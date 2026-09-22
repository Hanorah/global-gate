import { NextResponse } from "next/server";
import { createApprovalToken } from "@/lib/approval-token";
import { sendAdminApprovalRequest, sendAdminNotification, sendApplicantConfirmation } from "@/lib/email";
import { appendLead, generateLeadId } from "@/lib/google-sheets";
import { siteUrl } from "@/lib/seo";

type EnquiryBody = Record<string, string>;

// Matches the 7-step wizard in EnquiryForm.tsx — see docs/PLAN.md Section 2b.
// DOB / gender / nationality / qualification / GPA are deliberately NOT collected
// here; they're gathered by the admin after first contact (Section 4).
const REQUIRED = [
  "country",
  "stage",
  "studyLevel",
  "fieldOfStudy",
  "timeline",
  "heardAbout",
  "fullName",
  "email",
  "phone",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Small, deliberately short block list of common disposable-email domains.
// Not exhaustive — a borderline signal, not a hard gate (see spam-scoring note below).
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "tempmail.com",
  "yopmail.com",
  "trashmail.com",
]);

// Best-effort in-memory rate limit. Resets on cold start / across serverless
// instances — fine at current volume, but not a substitute for a real rate
// limiter (e.g. Upstash Redis) if traffic grows. Flagged in docs/PLAN.md.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const submissionsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionsByIp.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  timestamps.push(now);
  submissionsByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

function scoreSpam(body: EnquiryBody): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  const email = body.email?.trim().toLowerCase() ?? "";
  const domain = email.split("@")[1];

  if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    reasons.push("disposable email domain");
  }

  const digitsOnly = (body.phone ?? "").replace(/\D/g, "");
  if (digitsOnly.length < 7) {
    reasons.push("phone number too short to be real");
  }

  if (/https?:\/\//i.test(body.message ?? "")) {
    reasons.push("message contains a link");
  }

  const fullNameWords = (body.fullName ?? "").trim().split(/\s+/);
  if (fullNameWords.length < 2) {
    reasons.push("name looks incomplete");
  }

  return { score: reasons.length, reasons };
}

export async function POST(request: Request) {
  let body: EnquiryBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — pretend success for bots, per the confirmed "silent-drop
  // obvious bots" spam policy (docs/PLAN.md Section 7).
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (ip !== "unknown" && isRateLimited(ip)) {
    // Same "silent-drop obvious bots" policy — pretend success rather than
    // revealing the rate limit to whatever is hammering the endpoint.
    return NextResponse.json({ ok: true });
  }

  for (const key of REQUIRED) {
    if (!body[key]?.trim()) {
      return NextResponse.json({ ok: false, error: `Missing ${key}` }, { status: 400 });
    }
  }

  if (!EMAIL_RE.test(body.email.trim())) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address" }, { status: 400 });
  }

  // Borderline-quality signals — NOT blocked. Per the confirmed policy
  // ("flag borderline for review"), these route to an admin approval email
  // (Section 5b) instead of the normal lead flow; clean submissions get the
  // normal two-email flow (Section 5c).
  const { score, reasons } = scoreSpam(body);
  const isFlagged = score > 0;

  const leadId = generateLeadId();
  const lead = {
    leadId,
    fullName: body.fullName.trim(),
    email: body.email.trim(),
    phone: body.phone.trim(),
    country: body.country,
    stage: body.stage,
    studyLevel: body.studyLevel,
    fieldOfStudy: body.fieldOfStudy,
    timeline: body.timeline,
    heardAbout: body.heardAbout,
    message: body.message?.trim(),
    spamScore: String(score),
    spamReason: reasons.join("; "),
    status: isFlagged ? "Flagged for Review" : "New",
  };

  await appendLead(lead);

  if (isFlagged) {
    const approveUrl = `${siteUrl}/api/enquire/approve?token=${createApprovalToken(leadId, "approve")}`;
    const rejectUrl = `${siteUrl}/api/enquire/approve?token=${createApprovalToken(leadId, "reject")}`;
    await sendAdminApprovalRequest(lead, approveUrl, rejectUrl);
    // Applicant does not get a confirmation email until the admin approves —
    // avoids welcoming a likely-spam submission while still keeping the row.
    return NextResponse.json({ ok: true, stored: "sheets", flagged: true });
  }

  await Promise.all([sendAdminNotification(lead), sendApplicantConfirmation(lead)]);

  return NextResponse.json({ ok: true, stored: "sheets" });
}
