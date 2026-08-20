import Link from "next/link";
import { PlayerForm } from "@/components/players/player-form";
import { createPlayer } from "@/lib/actions/players";

export default function NuovoGiocatorePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href="/rosa" className="text-sm text-zinc-500 hover:text-zinc-700">
        ← Rosa
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">Nuovo giocatore</h1>

      <div className="mt-6">
        <PlayerForm action={createPlayer} submitLabel="Aggiungi giocatore" />
      </div>
    </div>
  );
}
