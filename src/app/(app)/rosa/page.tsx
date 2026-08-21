import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { PlayerCard } from "@/components/players/player-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PLAYER_STATUS_LABELS, PLAYER_STATUS_TONE, type PlayerStatus } from "@/lib/types/domain";

export default async function RosaPage({
  searchParams,
}: {
  searchParams: Promise<{ vista?: string }>;
}) {
  const { vista } = await searchParams;
  const view = vista === "lista" ? "lista" : "griglia";

  const supabase = await createClient();
  const { data: players, error } = await supabase
    .from("players")
    .select("id, name, role, jersey_number, status, photo_url")
    .order("jersey_number", { ascending: true, nullsFirst: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--ink)]">Rosa</h1>
        <Link
          href="/rosa/nuovo"
          className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-[var(--brand-fg)] hover:bg-[var(--brand-hover)]"
        >
          + Giocatore
        </Link>
      </div>

      <div className="mt-4 flex gap-1 rounded-lg bg-[var(--surface-sunken)] p-1 sm:w-fit">
        <Link
          href="/rosa?vista=griglia"
          className={`flex-1 rounded-md px-4 py-1.5 text-center text-sm font-medium transition-colors sm:flex-none ${
            view === "griglia" ? "bg-[var(--surface-raised)] text-[var(--ink)] shadow-sm" : "text-[var(--ink-dim)]"
          }`}
        >
          Griglia
        </Link>
        <Link
          href="/rosa?vista=lista"
          className={`flex-1 rounded-md px-4 py-1.5 text-center text-sm font-medium transition-colors sm:flex-none ${
            view === "lista" ? "bg-[var(--surface-raised)] text-[var(--ink)] shadow-sm" : "text-[var(--ink-dim)]"
          }`}
        >
          Lista
        </Link>
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-600">
          Non è stato possibile caricare la rosa. Riprova.
        </p>
      )}

      {!error && players?.length === 0 && (
        <EmptyState
          title="Rosa vuota"
          description="Aggiungi il primo giocatore per iniziare a costruire la squadra."
          actionHref="/rosa/nuovo"
          actionLabel="+ Giocatore"
        />
      )}

      {view === "griglia" ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {players?.map((player) => (
            <PlayerCard
              key={player.id}
              id={player.id}
              name={player.name}
              role={player.role}
              jerseyNumber={player.jersey_number}
              status={player.status as PlayerStatus}
              photoUrl={player.photo_url}
            />
          ))}
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {players?.map((player) => (
            <li key={player.id}>
              <Link
                href={`/rosa/${player.id}`}
                className="flex items-center gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 transition-colors hover:border-[var(--brand-border)] hover:bg-[var(--brand-soft)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--surface-sunken)] text-sm font-semibold text-[var(--ink-dim)]">
                  {player.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={player.photo_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    (player.jersey_number ?? "–")
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[var(--ink)]">{player.name}</p>
                  <p className="text-sm text-[var(--ink-dim)]">{player.role}</p>
                </div>
                <Badge tone={PLAYER_STATUS_TONE[player.status as PlayerStatus]}>
                  {PLAYER_STATUS_LABELS[player.status as PlayerStatus]}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
