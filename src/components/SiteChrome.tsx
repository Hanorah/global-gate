"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the public marketing chrome (Header/Footer/WhatsApp float) on
 * internal routes (/admin, /sign-in) — those get their own minimal layout
 * instead of the marketing nav and WhatsApp CTA.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInternal = pathname?.startsWith("/admin") || pathname?.startsWith("/sign-in");
  if (isInternal) return null;
  return <>{children}</>;
}
