"use client";

import { useMemo, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BoardToolbar, type Tool } from "./board-toolbar";
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
    <div className="flex aspect-[100/150] w-full items-center justify-center rounded-lg bg-[var(--brand)]/20 text-sm text-zinc-400">
      Caricamento campo…
    </div>
  ),
});

interface TacticalBoardEditorProps {
  schemeId?: string;
  initial: {
    name: string;
    category: SchemeCategory;
    subcategory: string | null;
    description: string | null;
    fieldData: FieldData;
  };
}

export function TacticalBoardEditor({ schemeId, initial }: TacticalBoardEditorProps) {
  const router = useRouter();
  const confirmDialog = useConfirm();
  const toast = useToast();
  const [name, setName] = useState(initial.name);
  const [category, setCategory] = useState<SchemeCategory>(initial.category);
  const [subcategory, setSubcategory] = useState(initial.subcategory ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [players, setPlayers] = useState<BoardPlayer[]>(initial.fieldData.players);
  const [drawings, setDrawings] = useState<BoardDrawing[]>(initial.fieldData.drawings);

  const [tool, setTool] = useState<Tool>("sposta");
  const [drawingStyle, setDrawingStyle] = useState<DrawingStyle>("piena");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showOpponents, setShowOpponents] = useState(true);
  const [saving, startSaving] = useTransition();
  const [deleting, startDeleting] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const nextOurLabel = useMemo(
    () => String(players.filter((p) => p.team === "nostri").length + 1),
    [players],
  );
  const nextOpponentLabel = useMemo(
    () => String(players.filter((p) => p.team === "avversari").length + 1),
    [players],
  );

  function addPlayer(team: BoardPlayer["team"]) {
    const count = players.filter((p) => p.team === team).length;
    const player: BoardPlayer = {
      id: crypto.randomUUID(),
      team,
      label: team === "nostri" ? nextOurLabel : nextOpponentLabel,
      x: 20 + (count % 6) * 10,
      y: team === "nostri" ? 130 : 20,
    };
    setPlayers((prev) => [...prev, player]);
    setSaved(false);
  }

  function handlePlayerMove(id: string, x: number, y: number) {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)));
    setSaved(false);
  }

  function handleDrawingAdd(drawing: BoardDrawing) {
    setDrawings((prev) => [...prev, drawing]);
    setSaved(false);
  }

  function handleDeleteSelected() {
    if (!selectedId) return;
    setPlayers((prev) => prev.filter((p) => p.id !== selectedId));
    setDrawings((prev) => prev.filter((d) => d.id !== selectedId));
    setSelectedId(null);
    setSaved(false);
  }

  async function handleClear() {
    const ok = await confirmDialog({ title: "Svuotare il campo?", confirmLabel: "Svuota" });
    if (!ok) return;
    setPlayers([]);
    setDrawings([]);
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

  return (
    <div className="flex flex-col gap-5">
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
        players={players}
        drawings={drawings}
        tool={tool}
        drawingStyle={drawingStyle}
        selectedId={selectedId}
        showOpponents={showOpponents}
        onSelect={setSelectedId}
        onPlayerMove={handlePlayerMove}
        onDrawingAdd={handleDrawingAdd}
      />

      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[var(--brand)]" /> Nostri
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-600" /> Avversari
        </span>
        <span>Trascina un giocatore per riposizionarlo.</span>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-zinc-200 pt-5 sm:grid-cols-2">
        <Select
          id="category"
          label="Categoria"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as SchemeCategory);
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
            label="Sottocategoria"
            value={SET_PIECE_SUBCATEGORIES.includes(subcategory as (typeof SET_PIECE_SUBCATEGORIES)[number]) ? subcategory : ""}
            onChange={(e) => {
              setSubcategory(e.target.value);
              setSaved(false);
            }}
          >
            <option value="">—</option>
            {SET_PIECE_SUBCATEGORIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            id="subcategory"
            label="Sottocategoria (opzionale)"
            value={subcategory}
            onChange={(e) => {
              setSubcategory(e.target.value);
              setSaved(false);
            }}
          />
        )}
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
