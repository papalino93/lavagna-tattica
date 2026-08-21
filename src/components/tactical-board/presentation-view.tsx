"use client";

import { useEffect, useRef, useState } from "react";
import type { BoardPlayer, FieldData } from "@/lib/types/tactical";
import { FIELD_WIDTH, FIELD_HEIGHT } from "./board-constants";

const FRAME_DURATION_MS = 900;

export function PresentationButton({
  name,
  fieldData,
  animationFrames,
  teamLogoUrl,
}: {
  name: string;
  fieldData: FieldData;
  animationFrames?: BoardPlayer[][] | null;
  teamLogoUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const hasAnimation = !!animationFrames && animationFrames.length > 1;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-[var(--line-strong)] px-3 py-1.5 text-sm font-medium text-[var(--ink)] hover:bg-[var(--surface)]"
      >
        ▶ Presenta
      </button>
      {open && (
        <PresentationOverlay
          name={name}
          fieldData={fieldData}
          animationFrames={hasAnimation ? animationFrames! : null}
          teamLogoUrl={teamLogoUrl}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function PresentationOverlay({
  name,
  fieldData,
  animationFrames,
  teamLogoUrl,
  onClose,
}: {
  name: string;
  fieldData: FieldData;
  animationFrames: BoardPlayer[][] | null;
  teamLogoUrl?: string | null;
  onClose: () => void;
}) {
  const { players: displayPlayers, playing, play } = useFramePlayback(
    fieldData.players,
    animationFrames,
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0c2417]">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <p className="font-display text-lg font-bold text-white sm:text-xl">{name}</p>
        <div className="flex items-center gap-2">
          {animationFrames && (
            <button
              type="button"
              onClick={play}
              disabled={playing}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0c2417] disabled:opacity-60"
            >
              {playing ? "In riproduzione…" : "▶ Play"}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
            autoFocus
          >
            Chiudi ✕
          </button>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
        <div className="relative h-full max-h-full aspect-[100/150]">
          <PresentationPitch fieldData={fieldData} players={displayPlayers} />
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
  );
}

/** Anima i giocatori attraverso i fotogrammi via requestAnimationFrame, interpolando
 * x/y per id tra un fotogramma e il successivo. Le frecce/linee restano fisse. */
function useFramePlayback(basePlayers: BoardPlayer[], frames: BoardPlayer[][] | null) {
  const [players, setPlayers] = useState<BoardPlayer[]>(basePlayers);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function play() {
    if (!frames || frames.length < 2 || playing) return;
    setPlaying(true);

    let segment = 0;

    function runSegment() {
      const from = frames![segment];
      const to = frames![segment + 1];
      const start = performance.now();

      function step(now: number) {
        const t = Math.min(1, (now - start) / FRAME_DURATION_MS);
        setPlayers(
          to.map((target) => {
            const origin = from.find((p) => p.id === target.id);
            if (!origin) return target;
            return { ...target, x: origin.x + (target.x - origin.x) * t, y: origin.y + (target.y - origin.y) * t };
          }),
        );
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
          return;
        }
        segment += 1;
        if (segment < frames!.length - 1) {
          rafRef.current = requestAnimationFrame(runSegment);
        } else {
          setPlaying(false);
        }
      }
      rafRef.current = requestAnimationFrame(step);
    }

    setPlayers(frames[0]);
    rafRef.current = requestAnimationFrame(runSegment);
  }

  return { players, playing, play };
}

function PresentationPitch({ fieldData, players }: { fieldData: FieldData; players: BoardPlayer[] }) {
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

      {players.map((p) => (
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
