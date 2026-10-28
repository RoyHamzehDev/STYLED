import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { ErrorState } from "../components/ErrorState";
import { ItemForm } from "../components/ItemForm";
import { LoadingState } from "../components/LoadingState";
import { NotFoundMessage } from "../components/NotFoundMessage";
import { useItem } from "../hooks/useItems";
import { parseId } from "../utils/parseId";

const notFound = <NotFoundMessage title="Item not found" linkTo="/wardrobe" linkLabel="Back to your wardrobe" />;

// Handles both /wardrobe/new (no :id) and /wardrobe/:id/edit.
export function ItemFormPage() {
  const param = useParams().id;
  const isEdit = param !== undefined;
  const id = parseId(param);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/wardrobe"
        className="-ml-3 inline-flex min-h-11 items-center gap-2 rounded-control px-3 text-sm text-ink-muted transition-colors duration-200 hover:bg-surface hover:text-ink"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
        Back to wardrobe
      </Link>
      <h1 className="mt-2 mb-6 text-3xl font-semibold md:mb-8 md:text-4xl">{isEdit ? "Edit item" : "Add item"}</h1>

      <div className="rounded-panel border border-border bg-background p-5 shadow-md sm:p-8">
        {!isEdit ? <ItemForm /> : id === null ? notFound : <EditItem id={id} />}
      </div>
    </div>
  );
}

// Separate component so useItem only runs once we know the id is a valid number.
function EditItem({ id }: { id: number }) {
  const itemQuery = useItem(id);

  if (itemQuery.isPending) return <LoadingState message="Loading item..." />;
  if (itemQuery.isError) {
    return <ErrorState message={itemQuery.error.message} onRetry={() => itemQuery.refetch()} />;
  }
  if (!itemQuery.data) return notFound;

  // key resets the form if the user navigates from one item's edit page to another's.
  return <ItemForm key={itemQuery.data.id} item={itemQuery.data} />;
}
