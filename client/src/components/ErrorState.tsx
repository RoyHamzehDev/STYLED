import { CircleAlert, RotateCw } from "lucide-react";
import { BUTTON_PRIMARY } from "../utils/buttons";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center" role="alert">
      <span className="flex size-14 items-center justify-center rounded-full bg-danger-soft text-danger">
        <CircleAlert className="size-7" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-semibold">{title}</h2>
      {message && <p className="mt-2 text-sm text-ink-muted">{message}</p>}
      {onRetry && (
        <button type="button" onClick={onRetry} className={`${BUTTON_PRIMARY} mt-6`}>
          <RotateCw className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}
