"use client";

import { useMemo, useState, useTransition } from "react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import { FORMATION_MODULES, type FormationModule } from "@/lib/types/domain";
import { saveFormation, type StarterAssignment } from "@/lib/actions/formations";

interface Player {
  id: string;
  name: string;
  jersey_number: number | null;
}

interface FormationEditorProps {
  matchId: string;
  calledUpPlayers: Player[];
  initialModule: FormationModule | null;
  initialAssignments: Record<string, string>; // slotCode -> playerId
}

const MODULE_NAMES = Object.keys(FORMATION_MODULES) as FormationModule[];

export function FormationEditor({
  matchId,
  calledUpPlayers,
  initialModule,
  initialAssignments,
}: FormationEditorProps) {
  const toast = useToast();
  const [module, setModule] = useState<FormationModule>(initialModule ?? "4-3-3");
  const [assignments, setAssignments] = useState<Record<string, string>>(initialAssignments);
  const [picked, setPicked] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const slots = FORMATION_MODULES[module];
  const playersById = useMemo(
    () => new Map(calledUpPlayers.map((p) => [p.id, p])),
    [calledUpPlayers],
  );
  const assignedIds = new Set(Object.values(assignments).filter(Boolean));
  const benchPlayers = calledUpPlayers.filter((p) => !assignedIds.has(p.id));

  function handleModuleChange(next: string) {
    setModule(next as FormationModule);
    setAssignments({});
    setPicked(null);
    setSaved(false);
  }

  /** Tocca uno slot sul campo: se ho un giocatore "in mano" lo schiero qui (scambiando
   * con l'eventuale occupante), altrimenti prendo in mano chi occupa già lo slot. */
  function handleSlotTap(slotCode: string) {
    setSaved(false);
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
      if (occupant && oldSlot) {
        next[oldSlot] = occupant;
      }
      next[slotCode] = picked;
      return next;
    });
    setPicked(null);
  }

  /** Tocca un giocatore in panchina: lo prendo in mano, rimettendo eventualmente
   * in panchina chi avevo già in mano. */
  function handleBenchTap(playerId: string) {
    setSaved(false);
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

  function handleSave() {
    const starters: StarterAssignment[] = Object.entries(assignments)
      .filter(([, playerId]) => !!playerId)
      .map(([slotCode, playerId]) => ({ slotCode, playerId }));
    const benchIds = benchPlayers.map((p) => p.id);

    startTransition(async () => {
      const result = await saveFormation(matchId, module, starters, benchIds);
      setSaved(!result.error);
      if (!result.error) toast("Formazione salvata");
    });
  }

  const pickedPlayer = picked ? playersById.get(picked) : null;

  return (
    <div className="flex flex-col gap-6">
      <Select
        id="module"
        label="Modulo"
        value={module}
        onChange={(e) => handleModuleChange(e.target.value)}
      >
        {MODULE_NAMES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </Select>

      <p className="text-sm text-[var(--ink-dim)]" aria-live="polite">
        {pickedPlayer
          ? `${pickedPlayer.name} in mano: tocca una posizione per schierarlo.`
          : "Tocca un giocatore in panchina, poi tocca una posizione sul campo."}
      </p>

      {/* Campo tattico: tap-to-place, niente drag necessario su mobile */}
      <div className="relative mx-auto aspect-[68/100] w-full max-w-xs overflow-hidden rounded-lg bg-[var(--brand-hover)]">
        <PitchMarkings />
        {slots.map((slot) => {
          const playerId = assignments[slot.code];
          const player = playerId ? playersById.get(playerId) : null;
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
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                  isPicked
                    ? "scale-110 border-white bg-white text-[var(--brand-hover)] shadow-lg ring-2 ring-white/70"
                    : player
                      ? "border-white bg-white text-[var(--brand-hover)]"
                      : picked
                        ? "border-dashed border-white/90 bg-white/10 text-white/80"
                        : "border-white/60 bg-[var(--brand-hover)] text-white/60"
                }`}
              >
                {player?.jersey_number ?? "?"}
              </div>
              <span className="rounded bg-black/25 px-1 text-[9px] font-medium leading-tight text-white/85">
                {slot.code}
              </span>
            </button>
          );
        })}
      </div>

      {/* Formazione titolare: riepilogo testuale di conferma */}
      <div>
        <h3 className="text-sm font-medium text-[var(--ink)]">Titolari</h3>
        <ul className="mt-2 flex flex-col gap-1.5">
          {slots.map((slot) => {
            const player = assignments[slot.code] ? playersById.get(assignments[slot.code]) : null;
            return (
              <li key={slot.code} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0 text-[var(--ink-dim)]">{slot.label}</span>
                <span className={player ? "font-medium text-[var(--ink)]" : "text-[var(--ink-faint)]"}>
                  {player
                    ? `${player.jersey_number ? player.jersey_number + " · " : ""}${player.name}`
                    : "—"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-medium text-[var(--ink)]">Panchina</h3>
        {benchPlayers.length === 0 ? (
          <p className="mt-1 text-sm text-[var(--ink-faint)]">Nessuno</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {benchPlayers.map((p) => {
              const isPicked = picked === p.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => handleBenchTap(p.id)}
                    aria-pressed={isPicked}
                    className={`rounded-full px-3 py-1.5 text-sm transition ${
                      isPicked
                        ? "bg-[var(--brand)] text-[var(--brand-fg)] shadow"
                        : "bg-[var(--surface-sunken)] text-[var(--ink)] hover:bg-[var(--surface-hover-strong)]"
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
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleSave} disabled={pending} className="self-start">
          {pending ? "Salvataggio…" : "Salva formazione"}
        </Button>
        {saved && <span className="text-sm text-[var(--brand)]">Salvata.</span>}
      </div>
    </div>
  );
}

function PitchMarkings() {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect x="2" y="2" width="96" height="96" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="0.5" />
      <line x1="2" y1="50" x2="98" y2="50" stroke="white" strokeOpacity="0.5" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="9" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="0.5" />
      <rect x="26" y="2" width="48" height="14" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="0.5" />
      <rect x="26" y="84" width="48" height="14" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="0.5" />
    </svg>
  );
}
