import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export default async function PartitePage() {
  const supabase = await createClient();
  const { data: matches, error } = await supabase
    .from("matches")
    .select("id, date, opponent, result")
    .order("date", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Partite</h1>
        <Link
          href="/partite/nuovo"
          className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-hover)]"
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
        <p className="mt-6 text-sm text-zinc-500">Nessuna partita ancora registrata.</p>
      )}

      <ul className="mt-6 flex flex-col gap-2">
        {matches?.map((match) => {
          const isPast = new Date(match.date) < new Date();
          return (
            <li key={match.id}>
              <Link
                href={`/partite/${match.id}`}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-[var(--brand-border)] hover:bg-[var(--brand-soft)]"
              >
                <div>
                  <p className="font-medium text-zinc-900">vs {match.opponent}</p>
                  <p className="mt-0.5 text-sm text-zinc-500">
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
