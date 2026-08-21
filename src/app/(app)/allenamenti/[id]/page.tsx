import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AttendanceRow } from "@/components/attendance/attendance-row";
import { AttendanceLegend } from "@/components/attendance/attendance-legend";
import { DeleteSessionButton } from "@/components/attendance/delete-session-button";
import { RemoveBlockButton } from "@/components/training/remove-block-button";
import { CloseSessionForm } from "@/components/training/close-session-form";
import { Badge } from "@/components/ui/badge";
import type { AttendanceStatus } from "@/lib/types/domain";

export default async function AllenamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: session }, { data: players }, { data: attendances }, { data: blocks }, { data: log }] =
    await Promise.all([
      supabase.from("training_sessions").select("*").eq("id", id).single(),
      supabase
        .from("players")
        .select("id, name, role, jersey_number")
        .neq("status", "altro")
        .order("jersey_number", { ascending: true, nullsFirst: false }),
      supabase.from("attendances").select("player_id, status").eq("training_session_id", id),
      supabase
        .from("session_blocks")
        .select(
          "id, position, duration_minutes, tactical_schemes(id, name, category), exercises(id, name, category)",
        )
        .eq("training_session_id", id)
        .order("position", { ascending: true }),
      supabase.from("training_session_logs").select("*").eq("training_session_id", id).maybeSingle(),
    ]);

  if (!session) {
    notFound();
  }

  const statusByPlayer = new Map<string, AttendanceStatus>(
    attendances?.map((a) => [a.player_id, a.status as AttendanceStatus]),
  );

  const blockSummaries = (blocks ?? []).map((b) => ({
    id: b.id,
    label: b.tactical_schemes?.name ?? b.exercises?.name ?? "—",
  }));

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/allenamenti" className="text-sm text-[var(--ink-dim)] hover:text-[var(--ink)]">
        ← Allenamenti
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-[var(--ink)]">
        {new Date(session.date).toLocaleDateString("it-IT", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </h1>
      {session.notes && <p className="mt-1 text-sm text-[var(--ink-dim)]">{session.notes}</p>}

      <div className="mt-2">
        <DeleteSessionButton sessionId={id} />
      </div>

      {blocks && blocks.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">Programma</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {blocks.map((block) => {
              const item = block.tactical_schemes ?? block.exercises;
              const isScheme = !!block.tactical_schemes;
              const href = item
                ? isScheme
                  ? `/lavagna/${item.id}`
                  : `/lavagna/esercizi/${item.id}`
                : "#";
              return (
                <li
                  key={block.id}
                  className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] p-3"
                >
                  <Link href={href} className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[var(--ink)]">{item?.name ?? "—"}</p>
                    {block.duration_minutes && (
                      <p className="text-xs text-[var(--ink-dim)]">{block.duration_minutes} min</p>
                    )}
                  </Link>
                  <Badge tone={isScheme ? "zinc" : "emerald"}>
                    {isScheme ? "Schema" : "Esercizio"}
                  </Badge>
                  <RemoveBlockButton blockId={block.id} trainingSessionId={id} />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Presenze</h2>
        <div className="mt-2">
          <AttendanceLegend />
        </div>
        {!players || players.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--ink-dim)]">
            Aggiungi giocatori alla rosa per poter segnare le presenze.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {players.map((player) => (
              <AttendanceRow
                key={player.id}
                sessionId={id}
                playerId={player.id}
                playerName={player.name}
                playerRole={player.role}
                jerseyNumber={player.jersey_number}
                initialStatus={statusByPlayer.get(player.id) ?? null}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Chiusura seduta</h2>
        {log && (
          <p className="mt-1 text-sm text-[var(--brand)]">
            Svolta — registrata il{" "}
            {new Date(log.closed_at).toLocaleDateString("it-IT", {
              day: "numeric",
              month: "long",
            })}
          </p>
        )}
        <div className="mt-3">
          <CloseSessionForm
            trainingSessionId={id}
            blocks={blockSummaries}
            initialDuration={log?.actual_duration_minutes ?? null}
            initialIntensity={log?.actual_intensity ?? null}
            initialNotes={log?.notes ?? null}
          />
        </div>
      </div>
    </div>
  );
}
