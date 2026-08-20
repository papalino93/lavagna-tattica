"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { PLAYER_ROLES, PLAYER_STATUS_LABELS, PLAYER_STATUSES } from "@/lib/types/domain";
import type { PlayerFormState } from "@/lib/actions/players";

interface PlayerFormProps {
  action: (state: PlayerFormState, formData: FormData) => Promise<PlayerFormState>;
  defaultValues?: {
    name: string;
    role: string;
    jerseyNumber: number | null;
    status: string;
    notes: string | null;
    photoUrl: string | null;
  };
  submitLabel: string;
}

const initialState: PlayerFormState = {};

export function PlayerForm({ action, defaultValues, submitLabel }: PlayerFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <ImageUpload name="photoUrl" bucket="player-photos" initialUrl={defaultValues?.photoUrl} />

      <Input
        id="name"
        name="name"
        label="Nome"
        defaultValue={defaultValues?.name}
        error={state.fieldErrors?.name}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          id="role"
          name="role"
          label="Ruolo"
          defaultValue={defaultValues?.role ?? PLAYER_ROLES[0]}
          error={state.fieldErrors?.role}
        >
          {PLAYER_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </Select>

        <Input
          id="jerseyNumber"
          name="jerseyNumber"
          label="Numero maglia"
          type="number"
          min={1}
          max={99}
          defaultValue={defaultValues?.jerseyNumber ?? ""}
          error={state.fieldErrors?.jerseyNumber}
        />
      </div>

      <Select
        id="status"
        name="status"
        label="Stato"
        defaultValue={defaultValues?.status ?? "attivo"}
        error={state.fieldErrors?.status}
      >
        {PLAYER_STATUSES.map((status) => (
          <option key={status} value={status}>
            {PLAYER_STATUS_LABELS[status]}
          </option>
        ))}
      </Select>

      <Textarea
        id="notes"
        name="notes"
        label="Note"
        rows={4}
        defaultValue={defaultValues?.notes ?? ""}
        error={state.fieldErrors?.notes}
      />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={pending} className="mt-1 self-start">
        {pending ? "Salvataggio…" : submitLabel}
      </Button>
    </form>
  );
}
