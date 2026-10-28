import { CircleAlert } from "lucide-react";

// Form-level error banner (e.g. "Invalid email or password").
export function FormAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-3 rounded-control border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger"
    >
      <CircleAlert className="mt-px size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
