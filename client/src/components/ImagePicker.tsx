import { useId, useState, type DragEvent } from "react";
import { CircleAlert, ImagePlus, ImageUp } from "lucide-react";

// Same limits as the server, checked in the browser so the user gets instant feedback.
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

type ImagePickerProps = {
  previewUrl: string | null;
  onFileSelected: (file: File) => void;
  onInvalidFile: (message: string) => void;
  error?: string;
  disabled?: boolean;
};

export function ImagePicker({ previewUrl, onFileSelected, onInvalidFile, error, disabled }: ImagePickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  // useId gives a unique id to link the error message to the input for screen readers.
  const errorId = useId();

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) return onInvalidFile("Please choose a JPEG, PNG or WebP image.");
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return onInvalidFile(`The image must be ${MAX_SIZE_MB}MB or smaller.`);
    onFileSelected(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault(); // stop the browser from opening the dropped file
    setIsDragging(false);
    if (!disabled) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">Photo</span>
      {/* A <label> around the hidden file input: clicking anywhere in the box opens the file dialog.
          The input itself is invisible, so has-focus-visible: draws the keyboard focus ring on the box. */}
      <label
        // preventDefault on dragOver is required, otherwise the browser never fires "drop".
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-card border-2 border-dashed text-center transition-colors duration-200 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-strong has-disabled:cursor-not-allowed has-disabled:opacity-60 sm:max-w-sm ${
          isDragging
            ? "border-accent-strong bg-accent-soft"
            : error
              ? "border-danger bg-danger-soft"
              : "border-border-strong bg-surface hover:border-accent hover:bg-accent-soft/50"
        }`}
      >
        <input
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          // Reset the value so picking the same file again still fires onChange.
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
          className="sr-only"
        />
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Preview" className="size-full bg-background object-contain p-4" />
            <span className="absolute bottom-3 inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3.5 py-1.5 text-xs font-medium text-ink shadow-md ring-1 ring-border transition-colors duration-200 group-hover:bg-accent-soft">
              <ImageUp className="size-4" strokeWidth={1.75} aria-hidden="true" />
              {isDragging ? "Drop to replace" : "Click or drop to change"}
            </span>
          </>
        ) : (
          <div className="flex flex-col items-center px-6 text-sm text-ink-muted">
            <span className="flex size-14 items-center justify-center rounded-full bg-background text-accent-strong shadow-sm ring-1 ring-border">
              <ImagePlus className="size-6" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <p className="mt-4 font-medium text-ink">{isDragging ? "Drop the photo here" : "Click to choose a photo"}</p>
            <p className="mt-0.5">or drag and drop it here</p>
            <p className="mt-3 text-xs">JPEG, PNG or WebP, up to {MAX_SIZE_MB}MB</p>
          </div>
        )}
      </label>
      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
          <CircleAlert className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
