"use client";

import { useTransition } from "react";
import { deleteEvaluation } from "@/lib/actions/evaluations";
import { useConfirm } from "@/components/ui/confirm-provider";

export function DeleteEvaluationButton({
  playerId,
  evaluationId,
}: {
  playerId: string;
  evaluationId: string;
}) {
  const [pending, startTransition] = useTransition();
  const confirm = useConfirm();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        const ok = await confirm({ title: "Eliminare questa valutazione?", confirmLabel: "Elimina" });
        if (ok) {
          startTransition(() => {
            deleteEvaluation(playerId, evaluationId);
          });
        }
      }}
      className="text-xs font-medium text-zinc-400 hover:text-red-600 disabled:opacity-60"
    >
      Elimina
    </button>
  );
}
