import type { CreateOutfitDto, SurpriseQueryDto, UpdateOutfitDto } from "@styled/shared";
import { apiFetch } from "./client";
import type { ClothingItem, Outfit } from "./types";

export function getOutfits() {
  return apiFetch<{ outfits: Outfit[] }>("/api/outfits").then((data) => data.outfits);
}

export function getOutfit(id: number) {
  return apiFetch<{ outfit: Outfit }>(`/api/outfits/${id}`).then((data) => data.outfit);
}

export function createOutfit(dto: CreateOutfitDto) {
  return apiFetch<{ outfit: Outfit }>("/api/outfits", { method: "POST", body: dto }).then((data) => data.outfit);
}

export function updateOutfit(id: number, dto: UpdateOutfitDto) {
  return apiFetch<{ outfit: Outfit }>(`/api/outfits/${id}`, { method: "PATCH", body: dto }).then(
    (data) => data.outfit,
  );
}

export function deleteOutfit(id: number) {
  return apiFetch<void>(`/api/outfits/${id}`, { method: "DELETE" });
}

// Returns an unsaved, random suggestion (top + bottom, plus outerwear/footwear if available).
export function getSurprise({ season }: SurpriseQueryDto = {}) {
  const query = season ? `?season=${season}` : "";
  return apiFetch<{ items: ClothingItem[] }>(`/api/outfits/surprise${query}`).then((data) => data.items);
}
