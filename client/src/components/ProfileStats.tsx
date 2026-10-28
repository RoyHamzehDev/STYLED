import { Link } from "react-router";
import { ArrowUpRight, BookHeart, Shirt, type LucideIcon } from "lucide-react";
import { useItems } from "../hooks/useItems";
import { useOutfits } from "../hooks/useOutfits";

// Reuses the cached wardrobe and outfits queries, so this is usually instant.
export function ProfileStats() {
  const itemsQuery = useItems();
  const outfitsQuery = useOutfits();

  return (
    <section className="rounded-panel border border-accent/40 bg-accent-soft p-5 sm:p-6">
      <h2 className="mb-4 text-xl font-semibold">Your Styled summary</h2>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Wardrobe items" to="/wardrobe" icon={Shirt} count={itemsQuery.data?.length} isError={itemsQuery.isError} />
        <Stat label="Saved outfits" to="/outfits" icon={BookHeart} count={outfitsQuery.data?.length} isError={outfitsQuery.isError} />
      </div>
    </section>
  );
}

type StatProps = { label: string; to: string; icon: LucideIcon; count: number | undefined; isError: boolean };

function Stat({ label, to, icon: Icon, count, isError }: StatProps) {
  return (
    <Link
      to={to}
      className="group rounded-card bg-background p-4 shadow-sm transition duration-200 ease-out hover:shadow-md motion-safe:hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between text-ink-muted">
        <Icon className="size-5 text-accent-strong" strokeWidth={1.75} aria-hidden="true" />
        <ArrowUpRight
          className="size-4 transition duration-200 group-hover:text-accent-strong motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </div>
      {/* "–" if the request failed, a grey pulsing bar while loading. */}
      <p className="mt-3 font-display text-4xl font-semibold text-ink tabular-nums">
        {isError ? (
          "–"
        ) : count === undefined ? (
          <>
            <span className="inline-block h-9 w-10 animate-pulse rounded-control bg-surface-strong align-middle" aria-hidden="true" />
            <span className="sr-only">Loading</span>
          </>
        ) : (
          count
        )}
      </p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </Link>
  );
}
