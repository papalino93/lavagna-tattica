"use client";

import { useMemo, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BoardToolbar, type Tool } from "./board-toolbar";
import { PresentationButton } from "./presentation-view";
import { useConfirm } from "@/components/ui/confirm-provider";
import { useToast } from "@/components/ui/toast-provider";
import { createScheme, updateScheme, deleteScheme, duplicateScheme } from "@/lib/actions/tactical-schemes";
import {
  SCHEME_CATEGORIES,
  SCHEME_CATEGORY_LABELS,
  SET_PIECE_SUBCATEGORIES,
  type BoardDrawing,
  type BoardPlayer,
  type DrawingStyle,
  type FieldData,
  type SchemeCategory,
} from "@/lib/types/tactical";

const BoardCanvas = dynamic(() => import("./board-canvas").then((m) => m.BoardCanvas), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[100/150] w-full items-center justify-center rounded-lg bg-[var(--brand)]/20 text-sm text-[var(--ink-faint)]">
      Caricamento campo…
    </div>
  ),
});

interface TacticalBoardEditorProps {
  schemeId?: string;
  teamLogoUrl?: string | null;
  initial: {
    name: string;
    category: SchemeCategory;
    subcategory: string | null;
    description: string | null;
    fieldData: FieldData;
    animationFrames?: BoardPlayer[][] | null;
  };
}

export function TacticalBoardEditor({ schemeId, teamLogoUrl, initial }: TacticalBoardEditorProps) {
  const router = useRouter();
  const confirmDialog = useConfirm();
  const toast = useToast();
  const [name, setName] = useState(initial.name);
  const [category, setCategory] = useState<SchemeCategory>(initial.category);
  const [subcategory, setSubcategory] = useState(initial.subcategory ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [players, setPlayers] = useState<BoardPlayer[]>(initial.fieldData.players);
  const [drawings, setDrawings] = useState<BoardDrawing[]>(initial.fieldData.drawings);
  // Fotogrammi successivi al primo (che coincide sempre con `players`). Ogni fotogramma
  // e' uno snapshot completo: stessi giocatori, solo x/y cambiano — animazione "tasto play".
  const [extraFrames, setExtraFrames] = useState<BoardPlayer[][]>(
    (initial.animationFrames ?? []).slice(1),
  );
  const [activeFrame, setActiveFrame] = useState(0);

  const [tool, setTool] = useState<Tool>("sposta");
  const [drawingStyle, setDrawingStyle] = useState<DrawingStyle>("piena");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showOpponents, setShowOpponents] = useState(true);
  const [saving, startSaving] = useTransition();
  const [deleting, startDeleting] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const frameCount = 1 + extraFrames.length;
  const displayedPlayers = activeFrame === 0 ? players : extraFrames[activeFrame - 1];
  const onBaseFrame = activeFrame === 0;

  const nextOurLabel = useMemo(
    () => String(players.filter((p) => p.team === "nostri").length + 1),
    [players],
  );
  const nextOpponentLabel = useMemo(
    () => String(players.filter((p) => p.team === "avversari").length + 1),
    [players],
  );

  function addPlayer(team: BoardPlayer["team"]) {
    if (!onBaseFrame) {
      toast("Aggiungi giocatori solo nel fotogramma 1: negli altri si può solo spostarli.");
      return;
    }
    const count = players.filter((p) => p.team === team).length;
    const player: BoardPlayer = {
      id: crypto.randomUUID(),
      team,
      label: team === "nostri" ? nextOurLabel : nextOpponentLabel,
      x: 20 + (count % 6) * 10,
      y: team === "nostri" ? 130 : 20,
    };
    setPlayers((prev) => [...prev, player]);
    // Lo stesso giocatore compare, alla stessa posizione, in tutti i fotogrammi già creati.
    setExtraFrames((prev) => prev.map((frame) => [...frame, { ...player }]));
    setSaved(false);
  }

  function handlePlayerMove(id: string, x: number, y: number) {
    if (onBaseFrame) {
      setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)));
    } else {
      setExtraFrames((prev) =>
        prev.map((frame, i) =>
          i === activeFrame - 1 ? frame.map((p) => (p.id === id ? { ...p, x, y } : p)) : frame,
        ),
      );
    }
    setSaved(false);
  }

  function handleDrawingAdd(drawing: BoardDrawing) {
    if (!onBaseFrame) {
      toast("Le frecce e linee si disegnano solo nel fotogramma 1.");
      return;
    }
    setDrawings((prev) => [...prev, drawing]);
    setSaved(false);
  }

  function handleDeleteSelected() {
    if (!selectedId) return;
    if (!onBaseFrame) {
      toast("Rimuovi giocatori solo nel fotogramma 1.");
      return;
    }
    setPlayers((prev) => prev.filter((p) => p.id !== selectedId));
    setDrawings((prev) => prev.filter((d) => d.id !== selectedId));
    setExtraFrames((prev) => prev.map((frame) => frame.filter((p) => p.id !== selectedId)));
    setSelectedId(null);
    setSaved(false);
  }

  async function handleClear() {
    const ok = await confirmDialog({ title: "Svuotare il campo?", confirmLabel: "Svuota" });
    if (!ok) return;
    setPlayers([]);
    setDrawings([]);
    setExtraFrames([]);
    setActiveFrame(0);
    setSelectedId(null);
    setSaved(false);
  }

  function handleAddFrame() {
    const base = onBaseFrame ? players : extraFrames[activeFrame - 1];
    setExtraFrames((prev) => [...prev, base.map((p) => ({ ...p }))]);
    setActiveFrame(extraFrames.length + 1);
    setSelectedId(null);
    setSaved(false);
  }

  async function handleRemoveFrame(frameIndex: number) {
    const ok = await confirmDialog({ title: "Eliminare questo fotogramma?", confirmLabel: "Elimina" });
    if (!ok) return;
    setExtraFrames((prev) => prev.filter((_, i) => i !== frameIndex - 1));
    setActiveFrame(0);
    setSelectedId(null);
    setSaved(false);
  }

  function handleSave() {
    setError(null);
    const payload = {
      name,
      category,
      subcategory: subcategory || null,
      description: description || null,
      fieldData: { players, drawings },
      animationFrames: extraFrames.length > 0 ? [players, ...extraFrames] : null,
    };

    startSaving(async () => {
      const result = schemeId
        ? await updateScheme(schemeId, payload)
        : await createScheme(payload);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (!schemeId && result.id) {
        toast("Schema creato");
        router.push(`/lavagna/${result.id}`);
        return;
      }

      toast("Schema salvato");
      setSaved(true);
    });
  }

  function handleDuplicate() {
    if (!schemeId) return;
    startDeleting(() => {
      duplicateScheme(schemeId);
    });
  }

  async function handleDelete() {
    if (!schemeId) return;
    const ok = await confirmDialog({ title: "Eliminare questo schema?", confirmLabel: "Elimina" });
    if (!ok) return;
    startDeleting(() => {
      deleteScheme(schemeId);
    });
  }

  const liveAnimationFrames = extraFrames.length > 0 ? [players, ...extraFrames] : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <Input
            id="name"
            label="Nome schema"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaved(false);
            }}
            className="text-base font-semibold"
            required
          />
        </div>
        {/* Presenta/Play funziona anche prima di salvare, sui dati attuali dell'editor. */}
        <div className="mt-6 shrink-0">
          <PresentationButton
            name={name || "Schema"}
            fieldData={{ players, drawings }}
            animationFrames={liveAnimationFrames}
            teamLogoUrl={teamLogoUrl}
          />
        </div>
      </div>

      {/* Campo-first: strumenti e campo subito dopo il nome, prima dei dettagli meno frequenti */}
      <BoardToolbar
        tool={tool}
        onToolChange={setTool}
        style={drawingStyle}
        onStyleChange={setDrawingStyle}
        onAddPlayer={() => addPlayer("nostri")}
        onAddOpponent={() => addPlayer("avversari")}
        onDeleteSelected={handleDeleteSelected}
        hasSelection={!!selectedId}
        onClear={handleClear}
        showOpponents={showOpponents}
        onToggleOpponents={() => setShowOpponents((v) => !v)}
      />

      <BoardCanvas
        players={displayedPlayers}
        drawings={drawings}
        tool={tool}
        drawingStyle={drawingStyle}
        selectedId={selectedId}
        showOpponents={showOpponents}
        onSelect={setSelectedId}
        onPlayerMove={handlePlayerMove}
        onDrawingAdd={handleDrawingAdd}
      />

      <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--ink-dim)]">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[var(--brand)]" /> Nostri
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-600" /> Avversari
        </span>
        <span>Trascina un giocatore per riposizionarlo.</span>
      </div>

      {/* Fotogrammi: dal secondo in poi si anima il movimento con il tasto "play"
          in modalità presentazione. Il primo resta sempre la posizione di partenza. */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-sunken)] p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[var(--ink-dim)]">Fotogrammi</span>
          {Array.from({ length: frameCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setActiveFrame(i);
                setSelectedId(null);
              }}
              aria-pressed={activeFrame === i}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                activeFrame === i
                  ? "bg-[var(--brand)] text-[var(--brand-fg)]"
                  : "bg-[var(--surface-raised)] text-[var(--ink-dim)] hover:bg-[var(--surface)]"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={handleAddFrame}
            disabled={players.length === 0}
            title="Aggiungi fotogramma"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-[var(--line-strong)] text-[var(--ink-dim)] hover:bg-[var(--surface-raised)] disabled:opacity-40"
          >
            +
          </button>
          {!onBaseFrame && (
            <button
              type="button"
              onClick={() => handleRemoveFrame(activeFrame)}
              className="ml-auto text-xs font-medium text-[var(--danger)] hover:underline"
            >
              Elimina fotogramma
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-[var(--ink-dim)]">
          {frameCount === 1
            ? "Posizione di partenza. Aggiungi un fotogramma per animare i movimenti con il tasto play in presentazione."
            : onBaseFrame
              ? "Posizione di partenza."
              : "Sposta i giocatori dove devono arrivare in questo passaggio."}
        </p>
      </div>

      <div className="border-t border-[var(--line)] pt-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            id="category"
            label="Categoria"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as SchemeCategory);
              setSubcategory("");
              setSaved(false);
            }}
          >
            {SCHEME_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {SCHEME_CATEGORY_LABELS[c]}
              </option>
            ))}
          </Select>

          {category === "palla_inattiva" ? (
            <Select
              id="subcategory"
              label="Tipo di palla inattiva"
              value={SET_PIECE_SUBCATEGORIES.includes(subcategory as (typeof SET_PIECE_SUBCATEGORIES)[number]) ? subcategory : ""}
              onChange={(e) => {
                setSubcategory(e.target.value);
                setSaved(false);
              }}
            >
              <option value="">Seleziona…</option>
              {SET_PIECE_SUBCATEGORIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              id="subcategory"
              label="Etichetta (opzionale)"
              placeholder="es. Pressing alto, Ripartenza veloce…"
              value={subcategory}
              onChange={(e) => {
                setSubcategory(e.target.value);
                setSaved(false);
              }}
            />
          )}
        </div>
        <p className="mt-2 text-xs text-[var(--ink-dim)]">
          {category === "palla_inattiva"
            ? "Palla inattiva: corner, punizioni, rimesse laterali — scegli il tipo per organizzarli in libreria."
            : category === "offensivo"
              ? "Offensivo: schemi di manovra e finalizzazione a gioco fermo o in movimento."
              : "Difensivo: schemi di pressing, ripiegamento e copertura degli spazi."}
        </p>
      </div>

      <Textarea
        id="description"
        label="Spiegazione (opzionale)"
        placeholder="Cosa allena questo schema, quando usarlo, punti chiave…"
        rows={3}
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setSaved(false);
        }}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleSave} disabled={saving || !name.trim()}>
          {saving ? "Salvataggio…" : "Salva schema"}
        </Button>
        {saved && <span className="text-sm text-[var(--brand)]">Salvato.</span>}

        {schemeId && (
          <>
            <Button variant="secondary" onClick={handleDuplicate} disabled={deleting} type="button">
              Duplica
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting} type="button">
              Elimina
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
