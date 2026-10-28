import { Heart } from "lucide-react";

type FavoriteButtonProps = {
  isFavorite: boolean;
  onToggle: () => void;
  name: string; // outfit name, for the screen reader label
  className?: string;
};

export function FavoriteButton({ isFavorite, onToggle, name, className = "" }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      className={`flex size-10 items-center justify-center rounded-full bg-background/95 shadow-sm ring-1 ring-border transition-colors duration-200 hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50 ${
        isFavorite ? "text-accent-strong" : "text-ink-muted hover:text-accent-strong"
      } ${className}`}
    >
      {/* fill="currentColor" turns the outline heart into a solid one when it's a favorite. */}
      <Heart className="size-5" strokeWidth={1.75} fill={isFavorite ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
