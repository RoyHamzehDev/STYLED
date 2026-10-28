import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { CircleAlert } from "lucide-react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  // The object returned by React Hook Form's register("field"): name, ref, onChange, onBlur.
  registration: UseFormRegisterReturn;
};

export function FormField({ label, error, registration, ...inputProps }: FormFieldProps) {
  const id = registration.name;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {/* text-base (16px) stops iOS Safari from zooming in when the input is focused.
          The coloured border + ring is the focus indicator, so the global outline is turned off. */}
      <input
        id={id}
        {...inputProps}
        {...registration}
        // aria-* lets screen readers announce the error message for this input.
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`min-h-11 w-full rounded-control border bg-background px-4 py-2.5 text-base text-ink shadow-sm transition-colors duration-200 outline-none placeholder:text-ink-muted focus:ring-3 disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60 ${
          error
            ? "border-danger focus:ring-danger/15"
            : "border-border hover:border-border-strong focus:border-accent-strong focus:ring-accent/30"
        }`}
      />
      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
          <CircleAlert className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
