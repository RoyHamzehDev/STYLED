import { Link, useSearchParams } from "react-router";
import { BookHeart, Heart, LayoutGrid, Plus } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { FormAlert } from "../components/FormAlert";
import { ItemCardSkeleton } from "../components/ItemCardSkeleton";
import { OutfitCard } from "../components/OutfitCard";
import { useOutfits, useToggleFavorite } from "../hooks/useOutfits";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "../utils/buttons";

const GRID = "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6";
const plusIcon = <Plus className="size-4" strokeWidth={2} aria-hidden="true" />;

const TABS = [
  { value: "all", label: "All", icon: LayoutGrid },
  { value: "favorites", label: "Favorites", icon: Heart },
] as const;

export function OutfitsPage() {
  const outfitsQuery = useOutfits();
  const toggleFavorite = useToggleFavorite();

  // ?tab=favorites keeps the choice on refresh. Anything else means "all".
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "favorites" ? "favorites" : "all";

  // Favorites are filtered here on the client: we already have every outfit.
  const outfits = outfitsQuery.data;
  const visible = tab === "favorites" ? outfits?.filter((outfit) => outfit.isFavorite) : outfits;
  // Shown next to each tab label once the outfits have loaded.
  const counts = { all: outfits?.length, favorites: outfits?.filter((outfit) => outfit.isFavorite).length };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
        <h1 className="text-3xl font-semibold md:text-4xl">Saved Outfits</h1>
        <Link to="/outfits/new" className={`${BUTTON_PRIMARY} shrink-0`}>
          {plusIcon}
          <span>
            Create <span className="hidden sm:inline">outfit</span>
          </span>
        </Link>
      </div>

      <div role="tablist" aria-label="Filter outfits" className="mb-6 inline-flex gap-1 rounded-full bg-surface-strong p-1">
        {TABS.map(({ value, label, icon: Icon }) => {
          const isActive = tab === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSearchParams(value === "all" ? {} : { tab: value }, { replace: true })}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm transition-colors duration-200 ${
                isActive ? "bg-background font-medium text-ink shadow-sm" : "text-ink-muted hover:bg-background/60 hover:text-ink"
              }`}
            >
              <Icon
                className={`size-4 ${isActive ? "text-accent-strong" : ""}`}
                strokeWidth={1.75}
                fill={value === "favorites" && isActive ? "currentColor" : "none"}
                aria-hidden="true"
              />
              {label}
              {counts[value] !== undefined && (
                <span className={`text-xs tabular-nums ${isActive ? "text-ink-muted" : ""}`}>{counts[value]}</span>
              )}
            </button>
          );
        })}
      </div>

      {toggleFavorite.isError && <FormAlert message="Couldn't update the favorite. Please try again." />}

      {outfitsQuery.isPending ? (
        <div className={GRID}>
          {Array.from({ length: 8 }, (_, i) => (
            <ItemCardSkeleton key={i} />
          ))}
        </div>
      ) : outfitsQuery.isError ? (
        <ErrorState
          title="We couldn't load your outfits"
          message={outfitsQuery.error.message}
          onRetry={() => outfitsQuery.refetch()}
        />
      ) : outfitsQuery.data.length === 0 ? (
        <EmptyState
          icon={BookHeart}
          title="No saved outfits yet"
          message="Mix items from your wardrobe and save your favorite looks here."
          action={
            <Link to="/outfits/new" className={BUTTON_PRIMARY}>
              {plusIcon}
              Create your first outfit
            </Link>
          }
        />
      ) : visible?.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          message="Tap the heart on an outfit to add it to your favorites."
          action={
            <button type="button" onClick={() => setSearchParams({}, { replace: true })} className={BUTTON_SECONDARY}>
              <LayoutGrid className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Show all outfits
            </button>
          }
        />
      ) : (
        <div className={GRID}>
          {visible?.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              onToggleFavorite={(o) => toggleFavorite.mutate({ id: o.id, isFavorite: !o.isFavorite })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
