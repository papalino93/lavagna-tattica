/** Placeholder pulsante mentre i dati arrivano — mai schermo bianco. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[var(--radius-m)] bg-[var(--surface-sunken)] ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--line)]">
      <Skeleton className="aspect-[3/4] rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] p-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}
