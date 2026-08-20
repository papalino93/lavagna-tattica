"use client";

import { useOptimistic, useTransition } from "react";
import { setCallUp } from "@/lib/actions/call-ups";

interface CallUpRowProps {
  matchId: string;
  playerId: string;
  playerName: string;
  playerRole: string;
  jerseyNumber: number | null;
  initialCalledUp: boolean;
}

export function CallUpRow({
  matchId,
  playerId,
  playerName,
  playerRole,
  jerseyNumber,
  initialCalledUp,
}: CallUpRowProps) {
  const [, startTransition] = useTransition();
  const [calledUp, setOptimisticCalledUp] = useOptimistic(initialCalledUp);

  function toggle() {
    const next = !calledUp;
    startTransition(async () => {
      setOptimisticCalledUp(next);
      await setCallUp(matchId, playerId, next);
    });
  }

  return (
    <li>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={calledUp}
        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
          calledUp
            ? "border-emerald-300 bg-emerald-50/60"
            : "border-zinc-200 bg-white hover:bg-zinc-50"
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500">
          {jerseyNumber ?? "–"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-zinc-900">{playerName}</p>
          <p className="truncate text-xs text-zinc-500">{playerRole}</p>
        </div>
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
            calledUp ? "border-emerald-600 bg-emerald-600 text-white" : "border-zinc-300"
          }`}
        >
          {calledUp && (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={3} stroke="currentColor" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
        </div>
      </button>
    </li>
  );
}
