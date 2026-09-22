"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  LEADS_HEADERS,
  LEADS_SHEET,
  VERIFIED_HEADERS,
  VERIFIED_SHEET,
  promoteLeadToVerifiedCustomer,
  updateSheetField,
} from "@/lib/google-sheets";

/**
 * Server Actions can be invoked directly, bypassing the layout render —
 * every action re-checks the admin email itself rather than trusting
 * src/app/admin/layout.tsx alone. Defense in depth for data this sensitive.
 */
async function requireAdmin(): Promise<string> {
  const user = await currentUser();
  const email = user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !email || email.toLowerCase() !== adminEmail.toLowerCase()) {
    throw new Error("Not authorized");
  }
  return email;
}

export async function updateLeadStatusAction(leadId: string, status: string) {
  await requireAdmin();
  await updateSheetField(LEADS_SHEET, LEADS_HEADERS, leadId, "Status", status);
  revalidatePath("/admin");
}

export async function updateLeadNotesAction(leadId: string, notes: string) {
  await requireAdmin();
  await updateSheetField(LEADS_SHEET, LEADS_HEADERS, leadId, "Admin notes", notes);
  revalidatePath("/admin");
}

export async function promoteToVerifiedAction(leadId: string) {
  const email = await requireAdmin();
  const result = await promoteLeadToVerifiedCustomer(leadId, email);
  revalidatePath("/admin");
  return result;
}

export async function updateVerifiedStageAction(leadId: string, stage: string) {
  await requireAdmin();
  await updateSheetField(VERIFIED_SHEET, VERIFIED_HEADERS, leadId, "Current stage", stage);
  revalidatePath("/admin");
}

export async function updateVerifiedNotesAction(leadId: string, notes: string) {
  await requireAdmin();
  await updateSheetField(VERIFIED_SHEET, VERIFIED_HEADERS, leadId, "Admin notes", notes);
  revalidatePath("/admin");
}
