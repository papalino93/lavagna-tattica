import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CallUpRow } from "@/components/matches/call-up-row";

export default async function ConvocatiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: match }, { data: players }, { data: callUps }] = await Promise.all([
    supabase.from("matches").select("id, opponent").eq("id", id).single(),
    supabase
      .from("players")
      .select("id, name, role, jersey_number")
      .neq("status", "altro")
      .order("jersey_number", { ascending: true, nullsFirst: false }),
    supabase.from("match_call_ups").select("player_id, called_up").eq("match_id", id),
  ]);

  if (!match) {
    notFound();
  }

  const calledUpSet = new Set(callUps?.filter((c) => c.called_up).map((c) => c.player_id));
  const totalCalledUp = calledUpSet.size;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href={`/partite/${id}`} className="text-sm text-[var(--ink-dim)] hover:text-[var(--ink)]">
        ← vs {match.opponent}
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--ink)]">Convocati</h1>
        <span className="text-sm text-[var(--ink-dim)]">{totalCalledUp} selezionati</span>
      </div>

      {!players || players.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--ink-dim)]">
          Aggiungi giocatori alla rosa per poterli convocare.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {players.map((player) => (
            <CallUpRow
              key={player.id}
              matchId={id}
              playerId={player.id}
              playerName={player.name}
              playerRole={player.role}
              jerseyNumber={player.jersey_number}
              initialCalledUp={calledUpSet.has(player.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
