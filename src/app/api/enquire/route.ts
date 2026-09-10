import { NextResponse } from "next/server";

type EnquiryBody = Record<string, string>;

const REQUIRED = [
  "fullName",
  "email",
  "phone",
  "country",
  "nationality",
  "dob",
  "gender",
  "qualification",
  "gpa",
  "fieldOfStudy",
  "studyLevel",
  "heardAbout",
  "message",
] as const;

export async function POST(request: Request) {
  let body: EnquiryBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — pretend success for bots
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  for (const key of REQUIRED) {
    if (!body[key]?.trim()) {
      return NextResponse.json({ ok: false, error: `Missing ${key}` }, { status: 400 });
    }
  }

  const payload = {
    ...body,
    receivedAt: new Date().toISOString(),
  };

  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhook) {
    console.warn(
      "[enquiry] GOOGLE_SHEETS_WEBHOOK_URL is not set. Saving to server log only.",
      payload,
    );
    // Still accept in local/dev so the UX works before the sheet is connected
    return NextResponse.json({ ok: true, stored: "log" });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Apps Script redirects; follow them
      redirect: "follow",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[enquiry] Google Sheets webhook failed", res.status, text);
      return NextResponse.json(
        { ok: false, error: "Could not save enquiry. Please try WhatsApp or email." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, stored: "sheets" });
  } catch (error) {
    console.error("[enquiry] Google Sheets webhook error", error);
    return NextResponse.json(
      { ok: false, error: "Could not save enquiry. Please try WhatsApp or email." },
      { status: 502 },
    );
  }
}
