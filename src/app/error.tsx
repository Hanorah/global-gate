"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="max-w-md rounded-[1.5rem] bg-white p-8 text-center shadow-sm">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {site.shortName} hit an unexpected error, often caused by a dropped network
          connection. Try again below.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-full bg-burgundy px-5 py-2 text-sm font-medium text-white hover:bg-burgundy-soft"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full border border-current px-5 py-2 text-sm font-medium"
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  );
}
