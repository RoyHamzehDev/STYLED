import { Link } from "react-router";
import { Plus, RotateCcw, Shirt } from "lucide-react";
import type { Outfit } from "../api/types";
import { useItems } from "../hooks/useItems";
import { BUILDER_CATEGORIES, useOutfitSelection } from "../hooks/useOutfitSelection";
import { BUTTON_PRIMARY } from "../utils/buttons";
import { formatEnum } from "../utils/format";
import { BuilderRow } from "./BuilderRow";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { OutfitPreview } from "./OutfitPreview";
import { SaveOutfitForm } from "./SaveOutfitForm";
import { SurpriseMe } from "./SurpriseMe";

// The outfit builder, used to create a new outfit or (with `outfit`) edit an existing one.
export function OutfitBuilder({ outfit }: { outfit?: Outfit }) {
  const itemsQuery = useItems();
  // In edit mode the outfit's items start selected.
  const selection = useOutfitSelection(outfit?.items);

  if (itemsQuery.isPending) return <LoadingState message="Loading your wardrobe..." />;
  if (itemsQuery.isError) {
    return (
      <ErrorState
        title="We couldn't load your wardrobe"
        message={itemsQuery.error.message}
        onRetry={() => itemsQuery.refetch()}
      />
    );
  }

  // One row per category, in builder order, skipping categories with no items.
  const rows = BUILDER_CATEGORIES.map((category) => ({
    category,
    items: itemsQuery.data.filter((item) => item.category === category),
  })).filter((row) => row.items.length > 0);

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Shirt}
        title="Your wardrobe is empty"
        message="Add some clothes first, then come back to mix and match them."
        action={
          <Link to="/wardrobe/new" className={BUTTON_PRIMARY}>
            <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
            Add items
          </Link>
        }
      />
    );
  }

  return (
    // Mobile: one column (preview below the rows). Desktop: rows | preview side by side.
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
      <div className="min-w-0 space-y-6">
        <SurpriseMe onSurprise={selection.replaceAll} />
        {rows.map((row) => (
          <BuilderRow
            key={row.category}
            label={formatEnum(row.category)}
            items={row.items}
            isSelected={selection.isSelected}
            hasSelection={selection.hasSelectionIn(row.category)}
            onToggle={selection.toggle}
          />
        ))}
      </div>

      {/* sticky keeps the preview in view while scrolling the rows on desktop. */}
      <aside className="space-y-6 self-start rounded-panel border border-border bg-background p-5 shadow-lg sm:p-6 lg:sticky lg:top-24">
        <div>
          {/* min-h-10 keeps the header the same height whether or not the Clear button shows. */}
          <div className="mb-4 flex min-h-10 items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-semibold">Your outfit</h2>
              {selection.selected.length > 0 && (
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-strong">
                  {selection.selected.length} {selection.selected.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>
            {selection.selected.length > 0 && (
              <button
                type="button"
                onClick={selection.clear}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-control px-3 text-sm text-ink-muted transition-colors duration-200 hover:bg-surface hover:text-ink"
              >
                <RotateCcw className="size-4" strokeWidth={1.75} aria-hidden="true" />
                Clear
              </button>
            )}
          </div>
          <OutfitPreview items={selection.selected} onRemove={selection.toggle} />
        </div>
        <div className="border-t border-border pt-6">
          <SaveOutfitForm selectedIds={selection.selectedIds} outfit={outfit} />
        </div>
      </aside>
    </div>
  );
}
