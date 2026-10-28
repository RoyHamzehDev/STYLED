import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { RegisterSchema, type RegisterDto } from "@styled/shared";
import { register as registerRequest } from "../api/auth";
import { ApiError } from "../api/client";
import { AuthCard } from "../components/AuthCard";
import { FormAlert } from "../components/FormAlert";
import { FormField } from "../components/FormField";
import { SubmitButton } from "../components/SubmitButton";
import { useAuth } from "../hooks/useAuth";

const FORM_FIELDS = ["name", "email", "password"] as const;

export function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(RegisterSchema) });

  const registerMutation = useMutation({
    // Register, then log in with the same credentials so the user lands logged in.
    mutationFn: async (dto: RegisterDto) => {
      await registerRequest(dto);
      await login({ email: dto.email, password: dto.password });
    },
    onSuccess: () => navigate("/", { replace: true }),
    onError: (error) => {
      // Server-side validation errors: show each one under its matching input.
      if (error instanceof ApiError && error.status === 400) {
        for (const { field, message } of error.body.errors ?? []) {
          const name = FORM_FIELDS.find((f) => f === field);
          if (name) setError(name, { message });
        }
      }
    },
  });

  const errorMessage = getBannerMessage(registerMutation.error);

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start building your smart wardrobe"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="rounded-sm font-semibold text-accent-strong underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      {errorMessage && <FormAlert message={errorMessage} />}

      <form onSubmit={handleSubmit((dto) => registerMutation.mutate(dto))} noValidate className="space-y-5">
        <FormField label="Name" autoComplete="name" registration={register("name")} error={errors.name?.message} />
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
          autoComplete="new-password"
          registration={register("password")}
          error={errors.password?.message}
        />
        <SubmitButton isLoading={registerMutation.isPending} loadingLabel="Creating account...">
          Sign up
        </SubmitButton>
      </form>
    </AuthCard>
  );
}

// Message for the banner above the form. 400s with field errors are shown under the inputs instead.
function getBannerMessage(error: Error | null): string | undefined {
  if (!error) return undefined;
  if (error instanceof ApiError) {
    if (error.status === 409) return "This email is already registered";
    if (error.status === 400 && error.body.errors?.length) return undefined;
  }
  return error.message;
}
