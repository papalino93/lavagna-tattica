"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { updateTeamSettings } from "@/lib/actions/team";
import { addOnboardingPlayers } from "@/lib/actions/players";
import { PLAYER_ROLES } from "@/lib/types/domain";

const DEFAULT_COLOR = "#1f6b3a";
const TOTAL_STEPS = 3;

type PlayerRow = { name: string; role: string };

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [teamName, setTeamName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [rows, setRows] = useState<PlayerRow[]>([
    { name: "", role: "Portiere" },
    { name: "", role: "Difensore" },
    { name: "", role: "Centrocampista" },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  function updateRow(index: number, patch: Partial<PlayerRow>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { name: "", role: "Difensore" }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function handleStep1Next() {
    setError(null);
    if (!teamName.trim()) {
      setError("Inserisci il nome della squadra.");
      return;
    }
    const formData = new FormData();
    formData.set("name", teamName.trim());
    formData.set("primaryColor", color);
    if (logoUrl) formData.set("logoUrl", logoUrl);

    startSaving(async () => {
      const result = await updateTeamSettings({}, formData);
      if (result.error || result.fieldErrors) {
        setError(result.error ?? "Controlla i dati inseriti.");
        return;
      }
      setStep(2);
    });
  }

  function handleStep2Next() {
    setError(null);
    startSaving(async () => {
      const result = await addOnboardingPlayers(rows);
      if (result.error) {
        setError(result.error);
        return;
      }
      setStep(3);
    });
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-[var(--brand)]" : "bg-[var(--surface-sunken)]"}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--ink)]">La tua squadra</h1>
            <p className="mt-1 text-sm text-[var(--ink-dim)]">
              Nome, stemma e colori: si vedono subito in tutta l&apos;app.
            </p>
          </div>

          <ImageUpload name="logoUrl" bucket="team-assets" shape="square" initialUrl={logoUrl} onUploaded={setLogoUrl} />

          <Input
            id="onboarding-name"
            label="Nome squadra"
            placeholder="es. ASD Provinciale"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            error={error ?? undefined}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="onboarding-color" className="text-sm font-medium text-[var(--ink)]">
              Colore squadra
            </label>
            <div className="flex items-center gap-3">
              <input
                id="onboarding-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-11 w-14 cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--surface-raised)] p-1"
              />
              <span className="font-mono text-sm uppercase text-[var(--ink-dim)]">{color}</span>
            </div>
          </div>

          <div
            className="flex items-center gap-3 rounded-xl border border-[var(--line)] p-3"
            style={{ background: color }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 font-display text-sm font-bold text-white">
              {(teamName || "Squadra").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-display text-sm font-bold text-white">{teamName || "Nome squadra"}</p>
              <p className="text-xs text-white/75">Anteprima sidebar</p>
            </div>
          </div>

          <Button onClick={handleStep1Next} disabled={saving}>
            {saving ? "Salvataggio…" : "Avanti"}
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--ink)]">Primi giocatori</h1>
            <p className="mt-1 text-sm text-[var(--ink-dim)]">
              Anche solo nome e ruolo: foto e dettagli si aggiungono con calma dopo.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={row.name}
                  onChange={(e) => updateRow(i, { name: e.target.value })}
                  placeholder="Nome giocatore"
                  className="flex-1 rounded-lg border border-[var(--line-strong)] bg-[var(--surface-raised)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-ring)]"
                />
                <select
                  value={row.role}
                  onChange={(e) => updateRow(i, { role: e.target.value })}
                  className="rounded-lg border border-[var(--line-strong)] bg-[var(--surface-raised)] px-2 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)]"
                >
                  {PLAYER_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  aria-label="Rimuovi riga"
                  className="shrink-0 rounded-lg px-2 py-2 text-[var(--ink-faint)] hover:bg-[var(--surface-sunken)] hover:text-[var(--danger)]"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="self-start text-sm font-medium text-[var(--brand-hover)] hover:underline"
          >
            + Aggiungi un altro
          </button>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-3">
            <Button onClick={handleStep2Next} disabled={saving}>
              {saving ? "Salvataggio…" : "Avanti"}
            </Button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-sm text-[var(--ink-dim)] hover:underline"
            >
              Salta per ora
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
            style={{ background: "var(--brand-soft)" }}
          >
            ⚽️
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--ink)]">
            Benvenuto nella tua Lavagna Tattica.
          </h1>
          <p className="text-sm text-[var(--ink-dim)]">
            Tutto è pronto: rosa, allenamenti, partite e lavagna tattica ti aspettano.
          </p>
          <Button onClick={() => router.push("/dashboard")} className="mt-2">
            Vai alla dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
