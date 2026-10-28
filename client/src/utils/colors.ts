import type { Color } from "../api/types";

// CSS background for each color enum value, used for the color dots.
// Typed as Record<Color, string> so TypeScript errors if a color is missing.
export const COLOR_SWATCHES: Record<Color, string> = {
  RED: "#dc2626",
  BLUE: "#2563eb",
  GREEN: "#16a34a",
  YELLOW: "#facc15",
  ORANGE: "#f97316",
  PURPLE: "#9333ea",
  PINK: "#ec4899",
  BROWN: "#8b5a2b",
  BLACK: "#1c1917",
  WHITE: "#ffffff",
  GRAY: "#9ca3af",
  NUDE: "#e8c4a8",
  MULTICOLOR: "conic-gradient(#dc2626, #facc15, #16a34a, #2563eb, #9333ea, #dc2626)",
};
