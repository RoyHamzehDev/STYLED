import { LoaderCircle } from "lucide-react";

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-muted" role="status">
      <LoaderCircle className="size-8 animate-spin text-accent-strong" strokeWidth={1.75} aria-hidden="true" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
