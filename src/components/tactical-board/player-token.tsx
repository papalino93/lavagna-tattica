"use client";

import { Group, Circle, Text } from "react-konva";
import type Konva from "konva";
import type { BoardPlayer } from "@/lib/types/tactical";
import { FIELD_WIDTH, FIELD_HEIGHT, PLAYER_RADIUS } from "./board-constants";

const TEAM_COLOR: Record<BoardPlayer["team"], string> = {
  nostri: "#059669",
  avversari: "#dc2626",
};

interface PlayerTokenProps {
  player: BoardPlayer;
  selected: boolean;
  draggable: boolean;
  onSelect: () => void;
  onChange: (x: number, y: number) => void;
}

export function PlayerToken({ player, selected, draggable, onSelect, onChange }: PlayerTokenProps) {
  function handleDragMove(e: Konva.KonvaEventObject<DragEvent>) {
    const node = e.target;
    const x = clamp(node.x(), PLAYER_RADIUS, FIELD_WIDTH - PLAYER_RADIUS);
    const y = clamp(node.y(), PLAYER_RADIUS, FIELD_HEIGHT - PLAYER_RADIUS);
    node.x(x);
    node.y(y);
  }

  function handleDragEnd(e: Konva.KonvaEventObject<DragEvent>) {
    onChange(e.target.x(), e.target.y());
  }

  return (
    <Group
      x={player.x}
      y={player.y}
      draggable={draggable}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onClick={onSelect}
      onTap={onSelect}
    >
      {selected && (
        <Circle radius={PLAYER_RADIUS + 1} stroke="#facc15" strokeWidth={0.6} />
      )}
      <Circle radius={PLAYER_RADIUS} fill={TEAM_COLOR[player.team]} stroke="white" strokeWidth={0.3} />
      <Text
        text={player.label}
        fontSize={3.2}
        fontStyle="bold"
        fill="white"
        width={PLAYER_RADIUS * 2}
        height={PLAYER_RADIUS * 2}
        offsetX={PLAYER_RADIUS}
        offsetY={PLAYER_RADIUS}
        align="center"
        verticalAlign="middle"
        listening={false}
      />
    </Group>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
