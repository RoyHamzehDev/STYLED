import { useState } from "react";
import { Link } from "react-router";
import { Plus, SearchX, Shirt, X } from "lucide-react";
import type { ClothingItem } from "../api/types";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { ItemCard } from "../components/ItemCard";
import { ItemCardSkeleton } from "../components/ItemCardSkeleton";
import { WardrobeFilters } from "../components/WardrobeFilters";
import { useItemFilters } from "../hooks/useItemFilters";
import { useDeleteItem, useItems } from "../hooks/useItems";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "../utils/buttons";

const GRID = "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6";

const plusIcon = <Plus className="size-4" strokeWidth={2} aria-hidden="true" />;

export function WardrobePage() {
  const { filters, hasFilters, setFilter, clearFilters } = useItemFilters();
  const itemsQuery = useItems(filters);
  const deleteMutation = useDeleteItem();
  // The item waiting for delete confirmation. null = dialog closed.
  const [itemToDelete, setItemToDelete] = useState<ClothingItem | null>(null);

  const items = itemsQuery.data;
  // A truly empty wardrobe (not just "nothing matches"): show only the empty state, no filters.
  const isWardrobeEmpty = !hasFilters && items?.length === 0;

  const openDeleteDialog = (item: ClothingItem) => {
    deleteMutation.reset(); // clear an error left over from a previous attempt
    setItemToDelete(item);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    deleteMutation.mutate(itemToDelete.id, { onSuccess: () => setItemToDelete(null) });
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
        <div>
          <h1 className="text-3xl font-semibold md:text-4xl">My Wardrobe</h1>
          {/* min-h keeps the header the same height before the count appears. */}
          <p className="mt-2 min-h-5 text-sm text-ink-muted">
            {items && items.length > 0 && (
              <>
                {items.length} {items.length === 1 ? "item" : "items"}
                {hasFilters && " found"}
              </>
            )}
          </p>
        </div>
        <Link to="/wardrobe/new" className={`${BUTTON_PRIMARY} shrink-0`}>
          {plusIcon}
          Add item
        </Link>
      </div>

      {!isWardrobeEmpty && (
        <WardrobeFilters filters={filters} hasFilters={hasFilters} onChange={setFilter} onClear={clearFilters} />
      )}

      {itemsQuery.isPending ? (
        <div className={GRID}>
          {Array.from({ length: 8 }, (_, i) => (
            <ItemCardSkeleton key={i} />
          ))}
        </div>
      ) : itemsQuery.isError ? (
        <ErrorState
          title="We couldn't load your wardrobe"
          message={itemsQuery.error.message}
          onRetry={() => itemsQuery.refetch()}
        />
      ) : isWardrobeEmpty ? (
        <EmptyState
          icon={Shirt}
          title="Your wardrobe is empty"
          message="Add your first piece of clothing to start building outfits."
          action={
            <Link to="/wardrobe/new" className={BUTTON_PRIMARY}>
              {plusIcon}
              Add your first item
            </Link>
          }
        />
      ) : itemsQuery.data.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No items match these filters"
          message="Try a different search or remove some filters."
          action={
            <button type="button" onClick={clearFilters} className={BUTTON_SECONDARY}>
              <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Clear filters
            </button>
          }
        />
      ) : (
        // isPlaceholderData = showing the previous results while new filters load.
        <div className={`${GRID} transition-opacity duration-200 ${itemsQuery.isPlaceholderData ? "opacity-50" : ""}`}>
          {itemsQuery.data.map((item) => (
            <ItemCard key={item.id} item={item} onDelete={openDeleteDialog} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={itemToDelete !== null}
        title="Delete item?"
        message={`"${itemToDelete?.name}" will be removed from your wardrobe and from any outfits that use it.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        errorMessage={deleteMutation.error?.message}
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
