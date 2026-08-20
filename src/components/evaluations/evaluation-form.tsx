"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createEvaluation, type EvaluationFormState } from "@/lib/actions/evaluations";

const initialState: EvaluationFormState = {};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function EvaluationForm({ playerId }: { playerId: string }) {
  const action = createEvaluation.bind(null, playerId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <Input
        id="date"
        name="date"
        type="date"
        label="Data"
        defaultValue={today()}
        error={state.fieldErrors?.date}
        required
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Input
          id="tecnica"
          name="tecnica"
          type="number"
          min={1}
          max={10}
          label="Tecnica"
          defaultValue={6}
          error={state.fieldErrors?.tecnica}
        />
        <Input
          id="tattica"
          name="tattica"
          type="number"
          min={1}
          max={10}
          label="Tattica"
          defaultValue={6}
          error={state.fieldErrors?.tattica}
        />
        <Input
          id="fisica"
          name="fisica"
          type="number"
          min={1}
          max={10}
          label="Fisica"
          defaultValue={6}
          error={state.fieldErrors?.fisica}
        />
        <Input
          id="mentale"
          name="mentale"
          type="number"
          min={1}
          max={10}
          label="Mentale"
          defaultValue={6}
          error={state.fieldErrors?.mentale}
        />
      </div>

      <Textarea id="notes" name="notes" label="Note" rows={2} error={state.fieldErrors?.notes} />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-[var(--brand)]">Valutazione salvata.</p>}

      <Button type="submit" disabled={pending} variant="secondary" className="self-start">
        {pending ? "Salvataggio…" : "Aggiungi valutazione"}
      </Button>
    </form>
  );
}
