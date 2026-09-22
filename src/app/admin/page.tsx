import { LeadsTable } from "./LeadsTable";
import { getLeads } from "./data";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await getLeads();
  const sorted = [...leads].reverse(); // newest first

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-3xl">Leads pipeline</h1>
        <p className="text-sm text-muted-foreground">{sorted.length} lead(s)</p>
      </div>
      <div className="mt-5">
        <LeadsTable leads={sorted} />
      </div>
    </div>
  );
}
