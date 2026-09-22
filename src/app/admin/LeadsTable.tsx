"use client";

import { useState, useTransition } from "react";
import type { SheetRow } from "@/lib/google-sheets";
import { promoteToVerifiedAction, updateLeadNotesAction, updateLeadStatusAction } from "./actions";

const STATUS_OPTIONS = [
  "New",
  "Flagged for Review",
  "Contacted",
  "Meeting Held - Pending Decision",
  "Not Proceeding",
];

export function LeadsTable({ leads }: { leads: SheetRow[] }) {
  if (leads.length === 0) {
    return <EmptyState message="No leads yet. New enquiries will show up here." />;
  }

  return (
    <div className="overflow-x-auto rounded-[1.25rem] bg-white shadow-sm">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead className="border-b border-border bg-surface text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-3">Name / Contact</th>
            <th className="px-4 py-3">Profile</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Flags</th>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3">Notes</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <LeadRow key={lead["Lead ID"]} lead={lead} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeadRow({ lead }: { lead: SheetRow }) {
  const [status, setStatus] = useState(lead["Status"] || "New");
  const [notes, setNotes] = useState(lead["Admin notes"] || "");
  const [pending, startTransition] = useTransition();
  const [promoted, setPromoted] = useState(lead["Status"] === "Verified Customer");
  const spamScore = Number(lead["Spam score"] || "0");

  function onStatusChange(next: string) {
    setStatus(next);
    startTransition(() => updateLeadStatusAction(lead["Lead ID"], next));
  }

  function onNotesBlur() {
    startTransition(() => updateLeadNotesAction(lead["Lead ID"], notes));
  }

  function onPromote() {
    startTransition(async () => {
      const result = await promoteToVerifiedAction(lead["Lead ID"]);
      if (result.moved) setPromoted(true);
    });
  }

  if (promoted) return null; // moved out of Leads — table refreshes on next load

  return (
    <tr className="border-b border-border last:border-0 align-top">
      <td className="px-4 py-3">
        <p className="font-medium text-foreground">{lead["Full name"]}</p>
        <p className="text-muted-foreground">{lead["Email"]}</p>
        <p className="text-muted-foreground">{lead["Phone"]}</p>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        <p>{lead["Country of residence"]}</p>
        <p>
          {lead["Study level"]} &middot; {lead["Field of study"]}
        </p>
        <p>{lead["Start timeline"]}</p>
      </td>
      <td className="px-4 py-3">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          disabled={pending}
          className="h-9 rounded-lg border border-input bg-transparent px-2 text-sm"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        {spamScore > 0 ? (
          <span
            className="inline-block rounded-full bg-blush px-2.5 py-1 text-xs font-medium text-foreground"
            title={lead["Spam reason"]}
          >
            Flagged ({spamScore})
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Clean</span>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
        {formatDate(lead["Timestamp"])}
      </td>
      <td className="px-4 py-3">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={onNotesBlur}
          placeholder="Add a note..."
          className="h-16 w-48 rounded-lg border border-input bg-transparent px-2 py-1 text-xs"
        />
      </td>
      <td className="px-4 py-3">
        <button
          onClick={onPromote}
          disabled={pending}
          className="rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-gold-soft disabled:opacity-50"
        >
          Promote to customer
        </button>
      </td>
    </tr>
  );
}

function formatDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  // Fixed locale, not the runtime's ambient one — the server (Node) and the
  // browser can have different default locales, which produces different
  // rendered text and a React hydration mismatch.
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[1.25rem] bg-white p-10 text-center text-sm text-muted-foreground shadow-sm">
      {message}
    </div>
  );
}
