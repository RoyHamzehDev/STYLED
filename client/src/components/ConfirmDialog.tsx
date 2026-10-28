import { useEffect, useRef } from "react";
import { CircleAlert, LoaderCircle, Trash2, TriangleAlert } from "lucide-react";
import { BUTTON_DANGER, BUTTON_SECONDARY } from "../utils/buttons";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isLoading?: boolean;
  errorMessage?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// Uses the native <dialog> element: showModal() gives us the dark backdrop,
// keeps keyboard focus inside the dialog, and closes on Escape for free.
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  isLoading = false,
  errorMessage,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // <dialog> is opened/closed with methods, so sync it with the `open` prop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const cancel = () => {
    if (!isLoading) onCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      // Escape fires "cancel". We prevent the browser closing it itself so React state stays in charge.
      onCancel={(e) => {
        e.preventDefault();
        cancel();
      }}
      // A click directly on the <dialog> (not its content) means the backdrop was clicked.
      onClick={(e) => {
        if (e.target === e.currentTarget) cancel();
      }}
      // starting:open: = the style the dialog starts from when it opens (CSS @starting-style),
      // so it fades in and rises 8px. Reduced-motion users get it instantly (see index.css).
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-panel bg-background p-0 shadow-lg transition duration-200 ease-out backdrop:bg-ink/50 backdrop:backdrop-blur-sm starting:open:translate-y-2 starting:open:opacity-0"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger">
            <TriangleAlert className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{message}</p>
          </div>
        </div>

        {errorMessage && (
          <p role="alert" className="mt-5 flex items-start gap-2 rounded-control bg-danger-soft px-3 py-2.5 text-sm text-danger">
            <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            {errorMessage}
          </p>
        )}

        {/* Phones: buttons stacked full width, Delete on top. Larger screens: side by side on the right. */}
        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={cancel} disabled={isLoading} className={BUTTON_SECONDARY}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={isLoading} className={BUTTON_DANGER}>
            {isLoading ? (
              <LoaderCircle className="size-4 animate-spin" strokeWidth={2} aria-hidden="true" />
            ) : (
              <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
            )}
            {isLoading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
