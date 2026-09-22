import { randomBytes } from "crypto";
import { google } from "googleapis";

/**
 * Google Sheets + Drive CRM automation — docs/PLAN.md Sections 4, 5d, 5e, 6.
 *
 * Replaces the Apps Script webhook (scripts/google-sheets-enquiry.gs) with
 * direct, auditable service-account API calls, so a single server-side
 * action can append a lead, move it between sheets on approval, and create
 * its Drive folder atomically.
 *
 * Requires (see docs/PLAN.md Section 5f for the full setup checklist):
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
 *   GOOGLE_SHEETS_SPREADSHEET_ID
 *   GOOGLE_DRIVE_PARENT_FOLDER_ID
 *
 * Degrades gracefully when any of these are unset — every exported function
 * logs and no-ops rather than throwing, matching the existing dev pattern.
 */

export const LEADS_SHEET = "Leads";
export const VERIFIED_SHEET = "Verified Customers";

// Collected at submission (wizard), in column order — must match onSubmit
// payload keys in src/components/EnquiryForm.tsx / src/app/api/enquire/route.ts.
const LEADS_HEADERS = [
  "Lead ID",
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
  "Drive folder link",
] as const;

const VERIFIED_HEADERS = [
  ...LEADS_HEADERS,
  "Package purchased",
  "Payment status",
  "Current stage",
  "Assigned Hungarian university",
  "Next action",
  "Next action due date",
  "Last contact date",
] as const;

export { LEADS_HEADERS, VERIFIED_HEADERS };

export type LeadRecord = {
  leadId: string;
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
  spamScore: string;
  spamReason: string;
  /** Defaults to "New". Pass "Flagged for Review" for borderline submissions. */
  status?: string;
};

function hasCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  );
}

function auth() {
  // Private keys stored in env vars usually have literal "\n" sequences
  // rather than real newlines — must be unescaped before use.
  const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });
}

function sheetsClient() {
  return google.sheets({ version: "v4", auth: auth() });
}

function driveClient() {
  return google.drive({ version: "v3", auth: auth() });
}

export function generateLeadId(): string {
  return `GGSN-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
}

async function ensureSheetWithHeaders(
  sheets: ReturnType<typeof sheetsClient>,
  spreadsheetId: string,
  sheetName: string,
  headers: readonly string[],
) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const exists = meta.data.sheets?.some((s) => s.properties?.title === sheetName);

  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: sheetName } } }] },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [[...headers]] },
    });
  }
}

/** Appends a new row to the Leads sheet. No-ops (logs) without credentials. */
export async function appendLead(lead: LeadRecord) {
  if (!hasCredentials()) {
    console.warn("[google-sheets] Credentials not set — skipping Sheets append.", lead.leadId);
    return { ok: true, written: false as const };
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const sheets = sheetsClient();

  try {
    await ensureSheetWithHeaders(sheets, spreadsheetId, LEADS_SHEET, LEADS_HEADERS);

    const row = [
      lead.leadId,
      new Date().toISOString(),
      lead.fullName,
      lead.email,
      lead.phone,
      lead.country,
      lead.stage,
      lead.studyLevel,
      lead.fieldOfStudy,
      lead.timeline,
      lead.heardAbout,
      lead.message || "",
      lead.spamScore,
      lead.spamReason,
      lead.status || "New",
      "", // Nationality
      "", // DOB
      "", // Gender
      "", // Highest qualification completed
      "", // GPA
      "N", // Qualification data complete
      "", // Admin notes
      "", // Approved by
      "", // Approved at
      "", // Drive folder link
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${LEADS_SHEET}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });

    return { ok: true, written: true as const };
  } catch (err) {
    console.error("[google-sheets] appendLead failed", err);
    return { ok: false, written: false as const };
  }
}

async function findLeadRow(
  sheets: ReturnType<typeof sheetsClient>,
  spreadsheetId: string,
  sheetName: string,
  leadId: string,
): Promise<{ rowIndex: number; values: string[] } | null> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:A`,
  });
  const ids = res.data.values || [];
  const rowIndex = ids.findIndex((row) => row[0] === leadId);
  if (rowIndex === -1) return null;

  const fullRow = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A${rowIndex + 1}:Z${rowIndex + 1}`,
  });
  return { rowIndex, values: fullRow.data.values?.[0] || [] };
}

async function getSheetId(
  sheets: ReturnType<typeof sheetsClient>,
  spreadsheetId: string,
  sheetName: string,
): Promise<number | null> {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = meta.data.sheets?.find((s) => s.properties?.title === sheetName);
  return sheet?.properties?.sheetId ?? null;
}

const STATUS_COLUMN_INDEX = LEADS_HEADERS.indexOf("Status");
const APPROVED_BY_INDEX = LEADS_HEADERS.indexOf("Approved by");
const APPROVED_AT_INDEX = LEADS_HEADERS.indexOf("Approved at");

/**
 * Approves a flagged lead: rejoins the normal flow (Status -> "New") rather
 * than moving straight to Verified — a flagged lead still needs the human
 * "meeting held" step before becoming a customer. See docs/PLAN.md 5b.
 * Idempotent: a second click on an already-processed lead is a no-op.
 */
export async function approveFlaggedLead(leadId: string, approvedBy: string) {
  return updateLeadStatus(leadId, "New", approvedBy);
}

/** Rejects a flagged lead: marks it Not Proceeding, no applicant email follows. */
export async function rejectFlaggedLead(leadId: string, rejectedBy: string) {
  return updateLeadStatus(leadId, "Not Proceeding", rejectedBy);
}

async function updateLeadStatus(leadId: string, status: string, actor: string) {
  if (!hasCredentials()) {
    console.warn("[google-sheets] Credentials not set — skipping status update.", leadId);
    return { ok: true, updated: false as const, alreadyProcessed: false, leadValues: null };
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const sheets = sheetsClient();

  try {
    const found = await findLeadRow(sheets, spreadsheetId, LEADS_SHEET, leadId);
    if (!found) return { ok: false, updated: false as const, alreadyProcessed: false, leadValues: null };

    // Single-use enforcement keys off "Approved by" rather than Status text —
    // approving sets Status back to "New" (indistinguishable from a fresh
    // lead's initial status), so Status alone can't tell first click from
    // Nth click. "Approved by" is only ever written once, by this function.
    if (found.values[APPROVED_BY_INDEX]) {
      return { ok: true, updated: false as const, alreadyProcessed: true, leadValues: found.values };
    }

    const sheetRow = found.rowIndex + 1;
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: "RAW",
        data: [
          {
            range: `${LEADS_SHEET}!${columnLetter(STATUS_COLUMN_INDEX)}${sheetRow}`,
            values: [[status]],
          },
          {
            range: `${LEADS_SHEET}!${columnLetter(APPROVED_BY_INDEX)}${sheetRow}`,
            values: [[actor]],
          },
          {
            range: `${LEADS_SHEET}!${columnLetter(APPROVED_AT_INDEX)}${sheetRow}`,
            values: [[new Date().toISOString()]],
          },
        ],
      },
    });

    return { ok: true, updated: true as const, alreadyProcessed: false, leadValues: found.values };
  } catch (err) {
    console.error("[google-sheets] updateLeadStatus failed", err);
    return { ok: false, updated: false as const, alreadyProcessed: false, leadValues: null };
  }
}

/** Column indexes into a raw Leads row, for reading `leadValues` results above. */
export const LEAD_COLUMN = {
  fullName: LEADS_HEADERS.indexOf("Full name"),
  email: LEADS_HEADERS.indexOf("Email"),
  phone: LEADS_HEADERS.indexOf("Phone"),
  country: LEADS_HEADERS.indexOf("Country of residence"),
  stage: LEADS_HEADERS.indexOf("Study stage"),
  studyLevel: LEADS_HEADERS.indexOf("Study level"),
  fieldOfStudy: LEADS_HEADERS.indexOf("Field of study"),
  timeline: LEADS_HEADERS.indexOf("Start timeline"),
  heardAbout: LEADS_HEADERS.indexOf("Heard about"),
  message: LEADS_HEADERS.indexOf("Message"),
} as const;

const DRIVE_FOLDER_LINK_INDEX = LEADS_HEADERS.indexOf("Drive folder link");

/**
 * Moves a lead from Leads to Verified Customers: appends the extended row,
 * then deletes the source row (a real move, not a copy — docs/PLAN.md 5d).
 */
export async function moveLeadToVerified(leadId: string, approvedBy: string, driveUrl?: string | null) {
  if (!hasCredentials()) {
    console.warn("[google-sheets] Credentials not set — skipping move to Verified.", leadId);
    return { ok: true, moved: false as const };
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const sheets = sheetsClient();

  try {
    await ensureSheetWithHeaders(sheets, spreadsheetId, VERIFIED_SHEET, VERIFIED_HEADERS);

    const found = await findLeadRow(sheets, spreadsheetId, LEADS_SHEET, leadId);
    if (!found) return { ok: false, moved: false as const };

    const row = [...found.values];
    row[STATUS_COLUMN_INDEX] = "Verified Customer";
    row[APPROVED_BY_INDEX] = approvedBy;
    if (driveUrl) row[DRIVE_FOLDER_LINK_INDEX] = driveUrl;
    row[APPROVED_AT_INDEX] = new Date().toISOString();
    // Pad to Verified Customers' extra columns (package, payment, stage, etc.)
    while (row.length < VERIFIED_HEADERS.length) row.push("");

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${VERIFIED_SHEET}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });

    const leadsSheetId = await getSheetId(sheets, spreadsheetId, LEADS_SHEET);
    if (leadsSheetId !== null) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: leadsSheetId,
                  dimension: "ROWS",
                  startIndex: found.rowIndex,
                  endIndex: found.rowIndex + 1,
                },
              },
            },
          ],
        },
      });
    }

    return { ok: true, moved: true as const };
  } catch (err) {
    console.error("[google-sheets] moveLeadToVerified failed", err);
    return { ok: false, moved: false as const };
  }
}

/**
 * The admin dashboard's main action: a lead that had its meeting and is
 * ready to become a customer. Creates the Drive folder (docs/PLAN.md 5e)
 * and moves the row into Verified Customers with the folder link attached,
 * in one call.
 */
export async function promoteLeadToVerifiedCustomer(leadId: string, approvedBy: string) {
  if (!hasCredentials()) {
    console.warn("[google-sheets] Credentials not set — skipping promotion.", leadId);
    return { ok: true, moved: false as const, driveUrl: null };
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const sheets = sheetsClient();
  const found = await findLeadRow(sheets, spreadsheetId, LEADS_SHEET, leadId);
  if (!found) return { ok: false, moved: false as const, driveUrl: null };

  const fullName = found.values[LEAD_COLUMN.fullName] || leadId;
  const drive = await createLeadDriveFolder({ leadId, fullName });
  const move = await moveLeadToVerified(leadId, approvedBy, drive.url);

  return { ok: move.ok, moved: move.moved, driveUrl: drive.url };
}

function columnLetter(zeroBasedIndex: number): string {
  let index = zeroBasedIndex + 1;
  let letters = "";
  while (index > 0) {
    const remainder = (index - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    index = Math.floor((index - 1) / 26);
  }
  return letters;
}

/**
 * Creates a per-lead Drive folder under GOOGLE_DRIVE_PARENT_FOLDER_ID,
 * named per docs/PLAN.md 5e: YYYY-MM-DD_Surname-Firstname_GGSN-#####.
 * Shares it with the admin account. Returns the folder's webViewLink.
 */
export async function createLeadDriveFolder(lead: {
  leadId: string;
  fullName: string;
}): Promise<{ ok: boolean; url: string | null }> {
  const parentId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;
  if (!hasCredentials() || !parentId) {
    console.warn("[google-drive] Credentials or parent folder not set — skipping folder creation.");
    return { ok: true, url: null };
  }

  const drive = driveClient();
  const [firstName, ...rest] = lead.fullName.trim().split(/\s+/);
  const surname = rest.length ? rest[rest.length - 1] : firstName;
  const datePrefix = new Date().toISOString().slice(0, 10);
  const folderName = `${datePrefix}_${surname}-${firstName}_${lead.leadId}`;

  try {
    const folder = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parentId],
      },
      fields: "id, webViewLink",
    });

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && folder.data.id) {
      await drive.permissions.create({
        fileId: folder.data.id,
        requestBody: { type: "user", role: "writer", emailAddress: adminEmail },
        sendNotificationEmail: false,
      });
    }

    return { ok: true, url: folder.data.webViewLink || null };
  } catch (err) {
    console.error("[google-drive] createLeadDriveFolder failed", err);
    return { ok: false, url: null };
  }
}

/** A raw sheet row keyed by header name — what the admin dashboard renders. */
export type SheetRow = Record<string, string>;

function rowsToObjects(headers: readonly string[], rows: string[][]): SheetRow[] {
  return rows.map((row) => {
    const obj: SheetRow = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] ?? "";
    });
    return obj;
  });
}

async function listSheet(sheetName: string, headers: readonly string[]): Promise<SheetRow[]> {
  if (!hasCredentials()) {
    console.warn(`[google-sheets] Credentials not set — cannot list ${sheetName}.`);
    return [];
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const sheets = sheetsClient();

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A2:Z`,
    });
    return rowsToObjects(headers, res.data.values || []);
  } catch (err) {
    // A brand-new spreadsheet with no Leads/Verified Customers tab yet — not
    // an error, just an empty pipeline.
    console.warn(`[google-sheets] listSheet(${sheetName}) failed (likely tab doesn't exist yet)`, err);
    return [];
  }
}

/** All rows in the Leads sheet, newest submissions included, for the admin dashboard. */
export async function listLeads(): Promise<SheetRow[]> {
  return listSheet(LEADS_SHEET, LEADS_HEADERS);
}

/** All rows in the Verified Customers sheet, for the admin dashboard. */
export async function listVerifiedCustomers(): Promise<SheetRow[]> {
  return listSheet(VERIFIED_SHEET, VERIFIED_HEADERS);
}

/**
 * Generic single-cell update by Lead ID, for the admin dashboard's day-to-day
 * pipeline management (status changes, admin notes, current stage, etc.) —
 * not the single-use-guarded flagged-review flow above.
 */
export async function updateSheetField(
  sheetName: string,
  headers: readonly string[],
  leadId: string,
  columnName: string,
  value: string,
): Promise<{ ok: boolean }> {
  if (!hasCredentials()) {
    console.warn(`[google-sheets] Credentials not set — skipping ${columnName} update.`, leadId);
    return { ok: true };
  }

  const columnIndex = headers.indexOf(columnName);
  if (columnIndex === -1) return { ok: false };

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const sheets = sheetsClient();

  try {
    const found = await findLeadRow(sheets, spreadsheetId, sheetName, leadId);
    if (!found) return { ok: false };

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!${columnLetter(columnIndex)}${found.rowIndex + 1}`,
      valueInputOption: "RAW",
      requestBody: { values: [[value]] },
    });
    return { ok: true };
  } catch (err) {
    console.error(`[google-sheets] updateSheetField(${columnName}) failed`, err);
    return { ok: false };
  }
}
