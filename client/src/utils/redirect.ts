import type { Location } from "react-router";

// ProtectedRoute redirects to /login with state { from: location }.
// This reads that back safely (state can be anything, or missing) and falls back to home.
export function getRedirectPath(state: unknown): string {
  const from = (state as { from?: Location } | null)?.from;
  return from ? `${from.pathname}${from.search}` : "/";
}
