import { useId } from "react";
import { CircleAlert } from "lucide-react";
import { formatEnum } from "../utils/format";

type ChipSelectProps<T extends string> = {
  label: string;
  options: readonly T[];
  selected: readonly T[];
  onToggle: (value: T) => void;
  error?: string;
  // Optional CSS background per option, shown as a small dot (used for colors).
  swatches?: Partial<Record<T, string>>;
};

// A group of toggle buttons. The parent decides what a click means:
// single-select replaces the value, multi-select adds/removes it.
export function ChipSelect<T extends string>({ label, options, selected, onToggle, error, swatches }: ChipSelectProps<T>) {
  const errorId = useId();

  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="mb-2 text-sm font-medium text-ink">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const swatch = swatches?.[option];
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              // aria-pressed tells screen readers this is an on/off toggle.
              aria-pressed={isSelected}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                isSelected
                  ? "border-accent bg-accent text-on-accent shadow-sm hover:border-accent-hover hover:bg-accent-hover"
                  : error
                    ? "border-danger/40 bg-background text-ink-muted hover:border-danger hover:text-ink"
                    : "border-border bg-background text-ink-muted hover:border-accent hover:bg-accent-soft hover:text-ink"
              }`}
            >
              {swatch && (
                <span className="size-3.5 rounded-full ring-1 ring-border-strong" style={{ background: swatch }} aria-hidden="true" />
              )}
              {formatEnum(option)}
            </button>
          );
        })}
      </div>
      {error && (
        <p id={errorId} className="mt-2 flex items-center gap-1.5 text-sm text-danger">
          <CircleAlert className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {error}
        </p>
      )}
    </fieldset>
  );
}
