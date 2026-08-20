"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  EXERCISE_CATEGORIES,
  EXERCISE_CATEGORY_LABELS,
  INTENSITY_LEVELS,
  INTENSITY_LABELS,
} from "@/lib/types/domain";
import type { ExerciseFormState } from "@/lib/actions/exercises";

interface ExerciseFormProps {
  action: (state: ExerciseFormState, formData: FormData) => Promise<ExerciseFormState>;
  defaultValues?: {
    name: string;
    category: string;
    description: string | null;
    objective: string | null;
    playersMin: number | null;
    playersMax: number | null;
    durationMinutes: number | null;
    intensity: string | null;
    fieldSize: string | null;
    equipment: string | null;
    coachingPoints: string | null;
    variants: string | null;
    tags: string[];
  };
  submitLabel: string;
}

const initialState: ExerciseFormState = {};

export function ExerciseForm({ action, defaultValues, submitLabel }: ExerciseFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Input
        id="name"
        name="name"
        label="Nome esercizio"
        defaultValue={defaultValues?.name}
        error={state.fieldErrors?.name}
        required
      />

      <Select
        id="category"
        name="category"
        label="Categoria"
        defaultValue={defaultValues?.category ?? EXERCISE_CATEGORIES[0]}
        error={state.fieldErrors?.category}
      >
        {EXERCISE_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {EXERCISE_CATEGORY_LABELS[c]}
          </option>
        ))}
      </Select>

      <Textarea
        id="description"
        name="description"
        label="Descrizione (come si svolge)"
        rows={4}
        defaultValue={defaultValues?.description ?? ""}
        error={state.fieldErrors?.description}
      />

      <Input
        id="objective"
        name="objective"
        label="Obiettivo (cosa allena)"
        defaultValue={defaultValues?.objective ?? ""}
        error={state.fieldErrors?.objective}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Input
          id="playersMin"
          name="playersMin"
          type="number"
          min={1}
          max={30}
          label="Giocatori min"
          defaultValue={defaultValues?.playersMin ?? ""}
          error={state.fieldErrors?.playersMin}
        />
        <Input
          id="playersMax"
          name="playersMax"
          type="number"
          min={1}
          max={30}
          label="Giocatori max"
          defaultValue={defaultValues?.playersMax ?? ""}
          error={state.fieldErrors?.playersMax}
        />
        <Input
          id="durationMinutes"
          name="durationMinutes"
          type="number"
          min={1}
          max={180}
          label="Durata (min)"
          defaultValue={defaultValues?.durationMinutes ?? ""}
          error={state.fieldErrors?.durationMinutes}
        />
        <Select
          id="intensity"
          name="intensity"
          label="Intensità"
          defaultValue={defaultValues?.intensity ?? ""}
          error={state.fieldErrors?.intensity}
        >
          <option value="">—</option>
          {INTENSITY_LEVELS.map((i) => (
            <option key={i} value={i}>
              {INTENSITY_LABELS[i]}
            </option>
          ))}
        </Select>
      </div>

      <Input
        id="fieldSize"
        name="fieldSize"
        label="Dimensione campo (opzionale)"
        placeholder="es. 20x15m"
        defaultValue={defaultValues?.fieldSize ?? ""}
        error={state.fieldErrors?.fieldSize}
      />

      <Input
        id="equipment"
        name="equipment"
        label="Materiale (opzionale)"
        placeholder="es. coni, pettorine, porte piccole"
        defaultValue={defaultValues?.equipment ?? ""}
        error={state.fieldErrors?.equipment}
      />

      <Textarea
        id="coachingPoints"
        name="coachingPoints"
        label="Coaching points (opzionale)"
        rows={3}
        defaultValue={defaultValues?.coachingPoints ?? ""}
        error={state.fieldErrors?.coachingPoints}
      />

      <Textarea
        id="variants"
        name="variants"
        label="Varianti (opzionale)"
        rows={3}
        defaultValue={defaultValues?.variants ?? ""}
        error={state.fieldErrors?.variants}
      />

      <Input
        id="tags"
        name="tags"
        label="Tag (separati da virgola, opzionale)"
        placeholder="es. ampiezza, velocità di gioco"
        defaultValue={defaultValues?.tags?.join(", ") ?? ""}
        error={state.fieldErrors?.tags}
      />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Salvataggio…" : submitLabel}
      </Button>
    </form>
  );
}
