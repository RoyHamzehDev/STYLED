import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { CATEGORIES, COLORS, SEASONS, type ItemFilters } from "@styled/shared";
import type { FilterKey } from "../hooks/useItemFilters";
import { formatEnum } from "../utils/format";
import { SelectMenu } from "./SelectMenu";

const SEARCH_DEBOUNCE_MS = 300;

type WardrobeFiltersProps = {
  filters: ItemFilters;
  hasFilters: boolean;
  onChange: (key: FilterKey, value: string) => void;
  onClear: () => void;
};

export function WardrobeFilters({ filters, hasFilters, onChange, onClear }: WardrobeFiltersProps) {
  // The input updates instantly while typing; the URL (and so the API request)
  // only updates once the user stops typing for 300ms.
  const [search, setSearch] = useState(filters.search ?? "");
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // If the URL's search changes from outside this input (e.g. the "Clear filters"
  // button in the empty state), copy it into the input. This is React's
  // "adjust state when a prop changes" pattern: setState during render, no effect needed.
  const [lastUrlSearch, setLastUrlSearch] = useState(filters.search);
  if (filters.search !== lastUrlSearch) {
    setLastUrlSearch(filters.search);
    if ((filters.search ?? "") !== search.trim()) setSearch(filters.search ?? "");
  }

  // Cancel a pending search update if the page unmounts.
  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    clearTimeout(debounceTimer.current); // each keystroke restarts the countdown
    debounceTimer.current = setTimeout(() => onChange("search", value.trim()), SEARCH_DEBOUNCE_MS);
  };

  const handleClear = () => {
    clearTimeout(debounceTimer.current);
    setSearch("");
    onClear();
  };

  return (
    <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-center">
      <div className="relative md:flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-muted"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by name..."
          maxLength={60}
          aria-label="Search items by name"
          // The border + ring is the focus indicator, so the global focus outline is turned off.
          className="min-h-11 w-full rounded-control border border-border bg-background pr-4 pl-10 text-base text-ink shadow-sm outline-none transition-colors duration-200 placeholder:text-ink-muted hover:border-border-strong focus:border-accent-strong focus:ring-3 focus:ring-accent/30 md:text-sm"
        />
      </div>
      {/* Phones: Category on its own row, Color + Season side by side (three in a row would truncate the labels). */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
        <FilterSelect label="Category" allLabel="All categories" value={filters.category} options={CATEGORIES} onChange={(v) => onChange("category", v)} className="col-span-2" />
        <FilterSelect label="Color" allLabel="All colors" value={filters.color} options={COLORS} onChange={(v) => onChange("color", v)} />
        <FilterSelect label="Season" allLabel="All seasons" value={filters.season} options={SEASONS} onChange={(v) => onChange("season", v)} />
        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="col-span-2 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-control px-3 text-sm font-medium text-accent-strong transition-colors duration-200 hover:bg-accent-soft"
          >
            <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

type FilterSelectProps = {
  label: string;
  allLabel: string;
  value: string | undefined;
  options: readonly string[];
  onChange: (value: string) => void;
  className?: string;
};

function FilterSelect({ label, allLabel, value, options, onChange, className = "" }: FilterSelectProps) {
  return (
    // A chosen filter is highlighted so the user can see at a glance which filters are on.
    <SelectMenu label={label} value={value ?? ""} onChange={onChange} highlighted={!!value} className={`sm:min-w-40 ${className}`}>
      {/* The empty option means "no filter". */}
      <option value="">{allLabel}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {formatEnum(option)}
        </option>
      ))}
    </SelectMenu>
  );
}
