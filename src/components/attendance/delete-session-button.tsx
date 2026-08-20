"use client";

import { useTransition } from "react";
import { deleteTrainingSession } from "@/lib/actions/training-sessions";

export function DeleteSessionButton({ sessionId }: { sessionId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm("Eliminare questo allenamento e le relative presenze?")) {
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
