"use client";

import { useOptimistic, useTransition } from "react";
import { toggleFavorite, type FavoriteKind } from "@/lib/actions/favorites";

export function FavoriteButton({
  kind,
  id,
  initialFavorite,
}: {
  kind: FavoriteKind;
  id: string;
  initialFavorite: boolean;
}) {
  const [, startTransition] = useTransition();
  const [isFavorite, setOptimisticFavorite] = useOptimistic(initialFavorite);

  return (
    <button
      type="button"
      aria-label={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
      aria-pressed={isFavorite}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(async () => {
          setOptimisticFavorite(!isFavorite);
          await toggleFavorite(kind, id, isFavorite);
        });
      }}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg transition-colors hover:bg-[var(--surface-sunken)]"
    >
      <span className={isFavorite ? "text-amber-500" : "text-[var(--ink-faint)]"}>★</span>
    </button>
  );
}
