"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import type Konva from "konva";
import { Pitch } from "./pitch";
import { PlayerToken } from "./player-token";
import { DrawingShape } from "./drawing-shape";
import { FIELD_WIDTH, FIELD_HEIGHT } from "./board-constants";
import type { BoardDrawing, BoardPlayer, DrawingStyle } from "@/lib/types/tactical";
import type { Tool } from "./board-toolbar";

interface BoardCanvasProps {
  players: BoardPlayer[];
  drawings: BoardDrawing[];
  tool: Tool;
  drawingStyle: DrawingStyle;
  selectedId: string | null;
  showOpponents: boolean;
  onSelect: (id: string | null) => void;
  onPlayerMove: (id: string, x: number, y: number) => void;
  onDrawingAdd: (drawing: BoardDrawing) => void;
}

export function BoardCanvas({
  players,
  drawings,
  tool,
  drawingStyle,
  selectedId,
  showOpponents,
  onSelect,
  onPlayerMove,
  onDrawingAdd,
}: BoardCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);
  const [pending, setPending] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(
    null,
  );

  useEffect(() => {
    function measure() {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const scale = width / FIELD_WIDTH;
  const height = FIELD_HEIGHT * scale;
  const drawingMode = tool === "freccia" || tool === "linea";

  function handleStagePointerDown(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    if (drawingMode) {
      setPending({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
      return;
    }

    if (e.target === stage) {
      onSelect(null);
    }
  }

  function handleStagePointerMove(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    if (!pending) return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;
    setPending({ ...pending, x2: pos.x, y2: pos.y });
  }

  function handleStagePointerUp() {
    if (!pending) return;
    const distance = Math.hypot(pending.x2 - pending.x1, pending.y2 - pending.y1);
    if (distance > 2) {
      onDrawingAdd({
        id: crypto.randomUUID(),
        kind: tool === "freccia" ? "freccia" : "linea",
        style: drawingStyle,
        ...pending,
      });
    }
    setPending(null);
  }

  return (
    <div ref={containerRef} className="w-full overflow-hidden rounded-lg">
      <Stage
        width={width}
        height={height}
        scale={{ x: scale, y: scale }}
        onMouseDown={handleStagePointerDown}
        onMouseMove={handleStagePointerMove}
        onMouseUp={handleStagePointerUp}
        onTouchStart={handleStagePointerDown}
        onTouchMove={handleStagePointerMove}
        onTouchEnd={handleStagePointerUp}
      >
        <Layer>
          <Pitch />

          {drawings.map((d) => (
            <DrawingShape
              key={d.id}
              drawing={d}
              selected={selectedId === d.id}
              onSelect={() => !drawingMode && onSelect(d.id)}
            />
          ))}

          {pending && (
            <DrawingShape
              drawing={{ id: "pending", kind: tool === "freccia" ? "freccia" : "linea", style: drawingStyle, ...pending }}
              selected={false}
              onSelect={() => {}}
            />
          )}

          {players
            .filter((p) => showOpponents || p.team === "nostri")
            .map((p) => (
              <PlayerToken
                key={p.id}
                player={p}
                selected={selectedId === p.id}
                draggable={!drawingMode}
                onSelect={() => !drawingMode && onSelect(p.id)}
                onChange={(x, y) => onPlayerMove(p.id, x, y)}
              />
            ))}
        </Layer>
      </Stage>
    </div>
  );
}
