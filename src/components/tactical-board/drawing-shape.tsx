"use client";

import { Arrow, Line } from "react-konva";
import type { BoardDrawing } from "@/lib/types/tactical";

interface DrawingShapeProps {
  drawing: BoardDrawing;
  selected: boolean;
  onSelect: () => void;
}

export function DrawingShape({ drawing, selected, onSelect }: DrawingShapeProps) {
  const points = [drawing.x1, drawing.y1, drawing.x2, drawing.y2];
  const dash = drawing.style === "tratteggiata" ? [2.2, 1.6] : undefined;
  const color = selected ? "#facc15" : "white";
  const props = {
    points,
    stroke: color,
    strokeWidth: 0.7,
    dash,
    hitStrokeWidth: 6,
    onClick: onSelect,
    onTap: onSelect,
  };

  return drawing.kind === "freccia" ? (
    <Arrow {...props} fill={color} pointerLength={2.6} pointerWidth={2.4} />
  ) : (
    <Line {...props} />
  );
}
