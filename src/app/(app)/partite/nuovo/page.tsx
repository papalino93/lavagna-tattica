import Link from "next/link";
import { MatchForm } from "@/components/matches/match-form";
import { createMatch } from "@/lib/actions/matches";

export default function NuovaPartitaPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href="/partite" className="text-sm text-[var(--ink-dim)] hover:text-[var(--ink)]">
        ← Partite
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-[var(--ink)]">Nuova partita</h1>

      <div className="mt-6">
        <MatchForm action={createMatch} submitLabel="Crea partita" />
      </div>
    </div>
  );
}
