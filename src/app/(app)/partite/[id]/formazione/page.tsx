import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormationEditor } from "@/components/matches/formation-editor";
import type { FormationModule } from "@/lib/types/domain";

export default async function FormazionePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: match }, { data: callUps }, { data: formation }] = await Promise.all([
    supabase.from("matches").select("id, opponent").eq("id", id).single(),
    supabase
      .from("match_call_ups")
      .select("player_id, players(id, name, jersey_number)")
      .eq("match_id", id)
      .eq("called_up", true),
    supabase.from("formations").select("id, module").eq("match_id", id).maybeSingle(),
  ]);

  if (!match) {
    notFound();
  }

  const calledUpPlayers = (callUps ?? [])
    .map((c) => c.players)
    .filter((p): p is { id: string; name: string; jersey_number: number | null } => !!p)
    .sort((a, b) => (a.jersey_number ?? 99) - (b.jersey_number ?? 99));

  let initialAssignments: Record<string, string> = {};
  if (formation) {
    const { data: slots } = await supabase
      .from("formation_slots")
      .select("player_id, slot_code, is_starter")
      .eq("formation_id", formation.id)
      .eq("is_starter", true);

    initialAssignments = Object.fromEntries(
      (slots ?? [])
        .filter((s) => s.slot_code)
        .map((s) => [s.slot_code as string, s.player_id]),
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href={`/partite/${id}`} className="text-sm text-zinc-500 hover:text-zinc-700">
        ← vs {match.opponent}
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">Formazione</h1>

      {calledUpPlayers.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500">
          Seleziona prima i{" "}
          <Link href={`/partite/${id}/convocati`} className="text-[var(--brand)] underline">
            convocati
          </Link>
          .
        </p>
      ) : (
        <div className="mt-6">
          <FormationEditor
            matchId={id}
            calledUpPlayers={calledUpPlayers}
            initialModule={(formation?.module as FormationModule) ?? null}
            initialAssignments={initialAssignments}
          />
        </div>
      )}
    </div>
  );
}
