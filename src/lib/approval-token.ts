import { createHmac, timingSafeEqual } from "crypto";

/**
 * Signed, expiring tokens for the flagged-lead approve/reject email links
 * (docs/PLAN.md Section 5b). Deliberately NOT a raw lead ID in the URL —
 * an unauthenticated action reachable from an email inbox needs a real
 * signature, not just obscurity.
 *
 * True single-use is enforced at the Sheets layer (src/lib/google-sheets.ts):
 * a second click re-checks the lead's current status and no-ops if it has
 * already been approved or rejected, rather than requiring a separate
 * token-blacklist store.
 */

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export type ApprovalAction = "approve" | "reject";

type TokenPayload = {
  leadId: string;
  action: ApprovalAction;
  exp: number;
};

function secret(): string {
  const value = process.env.APPROVAL_LINK_SECRET;
  if (!value) {
    throw new Error(
      "APPROVAL_LINK_SECRET is not set. Required to sign/verify approval links — see docs/PLAN.md Section 5f.",
    );
  }
  return value;
}

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createApprovalToken(leadId: string, action: ApprovalAction): string {
  const payload: TokenPayload = { leadId, action, exp: Date.now() + SEVEN_DAYS_MS };
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyApprovalToken(token: string): TokenPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = sign(encodedPayload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8"));
  } catch {
    return null;
  }

  if (typeof payload.leadId !== "string" || typeof payload.exp !== "number") return null;
  if (payload.action !== "approve" && payload.action !== "reject") return null;
  if (Date.now() > payload.exp) return null;

  return payload;
}
