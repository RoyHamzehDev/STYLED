import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { LoginDto } from "@styled/shared";
import { getMe, login as loginRequest } from "../api/auth";
import { setUnauthorizedHandler } from "../api/client";
import { clearToken, getToken, setToken } from "../api/token";
import { AuthContext, ME_QUERY_KEY } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy initial state: read localStorage once on startup.
  const [token, setTokenState] = useState(getToken);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // The current user is server data, so TanStack Query fetches and caches it.
  // `enabled` means GET /me only runs when we actually have a token.
  const meQuery = useQuery({ queryKey: ME_QUERY_KEY, queryFn: getMe, enabled: !!token });

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    queryClient.clear(); // drop every cached response that belonged to this user
    navigate("/login", { replace: true });
  }, [queryClient, navigate]);

  // Let the fetch wrapper call logout() whenever any request returns 401.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const login = useCallback(
    async (dto: LoginDto) => {
      const { token, user } = await loginRequest(dto);
      setToken(token);
      // Prefill the cache with the user from the login response so we skip an extra GET /me.
      queryClient.setQueryData(ME_QUERY_KEY, user);
      setTokenState(token);
    },
    [queryClient],
  );

  const value = useMemo(
    () => ({
      token,
      user: meQuery.data ?? null,
      isLoading: !!token && meQuery.isPending,
      error: meQuery.error,
      retry: () => void meQuery.refetch(),
      login,
      logout,
    }),
    [token, meQuery, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
