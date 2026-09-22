/**
 * Google Apps Script — Enquiry → Google Sheet ("Leads" tab)
 *
 * Matches the 7-step wizard (src/components/EnquiryForm.tsx) and the
 * "Leads" sheet design in docs/PLAN.md Section 4. Columns collected at
 * submission come first; columns the admin fills in later (after first
 * contact) are appended blank so the row is ready for manual completion.
 *
 * SETUP
 * 1. Create a Google Sheet with a tab named "Leads"
 * 2. Extensions → Apps Script → paste this file
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL into website/.env.local:
 *    GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
 * 5. Restart `npm run dev`
 *
 * NOTE: this is the interim dev-era webhook. It will be replaced by direct
 * Google Sheets API calls from a service account per docs/PLAN.md Section 6
 * once the Sheets/Drive CRM automation phase is built.
 */

const SHEET_NAME = "Leads";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        // Collected at submission (wizard)
        "Timestamp",
        "Full name",
        "Email",
        "Phone",
        "Country of residence",
        "Study stage",
        "Study level",
        "Field of study",
        "Start timeline",
        "Heard about",
        "Message",
        "Spam score",
        "Spam reason",
        "Status",
        // Filled in later by the admin after first contact
        "Nationality",
        "DOB",
        "Gender",
        "Highest qualification completed",
        "GPA",
        "Qualification data complete",
        "Admin notes",
        "Approved by",
        "Approved at",
      ]);
    }

    sheet.appendRow([
      data.receivedAt || new Date().toISOString(),
      data.fullName || "",
      data.email || "",
      data.phone || "",
      data.country || "",
      data.stage || "",
      data.studyLevel || "",
      data.fieldOfStudy || "",
      data.timeline || "",
      data.heardAbout || "",
      data.message || "",
      data.spamScore || "0",
      data.spamReason || "",
      "New",
      "", // Nationality
      "", // DOB
      "", // Gender
      "", // Highest qualification completed
      "", // GPA
      "N", // Qualification data complete
      "", // Admin notes
      "", // Approved by
      "", // Approved at
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional browser test
function doGet() {
  return ContentService.createTextOutput("Global Gate enquiry webhook is live.");
}
