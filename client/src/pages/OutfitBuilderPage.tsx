import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { ApiError } from "../api/client";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { NotFoundMessage } from "../components/NotFoundMessage";
import { OutfitBuilder } from "../components/OutfitBuilder";
import { useOutfit } from "../hooks/useOutfits";
import { parseId } from "../utils/parseId";

const notFound = <NotFoundMessage title="Outfit not found" linkTo="/outfits" linkLabel="Back to your outfits" />;

// Handles both /outfits/new (no :id) and /outfits/:id/edit.
export function OutfitBuilderPage() {
  const param = useParams().id;
  const isEdit = param !== undefined;
  const id = parseId(param);

  return (
    <div>
      {isEdit && (
        <Link
          to={id ? `/outfits/${id}` : "/outfits"}
          className="-ml-3 mb-2 inline-flex min-h-11 items-center gap-2 rounded-control px-3 text-sm text-ink-muted transition-colors duration-200 hover:bg-surface hover:text-ink"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Back to outfit
        </Link>
      )}
      <h1 className="text-3xl font-semibold md:text-4xl">{isEdit ? "Edit outfit" : "Create Outfit"}</h1>
      <p className="mt-2 mb-6 text-ink-muted md:mb-8">Pick one item per row, or let us surprise you.</p>

      {!isEdit ? <OutfitBuilder /> : id === null ? notFound : <EditOutfit id={id} />}
    </div>
  );
}

function EditOutfit({ id }: { id: number }) {
  const outfitQuery = useOutfit(id);

  if (outfitQuery.isPending) return <LoadingState message="Loading outfit..." />;
  if (outfitQuery.isError) {
    if (outfitQuery.error instanceof ApiError && outfitQuery.error.status === 404) return notFound;
    return <ErrorState message={outfitQuery.error.message} onRetry={() => outfitQuery.refetch()} />;
  }
  // key: a different outfit means a fresh builder (selection and form start over).
  return <OutfitBuilder key={outfitQuery.data.id} outfit={outfitQuery.data} />;
}
