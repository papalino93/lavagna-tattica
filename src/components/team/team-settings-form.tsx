"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { updateTeamSettings, type TeamSettingsFormState } from "@/lib/actions/team";

const initialState: TeamSettingsFormState = {};
const DEFAULT_COLOR = "#1f6b3a";

export function TeamSettingsForm({
  defaultValues,
}: {
  defaultValues: { name: string | null; logoUrl: string | null; primaryColor: string | null };
}) {
  const [state, formAction, pending] = useActionState(updateTeamSettings, initialState);
  const [color, setColor] = useState(defaultValues.primaryColor ?? DEFAULT_COLOR);
  const [name, setName] = useState(defaultValues.name ?? "");

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
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={state.fieldErrors?.name}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="primaryColor" className="text-sm font-medium text-zinc-700">
          Colore squadra
        </label>
        <div className="flex items-center gap-3">
          <input
            id="primaryColor"
            name="primaryColor"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-11 w-14 cursor-pointer rounded-lg border border-zinc-300 bg-white p-1"
          />
          <span className="font-mono text-sm text-zinc-500 uppercase">{color}</span>
        </div>
        {state.fieldErrors?.primaryColor && (
          <p className="text-sm text-red-600">{state.fieldErrors.primaryColor}</p>
        )}
      </div>

      {/* Anteprima live: sidebar in miniatura col colore scelto */}
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3" style={{ background: color }}>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 font-display text-sm font-bold text-white">
          {(name || "Squadra").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-display text-sm font-bold text-white">{name || "Nome squadra"}</p>
          <p className="text-xs text-white/75">Anteprima sidebar</p>
        </div>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-[var(--brand)]">Salvato.</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Salvataggio…" : "Salva"}
      </Button>
    </form>
  );
}
