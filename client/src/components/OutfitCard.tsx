import { Link } from "react-router";
import type { Outfit } from "../api/types";
import { formatDate } from "../utils/format";
import { FavoriteButton } from "./FavoriteButton";
import { OutfitCollage } from "./OutfitCollage";

type OutfitCardProps = {
  outfit: Outfit;
  onToggleFavorite: (outfit: Outfit) => void;
};

export function OutfitCard({ outfit, onToggleFavorite }: OutfitCardProps) {
  return (
    // The heart is a sibling of the Link, not inside it: a button inside a link is invalid HTML
    // and clicking the heart would also open the outfit.
    <article className="group relative overflow-hidden rounded-card border border-border bg-background shadow-md transition duration-200 ease-out hover:shadow-lg motion-safe:hover:-translate-y-0.5">
      {/* The article clips its overflow, so the focus outline is drawn inside the edge (-outline-offset-2). */}
      <Link to={`/outfits/${outfit.id}`} className="block rounded-card focus-visible:-outline-offset-2">
        <OutfitCollage items={outfit.items} />
        <div className="border-t border-border p-3 md:p-4">
          <h3 className="truncate text-base font-semibold transition-colors duration-200 group-hover:text-accent-strong md:text-lg" title={outfit.name}>
            {outfit.name}
          </h3>
          <p className="mt-1 truncate text-xs text-ink-muted">
            {outfit.occasion && <span className="font-medium text-ink">{outfit.occasion} · </span>}
            {formatDate(outfit.createdAt)}
          </p>
        </div>
      </Link>
      <FavoriteButton
        isFavorite={outfit.isFavorite}
        onToggle={() => onToggleFavorite(outfit)}
        name={outfit.name}
        className="absolute top-2 right-2"
      />
    </article>
  );
}
