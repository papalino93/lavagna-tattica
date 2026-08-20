"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { updateTeamSettings, type TeamSettingsFormState } from "@/lib/actions/team";

const initialState: TeamSettingsFormState = {};

export function TeamSettingsForm({
  defaultValues,
}: {
  defaultValues: { name: string | null; logoUrl: string | null };
}) {
  const [state, formAction, pending] = useActionState(updateTeamSettings, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <ImageUpload
        name="logoUrl"
        bucket="team-assets"
        shape="square"
        initialUrl={defaultValues.logoUrl}
      />

      <Input
        id="name"
        name="name"
        label="Nome squadra"
        placeholder="es. ASD Provinciale"
        defaultValue={defaultValues.name ?? ""}
        error={state.fieldErrors?.name}
      />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-600">Salvato.</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Salvataggio…" : "Salva"}
      </Button>
    </form>
  );
}
