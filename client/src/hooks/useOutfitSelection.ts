import { useState } from "react";
import type { Category } from "@styled/shared";
import type { ClothingItem } from "../api/types";

// Builder rows, top to bottom. Also the order of the preview. ("OTHER" isn't part of the builder.)
export const BUILDER_CATEGORIES = ["OUTERWEAR", "TOP", "DRESS", "BOTTOM", "FOOTWEAR", "ACCESSORIES"] as const satisfies readonly Category[];

// Position of a category in the builder (OTHER, which isn't a row, sorts last).
function categoryRank(category: Category): number {
  const index = (BUILDER_CATEGORIES as readonly Category[]).indexOf(category);
  return index === -1 ? BUILDER_CATEGORIES.length : index;
}

// Which categories a newly selected item removes from the selection.
function conflictsWith(category: Category): Category[] {
  switch (category) {
    case "ACCESSORIES":
      return []; // any number of accessories
    case "DRESS":
      return ["DRESS", "TOP", "BOTTOM"]; // a dress replaces top + bottom
    case "TOP":
    case "BOTTOM":
      return [category, "DRESS"];
    default:
      return [category]; // one item per row
  }
}

// All the outfit builder's selection rules in one place, so the page just calls toggle().
// `initial` preselects items (editing an existing outfit). It's only read on first render.
export function useOutfitSelection(initial: ClothingItem[] = []) {
  const [selected, setSelected] = useState<ClothingItem[]>(initial);

  const isSelected = (id: number) => selected.some((item) => item.id === id);

  const toggle = (item: ClothingItem) => {
    setSelected((prev) => {
      // Clicking a selected item deselects it.
      if (prev.some((i) => i.id === item.id)) return prev.filter((i) => i.id !== item.id);
      const removed = conflictsWith(item.category);
      return [...prev.filter((i) => !removed.includes(i.category)), item];
    });
  };

  const hasSelectionIn = (category: Category) => selected.some((item) => item.category === category);

  // Selected items sorted in builder order, for the preview column.
  const ordered = [...selected].sort((a, b) => categoryRank(a.category) - categoryRank(b.category));

  return {
    selected: ordered,
    selectedIds: selected.map((item) => item.id),
    isSelected,
    hasSelectionIn,
    toggle,
    replaceAll: setSelected, // used by Surprise Me
    clear: () => setSelected([]),
  };
}
