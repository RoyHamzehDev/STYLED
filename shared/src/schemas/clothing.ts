import { z } from "zod";

// Must match the enums in server/prisma/schema.prisma
export const CATEGORIES = ["TOP", "BOTTOM", "DRESS", "OUTERWEAR", "FOOTWEAR", "ACCESSORIES", "OTHER"] as const;
export const STYLES = ["CASUAL", "FORMAL", "SPORTY", "VINTAGE", "BOHEMIAN", "CHIC", "PREPPY", "STREETWEAR", "MINIMALIST", "ECLECTIC"] as const;
export const COLORS = ["RED", "BLUE", "GREEN", "YELLOW", "ORANGE", "PURPLE", "PINK", "BROWN", "BLACK", "WHITE", "GRAY", "MULTICOLOR", "NUDE"] as const;
export const SEASONS = ["SPRING", "SUMMER", "FALL", "WINTER"] as const;

export const CreateItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  category: z.enum(CATEGORIES),
  styles: z.array(z.enum(STYLES)),
  colors: z.array(z.enum(COLORS)).min(1, "Pick at least one color"),
  seasons: z.array(z.enum(SEASONS)),
  imageUrl: z.url("Invalid image URL"),
});

export const UpdateItemSchema = CreateItemSchema.partial(); //.partial() makes all fields optional for updates

export const ItemFiltersSchema = z.object({
  category: z.enum(CATEGORIES).optional(),
  style: z.enum(STYLES).optional(),
  color: z.enum(COLORS).optional(),
  season: z.enum(SEASONS).optional(),
  search: z.string().trim().min(1).max(60).optional(),
});

export type ItemFilters = z.infer<typeof ItemFiltersSchema>;

export type CreateItemDto = z.infer<typeof CreateItemSchema>;
export type UpdateItemDto = z.infer<typeof UpdateItemSchema>;
export type Category = (typeof CATEGORIES)[number];