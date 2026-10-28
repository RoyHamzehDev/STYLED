// Grey placeholder with the same shape as ItemCard, shown while items load.
export function ItemCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-card border border-border bg-background shadow-md" aria-hidden="true">
      <div className="aspect-square bg-surface-strong" />
      <div className="space-y-2.5 border-t border-border p-3 md:p-4">
        <div className="h-4 w-3/4 rounded-full bg-surface-strong" />
        <div className="h-3 w-1/3 rounded-full bg-surface-strong" />
      </div>
    </div>
  );
}
