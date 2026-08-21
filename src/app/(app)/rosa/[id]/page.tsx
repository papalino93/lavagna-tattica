import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PlayerForm } from "@/components/players/player-form";
import { DeletePlayerButton } from "@/components/players/delete-player-button";
import { EvaluationForm } from "@/components/evaluations/evaluation-form";
import { DeleteEvaluationButton } from "@/components/evaluations/delete-evaluation-button";
import { updatePlayer } from "@/lib/actions/players";
import { ATTENDANCE_LABELS, type AttendanceStatus } from "@/lib/types/domain";

export default async function GiocatorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: player }, { data: evaluations }, { data: attendances }] = await Promise.all([
    supabase.from("players").select("*").eq("id", id).single(),
    supabase
      .from("evaluations")
      .select("*")
      .eq("player_id", id)
      .order("date", { ascending: false }),
    supabase.from("attendances").select("status").eq("player_id", id),
  ]);

  if (!player) {
    notFound();
  }

  const action = updatePlayer.bind(null, id);

  const attendanceCounts = (attendances ?? []).reduce<Record<AttendanceStatus, number>>(
    (acc, a) => {
      const status = a.status as AttendanceStatus;
      acc[status] = (acc[status] ?? 0) + 1;
      return acc;
    },
    { presente: 0, assente: 0, giustificato: 0, ritardo: 0 },
  );
  const totalTrainings = attendances?.length ?? 0;

  const averageEvaluation =
    evaluations && evaluations.length > 0
      ? evaluations.reduce(
          (sum, e) => sum + (e.tecnica + e.tattica + e.fisica + e.mentale) / 4,
          0,
        ) / evaluations.length
      : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href="/rosa" className="text-sm text-[var(--ink-dim)] hover:text-[var(--ink)]">
        ← Rosa
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-[var(--ink)]">{player.name}</h1>

      <div className="mt-6">
        <PlayerForm
          action={action}
          submitLabel="Salva modifiche"
          defaultValues={{
            name: player.name,
            role: player.role,
            jerseyNumber: player.jersey_number,
            status: player.status,
            notes: player.notes,
            photoUrl: player.photo_url,
          }}
        />
      </div>

      <div className="mt-6 border-t border-[var(--line)] pt-6">
        <DeletePlayerButton playerId={player.id} playerName={player.name} />
      </div>

      <div className="mt-10 border-t border-[var(--line)] pt-8">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Performance</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Allenamenti" value={totalTrainings} />
          <StatTile label={ATTENDANCE_LABELS.presente} value={attendanceCounts.presente} />
          <StatTile label={ATTENDANCE_LABELS.assente} value={attendanceCounts.assente} />
          <StatTile
            label="Valutazione media"
            value={averageEvaluation ? averageEvaluation.toFixed(1) : "—"}
          />
        </div>
      </div>

      <div className="mt-10 border-t border-[var(--line)] pt-8">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Valutazioni</h2>

        <div className="mt-4">
          <EvaluationForm playerId={id} />
        </div>

        {evaluations && evaluations.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="text-[var(--ink-dim)]">
                  <th className="pb-2 pr-3 font-medium">Data</th>
                  <th className="pb-2 pr-3 font-medium">Tec</th>
                  <th className="pb-2 pr-3 font-medium">Tat</th>
                  <th className="pb-2 pr-3 font-medium">Fis</th>
                  <th className="pb-2 pr-3 font-medium">Men</th>
                  <th className="pb-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((evaluation) => (
                  <tr key={evaluation.id} className="border-t border-[var(--line)]">
                    <td className="py-2 pr-3 text-[var(--ink)]">
                      {new Date(evaluation.date).toLocaleDateString("it-IT")}
                    </td>
                    <td className="py-2 pr-3 text-[var(--ink)]">{evaluation.tecnica}</td>
                    <td className="py-2 pr-3 text-[var(--ink)]">{evaluation.tattica}</td>
                    <td className="py-2 pr-3 text-[var(--ink)]">{evaluation.fisica}</td>
                    <td className="py-2 pr-3 text-[var(--ink)]">{evaluation.mentale}</td>
                    <td className="py-2 text-right">
                      <DeleteEvaluationButton playerId={id} evaluationId={evaluation.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--ink-dim)]">Nessuna valutazione ancora.</p>
        )}
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] p-3 text-center">
      <p className="text-xl font-semibold text-[var(--ink)]">{value}</p>
      <p className="mt-0.5 text-xs text-[var(--ink-dim)]">{label}</p>
    </div>
  );
}
