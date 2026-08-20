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
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg transition-colors hover:bg-zinc-100"
    >
      <span className={isFavorite ? "text-amber-500" : "text-zinc-300"}>★</span>
    </button>
  );
}
