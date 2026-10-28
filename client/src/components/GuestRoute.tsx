import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { getRedirectPath } from "../utils/redirect";

// Opposite of ProtectedRoute: /login and /register are only for logged-out users.
export function GuestRoute() {
  const { token } = useAuth();
  const location = useLocation();

  // Right after a successful login the token appears and this redirect fires,
  // so it uses the same target as the login page ("where they were going", else home).
  if (token) return <Navigate to={getRedirectPath(location.state)} replace />;

  return <Outlet />;
}
