"use client";

import { Group, Rect, Line, Circle } from "react-konva";
import { FIELD_WIDTH as W, FIELD_HEIGHT as H } from "./board-constants";

const STROKE = "rgba(255,255,255,0.55)";
const STROKE_WIDTH = 0.35;

/** Campo da calcio verticale, proporzioni realistiche, come sfondo dello Stage. */
export function Pitch() {
  return (
    <Group listening={false}>
      <Rect x={0} y={0} width={W} height={H} fill="#15803d" />

      {/* Bordo campo */}
      <Rect x={2} y={2} width={W - 4} height={H - 4} stroke={STROKE} strokeWidth={STROKE_WIDTH} />

      {/* Linea di metà campo */}
      <Line points={[2, H / 2, W - 2, H / 2]} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Circle x={W / 2} y={H / 2} radius={9.15} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Circle x={W / 2} y={H / 2} radius={0.5} fill={STROKE} />

      {/* Area di rigore + area piccola, in alto e in basso */}
      {[
        { y: 2, dir: 1 },
        { y: H - 2, dir: -1 },
      ].map(({ y, dir }) => (
        <Group key={y}>
          <Rect
            x={W / 2 - 22}
            y={dir === 1 ? y : y - 22}
            width={44}
            height={22}
            stroke={STROKE}
            strokeWidth={STROKE_WIDTH}
          />
          <Rect
            x={W / 2 - 10}
            y={dir === 1 ? y : y - 8}
            width={20}
            height={8}
            stroke={STROKE}
            strokeWidth={STROKE_WIDTH}
          />
          <Circle x={W / 2} y={y + dir * 13.5} radius={0.5} fill={STROKE} />
          <Rect x={W / 2 - 3.66} y={dir === 1 ? -0.6 : H - 1.4} width={7.32} height={2} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
        </Group>
      ))}
    </Group>
  );
}
