import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, CalendarDays, Layers, Pencil, Shirt, Tag, Trash2 } from "lucide-react";
import { ApiError } from "../api/client";
import type { Outfit } from "../api/types";
import { ColorDots } from "../components/ColorDots";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { FavoriteButton } from "../components/FavoriteButton";
import { FormAlert } from "../components/FormAlert";
import { LoadingState } from "../components/LoadingState";
import { NotFoundMessage } from "../components/NotFoundMessage";
import { OutfitInfoForm } from "../components/OutfitInfoForm";
import { useDeleteOutfit, useOutfit, useToggleFavorite } from "../hooks/useOutfits";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "../utils/buttons";
import { parseId } from "../utils/parseId";
import { formatDate, formatEnum } from "../utils/format";

const notFound = <NotFoundMessage title="Outfit not found" linkTo="/outfits" linkLabel="Back to your outfits" />;

export function OutfitDetailPage() {
  const id = parseId(useParams().id);

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/outfits"
        className="-ml-3 inline-flex min-h-11 items-center gap-2 rounded-control px-3 text-sm text-ink-muted transition-colors duration-200 hover:bg-surface hover:text-ink"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
        Back to outfits
      </Link>
      {/* /outfits/abc never reaches the API. */}
      {id === null ? notFound : <OutfitDetail id={id} />}
    </div>
  );
}

function OutfitDetail({ id }: { id: number }) {
  const outfitQuery = useOutfit(id);

  if (outfitQuery.isPending) return <LoadingState message="Loading outfit..." />;
  if (outfitQuery.isError) {
    // 404 = doesn't exist or isn't ours. Only a 401 logs out; this just shows a message.
    if (outfitQuery.error instanceof ApiError && outfitQuery.error.status === 404) return notFound;
    return <ErrorState message={outfitQuery.error.message} onRetry={() => outfitQuery.refetch()} />;
  }
  return <OutfitContent outfit={outfitQuery.data} />;
}

function OutfitContent({ outfit }: { outfit: Outfit }) {
  const navigate = useNavigate();
  const toggleFavorite = useToggleFavorite();
  const deleteMutation = useDeleteOutfit();
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const confirmDelete = () => {
    deleteMutation.mutate(outfit.id, { onSuccess: () => navigate("/outfits", { replace: true }) });
  };

  return (
    <div className="mt-2 space-y-6 md:space-y-8">
      {toggleFavorite.isError && <FormAlert message="Couldn't update the favorite. Please try again." />}

      <section className="rounded-panel border border-border bg-background p-5 shadow-md sm:p-8">
        {isEditingInfo ? (
          <OutfitInfoForm outfit={outfit} onDone={() => setIsEditingInfo(false)} />
        ) : (
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-semibold break-words md:text-4xl">{outfit.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
                {outfit.occasion && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 font-medium text-accent-strong">
                    <Tag className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                    {outfit.occasion}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  Created {formatDate(outfit.createdAt)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  {outfit.items.length} {outfit.items.length === 1 ? "item" : "items"}
                </span>
              </div>
            </div>
            <FavoriteButton
              isFavorite={outfit.isFavorite}
              onToggle={() => toggleFavorite.mutate({ id: outfit.id, isFavorite: !outfit.isFavorite })}
              name={outfit.name}
              className="shrink-0"
            />
          </div>
        )}

        {!isEditingInfo && (
          <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-6">
            <button type="button" onClick={() => setIsEditingInfo(true)} className={BUTTON_SECONDARY}>
              <Pencil className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Edit name & occasion
            </button>
            <Link to={`/outfits/${outfit.id}/edit`} className={BUTTON_SECONDARY}>
              <Shirt className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Edit items
            </Link>
            {/* Outlined danger: deleting is serious, but shouldn't be the loudest button on the page. */}
            <button
              type="button"
              onClick={() => {
                deleteMutation.reset();
                setIsDeleteOpen(true);
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-danger/40 px-5 text-sm font-medium text-danger transition-colors duration-200 hover:border-danger hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto"
            >
              <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Delete outfit
            </button>
          </div>
        )}
      </section>

      {outfit.items.length === 0 ? (
        // Can happen if every item in the outfit was deleted from the wardrobe.
        <EmptyState
          icon={Layers}
          title="This outfit has no items"
          message="Its items were removed from your wardrobe. Add some new ones to bring it back to life."
          action={
            <Link to={`/outfits/${outfit.id}/edit`} className={BUTTON_PRIMARY}>
              <Shirt className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Edit items
            </Link>
          }
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5">
          {outfit.items.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-card border border-border bg-background shadow-md">
              <div className="aspect-square bg-surface">
                <img src={item.imageUrl} alt={item.name} loading="lazy" className="size-full object-contain p-4" />
              </div>
              <div className="space-y-2 border-t border-border p-3 md:p-4">
                <p className="truncate text-sm font-medium md:text-base">{item.name}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium tracking-wider text-ink-muted uppercase">{formatEnum(item.category)}</span>
                  <ColorDots colors={item.colors} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete outfit?"
        message={`"${outfit.name}" will be deleted. The clothes stay in your wardrobe.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        errorMessage={deleteMutation.error?.message}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
