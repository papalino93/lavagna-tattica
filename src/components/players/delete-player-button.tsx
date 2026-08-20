"use client";

import { useTransition } from "react";
import { deletePlayer } from "@/lib/actions/players";

export function DeletePlayerButton({ playerId, playerName }: { playerId: string; playerName: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`Eliminare ${playerName} dalla rosa? L'azione non è reversibile.`)) {
          startTransition(() => {
            deletePlayer(playerId);
          });
        }
      }}
      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
    >
      {pending ? "Eliminazione…" : "Elimina giocatore"}
    </button>
  );
}
