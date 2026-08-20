import { ATTENDANCE_STATUSES, ATTENDANCE_LABELS, type AttendanceStatus } from "@/lib/types/domain";

const DOT_COLOR: Record<AttendanceStatus, string> = {
  presente: "var(--brand)",
  assente: "#dc2626",
  giustificato: "#f59e0b",
  ritardo: "#0ea5e9",
};

const LETTER: Record<AttendanceStatus, string> = {
  presente: "P",
  assente: "A",
  giustificato: "G",
  ritardo: "R",
};

export function AttendanceLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
      {ATTENDANCE_STATUSES.map((s) => (
        <span key={s} className="flex items-center gap-1.5">
          <span
            className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
            style={{ background: DOT_COLOR[s] }}
          >
            {LETTER[s]}
          </span>
          {ATTENDANCE_LABELS[s]}
        </span>
      ))}
    </div>
  );
}
