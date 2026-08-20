import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { PLAYER_STATUS_LABELS, PLAYER_STATUS_TONE, type PlayerStatus } from "@/lib/types/domain";

export default async function RosaPage() {
  const supabase = await createClient();
  const { data: players, error } = await supabase
    .from("players")
    .select("id, name, role, jersey_number, status, photo_url")
    .order("jersey_number", { ascending: true, nullsFirst: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Rosa</h1>
        <Link
          href="/rosa/nuovo"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          + Giocatore
        </Link>
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-600">
          Non è stato possibile caricare la rosa. Riprova.
        </p>
      )}

      {!error && players?.length === 0 && (
        <p className="mt-6 text-sm text-zinc-500">
          Nessun giocatore in rosa. Aggiungi il primo con &quot;+ Giocatore&quot;.
        </p>
      )}

      <ul className="mt-6 flex flex-col gap-2">
        {players?.map((player) => (
          <li key={player.id}>
            <Link
              href={`/rosa/${player.id}`}
              className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100 text-sm font-semibold text-zinc-500">
                {player.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={player.photo_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  (player.jersey_number ?? "–")
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-zinc-900">{player.name}</p>
                <p className="text-sm text-zinc-500">{player.role}</p>
              </div>
              <Badge tone={PLAYER_STATUS_TONE[player.status as PlayerStatus]}>
                {PLAYER_STATUS_LABELS[player.status as PlayerStatus]}
              </Badge>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
