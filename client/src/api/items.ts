import type { CreateItemDto, ItemFilters, UpdateItemDto } from "@styled/shared";
import { apiFetch } from "./client";
import type { ClothingItem } from "./types";

export function getItems(filters: ItemFilters = {}) {
  // Only send filters that are set: { category: "TOP", search: "" } -> "?category=TOP"
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  const query = params.size ? `?${params}` : "";
  return apiFetch<{ items: ClothingItem[] }>(`/api/items${query}`).then((data) => data.items);
}

export function createItem(dto: CreateItemDto) {
  return apiFetch<{ item: ClothingItem }>("/api/items", { method: "POST", body: dto }).then((data) => data.item);
}

export function updateItem(id: number, dto: UpdateItemDto) {
  return apiFetch<{ item: ClothingItem }>(`/api/items/${id}`, { method: "PATCH", body: dto }).then(
    (data) => data.item,
  );
}

export function deleteItem(id: number) {
  return apiFetch<void>(`/api/items/${id}`, { method: "DELETE" });
}

// Sends the file as multipart/form-data under the field name "image".
// No Content-Type header here: the browser sets it, including the multipart boundary.
export function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  return apiFetch<{ imageUrl: string }>("/api/uploads/image", { method: "POST", body: formData }).then(
    (data) => data.imageUrl,
  );
}
