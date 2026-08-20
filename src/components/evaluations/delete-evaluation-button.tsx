"use client";

import { useTransition } from "react";
import { deleteEvaluation } from "@/lib/actions/evaluations";

export function DeleteEvaluationButton({
  playerId,
  evaluationId,
}: {
  playerId: string;
  evaluationId: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm("Eliminare questa valutazione?")) {
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
