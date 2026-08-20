"use client";

import { useTransition } from "react";
import { deleteExercise } from "@/lib/actions/exercises";

export function DeleteExerciseButton({ exerciseId }: { exerciseId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm("Eliminare questo esercizio?")) {
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
