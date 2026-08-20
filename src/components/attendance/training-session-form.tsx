"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createTrainingSession,
  type TrainingSessionFormState,
} from "@/lib/actions/training-sessions";

const initialState: TrainingSessionFormState = {};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function TrainingSessionForm() {
  const [state, formAction, pending] = useActionState(createTrainingSession, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Input
        id="date"
        name="date"
        type="date"
        label="Data"
        defaultValue={today()}
        error={state.fieldErrors?.date}
        required
      />
      <Textarea id="notes" name="notes" label="Note (opzionale)" rows={3} error={state.fieldErrors?.notes} />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Creazione…" : "Crea allenamento"}
      </Button>
    </form>
  );
}
