"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "1.5rem" }}>Something went wrong</h1>
            <p style={{ marginTop: "0.75rem", color: "#6b6b6b", fontSize: "0.875rem" }}>
              The app hit an unexpected error, often caused by a dropped network
              connection. Try again below.
            </p>
            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "0.75rem" }}>
              <button
                onClick={() => reset()}
                style={{
                  borderRadius: "9999px",
                  padding: "0.5rem 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "white",
                  background: "#7a1f2b",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  borderRadius: "9999px",
                  padding: "0.5rem 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  border: "1px solid currentColor",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
