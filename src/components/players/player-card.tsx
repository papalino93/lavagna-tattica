import Link from "next/link";
import { PLAYER_STATUS_LABELS, type PlayerStatus } from "@/lib/types/domain";

interface PlayerCardProps {
  id: string;
  name: string;
  role: string;
  jerseyNumber: number | null;
  status: PlayerStatus;
  photoUrl: string | null;
}

const STATUS_STRIPE: Record<PlayerStatus, string> = {
  attivo: "var(--brand)",
  infortunato: "var(--danger)",
  squalificato: "var(--warn)",
  altro: "#a1a1aa",
};

export function PlayerCard({ id, name, role, jerseyNumber, status, photoUrl }: PlayerCardProps) {
  return (
    <Link
      href={`/rosa/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] transition-shadow hover:shadow-md"
    >
      <span
        className="absolute inset-y-0 right-0 z-10 w-1"
        style={{ background: STATUS_STRIPE[status] }}
        aria-hidden="true"
      />
      <div
        className="relative aspect-[3/4] w-full overflow-hidden"
        style={{
          background: photoUrl
            ? undefined
            : "linear-gradient(160deg, var(--brand), color-mix(in srgb, var(--brand) 60%, black))",
        }}
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <PlayerSilhouette />
        )}
        <span className="absolute top-2 left-2 rounded-md bg-black/35 px-1.5 py-0.5 font-display text-lg font-bold text-white backdrop-blur-sm tabular-nums">
          {jerseyNumber ?? "–"}
        </span>
        {status !== "attivo" && (
          <span
            className="absolute top-2 right-2 rounded-full bg-black/35 px-1.5 py-0.5 text-[10px] font-semibold backdrop-blur-sm"
            style={{ color: STATUS_STRIPE[status] }}
          >
            {PLAYER_STATUS_LABELS[status]}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <p className="truncate text-sm font-semibold text-[var(--ink)]">{name}</p>
        <p className="truncate text-xs text-[var(--ink-dim)] uppercase tracking-wide">{role}</p>
      </div>
    </Link>
  );
}

function PlayerSilhouette() {
  return (
    <svg
      viewBox="0 0 100 120"
      className="absolute bottom-0 left-1/2 h-[70%] -translate-x-1/2 opacity-40"
      fill="white"
      aria-hidden="true"
    >
      <circle cx="50" cy="32" r="22" />
      <path d="M8 118c2-36 20-54 42-54s40 18 42 54z" />
    </svg>
  );
}
