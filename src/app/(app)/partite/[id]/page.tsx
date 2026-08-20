import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MatchForm } from "@/components/matches/match-form";
import { DeleteMatchButton } from "@/components/matches/delete-match-button";
import { updateMatch } from "@/lib/actions/matches";

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
    supabase.from("formations").select("module").eq("match_id", id).maybeSingle(),
  ]);

  if (!match) {
    notFound();
  }

  const action = updateMatch.bind(null, id);

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
