import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Next.js 16 renamed Middleware to Proxy — this file (src/proxy.ts) is the
 * replacement for middleware.ts, same API. Public-first: only /admin
 * requires sign-in, everything else (the marketing site + /api/enquire) stays
 * public. See docs/PLAN.md Section 6 — admin dashboard.
 *
 * NOTE: this only confirms someone is signed in. It does NOT restrict WHO
 * can sign in — Clerk's own instance may allow public sign-up. The real
 * access gate (comparing the signed-in email to ADMIN_EMAIL) lives in
 * src/app/admin/layout.tsx, which runs on every /admin request.
 */
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
