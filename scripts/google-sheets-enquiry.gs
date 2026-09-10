/**
 * Google Apps Script — Enquiry → Google Sheet
 *
 * SETUP
 * 1. Create a Google Sheet with a tab named "Enquiries"
 * 2. Row 1 headers (exact order optional — script writes by name):
 *    Timestamp | Full name | Email | Phone | Country | Nationality | DOB | Gender |
 *    Qualification | GPA | Field of study | Study level | Heard about | Message
 * 3. Extensions → Apps Script → paste this file
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL into website/.env.local:
 *    GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
 * 6. Restart `npm run dev`
 */

const SHEET_NAME = "Enquiries";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp",
        "Full name",
        "Email",
        "Phone",
        "Country",
        "Nationality",
        "DOB",
        "Gender",
        "Qualification",
        "GPA",
        "Field of study",
        "Study level",
        "Heard about",
        "Message",
      ]);
    }

    sheet.appendRow([
      data.receivedAt || new Date().toISOString(),
      data.fullName || "",
      data.email || "",
      data.phone || "",
      data.country || "",
      data.nationality || "",
      data.dob || "",
      data.gender || "",
      data.qualification || "",
      data.gpa || "",
      data.fieldOfStudy || "",
      data.studyLevel || "",
      data.heardAbout || "",
      data.message || "",
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
