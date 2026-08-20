import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AllenamentiPage() {
  const supabase = await createClient();
  const { data: sessions, error } = await supabase
    .from("training_sessions")
    .select("id, date, notes")
    .order("date", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Allenamenti</h1>
        <Link
          href="/allenamenti/nuovo"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
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
        <p className="mt-6 text-sm text-zinc-500">Nessun allenamento ancora registrato.</p>
      )}

      <ul className="mt-6 flex flex-col gap-2">
        {sessions?.map((session) => (
          <li key={session.id}>
            <Link
              href={`/allenamenti/${session.id}`}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
            >
              <div>
                <p className="font-medium text-zinc-900">
                  {new Date(session.date).toLocaleDateString("it-IT", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                {session.notes && (
                  <p className="mt-0.5 truncate text-sm text-zinc-500">{session.notes}</p>
                )}
              </div>
              <span className="text-zinc-400">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
