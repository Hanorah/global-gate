import { VerifiedTable } from "../VerifiedTable";
import { getVerifiedCustomers } from "../data";

export const dynamic = "force-dynamic";

export default async function AdminVerifiedPage() {
  const customers = await getVerifiedCustomers();
  const sorted = [...customers].reverse(); // newest first

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-3xl">Verified customers</h1>
        <p className="text-sm text-muted-foreground">{sorted.length} customer(s)</p>
      </div>
      <div className="mt-5">
        <VerifiedTable customers={sorted} />
      </div>
    </div>
  );
}
