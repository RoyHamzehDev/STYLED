import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router";
import { LoginSchema } from "@styled/shared";
import { ApiError } from "../api/client";
import { AuthCard } from "../components/AuthCard";
import { FormAlert } from "../components/FormAlert";
import { FormField } from "../components/FormField";
import { SubmitButton } from "../components/SubmitButton";
import { useAuth } from "../hooks/useAuth";
import { getRedirectPath } from "../utils/redirect";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // zodResolver runs the shared LoginSchema on submit, so the client validates
  // with exactly the same rules as the server. Form types are inferred from the schema.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(LoginSchema) });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => navigate(getRedirectPath(location.state), { replace: true }),
  });

  const error = loginMutation.error;
  const errorMessage =
    error instanceof ApiError && error.status === 401 ? "Invalid email or password" : error?.message;

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your wardrobe"
      footer={
        <>
          No account?{" "}
          <Link
            to="/register"
            className="rounded-sm font-semibold text-accent-strong underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      {errorMessage && <FormAlert message={errorMessage} />}

      {/* handleSubmit only calls mutate() when the schema validation passes. */}
      <form onSubmit={handleSubmit((dto) => loginMutation.mutate(dto))} noValidate className="space-y-5">
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          registration={register("email")}
          error={errors.email?.message}
        />
        <FormField
          label="Password"
          type="password"
          autoComplete="current-password"
          registration={register("password")}
          error={errors.password?.message}
        />
        <SubmitButton isLoading={loginMutation.isPending} loadingLabel="Logging in...">
          Log in
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
