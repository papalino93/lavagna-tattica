"use client";

import { useMemo, useState, useTransition } from "react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
  const [module, setModule] = useState<FormationModule>(initialModule ?? "4-3-3");
  const [assignments, setAssignments] = useState<Record<string, string>>(initialAssignments);
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
    setSaved(false);
  }

  function handleAssign(slotCode: string, playerId: string) {
    setAssignments((prev) => {
      const next = { ...prev };
      if (playerId) {
        // Un giocatore può occupare un solo slot alla volta.
        for (const code of Object.keys(next)) {
          if (next[code] === playerId) delete next[code];
        }
        next[slotCode] = playerId;
      } else {
        delete next[slotCode];
      }
      return next;
    });
    setSaved(false);
  }

  function handleSave() {
    const starters: StarterAssignment[] = Object.entries(assignments)
      .filter(([, playerId]) => !!playerId)
      .map(([slotCode, playerId]) => ({ slotCode, playerId }));
    const benchIds = benchPlayers.map((p) => p.id);

    startTransition(async () => {
      const result = await saveFormation(matchId, module, starters, benchIds);
      setSaved(!result.error);
    });
  }

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

      {/* Campo visivo: anteprima in tempo reale della disposizione scelta */}
      <div className="relative mx-auto aspect-[68/100] w-full max-w-xs overflow-hidden rounded-lg bg-emerald-700">
        <PitchMarkings />
        {slots.map((slot) => {
          const playerId = assignments[slot.code];
          const player = playerId ? playersById.get(playerId) : null;
          return (
            <div
              key={slot.code}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  player
                    ? "border-white bg-white text-emerald-700"
                    : "border-white/60 bg-emerald-700 text-white/60"
                }`}
              >
                {player?.jersey_number ?? "?"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lista testuale: assegnazione giocatore per ruolo */}
      <div className="flex flex-col gap-2.5">
        {slots.map((slot) => (
          <div key={slot.code} className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-sm text-zinc-600">{slot.label}</span>
            <select
              value={assignments[slot.code] ?? ""}
              onChange={(e) => handleAssign(slot.code, e.target.value)}
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="">—</option>
              {calledUpPlayers
                .filter((p) => !assignedIds.has(p.id) || assignments[slot.code] === p.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.jersey_number ? `${p.jersey_number} · ` : ""}
                    {p.name}
                  </option>
                ))}
            </select>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-700">Panchina</h3>
        {benchPlayers.length === 0 ? (
          <p className="mt-1 text-sm text-zinc-400">Nessuno</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {benchPlayers.map((p) => (
              <li
                key={p.id}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700"
              >
                {p.jersey_number ? `${p.jersey_number} · ` : ""}
                {p.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleSave} disabled={pending} className="self-start">
          {pending ? "Salvataggio…" : "Salva formazione"}
        </Button>
        {saved && <span className="text-sm text-emerald-600">Salvata.</span>}
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
