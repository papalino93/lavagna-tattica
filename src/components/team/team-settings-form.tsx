"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { KitPreview } from "./kit-preview";
import { updateTeamSettings, type TeamSettingsFormState } from "@/lib/actions/team";

const initialState: TeamSettingsFormState = {};
const DEFAULT_SHIRT = "#1f6b3a";
const DEFAULT_SHORTS = "#14201a";
const DEFAULT_SOCKS = "#14201a";

export function TeamSettingsForm({
  defaultValues,
}: {
  defaultValues: {
    name: string | null;
    logoUrl: string | null;
    primaryColor: string | null;
    secondaryColor: string | null;
    kitSocksColor: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(updateTeamSettings, initialState);
  const [color, setColor] = useState(defaultValues.primaryColor ?? DEFAULT_SHIRT);
  const [shortsColor, setShortsColor] = useState(defaultValues.secondaryColor ?? DEFAULT_SHORTS);
  const [socksColor, setSocksColor] = useState(defaultValues.kitSocksColor ?? DEFAULT_SOCKS);
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
        <label htmlFor="primaryColor" className="text-sm font-medium text-[var(--ink)]">
          Colore squadra
        </label>
        <div className="flex items-center gap-3">
          <input
            id="primaryColor"
            name="primaryColor"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-11 w-14 cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--surface-raised)] p-1"
          />
          <span className="font-mono text-sm text-[var(--ink-dim)] uppercase">{color}</span>
        </div>
        <p className="text-xs text-[var(--ink-dim)]">Usato in sidebar, bottoni e badge in tutta l&apos;app.</p>
        {state.fieldErrors?.primaryColor && (
          <p className="text-sm text-red-600">{state.fieldErrors.primaryColor}</p>
        )}
      </div>

      {/* Anteprima live: sidebar in miniatura col colore scelto */}
      <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] p-3" style={{ background: color }}>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 font-display text-sm font-bold text-white">
          {(name || "Squadra").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-display text-sm font-bold text-white">{name || "Nome squadra"}</p>
          <p className="text-xs text-white/75">Anteprima sidebar</p>
        </div>
      </div>

      {/* Kit personalizzato: maglia, pantaloncini, calzettoni */}
      <div className="border-t border-[var(--line)] pt-5">
        <h2 className="text-sm font-medium text-[var(--ink)]">Kit squadra</h2>
        <p className="mt-0.5 text-xs text-[var(--ink-dim)]">
          La maglia usa il colore squadra qui sopra; scegli pantaloncini e calzettoni.
        </p>

        <div className="mt-3 flex flex-wrap items-start gap-6">
          <KitPreview shirtColor={color} shortsColor={shortsColor} socksColor={socksColor} />

          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="secondaryColor" className="text-sm font-medium text-[var(--ink)]">
                Pantaloncini
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="secondaryColor"
                  name="secondaryColor"
                  type="color"
                  value={shortsColor}
                  onChange={(e) => setShortsColor(e.target.value)}
                  className="h-11 w-14 cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--surface-raised)] p-1"
                />
                <span className="font-mono text-sm text-[var(--ink-dim)] uppercase">{shortsColor}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="kitSocksColor" className="text-sm font-medium text-[var(--ink)]">
                Calzettoni
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="kitSocksColor"
                  name="kitSocksColor"
                  type="color"
                  value={socksColor}
                  onChange={(e) => setSocksColor(e.target.value)}
                  className="h-11 w-14 cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--surface-raised)] p-1"
                />
                <span className="font-mono text-sm text-[var(--ink-dim)] uppercase">{socksColor}</span>
              </div>
            </div>
          </div>
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
