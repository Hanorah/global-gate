import { Resend } from "resend";
import { site, whatsappUrl } from "@/lib/site";
import { siteUrl } from "@/lib/seo";

/**
 * Transactional email sending — Section 5c of docs/PLAN.md.
 *
 * Degrades gracefully when RESEND_API_KEY is unset (matches the existing
 * pattern in src/app/api/enquire/route.ts for GOOGLE_SHEETS_WEBHOOK_URL):
 * logs what would have been sent instead of throwing, so local/dev
 * submissions still work before the Resend domain is verified.
 */

const FROM_ADDRESS = process.env.EMAIL_FROM || `${site.name} <onboarding@resend.dev>`;

function client(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

async function send({ to, subject, html }: { to: string; subject: string; html: string }) {
  const resend = client();
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — would send "${subject}" to ${to}.`);
    return { ok: true, sent: false as const };
  }

  try {
    const { error } = await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
    if (error) {
      console.error("[email] Resend send failed", error);
      return { ok: false, sent: false as const };
    }
    return { ok: true, sent: true as const };
  } catch (err) {
    console.error("[email] Resend send error", err);
    return { ok: false, sent: false as const };
  }
}

/** Shared branded wrapper — burgundy/gold palette matching src/app/globals.css. */
function emailShell(preheader: string, bodyHtml: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${site.name}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#fbfaf8;font-family:Georgia,'Times New Roman',serif;">
    <span style="display:none;font-size:1px;color:#fbfaf8;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      ${preheader}
    </span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fbfaf8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="background-color:#1f1210;padding:28px 32px;">
                <span style="color:#ffffff;font-size:20px;font-weight:600;letter-spacing:-0.02em;">
                  ${site.name}
                </span>
                <div style="height:3px;width:48px;background-color:#c9a24a;margin-top:12px;border-radius:2px;"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#12110f;font-size:15px;line-height:1.6;font-family:Georgia,'Times New Roman',serif;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="background-color:#f4f1ec;padding:24px 32px;color:#6b6560;font-size:12px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
                ${site.name} &middot; ${site.contact.address}<br />
                ${site.contact.email} &middot; ${site.contact.phoneDisplay}<br />
                <a href="${siteUrl}/privacy" style="color:#6b6560;">Privacy Policy</a>
                &middot;
                <a href="${siteUrl}/terms" style="color:#6b6560;">Terms</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function button(href: string, label: string, style: "primary" | "outline" = "primary") {
  const bg = style === "primary" ? "#1f1210" : "#ffffff";
  const color = style === "primary" ? "#ffffff" : "#1f1210";
  const border = style === "primary" ? "none" : "1px solid #1f1210";
  return `<a href="${href}" style="display:inline-block;background-color:${bg};color:${color};border:${border};padding:12px 24px;border-radius:999px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;">${label}</a>`;
}

type LeadEmailFields = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  stage: string;
  studyLevel: string;
  fieldOfStudy: string;
  timeline: string;
  heardAbout: string;
  message?: string;
};

function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

/** Sent to the applicant right after a clean (non-flagged) submission. */
export async function sendApplicantConfirmation(lead: LeadEmailFields) {
  const body = `
    <p style="margin:0 0 16px;">Dear ${firstName(lead.fullName)},</p>
    <p style="margin:0 0 16px;">
      Thank you for reaching out to ${site.name}. We are glad you are considering Hungary for
      your studies, and we are looking forward to learning more about your goals.
    </p>
    <p style="margin:0 0 16px;">Here is what happens next:</p>
    <ol style="margin:0 0 16px;padding-left:20px;">
      <li style="margin-bottom:8px;">Our team reviews the details you shared.</li>
      <li style="margin-bottom:8px;">We reach out to you ${site.responseSla}, usually by WhatsApp or email.</li>
      <li style="margin-bottom:8px;">We talk through your goals and the right next steps for your case.</li>
    </ol>
    <p style="margin:0 0 24px;">
      If anything is urgent, you are welcome to message us on WhatsApp any time.
    </p>
    <div style="margin-bottom:8px;">${button(whatsappUrl(), "Message us on WhatsApp")}</div>
    <p style="margin:24px 0 0;">Warmly,<br />${site.founder.name}<br />${site.name}</p>
    <p style="margin:20px 0 0;font-size:12px;color:#6b6560;">
      You are receiving this email because you submitted an enquiry on ${site.name}'s website.
      See our <a href="${siteUrl}/privacy" style="color:#6b6560;">Privacy Policy</a> for how we
      handle your information.
    </p>
  `;
  return send({
    to: lead.email,
    subject: `We received your enquiry, ${firstName(lead.fullName)}`,
    html: emailShell(`Thank you for contacting ${site.name}`, body),
  });
}

/** Sent to the admin for every clean (non-flagged) submission. */
export async function sendAdminNotification(lead: LeadEmailFields) {
  const rows: [string, string][] = [
    ["Name", lead.fullName],
    ["Email", lead.email],
    ["Phone / WhatsApp", lead.phone],
    ["Country", lead.country],
    ["Stage", lead.stage],
    ["Study level", lead.studyLevel],
    ["Field of study", lead.fieldOfStudy],
    ["Timeline", lead.timeline],
    ["Heard about", lead.heardAbout],
    ["Message", lead.message || "(none)"],
  ];
  const table = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:6px 12px 6px 0;color:#6b6560;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
          <td style="padding:6px 0;font-size:14px;">${value}</td>
        </tr>`,
    )
    .join("");

  const body = `
    <p style="margin:0 0 16px;">New enquiry received.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">${table}</table>
    <div>${button(`mailto:${lead.email}`, "Reply by email")}</div>
  `;
  const admin = process.env.ADMIN_EMAIL;
  if (!admin) {
    console.warn("[email] ADMIN_EMAIL not set — skipping admin notification.");
    return { ok: true, sent: false as const };
  }
  return send({
    to: admin,
    subject: `New enquiry: ${lead.fullName} (${lead.country})`,
    html: emailShell(`New enquiry from ${lead.fullName}`, body),
  });
}

/**
 * Sent to the admin when a submission is flagged as borderline (Section 5b).
 * approveUrl / rejectUrl are signed, single-use links (src/lib/approval-token.ts).
 */
export async function sendAdminApprovalRequest(
  lead: LeadEmailFields & { spamReason: string },
  approveUrl: string,
  rejectUrl: string,
) {
  const body = `
    <p style="margin:0 0 16px;">
      A new enquiry was flagged for review before the applicant gets a confirmation email.
    </p>
    <p style="margin:0 0 16px;padding:12px 16px;background-color:#f3e4e2;border-radius:12px;font-size:13px;">
      Flagged because: ${lead.spamReason || "borderline signals"}
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
      <tr><td style="padding:4px 12px 4px 0;color:#6b6560;font-size:13px;white-space:nowrap;">Name</td><td style="padding:4px 0;font-size:14px;">${lead.fullName}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6b6560;font-size:13px;white-space:nowrap;">Email</td><td style="padding:4px 0;font-size:14px;">${lead.email}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6b6560;font-size:13px;white-space:nowrap;">Phone</td><td style="padding:4px 0;font-size:14px;">${lead.phone}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6b6560;font-size:13px;white-space:nowrap;">Country</td><td style="padding:4px 0;font-size:14px;">${lead.country}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6b6560;font-size:13px;white-space:nowrap;">Message</td><td style="padding:4px 0;font-size:14px;">${lead.message || "(none)"}</td></tr>
    </table>
    <div>
      ${button(approveUrl, "Approve: treat as a real lead")}
      &nbsp;&nbsp;
      ${button(rejectUrl, "Reject: mark as spam", "outline")}
    </div>
    <p style="margin:16px 0 0;font-size:12px;color:#6b6560;">
      Each link works once and expires after 7 days.
    </p>
  `;
  const admin = process.env.ADMIN_EMAIL;
  if (!admin) {
    console.warn("[email] ADMIN_EMAIL not set — skipping approval request email.");
    return { ok: true, sent: false as const };
  }
  return send({
    to: admin,
    subject: `Review needed: ${lead.fullName}'s enquiry`,
    html: emailShell(`An enquiry needs your review`, body),
  });
}
