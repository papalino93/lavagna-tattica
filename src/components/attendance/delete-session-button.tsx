"use client";

import { useTransition } from "react";
import { deleteTrainingSession } from "@/lib/actions/training-sessions";
import { useConfirm } from "@/components/ui/confirm-provider";

export function DeleteSessionButton({ sessionId }: { sessionId: string }) {
  const [pending, startTransition] = useTransition();
  const confirm = useConfirm();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        const ok = await confirm({
          title: "Eliminare l'allenamento?",
          description: "Le presenze registrate andranno perse. L'azione non è reversibile.",
          confirmLabel: "Elimina",
        });
        if (ok) {
          startTransition(() => {
            deleteTrainingSession(sessionId);
          });
        }
      }}
      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
    >
      {pending ? "Eliminazione…" : "Elimina allenamento"}
    </button>
  );
}
