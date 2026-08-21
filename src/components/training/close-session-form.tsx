"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  closeTrainingSession,
  type BlockStatusInput,
} from "@/lib/actions/training-session-log";
import {
  INTENSITY_LEVELS,
  INTENSITY_LABELS,
  SESSION_BLOCK_STATUSES,
  SESSION_BLOCK_STATUS_LABELS,
} from "@/lib/types/domain";

interface BlockSummary {
  id: string;
  label: string;
}

export function CloseSessionForm({
  trainingSessionId,
  blocks,
  initialDuration,
  initialIntensity,
  initialNotes,
}: {
  trainingSessionId: string;
  blocks: BlockSummary[];
  initialDuration: number | null;
  initialIntensity: string | null;
  initialNotes: string | null;
}) {
  const router = useRouter();
  const [duration, setDuration] = useState(initialDuration ?? "");
  const [intensity, setIntensity] = useState(initialIntensity ?? "");
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [statuses, setStatuses] = useState<Record<string, BlockStatusInput["status"]>>(
    Object.fromEntries(blocks.map((b) => [b.id, "fatto"])),
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await closeTrainingSession(trainingSessionId, {
        actualDurationMinutes: duration === "" ? null : Number(duration),
        actualIntensity: intensity || null,
        notes: notes || null,
        blocks: blocks.map((b) => ({ blockId: b.id, status: statuses[b.id], note: null })),
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] p-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="actualDuration"
          type="number"
          min={1}
          max={300}
          label="Durata effettiva (min)"
          value={duration}
          onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <Select
          id="actualIntensity"
          label="Intensità"
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
        >
          <option value="">—</option>
          {INTENSITY_LEVELS.map((i) => (
            <option key={i} value={i}>
              {INTENSITY_LABELS[i]}
            </option>
          ))}
        </Select>
      </div>

      {blocks.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--ink)]">Blocchi svolti</p>
          {blocks.map((b) => (
            <div key={b.id} className="flex items-center gap-3">
              <span className="min-w-0 flex-1 truncate text-sm text-[var(--ink-dim)]">{b.label}</span>
              <select
                value={statuses[b.id]}
                onChange={(e) =>
                  setStatuses((prev) => ({
                    ...prev,
                    [b.id]: e.target.value as BlockStatusInput["status"],
                  }))
                }
                className="rounded-lg border border-[var(--line-strong)] bg-[var(--surface-raised)] px-2 py-1.5 text-sm outline-none focus:border-[var(--brand)]"
              >
                {SESSION_BLOCK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {SESSION_BLOCK_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <Textarea
        id="sessionNotes"
        label="Note sulla seduta"
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="button" onClick={handleSubmit} disabled={pending} className="self-start">
        {pending ? "Salvataggio…" : "Salva e chiudi seduta"}
      </Button>
    </div>
  );
}
