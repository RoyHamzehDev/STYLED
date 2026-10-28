import { keepPreviousData, useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import type { CreateItemDto, ItemFilters, UpdateItemDto } from "@styled/shared";
import { createItem, deleteItem, getItems, updateItem, uploadImage } from "../api/items";

// Every items query key starts with "items". Invalidating ["items"] therefore
// refreshes all of them, whatever filters they were fetched with.
export const ITEMS_QUERY_KEY = ["items"];

// After any item change: refresh item lists, and outfits too because they embed their items.
function invalidateItems(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: ["outfits"] });
}

export function useItems(filters: ItemFilters = {}) {
  return useQuery({
    // The filters are part of the key, so each filter combination is cached
    // separately and changing a filter automatically triggers a new fetch.
    queryKey: [...ITEMS_QUERY_KEY, filters],
    queryFn: () => getItems(filters),
    // While a new filter combination loads, keep showing the previous results
    // instead of flashing the skeleton on every keystroke.
    placeholderData: keepPreviousData,
  });
}

// The API has no GET /api/items/:id, so we read the item from the full (unfiltered) list.
// It uses the same query key as useItems(), so coming from the wardrobe it's already cached.
// `select` picks the one item; null means it doesn't exist (or isn't this user's).
export function useItem(id: number) {
  return useQuery({
    queryKey: [...ITEMS_QUERY_KEY, {}],
    queryFn: () => getItems(),
    select: (items) => items.find((item) => item.id === id) ?? null,
  });
}

export function useUploadImage() {
  return useMutation({ mutationFn: uploadImage });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateItemDto) => createItem(dto),
    onSuccess: () => invalidateItems(queryClient),
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateItemDto }) => updateItem(id, dto),
    onSuccess: () => invalidateItems(queryClient),
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => invalidateItems(queryClient),
  });
}
