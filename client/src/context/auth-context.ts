import { createContext } from "react";
import type { LoginDto } from "@styled/shared";
import type { User } from "../api/types";

// TanStack Query cache key for the logged-in user (GET /api/auth/me).
export const ME_QUERY_KEY = ["me"];

export type AuthContextValue = {
  token: string | null;
  user: User | null;
  // True only while we have a token and are still fetching GET /me.
  isLoading: boolean;
  // Set when GET /me fails for a reason other than 401 (server down, 500...).
  error: Error | null;
  retry: () => void;
  login: (dto: LoginDto) => Promise<void>;
  logout: () => void;
};

// Kept in its own file (not with the provider) so React Fast Refresh works:
// files exporting components should export only components.
export const AuthContext = createContext<AuthContextValue | null>(null);
