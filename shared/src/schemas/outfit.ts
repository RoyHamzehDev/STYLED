import { z } from "zod";
import { SEASONS } from "./clothing.js";

const ItemIdsSchema = z
  .array(z.number().int().positive())
  .min(1, "Pick at least one item")
  .max(10, "An outfit can have at most 10 items")
  .transform((ids) => [...new Set(ids)]);

export const CreateOutfitSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  occasion: z.string().trim().max(60).optional(),
  itemIds: ItemIdsSchema,
});

export const UpdateOutfitSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60).optional(),
  occasion: z.string().trim().max(60).nullable().optional(),
  itemIds: ItemIdsSchema.optional(),
  isFavorite: z.boolean().optional(),
});

export const SurpriseQuerySchema = z.object({
  season: z.enum(SEASONS).optional(),
});

export type CreateOutfitDto = z.infer<typeof CreateOutfitSchema>;
export type UpdateOutfitDto = z.infer<typeof UpdateOutfitSchema>;
export type SurpriseQueryDto = z.infer<typeof SurpriseQuerySchema>;