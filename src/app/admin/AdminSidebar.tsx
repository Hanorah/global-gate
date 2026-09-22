"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { Menu, Users, UserCheck, X } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; count: number; icon: typeof Users };

export function AdminSidebar({
  email,
  leadsCount,
  verifiedCount,
}: {
  email: string;
  leadsCount: number;
  verifiedCount: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer on route change — adjusted during render (React's
  // documented pattern for "reset state when a prop changes") rather than
  // in an effect, which would cause an extra commit + render pass.
  const [renderedPathname, setRenderedPathname] = useState(pathname);
  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setOpen(false);
  }

  const items: NavItem[] = [
    { href: "/admin", label: "Leads", count: leadsCount, icon: Users },
    { href: "/admin/verified", label: "Verified Customers", count: verifiedCount, icon: UserCheck },
  ];

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-white px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 hover:bg-muted"
        >
          <Menu className="size-5" />
        </button>
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          {site.shortName} Admin
        </p>
        <div className="size-9" aria-hidden="true" />
      </div>

      {/* Mobile drawer + backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          "transition-[opacity,visibility] duration-300",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/40"
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 flex-col bg-white transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <SidebarContent
            items={items}
            pathname={pathname}
            email={email}
            onNavigate={() => setOpen(false)}
            closeButton={
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            }
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden w-64 shrink-0 border-r border-border bg-white md:flex md:flex-col">
        <SidebarContent items={items} pathname={pathname} email={email} />
      </div>
    </>
  );
}

function SidebarContent({
  items,
  pathname,
  email,
  onNavigate,
  closeButton,
}: {
  items: NavItem[];
  pathname: string | null;
  email: string;
  onNavigate?: () => void;
  closeButton?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          {site.shortName} Admin
        </p>
        {closeButton}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-burgundy text-white" : "text-foreground hover:bg-muted",
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="size-4" />
                {item.label}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  active ? "bg-white/15 text-white" : "bg-muted text-muted-foreground",
                )}
              >
                {item.count}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <p className="truncate text-xs text-muted-foreground">{email}</p>
        <SignOutButton>
          <button className="mt-3 w-full rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted">
            Sign out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
