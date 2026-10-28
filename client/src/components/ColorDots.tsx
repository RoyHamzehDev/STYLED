import type { Color } from "../api/types";
import { COLOR_SWATCHES } from "../utils/colors";
import { formatEnum } from "../utils/format";

export function ColorDots({ colors }: { colors: Color[] }) {
  return (
    <ul className="flex flex-wrap gap-1" aria-label={`Colors: ${colors.map(formatEnum).join(", ")}`}>
      {colors.map((color) => (
        <li
          key={color}
          title={formatEnum(color)}
          // `background` (not backgroundColor) so MULTICOLOR's gradient works too.
          style={{ background: COLOR_SWATCHES[color] }}
          className="size-3.5 rounded-full ring-1 ring-border-strong"
        />
      ))}
    </ul>
  );
}
