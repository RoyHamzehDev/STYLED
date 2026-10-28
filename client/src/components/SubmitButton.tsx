import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type SubmitButtonProps = {
  isLoading: boolean;
  loadingLabel: string;
  children: ReactNode;
};

export function SubmitButton({ isLoading, loadingLabel, children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-control bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent shadow-sm transition-colors duration-200 hover:bg-accent-hover active:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-accent"
    >
      {isLoading && <LoaderCircle className="size-4 animate-spin" strokeWidth={2} aria-hidden="true" />}
      {isLoading ? loadingLabel : children}
    </button>
  );
}
