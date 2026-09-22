import { cache } from "react";
import { listLeads, listVerifiedCustomers } from "@/lib/google-sheets";

/**
 * React's per-request cache() dedupes calls to the same function with the
 * same args within a single render pass — layout.tsx (sidebar counts) and
 * each page (table data) both need this data without doubling the number of
 * Google Sheets API reads per admin page load.
 */
export const getLeads = cache(listLeads);
export const getVerifiedCustomers = cache(listVerifiedCustomers);
