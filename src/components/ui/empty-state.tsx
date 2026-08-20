import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({ title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center">
      <PitchIcon />
      <p className="font-display text-lg font-bold text-zinc-800">{title}</p>
      {description && <p className="max-w-xs text-sm text-zinc-500">{description}</p>}
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-2 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-[var(--brand-fg)] hover:bg-[var(--brand-hover)]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

function PitchIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12 text-zinc-300" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="56" height="56" rx="6" stroke="currentColor" strokeWidth="2.5" />
      <line x1="4" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="9" stroke="currentColor" strokeWidth="2.5" />
      <rect x="20" y="4" width="24" height="10" stroke="currentColor" strokeWidth="2.5" />
      <rect x="20" y="50" width="24" height="10" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}
