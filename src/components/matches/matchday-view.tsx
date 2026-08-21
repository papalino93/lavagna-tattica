"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { FORMATION_MODULES, type FormationModule } from "@/lib/types/domain";
import { saveFormation, type StarterAssignment } from "@/lib/actions/formations";
import { saveMatchNotes } from "@/lib/actions/matches";
import { useToast } from "@/components/ui/toast-provider";

interface Player {
  id: string;
  name: string;
  jersey_number: number | null;
}

interface MatchdayViewProps {
  matchId: string;
  opponent: string;
  module: FormationModule | null;
  starters: Record<string, string>; // slotCode -> playerId
  bench: Player[];
  playersById: Record<string, Player>;
  initialNotes: string | null;
}

export function MatchdayButton(props: MatchdayViewProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl bg-[var(--brand)] px-4 py-3 text-center font-display text-base font-bold text-[var(--brand-fg)] shadow-sm transition hover:bg-[var(--brand-hover)]"
      >
        ▶ Modalità Partita
      </button>
      {open && <MatchdayOverlay {...props} onClose={() => setOpen(false)} />}
    </>
  );
}

function MatchdayOverlay({
  matchId,
  opponent,
  module,
  starters,
  bench,
  playersById,
  initialNotes,
  onClose,
}: MatchdayViewProps & { onClose: () => void }) {
  const toast = useToast();
  const [assignments, setAssignments] = useState<Record<string, string>>(starters);
  const [picked, setPicked] = useState<string | null>(null);
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [savingFormation, startSavingFormation] = useTransition();
  const [savingNotes, startSavingNotes] = useTransition();

  const benchIds = useMemo(() => new Set(bench.map((p) => p.id)), [bench]);
  const assignedIds = new Set(Object.values(assignments).filter(Boolean));
  const benchPlayers = bench.filter((p) => !assignedIds.has(p.id));
  // Un titolare uscito per cambio finisce anche lui in "panchina" nella vista.
  const outPlayers = Object.values(starters)
    .filter((id) => !assignedIds.has(id) && !benchIds.has(id))
    .map((id) => playersById[id])
    .filter(Boolean);
  const allBench = [...benchPlayers, ...outPlayers];

  if (!module) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#0c2417] px-6 text-center">
        <p className="text-lg font-medium text-white">Nessuna formazione impostata.</p>
        <Link
          href={`/partite/${matchId}/formazione`}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#0c2417]"
        >
          Imposta formazione
        </Link>
        <button type="button" onClick={onClose} className="text-sm text-white/70 underline">
          Chiudi
        </button>
      </div>
    );
  }

  const mod: FormationModule = module;
  const slots = FORMATION_MODULES[mod];

  function handleSlotTap(slotCode: string) {
    if (!picked) {
      const occupant = assignments[slotCode];
      if (occupant) setPicked(occupant);
      return;
    }
    if (picked === assignments[slotCode]) {
      setPicked(null);
      return;
    }
    setAssignments((prev) => {
      const next = { ...prev };
      const oldSlot = Object.keys(next).find((c) => next[c] === picked);
      const occupant = next[slotCode] ?? null;
      if (oldSlot) delete next[oldSlot];
      if (occupant && oldSlot) next[oldSlot] = occupant;
      next[slotCode] = picked as string;
      return next;
    });
    setPicked(null);
  }

  function handleBenchTap(playerId: string) {
    if (picked === playerId) {
      setPicked(null);
      return;
    }
    if (picked) {
      setAssignments((prev) => {
        const next = { ...prev };
        const oldSlot = Object.keys(next).find((c) => next[c] === picked);
        if (oldSlot) delete next[oldSlot];
        return next;
      });
    }
    setPicked(playerId);
  }

  function handleSaveFormation() {
    const starterList: StarterAssignment[] = Object.entries(assignments)
      .filter(([, playerId]) => !!playerId)
      .map(([slotCode, playerId]) => ({ slotCode, playerId }));
    const benchIdList = allBench.map((p) => p.id);

    startSavingFormation(async () => {
      const result = await saveFormation(matchId, mod, starterList, benchIdList);
      if (!result.error) toast("Cambio salvato");
    });
  }

  function handleSaveNotes() {
    startSavingNotes(async () => {
      const result = await saveMatchNotes(matchId, notes);
      if (!result.error) toast("Note salvate");
    });
  }

  const pickedPlayer = picked ? playersById[picked] : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0c2417]">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/50">Modalità Partita</p>
          <p className="font-display text-lg font-bold text-white sm:text-xl">vs {opponent}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
        >
          Chiudi ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 sm:px-6">
        <p className="text-center text-sm text-white/70" aria-live="polite">
          {pickedPlayer
            ? `${pickedPlayer.name} in mano: tocca dove schierarlo.`
            : "Tocca un titolare o un giocatore in panchina per fare un cambio."}
        </p>

        <div className="relative mx-auto mt-3 aspect-[68/100] w-full max-w-xs overflow-hidden rounded-lg bg-[#0f3d22]">
          <PitchMarkings />
          {slots.map((slot) => {
            const playerId = assignments[slot.code];
            const player = playerId ? playersById[playerId] : null;
            const isPicked = !!playerId && playerId === picked;
            return (
              <button
                key={slot.code}
                type="button"
                onClick={() => handleSlotTap(slot.code)}
                aria-pressed={isPicked}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5"
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                    isPicked
                      ? "scale-110 border-white bg-white text-[#0c2417] shadow-lg ring-2 ring-white/70"
                      : player
                        ? "border-white bg-white text-[#0c2417]"
                        : "border-dashed border-white/50 bg-white/5 text-white/50"
                  }`}
                >
                  {player?.jersey_number ?? "?"}
                </div>
                <span className="max-w-[64px] truncate rounded bg-black/30 px-1 text-[9px] leading-tight text-white/80">
                  {player?.name.split(" ")[0] ?? slot.code}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-5 max-w-xs">
          <h3 className="text-xs font-medium uppercase tracking-wide text-white/50">Panchina</h3>
          {allBench.length === 0 ? (
            <p className="mt-1.5 text-sm text-white/40">Nessuno</p>
          ) : (
            <ul className="mt-1.5 flex flex-wrap gap-2">
              {allBench.map((p) => {
                const isPicked = picked === p.id;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => handleBenchTap(p.id)}
                      aria-pressed={isPicked}
                      className={`rounded-full px-3 py-1.5 text-sm transition ${
                        isPicked ? "bg-white text-[#0c2417] shadow" : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {p.jersey_number ? `${p.jersey_number} · ` : ""}
                      {p.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <button
            type="button"
            onClick={handleSaveFormation}
            disabled={savingFormation}
            className="mt-4 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-[#0c2417] disabled:opacity-60"
          >
            {savingFormation ? "Salvataggio…" : "Salva cambio"}
          </button>
        </div>

        <div className="mx-auto mt-6 max-w-xs border-t border-white/10 pt-5">
          <h3 className="text-xs font-medium uppercase tracking-wide text-white/50">Note veloci</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Es. 60' pressing più alto, attenti ai contropiedi…"
            className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/40"
          />
          <button
            type="button"
            onClick={handleSaveNotes}
            disabled={savingNotes}
            className="mt-2 w-full rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-60"
          >
            {savingNotes ? "Salvataggio…" : "Salva note"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PitchMarkings() {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect x="2" y="2" width="96" height="96" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="0.5" />
      <line x1="2" y1="50" x2="98" y2="50" stroke="white" strokeOpacity="0.35" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="9" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="0.5" />
      <rect x="26" y="2" width="48" height="14" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="0.5" />
      <rect x="26" y="84" width="48" height="14" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="0.5" />
    </svg>
  );
}
