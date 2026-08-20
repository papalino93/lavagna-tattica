"use client";

import { useTransition } from "react";
import { deletePlayer } from "@/lib/actions/players";
import { useConfirm } from "@/components/ui/confirm-provider";

export function DeletePlayerButton({ playerId, playerName }: { playerId: string; playerName: string }) {
  const [pending, startTransition] = useTransition();
  const confirm = useConfirm();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        const ok = await confirm({
          title: `Eliminare ${playerName}?`,
          description: "Verrà rimosso dalla rosa. L'azione non è reversibile.",
          confirmLabel: "Elimina",
        });
        if (ok) {
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
