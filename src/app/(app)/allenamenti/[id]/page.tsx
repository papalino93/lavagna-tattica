import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AttendanceRow } from "@/components/attendance/attendance-row";
import { DeleteSessionButton } from "@/components/attendance/delete-session-button";
import type { AttendanceStatus } from "@/lib/types/domain";

export default async function AllenamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: session }, { data: players }, { data: attendances }] = await Promise.all([
    supabase.from("training_sessions").select("*").eq("id", id).single(),
    supabase
      .from("players")
      .select("id, name, role, jersey_number")
      .neq("status", "altro")
      .order("jersey_number", { ascending: true, nullsFirst: false }),
    supabase
      .from("attendances")
      .select("player_id, status")
      .eq("training_session_id", id),
  ]);

  if (!session) {
    notFound();
  }

  const statusByPlayer = new Map<string, AttendanceStatus>(
    attendances?.map((a) => [a.player_id, a.status as AttendanceStatus]),
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/allenamenti" className="text-sm text-zinc-500 hover:text-zinc-700">
        ← Allenamenti
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
        {new Date(session.date).toLocaleDateString("it-IT", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </h1>
      {session.notes && <p className="mt-1 text-sm text-zinc-500">{session.notes}</p>}

      <div className="mt-2">
        <DeleteSessionButton sessionId={id} />
      </div>

      {!players || players.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500">
          Aggiungi giocatori alla rosa per poter segnare le presenze.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
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
  );
}
