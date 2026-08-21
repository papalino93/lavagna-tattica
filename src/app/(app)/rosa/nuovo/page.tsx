import Link from "next/link";
import { PlayerForm } from "@/components/players/player-form";
import { createPlayer } from "@/lib/actions/players";

export default function NuovoGiocatorePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href="/rosa" className="text-sm text-[var(--ink-dim)] hover:text-[var(--ink)]">
        ← Rosa
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-[var(--ink)]">Nuovo giocatore</h1>

      <div className="mt-6">
        <PlayerForm action={createPlayer} submitLabel="Aggiungi giocatore" />
      </div>
    </div>
  );
}
