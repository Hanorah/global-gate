import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { site } from "@/lib/site";
import { AdminSidebar } from "./AdminSidebar";
import { getLeads, getVerifiedCustomers } from "./data";

/**
 * The real access gate for /admin. src/proxy.ts only confirms "signed in
 * with Clerk" — Clerk's own instance may allow any Google account to sign
 * up. This layout is what actually restricts access to the one admin email,
 * on every request to every /admin/* route.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const email = user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    return (
      <AccessMessage title="Admin dashboard not configured">
        ADMIN_EMAIL is not set in the environment. Set it, then reload.
      </AccessMessage>
    );
  }

  if (!email || email.toLowerCase() !== adminEmail.toLowerCase()) {
    return (
      <AccessMessage title="Access restricted">
        This dashboard is limited to {site.name}&apos;s admin account. The account you signed in
        with ({email || "unknown"}) does not have access.
        <div className="mt-6">
          <SignOutButton>
            <button className="rounded-full bg-burgundy px-5 py-2 text-sm font-medium text-white hover:bg-burgundy-soft">
              Sign out and try a different account
            </button>
          </SignOutButton>
        </div>
      </AccessMessage>
    );
  }

  const [leads, verified] = await Promise.all([getLeads(), getVerifiedCustomers()]);

  return (
    <div className="flex min-h-screen flex-col bg-surface md:flex-row">
      <AdminSidebar email={email} leadsCount={leads.length} verifiedCount={verified.length} />
      <main className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</main>
    </div>
  );
}

function AccessMessage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="max-w-md rounded-[1.5rem] bg-white p-8 text-center shadow-sm">
        <h1 className="font-display text-2xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
