"use client";

import { useTransition } from "react";
import { deleteMatch } from "@/lib/actions/matches";
import { useConfirm } from "@/components/ui/confirm-provider";

export function DeleteMatchButton({ matchId }: { matchId: string }) {
  const [pending, startTransition] = useTransition();
  const confirm = useConfirm();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        const ok = await confirm({
          title: "Eliminare questa partita?",
          description: "Convocati e formazione andranno persi. L'azione non è reversibile.",
          confirmLabel: "Elimina",
        });
        if (ok) {
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
