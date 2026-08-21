import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default async function PartitePage() {
  const supabase = await createClient();
  const { data: matches, error } = await supabase
    .from("matches")
    .select("id, date, opponent, result")
    .order("date", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--ink)]">Partite</h1>
        <Link
          href="/partite/nuovo"
          className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-[var(--brand-fg)] hover:bg-[var(--brand-hover)]"
        >
          + Partita
        </Link>
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-600">
          Non è stato possibile caricare le partite. Riprova.
        </p>
      )}

      {!error && matches?.length === 0 && (
        <EmptyState
          title="Nessuna partita ancora"
          description="Registra la prossima partita per gestire convocati e formazione."
          actionHref="/partite/nuovo"
          actionLabel="+ Partita"
        />
      )}

      <ul className="mt-6 flex flex-col gap-2">
        {matches?.map((match) => {
          const isPast = new Date(match.date) < new Date();
          return (
            <li key={match.id}>
              <Link
                href={`/partite/${match.id}`}
                className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 transition-colors hover:border-[var(--brand-border)] hover:bg-[var(--brand-soft)]"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                  style={{ background: "var(--brand)" }}
                >
                  {match.opponent.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-[var(--ink)]">vs {match.opponent}</p>
                  <p className="mt-0.5 text-sm text-[var(--ink-dim)]">
                    {new Date(match.date).toLocaleDateString("it-IT", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {match.result ? (
                  <Badge tone="emerald">{match.result}</Badge>
                ) : isPast ? (
                  <Badge tone="zinc">Da segnare</Badge>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
