import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/empty-state";

export default async function AllenamentiPage() {
  const supabase = await createClient();
  const { data: sessions, error } = await supabase
    .from("training_sessions")
    .select("id, date, notes")
    .order("date", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--ink)]">Allenamenti</h1>
        <Link
          href="/allenamenti/nuovo"
          className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-hover)]"
        >
          + Allenamento
        </Link>
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-600">
          Non è stato possibile caricare gli allenamenti. Riprova.
        </p>
      )}

      {!error && sessions?.length === 0 && (
        <EmptyState
          title="Nessun allenamento ancora"
          description="Programma la prossima seduta e segna le presenze a bordo campo."
          actionHref="/allenamenti/nuovo"
          actionLabel="+ Allenamento"
        />
      )}

      <ul className="mt-6 flex flex-col gap-2">
        {sessions?.map((session) => (
          <li key={session.id}>
            <Link
              href={`/allenamenti/${session.id}`}
              className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 transition-colors hover:border-[var(--brand-border)] hover:bg-[var(--brand-soft)]"
            >
              <div>
                <p className="font-medium text-[var(--ink)]">
                  {new Date(session.date).toLocaleDateString("it-IT", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                {session.notes && (
                  <p className="mt-0.5 truncate text-sm text-[var(--ink-dim)]">{session.notes}</p>
                )}
              </div>
              <span className="text-[var(--ink-faint)]">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
