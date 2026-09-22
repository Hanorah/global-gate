import { NextResponse } from "next/server";
import { verifyApprovalToken } from "@/lib/approval-token";
import { sendApplicantConfirmation } from "@/lib/email";
import { LEAD_COLUMN, approveFlaggedLead, rejectFlaggedLead } from "@/lib/google-sheets";
import { site } from "@/lib/site";

/**
 * Landing page for the signed approve/reject links in the flagged-lead
 * admin email (docs/PLAN.md Section 5b). Renders a small branded HTML
 * page since a human clicks into this from their inbox, not an API client.
 */

function page(title: string, message: string) {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} | ${site.shortName}</title>
  </head>
  <body style="margin:0;background-color:#fbfaf8;font-family:Georgia,'Times New Roman',serif;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px;">
    <div style="max-width:480px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;">
      <div style="background-color:#1f1210;padding:24px 28px;">
        <span style="color:#ffffff;font-size:18px;font-weight:600;">${site.name}</span>
        <div style="height:3px;width:40px;background-color:#c9a24a;margin-top:10px;border-radius:2px;"></div>
      </div>
      <div style="padding:28px;color:#12110f;font-size:15px;line-height:1.6;">
        <h1 style="font-size:20px;margin:0 0 12px;">${title}</h1>
        <p style="margin:0;color:#6b6560;">${message}</p>
      </div>
    </div>
  </body>
</html>`;
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";
  const payload = verifyApprovalToken(token);

  if (!payload) {
    return page(
      "Link invalid or expired",
      "This approve/reject link is no longer valid. Approval links expire after 7 days and can only be used once.",
    );
  }

  const actor = process.env.ADMIN_EMAIL || "admin";

  if (payload.action === "reject") {
    const result = await rejectFlaggedLead(payload.leadId, actor);
    if (result.alreadyProcessed) {
      return page("Already handled", "This enquiry has already been reviewed. No further action was taken.");
    }
    if (!result.updated) {
      return page("Could not find this enquiry", "The enquiry this link points to could not be found.");
    }
    return page("Marked as spam", "This enquiry has been marked as not proceeding. No email was sent to the applicant.");
  }

  const result = await approveFlaggedLead(payload.leadId, actor);
  if (result.alreadyProcessed) {
    return page("Already handled", "This enquiry has already been reviewed. No further action was taken.");
  }
  if (!result.updated || !result.leadValues) {
    return page("Could not find this enquiry", "The enquiry this link points to could not be found.");
  }

  const v = result.leadValues;
  await sendApplicantConfirmation({
    fullName: v[LEAD_COLUMN.fullName] || "",
    email: v[LEAD_COLUMN.email] || "",
    phone: v[LEAD_COLUMN.phone] || "",
    country: v[LEAD_COLUMN.country] || "",
    stage: v[LEAD_COLUMN.stage] || "",
    studyLevel: v[LEAD_COLUMN.studyLevel] || "",
    fieldOfStudy: v[LEAD_COLUMN.fieldOfStudy] || "",
    timeline: v[LEAD_COLUMN.timeline] || "",
    heardAbout: v[LEAD_COLUMN.heardAbout] || "",
    message: v[LEAD_COLUMN.message] || "",
  });

  return page(
    "Approved",
    "This enquiry now rejoins the normal pipeline as a new lead, and the applicant has been sent their confirmation email.",
  );
}
