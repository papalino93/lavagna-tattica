"use client";

import { useTransition } from "react";
import { removeSessionBlock } from "@/lib/actions/session-blocks";

export function RemoveBlockButton({
  blockId,
  trainingSessionId,
}: {
  blockId: string;
  trainingSessionId: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => removeSessionBlock(blockId, trainingSessionId))}
      className="text-xs font-medium text-[var(--ink-faint)] hover:text-red-600 disabled:opacity-60"
    >
      Rimuovi
    </button>
  );
}
