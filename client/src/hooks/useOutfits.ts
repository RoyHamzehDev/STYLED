import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateOutfitDto, UpdateOutfitDto } from "@styled/shared";
import { createOutfit, deleteOutfit, getOutfit, getOutfits, getSurprise, updateOutfit } from "../api/outfits";
import type { Outfit } from "../api/types";

// ["outfits"] is the list, ["outfits", id] a single outfit.
// Invalidating ["outfits"] refreshes both, since it matches every key that starts with it.
export const OUTFITS_QUERY_KEY = ["outfits"];
const outfitKey = (id: number) => [...OUTFITS_QUERY_KEY, id];

export function useOutfits() {
  return useQuery({ queryKey: OUTFITS_QUERY_KEY, queryFn: getOutfits });
}

export function useOutfit(id: number) {
  return useQuery({ queryKey: outfitKey(id), queryFn: () => getOutfit(id) });
}

export function useCreateOutfit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateOutfitDto) => createOutfit(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: OUTFITS_QUERY_KEY }),
  });
}

export function useUpdateOutfit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateOutfitDto }) => updateOutfit(id, dto),
    onSuccess: (outfit) => {
      // Put the server's response straight into the cache so the page updates instantly,
      // then refetch everything in the background to be safe.
      queryClient.setQueryData(outfitKey(outfit.id), outfit);
      queryClient.invalidateQueries({ queryKey: OUTFITS_QUERY_KEY });
    },
  });
}

export function useDeleteOutfit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOutfit,
    onSuccess: (_data, id) => {
      // Drop the deleted outfit's own cache entry (refetching it would just 404),
      // and refresh the list.
      queryClient.removeQueries({ queryKey: outfitKey(id) });
      queryClient.invalidateQueries({ queryKey: OUTFITS_QUERY_KEY, exact: true });
    },
  });
}

type ToggleFavoriteVars = { id: number; isFavorite: boolean };

// Optimistic update: the heart changes instantly, before the server answers.
// 1. onMutate: save the current cache, then write the new value into it.
// 2. onError: the request failed, so put the saved cache back (rollback).
// 3. onSettled: success or not, refetch so the cache matches the server.
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFavorite }: ToggleFavoriteVars) => updateOutfit(id, { isFavorite }),
    onMutate: async ({ id, isFavorite }) => {
      // Stop in-flight refetches so they can't overwrite our optimistic value.
      await queryClient.cancelQueries({ queryKey: OUTFITS_QUERY_KEY });

      const previousList = queryClient.getQueryData<Outfit[]>(OUTFITS_QUERY_KEY);
      const previousOutfit = queryClient.getQueryData<Outfit>(outfitKey(id));

      queryClient.setQueryData<Outfit[]>(OUTFITS_QUERY_KEY, (list) =>
        list?.map((outfit) => (outfit.id === id ? { ...outfit, isFavorite } : outfit)),
      );
      queryClient.setQueryData<Outfit>(outfitKey(id), (outfit) => (outfit ? { ...outfit, isFavorite } : outfit));

      return { previousList, previousOutfit }; // passed to onError as the 3rd argument
    },
    onError: (_error, { id }, snapshot) => {
      queryClient.setQueryData(OUTFITS_QUERY_KEY, snapshot?.previousList);
      queryClient.setQueryData(outfitKey(id), snapshot?.previousOutfit);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: OUTFITS_QUERY_KEY }),
  });
}

// Surprise Me is a GET, but we use useMutation instead of useQuery: it runs only when
// the button is clicked, and each click should give a new random result, not a cached one.
export function useSurprise() {
  return useMutation({ mutationFn: getSurprise });
}
