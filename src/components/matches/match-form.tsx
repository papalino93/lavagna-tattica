"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { MatchFormState } from "@/lib/actions/matches";

interface MatchFormProps {
  action: (state: MatchFormState, formData: FormData) => Promise<MatchFormState>;
  defaultValues?: {
    date: string;
    opponent: string;
    notes: string | null;
    result: string | null;
  };
  submitLabel: string;
}

const initialState: MatchFormState = {};

/** ISO (UTC) -> valore per <input type="datetime-local">, nel fuso del browser. */
function isoToLocalInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

/** Valore di <input type="datetime-local"> (nel fuso del browser) -> ISO UTC. */
function localInputToIso(local: string) {
  if (!local) return "";
  return new Date(local).toISOString();
}

export function MatchForm({ action, defaultValues, submitLabel }: MatchFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [localDate, setLocalDate] = useState(() => isoToLocalInput(defaultValues?.date));

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Input
        id="opponent"
        name="opponent"
        label="Avversario"
        defaultValue={defaultValues?.opponent}
        error={state.fieldErrors?.opponent}
        required
      />

      <Input
        id="dateLocal"
        label="Data e ora"
        type="datetime-local"
        value={localDate}
        onChange={(e) => setLocalDate(e.target.value)}
        error={state.fieldErrors?.date}
        required
      />
      {/* Convertito in UTC lato browser: evita disallineamenti di fuso col server. */}
      <input type="hidden" name="date" value={localInputToIso(localDate)} />

      <Input
        id="result"
        name="result"
        label="Risultato (opzionale)"
        placeholder="es. 2-1"
        defaultValue={defaultValues?.result ?? ""}
        error={state.fieldErrors?.result}
      />

      <Textarea
        id="notes"
        name="notes"
        label="Note"
        rows={3}
        defaultValue={defaultValues?.notes ?? ""}
        error={state.fieldErrors?.notes}
      />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Salvataggio…" : submitLabel}
      </Button>
    </form>
  );
}
