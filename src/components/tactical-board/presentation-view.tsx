"use client";

import { useState } from "react";
import type { FieldData } from "@/lib/types/tactical";
import { FIELD_WIDTH, FIELD_HEIGHT } from "./board-constants";

export function PresentationButton({
  name,
  fieldData,
  teamLogoUrl,
}: {
  name: string;
  fieldData: FieldData;
  teamLogoUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
      >
        ▶ Presenta
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#0c2417]">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <p className="font-display text-lg font-bold text-white sm:text-xl">{name}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
              autoFocus
            >
              Chiudi ✕
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
            <div className="relative h-full max-h-full aspect-[100/150]">
              <PresentationPitch fieldData={fieldData} />
              {teamLogoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={teamLogoUrl}
                  alt=""
                  className="pointer-events-none absolute inset-0 m-auto h-1/3 w-1/3 object-contain opacity-[0.06] blur-[1px]"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PresentationPitch({ fieldData }: { fieldData: FieldData }) {
  const W = FIELD_WIDTH;
  const H = FIELD_HEIGHT;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full rounded-lg" aria-hidden="true">
      <rect x="0" y="0" width={W} height={H} fill="#15803d" />
      <rect x="2" y="2" width={W - 4} height={H - 4} fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="0.4" />
      <line x1="2" y1={H / 2} x2={W - 2} y2={H / 2} stroke="white" strokeOpacity="0.55" strokeWidth="0.4" />
      <circle cx={W / 2} cy={H / 2} r="9.15" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="0.4" />
      {[2, H - 24].map((y) => (
        <rect key={y} x={W / 2 - 22} y={y} width="44" height="22" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="0.4" />
      ))}

      {fieldData.drawings.map((d) => (
        <line
          key={d.id}
          x1={d.x1}
          y1={d.y1}
          x2={d.x2}
          y2={d.y2}
          stroke="white"
          strokeWidth="0.8"
          strokeDasharray={d.style === "tratteggiata" ? "2.2 1.6" : undefined}
          markerEnd={d.kind === "freccia" ? "url(#arrowhead)" : undefined}
        />
      ))}
      <defs>
        <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="white" />
        </marker>
      </defs>

      {fieldData.players.map((p) => (
        <g key={p.id}>
          <circle
            cx={p.x}
            cy={p.y}
            r="3.6"
            fill={p.team === "nostri" ? "white" : "#dc2626"}
            stroke={p.team === "nostri" ? "#15803d" : "white"}
            strokeWidth="0.5"
          />
          <text
            x={p.x}
            y={p.y}
            fontSize="3.2"
            fontWeight="700"
            textAnchor="middle"
            dominantBaseline="central"
            fill={p.team === "nostri" ? "#15803d" : "white"}
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
