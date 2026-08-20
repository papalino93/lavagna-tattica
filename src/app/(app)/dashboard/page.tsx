import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { PLAYER_STATUS_LABELS, PLAYER_STATUS_TONE, type PlayerStatus } from "@/lib/types/domain";

export default async function DashboardPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();

  const [{ data: nextSession }, { data: nextMatch }, { data: unavailablePlayers }] =
    await Promise.all([
      supabase
        .from("training_sessions")
        .select("id, date, notes")
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("matches")
        .select("id, date, opponent")
        .gte("date", now)
        .order("date", { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("players")
        .select("id, name, status")
        .in("status", ["infortunato", "squalificato"])
        .order("name"),
    ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard title="Prossimo allenamento" href={nextSession ? `/allenamenti/${nextSession.id}` : "/allenamenti"}>
          {nextSession ? (
            <>
              <p className="font-medium text-zinc-900">
                {new Date(nextSession.date).toLocaleDateString("it-IT", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              {nextSession.notes && (
                <p className="mt-0.5 truncate text-sm text-zinc-500">{nextSession.notes}</p>
              )}
            </>
          ) : (
            <p className="text-sm text-zinc-500">Nessuno programmato</p>
          )}
        </InfoCard>

        <InfoCard title="Prossima partita" href={nextMatch ? `/partite/${nextMatch.id}` : "/partite"}>
          {nextMatch ? (
            <>
              <p className="font-medium text-zinc-900">vs {nextMatch.opponent}</p>
              <p className="mt-0.5 text-sm text-zinc-500">
                {new Date(nextMatch.date).toLocaleDateString("it-IT", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </>
          ) : (
            <p className="text-sm text-zinc-500">Nessuna programmata</p>
          )}
        </InfoCard>
      </div>

      <div className="mt-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm font-medium text-zinc-700">Assenti / infortunati</p>
          {!unavailablePlayers || unavailablePlayers.length === 0 ? (
            <p className="mt-1 text-sm text-zinc-500">Rosa al completo</p>
          ) : (
            <ul className="mt-2 flex flex-wrap gap-2">
              {unavailablePlayers.map((p) => (
                <li key={p.id}>
                  <Link href={`/rosa/${p.id}`}>
                    <Badge tone={PLAYER_STATUS_TONE[p.status as PlayerStatus]}>
                      {p.name} · {PLAYER_STATUS_LABELS[p.status as PlayerStatus]}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Link
          href="/rosa"
          className="flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-5 font-medium text-zinc-800 transition-colors hover:border-[var(--brand-border)] hover:bg-[var(--brand-soft)]"
        >
          Rosa
        </Link>
        <Link
          href="/lavagna"
          className="flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-5 font-medium text-zinc-800 transition-colors hover:border-[var(--brand-border)] hover:bg-[var(--brand-soft)]"
        >
          Lavagna tattica
        </Link>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-[var(--brand-border)] hover:bg-[var(--brand-soft)]"
    >
      <p className="text-sm font-medium text-zinc-500">{title}</p>
      <div className="mt-1">{children}</div>
    </Link>
  );
}
