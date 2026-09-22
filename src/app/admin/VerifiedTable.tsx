"use client";

import { useState, useTransition } from "react";
import type { SheetRow } from "@/lib/google-sheets";
import { updateVerifiedNotesAction, updateVerifiedStageAction } from "./actions";

const STAGE_OPTIONS = [
  "Documents In Progress",
  "Application Submitted",
  "Visa Stage",
  "Arrival and Settling In",
  "Completed - Alumni",
];

export function VerifiedTable({ customers }: { customers: SheetRow[] }) {
  if (customers.length === 0) {
    return (
      <div className="rounded-[1.25rem] bg-white p-10 text-center text-sm text-muted-foreground shadow-sm">
        No verified customers yet. Promote a lead above once they&apos;ve had their meeting.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[1.25rem] bg-white shadow-sm">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead className="border-b border-border bg-surface text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-3">Name / Contact</th>
            <th className="px-4 py-3">Profile</th>
            <th className="px-4 py-3">Current stage</th>
            <th className="px-4 py-3">Documents</th>
            <th className="px-4 py-3">Notes</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <CustomerRow key={c["Lead ID"]} customer={c} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CustomerRow({ customer }: { customer: SheetRow }) {
  const [stage, setStage] = useState(customer["Current stage"] || STAGE_OPTIONS[0]);
  const [notes, setNotes] = useState(customer["Admin notes"] || "");
  const [, startTransition] = useTransition();

  function onStageChange(next: string) {
    setStage(next);
    startTransition(() => updateVerifiedStageAction(customer["Lead ID"], next));
  }

  function onNotesBlur() {
    startTransition(() => updateVerifiedNotesAction(customer["Lead ID"], notes));
  }

  const driveLink = customer["Drive folder link"];

  return (
    <tr className="border-b border-border last:border-0 align-top">
      <td className="px-4 py-3">
        <p className="font-medium text-foreground">{customer["Full name"]}</p>
        <p className="text-muted-foreground">{customer["Email"]}</p>
        <p className="text-muted-foreground">{customer["Phone"]}</p>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        <p>{customer["Country of residence"]}</p>
        <p>
          {customer["Study level"]} &middot; {customer["Field of study"]}
        </p>
      </td>
      <td className="px-4 py-3">
        <select
          value={stage}
          onChange={(e) => onStageChange(e.target.value)}
          className="h-9 rounded-lg border border-input bg-transparent px-2 text-sm"
        >
          {STAGE_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        {driveLink ? (
          <a
            href={driveLink}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-foreground underline"
          >
            Open folder
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">No folder</span>
        )}
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
    </tr>
  );
}
