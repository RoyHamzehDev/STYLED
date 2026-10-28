import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type SelectMenuProps = {
  value: string;
  onChange: (value: string) => void;
  label: string; // accessible name (there is no visible label)
  children: ReactNode; // the <option> elements
  highlighted?: boolean; // tinted, e.g. when a filter is active
  className?: string;
};

// A native <select> styled to match our inputs. appearance-none hides the
// browser's own arrow, so we draw a lucide chevron on top instead. The border +
// ring is the focus indicator, so the global focus outline is turned off.
export function SelectMenu({ value, onChange, label, children, highlighted = false, className = "" }: SelectMenuProps) {
  return (
    <div className={`relative min-w-0 ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className={`min-h-11 w-full cursor-pointer appearance-none truncate rounded-control border py-2 pr-9 pl-3 text-base shadow-sm outline-none transition-colors duration-200 focus:border-accent-strong focus:ring-3 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${
          highlighted
            ? "border-accent bg-accent-soft font-medium text-ink"
            : "border-border bg-background text-ink-muted hover:border-border-strong"
        }`}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-muted"
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </div>
  );
}
