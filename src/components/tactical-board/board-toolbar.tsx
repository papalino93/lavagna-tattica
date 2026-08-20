"use client";

import type { DrawingKind, DrawingStyle } from "@/lib/types/tactical";

export type Tool = "sposta" | DrawingKind;

interface BoardToolbarProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  style: DrawingStyle;
  onStyleChange: (style: DrawingStyle) => void;
  onAddPlayer: () => void;
  onAddOpponent: () => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
  onClear: () => void;
  showOpponents: boolean;
  onToggleOpponents: () => void;
}

export function BoardToolbar({
  tool,
  onToolChange,
  style,
  onStyleChange,
  onAddPlayer,
  onAddOpponent,
  onDeleteSelected,
  hasSelection,
  onClear,
  showOpponents,
  onToggleOpponents,
}: BoardToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <ToolbarButton onClick={onAddPlayer}>+ Giocatore</ToolbarButton>
        <ToolbarButton onClick={onAddOpponent}>+ Avversario</ToolbarButton>
      </div>

      <label className="flex w-fit items-center gap-2 text-xs font-medium text-zinc-500">
        <input
          type="checkbox"
          checked={showOpponents}
          onChange={onToggleOpponents}
          className="h-4 w-4 accent-[var(--brand)]"
        />
        Mostra avversari
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-zinc-500">Strumento</span>
        <SegmentedButton active={tool === "sposta"} onClick={() => onToolChange("sposta")}>
          Sposta
        </SegmentedButton>
        <SegmentedButton active={tool === "freccia"} onClick={() => onToolChange("freccia")}>
          Freccia
        </SegmentedButton>
        <SegmentedButton active={tool === "linea"} onClick={() => onToolChange("linea")}>
          Linea
        </SegmentedButton>
      </div>

      {(tool === "freccia" || tool === "linea") && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-zinc-500">Stile</span>
          <SegmentedButton active={style === "piena"} onClick={() => onStyleChange("piena")}>
            Piena
          </SegmentedButton>
          <SegmentedButton
            active={style === "tratteggiata"}
            onClick={() => onStyleChange("tratteggiata")}
          >
            Tratteggiata
          </SegmentedButton>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <ToolbarButton onClick={onDeleteSelected} disabled={!hasSelection} tone="danger">
          Elimina selezionato
        </ToolbarButton>
        <ToolbarButton onClick={onClear} tone="ghost">
          Svuota campo
        </ToolbarButton>
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  disabled,
  tone = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger" | "ghost";
}) {
  const toneClasses =
    tone === "danger"
      ? "border-red-200 text-red-600 hover:bg-red-50"
      : tone === "ghost"
        ? "border-zinc-200 text-zinc-500 hover:bg-zinc-50"
        : "border-zinc-300 text-zinc-700 hover:bg-zinc-50";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${toneClasses}`}
    >
      {children}
    </button>
  );
}

function SegmentedButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active ? "bg-[var(--brand)] text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}
