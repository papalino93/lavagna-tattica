"use client";

import { useTransition } from "react";
import { deleteMatch } from "@/lib/actions/matches";

export function DeleteMatchButton({ matchId }: { matchId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm("Eliminare questa partita, convocati e formazione inclusi?")) {
          startTransition(() => {
            deleteMatch(matchId);
          });
        }
      }}
      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
    >
      {pending ? "Eliminazione…" : "Elimina partita"}
    </button>
  );
}
