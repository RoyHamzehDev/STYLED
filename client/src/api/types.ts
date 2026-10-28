import type { Category, COLORS, SEASONS, STYLES } from "@styled/shared";

// Union types built from the shared enum arrays, e.g. Color = "RED" | "BLUE" | ...
// (@styled/shared only exports Category, so the others are derived here the same way.)
export type Style = (typeof STYLES)[number];
export type Color = (typeof COLORS)[number];
export type Season = (typeof SEASONS)[number];

// Response shapes from the server. Request shapes come from @styled/shared schemas.
export type User = {
  id: number;
  name: string;
  email: string;
  preferredStyles: Style[];
  favoriteColors: Color[];
  createdAt: string;
};

export type ClothingItem = {
  id: number;
  name: string;
  category: Category;
  styles: Style[];
  colors: Color[];
  seasons: Season[];
  imageUrl: string;
  createdAt: string; // dates arrive as ISO strings in JSON
  userId: number;
};

export type Outfit = {
  id: number;
  name: string;
  occasion: string | null;
  isFavorite: boolean;
  shareToken: string | null;
  createdAt: string;
  userId: number;
  items: ClothingItem[]; // the server flattens the join table into full items
};
