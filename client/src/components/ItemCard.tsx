import { Link } from "react-router";
import { Pencil, Trash2 } from "lucide-react";
import type { ClothingItem } from "../api/types";
import { formatEnum } from "../utils/format";
import { ColorDots } from "./ColorDots";

type ItemCardProps = {
  item: ClothingItem;
  onDelete: (item: ClothingItem) => void;
};

const ACTION_CLASS =
  "flex size-10 items-center justify-center rounded-full bg-background/95 text-ink-muted shadow-sm ring-1 ring-border transition-colors duration-200";

export function ItemCard({ item, onDelete }: ItemCardProps) {
  return (
    <article className="group overflow-hidden rounded-card border border-border bg-background shadow-md transition duration-200 ease-out hover:shadow-lg motion-safe:hover:-translate-y-0.5">
      {/* overflow-hidden keeps the zoomed photo inside its box, so the hover zoom never shifts the layout. */}
      <div className="relative aspect-square overflow-hidden bg-surface">
        {/* object-contain shows the whole garment without cropping, whatever the photo's shape. */}
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className="size-full object-contain p-4 transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.03]"
        />

        {/* With a mouse (pointer-fine) the buttons appear on hover or keyboard focus; on touch screens they are always visible. */}
        <div className="absolute top-2 right-2 flex gap-1.5 transition-opacity duration-200 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:opacity-100">
          <Link
            to={`/wardrobe/${item.id}/edit`}
            aria-label={`Edit ${item.name}`}
            className={`${ACTION_CLASS} hover:bg-accent-soft hover:text-accent-strong`}
          >
            <Pencil className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(item)}
            aria-label={`Delete ${item.name}`}
            className={`${ACTION_CLASS} hover:bg-danger-soft hover:text-danger disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="space-y-2 border-t border-border p-3 md:p-4">
        <h3 className="truncate font-sans text-sm font-medium" title={item.name}>
          {item.name}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium tracking-wider text-ink-muted uppercase">{formatEnum(item.category)}</span>
          <ColorDots colors={item.colors} />
        </div>
      </div>
    </article>
  );
}
