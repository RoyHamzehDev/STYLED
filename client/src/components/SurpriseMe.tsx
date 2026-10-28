import { useState } from "react";
import { CircleAlert, Dices, LoaderCircle, Shuffle } from "lucide-react";
import { SEASONS } from "@styled/shared";
import { ApiError } from "../api/client";
import type { ClothingItem, Season } from "../api/types";
import { useSurprise } from "../hooks/useOutfits";
import { BUTTON_DARK } from "../utils/buttons";
import { formatEnum } from "../utils/format";
import { SelectMenu } from "./SelectMenu";

// Season picker + "Surprise Me" button. Hands the random items to the parent.
export function SurpriseMe({ onSurprise }: { onSurprise: (items: ClothingItem[]) => void }) {
  const [season, setSeason] = useState<Season | "">("");
  const surpriseMutation = useSurprise();

  const handleClick = () => {
    surpriseMutation.mutate({ season: season || undefined }, { onSuccess: onSurprise });
  };

  return (
    <div className="rounded-card border border-accent/40 bg-accent-soft p-4 sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-background text-accent-strong shadow-sm">
            <Dices className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-ink">Need inspiration?</p>
            <p className="text-sm text-ink-muted">Get a random outfit from your wardrobe.</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <SelectMenu
            label="Season for Surprise Me"
            value={season}
            onChange={(value) => setSeason(value as Season | "")}
            className="sm:min-w-36"
          >
            <option value="">Any season</option>
            {SEASONS.map((s) => (
              <option key={s} value={s}>
                {formatEnum(s)}
              </option>
            ))}
          </SelectMenu>
          {/* Dark button so it stands out on the tan panel (MASTER "Dark" variant). */}
          <button
            type="button"
            onClick={handleClick}
            disabled={surpriseMutation.isPending}
            className={`${BUTTON_DARK} whitespace-nowrap`}
          >
            {surpriseMutation.isPending ? (
              <LoaderCircle className="size-4 animate-spin" strokeWidth={2} aria-hidden="true" />
            ) : (
              <Shuffle className="size-4" strokeWidth={1.75} aria-hidden="true" />
            )}
            {surpriseMutation.isPending ? "Picking..." : "Surprise Me"}
          </button>
        </div>
      </div>

      {surpriseMutation.error && (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-control bg-background px-3 py-2.5 text-sm text-ink">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-danger" strokeWidth={1.75} aria-hidden="true" />
          {getSurpriseErrorMessage(surpriseMutation.error, season)}
        </p>
      )}
    </div>
  );
}

// The server returns 400 when there's no top or no bottom (for that season, if one was picked).
function getSurpriseErrorMessage(error: Error, season: Season | ""): string {
  if (error instanceof ApiError && error.status === 400) {
    return season
      ? `You need at least one top and one bottom for ${formatEnum(season)}. Try another season, or tag more items with it.`
      : "You need at least one top and one bottom in your wardrobe to use Surprise Me.";
  }
  return error.message;
}
