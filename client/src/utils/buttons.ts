// Button looks from MASTER.md, shared so every page's buttons match.
// Plain class strings (not a component) so they work on <button> and <Link> alike.
const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-5 py-2.5 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

export const BUTTON_PRIMARY = `${BASE} bg-accent text-on-accent shadow-sm hover:bg-accent-hover disabled:hover:bg-accent`;

export const BUTTON_DARK = `${BASE} bg-ink text-white shadow-sm hover:bg-ink/85 disabled:hover:bg-ink`;

export const BUTTON_DANGER = `${BASE} bg-danger text-white shadow-sm hover:bg-danger-hover disabled:hover:bg-danger`;

export const BUTTON_SECONDARY = `${BASE} border border-border bg-background text-ink hover:border-border-strong hover:bg-surface disabled:hover:bg-background`;
