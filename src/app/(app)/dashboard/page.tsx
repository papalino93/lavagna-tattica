import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { PLAYER_STATUS_LABELS, PLAYER_STATUS_TONE, type PlayerStatus } from "@/lib/types/domain";

export default async function DashboardPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();

  const [{ data: nextSession }, { data: nextMatch }, { data: unavailablePlayers }, { data: team }] =
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
      supabase.from("team_settings").select("name, logo_url").maybeSingle(),
    ]);

  const teamName = team?.name ?? "La tua squadra";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-[var(--ink)]">Dashboard</h1>

      {/* Hero matchday: sempre visibile, colore squadra */}
      <Link
        href={nextMatch ? `/partite/${nextMatch.id}` : "/partite/nuovo"}
        className="mt-6 block overflow-hidden rounded-2xl p-6 text-white shadow-sm transition-opacity hover:opacity-95"
        style={{
          background:
            "linear-gradient(135deg, var(--brand), color-mix(in srgb, var(--brand) 55%, black))",
        }}
      >
        <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
          {nextMatch ? "Prossima partita" : "Matchday"}
        </p>

        {nextMatch ? (
          <>
            <div className="mt-3 flex items-center gap-4">
              <TeamBadge label={teamName} logoUrl={team?.logo_url ?? null} />
              <span className="font-display text-2xl font-bold text-white/70">VS</span>
              <TeamBadge label={nextMatch.opponent} />
            </div>
            <p className="mt-4 text-sm text-white/80">
              {new Date(nextMatch.date).toLocaleDateString("it-IT", {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[var(--surface-raised)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-hover)]">
                Formazione
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
                Convocati
              </span>
            </div>
          </>
        ) : (
          <p className="mt-3 font-display text-xl font-bold">Nessuna partita programmata</p>
        )}
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard title="Prossimo allenamento" href={nextSession ? `/allenamenti/${nextSession.id}` : "/allenamenti"}>
          {nextSession ? (
            <>
              <p className="font-medium text-[var(--ink)]">
                {new Date(nextSession.date).toLocaleDateString("it-IT", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              {nextSession.notes && (
                <p className="mt-0.5 truncate text-sm text-[var(--ink-dim)]">{nextSession.notes}</p>
              )}
            </>
          ) : (
            <p className="text-sm text-[var(--ink-dim)]">Nessuno programmato</p>
          )}
        </InfoCard>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] p-4">
          <p className="text-sm font-medium text-[var(--ink-dim)]">Assenti / infortunati</p>
          {!unavailablePlayers || unavailablePlayers.length === 0 ? (
            <p className="mt-1 text-sm text-[var(--ink-dim)]">Rosa al completo</p>
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

      <p className="mt-6 text-xs font-semibold tracking-widest text-[var(--ink-faint)] uppercase">
        Azioni rapide
      </p>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickAction href="/rosa/nuovo" label="+ Giocatore" />
        <QuickAction href="/allenamenti/nuovo" label="+ Allenamento" />
        <QuickAction href="/lavagna/nuovo" label="+ Schema" />
        <QuickAction href="/partite/nuovo" label="+ Partita" />
      </div>
    </div>
  );
}

function TeamBadge({ label, logoUrl }: { label: string; logoUrl?: string | null }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="" className="h-11 w-11 rounded-full object-cover" />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 font-display text-base font-bold">
          {label.slice(0, 2).toUpperCase()}
        </div>
      )}
      <span className="max-w-24 truncate text-center text-xs font-medium text-white/90">
        {label}
      </span>
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
      className="rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 transition-colors hover:border-[var(--brand-border)] hover:bg-[var(--brand-soft)]"
    >
      <p className="text-sm font-medium text-[var(--ink-dim)]">{title}</p>
      <div className="mt-1">{children}</div>
    </Link>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] px-3 py-4 text-center text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--brand-border)] hover:bg-[var(--brand-soft)]"
    >
      {label}
    </Link>
  );
}
