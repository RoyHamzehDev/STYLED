import { useSearchParams } from "react-router";
import { ItemFiltersSchema, type ItemFilters } from "@styled/shared";

export type FilterKey = "category" | "color" | "season" | "search";

// Filters live in the URL (?category=TOP&search=shirt) so a refresh or a shared link keeps them.
export function useItemFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Validate each URL value with the shared schema. Anything invalid (?category=BANANA)
  // is ignored instead of being sent to the server and causing a 400.
  // safeParse(...).data is the parsed value on success and undefined on failure.
  const shape = ItemFiltersSchema.shape;
  const param = (key: FilterKey) => searchParams.get(key) ?? undefined;

  const filters: ItemFilters = {
    category: shape.category.safeParse(param("category")).data,
    color: shape.color.safeParse(param("color")).data,
    season: shape.season.safeParse(param("season")).data,
    search: shape.search.safeParse(param("search")).data, // also trims, and drops "   "
  };

  const hasFilters = Object.values(filters).some(Boolean);

  // Empty value removes the param. `replace` avoids one history entry per change.
  const setFilter = (key: FilterKey, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  };

  const clearFilters = () => setSearchParams({}, { replace: true });

  return { filters, hasFilters, setFilter, clearFilters };
}
