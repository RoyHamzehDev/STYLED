import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";

// Wraps protected routes. Child routes render through <Outlet /> only once we know the user.
export function ProtectedRoute() {
  const { token, user, isLoading, error, retry } = useAuth();
  const location = useLocation();

  // No token: send to /login and remember where the user was going.
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;

  if (isLoading) return <LoadingState message="Loading your account..." />;

  // A 401 has already logged the user out, so this is a server/network problem:
  // keep the token and let them retry.
  if (error || !user) {
    return (
      <ErrorState
        title="We couldn't load your account"
        message={error?.message ?? "Please try again."}
        onRetry={retry}
      />
    );
  }

  return <Outlet />;
}
