import { Layers, X } from "lucide-react";
import type { ClothingItem } from "../api/types";
import { formatEnum } from "../utils/format";

type OutfitPreviewProps = {
  items: ClothingItem[]; // already in head-to-toe order
  onRemove: (item: ClothingItem) => void;
};

// The selected items stacked in a column, roughly how they'd be worn.
export function OutfitPreview({ items, onRemove }: OutfitPreviewProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-52 flex-col items-center justify-center rounded-card border border-dashed border-border-strong bg-surface p-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-background text-accent-strong shadow-sm ring-1 ring-border">
          <Layers className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <p className="mt-3 max-w-52 text-sm text-ink-muted">Pick items from the rows to build your outfit.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 rounded-card border border-border bg-surface p-2 pr-1.5">
          <img
            src={item.imageUrl}
            alt=""
            className="size-16 shrink-0 rounded-control bg-background object-contain p-1.5 ring-1 ring-border"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.name}</p>
            <p className="mt-0.5 text-xs tracking-wider text-ink-muted uppercase">{formatEnum(item.category)}</p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item)}
            aria-label={`Remove ${item.name}`}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors duration-200 hover:bg-danger-soft hover:text-danger"
          >
            <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
