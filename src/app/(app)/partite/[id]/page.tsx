import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MatchForm } from "@/components/matches/match-form";
import { DeleteMatchButton } from "@/components/matches/delete-match-button";
import { MatchdayButton } from "@/components/matches/matchday-view";
import { updateMatch } from "@/lib/actions/matches";
import type { FormationModule } from "@/lib/types/domain";

export default async function PartitaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: match }, { count: calledUpCount }, { data: formation }] = await Promise.all([
    supabase.from("matches").select("*").eq("id", id).single(),
    supabase
      .from("match_call_ups")
      .select("player_id", { count: "exact", head: true })
      .eq("match_id", id)
      .eq("called_up", true),
    supabase.from("formations").select("id, module").eq("match_id", id).maybeSingle(),
  ]);

  if (!match) {
    notFound();
  }

  const action = updateMatch.bind(null, id);

  const starters: Record<string, string> = {};
  const bench: { id: string; name: string; jersey_number: number | null }[] = [];
  const playersById: Record<string, { id: string; name: string; jersey_number: number | null }> = {};

  if (formation) {
    const { data: slots } = await supabase
      .from("formation_slots")
      .select("player_id, slot_code, is_starter, players(id, name, jersey_number)")
      .eq("formation_id", formation.id);

    for (const s of slots ?? []) {
      const p = s.players as unknown as { id: string; name: string; jersey_number: number | null } | null;
      if (!p) continue;
      playersById[p.id] = p;
      if (s.is_starter && s.slot_code) {
        starters[s.slot_code] = p.id;
      } else if (!s.is_starter) {
        bench.push(p);
      }
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href="/partite" className="text-sm text-zinc-500 hover:text-zinc-700">
        ← Partite
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">vs {match.opponent}</h1>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          href={`/partite/${id}/convocati`}
          className="rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-[var(--brand-border)] hover:bg-[var(--brand-soft)]"
        >
          <p className="font-medium text-zinc-900">Convocati</p>
          <p className="mt-0.5 text-sm text-zinc-500">{calledUpCount ?? 0} selezionati</p>
        </Link>
        <Link
          href={`/partite/${id}/formazione`}
          className="rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-[var(--brand-border)] hover:bg-[var(--brand-soft)]"
        >
          <p className="font-medium text-zinc-900">Formazione</p>
          <p className="mt-0.5 text-sm text-zinc-500">{formation?.module ?? "Da impostare"}</p>
        </Link>
      </div>

      <div className="mt-4">
        <MatchdayButton
          matchId={id}
          opponent={match.opponent}
          module={(formation?.module as FormationModule) ?? null}
          starters={starters}
          bench={bench}
          playersById={playersById}
          initialNotes={match.notes}
        />
      </div>

      <div className="mt-8 border-t border-zinc-200 pt-6">
        <MatchForm
          action={action}
          submitLabel="Salva modifiche"
          defaultValues={{
            date: match.date,
            opponent: match.opponent,
            notes: match.notes,
            result: match.result,
          }}
        />
      </div>

      <div className="mt-6 border-t border-zinc-200 pt-6">
        <DeleteMatchButton matchId={id} />
      </div>
    </div>
  );
}
