"use client";

import { useActionState } from "react";
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

function toLocalDatetimeInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function MatchForm({ action, defaultValues, submitLabel }: MatchFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

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
        id="date"
        name="date"
        type="datetime-local"
        label="Data e ora"
        defaultValue={toLocalDatetimeInput(defaultValues?.date)}
        error={state.fieldErrors?.date}
        required
      />

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
