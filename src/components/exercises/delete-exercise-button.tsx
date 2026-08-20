"use client";

import { useTransition } from "react";
import { deleteExercise } from "@/lib/actions/exercises";
import { useConfirm } from "@/components/ui/confirm-provider";

export function DeleteExerciseButton({ exerciseId }: { exerciseId: string }) {
  const [pending, startTransition] = useTransition();
  const confirm = useConfirm();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        const ok = await confirm({ title: "Eliminare questo esercizio?", confirmLabel: "Elimina" });
        if (ok) {
          startTransition(() => {
            deleteExercise(exerciseId);
          });
        }
      }}
      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
    >
      {pending ? "Eliminazione…" : "Elimina esercizio"}
    </button>
  );
}
