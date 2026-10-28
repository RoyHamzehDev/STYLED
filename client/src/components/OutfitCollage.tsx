import { Layers } from "lucide-react";
import type { ClothingItem } from "../api/types";

const MAX_TILES = 4;

// 2x2 grid of item thumbnails. With more than 4 items, the last tile becomes "+N".
// The 1px gap over a border-coloured background draws thin dividers between the tiles.
export function OutfitCollage({ items }: { items: ClothingItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex aspect-square flex-col items-center justify-center gap-2 bg-surface text-sm text-ink-muted">
        <Layers className="size-6" strokeWidth={1.5} aria-hidden="true" />
        No items
      </div>
    );
  }

  const overflow = items.length > MAX_TILES;
  // When overflowing, show 3 photos and use the 4th tile for the "+N" count.
  const shown = items.slice(0, overflow ? MAX_TILES - 1 : MAX_TILES);
  const hiddenCount = items.length - shown.length;

  return (
    <div className="grid aspect-square grid-cols-2 grid-rows-2 gap-px bg-border">
      {shown.map((item) => (
        <div key={item.id} className="overflow-hidden bg-surface">
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            className="size-full object-contain p-2.5 transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.04]"
          />
        </div>
      ))}
      {overflow && (
        <div className="flex items-center justify-center bg-accent-soft font-display text-2xl font-semibold text-accent-strong">
          +{hiddenCount}
        </div>
      )}
      {/* Fill the empty cells so the grid always looks like a full square. */}
      {Array.from({ length: MAX_TILES - shown.length - (overflow ? 1 : 0) }, (_, i) => (
        <div key={`empty-${i}`} className="bg-surface" />
      ))}
    </div>
  );
}
