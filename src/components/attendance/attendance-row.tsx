"use client";

import { useOptimistic, useTransition } from "react";
import { setAttendance } from "@/lib/actions/attendance";
import { ATTENDANCE_STATUSES, type AttendanceStatus } from "@/lib/types/domain";

const BUTTON_LABEL: Record<AttendanceStatus, string> = {
  presente: "P",
  assente: "A",
  giustificato: "G",
  ritardo: "R",
};

const ACTIVE_CLASSES: Record<AttendanceStatus, string> = {
  presente: "bg-[var(--brand)] text-white border-[var(--brand)]",
  assente: "bg-red-600 text-white border-red-600",
  giustificato: "bg-amber-500 text-white border-amber-500",
  ritardo: "bg-sky-500 text-white border-sky-500",
};

interface AttendanceRowProps {
  sessionId: string;
  playerId: string;
  playerName: string;
  playerRole: string;
  jerseyNumber: number | null;
  initialStatus: AttendanceStatus | null;
}

export function AttendanceRow({
  sessionId,
  playerId,
  playerName,
  playerRole,
  jerseyNumber,
  initialStatus,
}: AttendanceRowProps) {
  const [, startTransition] = useTransition();
  const [status, setOptimisticStatus] = useOptimistic<AttendanceStatus | null>(initialStatus);

  function handleClick(next: AttendanceStatus) {
    startTransition(async () => {
      setOptimisticStatus(next);
      await setAttendance(sessionId, playerId, next);
    });
  }

  return (
    <li className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-sunken)] text-xs font-semibold text-[var(--ink-dim)]">
        {jerseyNumber ?? "–"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium text-[var(--ink)]">{playerName}</p>
        <p className="truncate text-xs text-[var(--ink-dim)]">{playerRole}</p>
      </div>
      <div className="flex gap-1">
        {ATTENDANCE_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleClick(s)}
            aria-pressed={status === s}
            aria-label={s}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
              status === s
                ? ACTIVE_CLASSES[s]
                : "border-[var(--line-strong)] bg-[var(--surface-raised)] text-[var(--ink-dim)] hover:bg-[var(--surface)]"
            }`}
          >
            {BUTTON_LABEL[s]}
          </button>
        ))}
      </div>
    </li>
  );
}
