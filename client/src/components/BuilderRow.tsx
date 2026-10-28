import { Check } from "lucide-react";
import type { ClothingItem } from "../api/types";

type BuilderRowProps = {
  label: string;
  items: ClothingItem[];
  isSelected: (id: number) => boolean;
  hasSelection: boolean;
  onToggle: (item: ClothingItem) => void;
};

// One category of the outfit builder: a label and a sideways-scrolling strip of items.
export function BuilderRow({ label, items, isSelected, hasSelection, onToggle }: BuilderRowProps) {
  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h2 className="font-sans text-xs font-semibold tracking-[0.15em] text-ink-muted uppercase">{label}</h2>
        <span className="text-xs text-ink-muted">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>
      {/* overflow-x-auto + shrink-0 tiles = horizontal scroll; snap makes swiping stop on a tile.
          The padding leaves room for the hover lift and the focus outline, which would otherwise be clipped. */}
      <div className="-mx-2 flex snap-x scroll-px-2 gap-3 overflow-x-auto px-2 pt-2 pb-4">
        {items.map((item) => {
          const selected = isSelected(item.id);
          // Like the Android app: once a row has a pick, the other items in it fade.
          const faded = hasSelection && !selected;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item)}
              aria-pressed={selected}
              className={`group relative w-32 shrink-0 snap-start overflow-hidden rounded-card border-2 bg-background text-left transition duration-200 ease-out motion-safe:hover:-translate-y-0.5 sm:w-36 ${
                selected
                  ? "border-accent-strong shadow-lg"
                  : "border-border shadow-sm hover:border-border-strong hover:shadow-md"
              } ${faded ? "opacity-50 hover:opacity-90" : ""}`}
            >
              <div className="aspect-square overflow-hidden bg-surface">
                <img
                  src={item.imageUrl}
                  alt=""
                  loading="lazy"
                  className="size-full object-contain p-3 transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.04]"
                />
              </div>
              <p className={`truncate border-t px-2.5 py-2 text-xs font-medium ${selected ? "border-accent-soft bg-accent-soft text-ink" : "border-border text-ink"}`}>
                {item.name}
              </p>
              {selected && (
                <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-accent-strong text-white shadow-md">
                  <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
