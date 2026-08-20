"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { addToTrainingSession } from "@/lib/actions/session-blocks";

interface SessionOption {
  id: string;
  date: string;
}

export function AddToSessionForm({
  kind,
  contentId,
  sessions,
  defaultDurationMinutes,
}: {
  kind: "schema" | "esercizio";
  contentId: string;
  sessions: SessionOption[];
  defaultDurationMinutes: number | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(sessions[0]?.id ?? "nuovo");
  const [duration, setDuration] = useState(defaultDurationMinutes ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!open) {
    return (
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        Aggiungi all&apos;allenamento
      </Button>
    );
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await addToTrainingSession(
        kind,
        contentId,
        sessionId,
        duration === "" ? null : Number(duration),
      );
      if (result.error) {
        setError(result.error);
        return;
      }
      setDone(true);
      router.refresh();
    });
  }

  if (done) {
    return <p className="text-sm text-[var(--brand)]">Aggiunto all&apos;allenamento.</p>;
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <Select
        id="session"
        label="Allenamento"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
      >
        <option value="nuovo">+ Crea nuovo allenamento (oggi)</option>
        {sessions.map((s) => (
          <option key={s.id} value={s.id}>
            {new Date(s.date).toLocaleDateString("it-IT", {
              weekday: "short",
              day: "numeric",
              month: "long",
            })}
          </option>
        ))}
      </Select>

      <Input
        id="blockDuration"
        type="number"
        min={1}
        max={180}
        label="Durata per questo blocco (min, opzionale)"
        value={duration}
        onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <Button type="button" onClick={handleSubmit} disabled={pending}>
          {pending ? "Aggiunta…" : "Conferma"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
          Annulla
        </Button>
      </div>
    </div>
  );
}
