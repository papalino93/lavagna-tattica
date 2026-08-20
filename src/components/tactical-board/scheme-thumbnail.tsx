import type { FieldData } from "@/lib/types/tactical";

/**
 * Anteprima statica e leggera di uno schema, in SVG puro (nessun Konva):
 * generata dagli stessi dati dello schema, non un'immagine salvata a parte.
 */
export function SchemeThumbnail({ fieldData }: { fieldData: FieldData | null }) {
  const players = fieldData?.players ?? [];
  const drawings = fieldData?.drawings ?? [];

  return (
    <svg viewBox="0 0 100 150" className="h-full w-full" aria-hidden="true">
      <rect x="0" y="0" width="100" height="150" fill="var(--brand)" opacity="0.9" />
      <rect x="2" y="2" width="96" height="146" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="0.6" />
      <line x1="2" y1="75" x2="98" y2="75" stroke="white" strokeOpacity="0.4" strokeWidth="0.6" />
      <circle cx="50" cy="75" r="9" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="0.6" />

      {drawings.map((d) => (
        <line
          key={d.id}
          x1={d.x1}
          y1={d.y1}
          x2={d.x2}
          y2={d.y2}
          stroke="white"
          strokeWidth="1"
          strokeDasharray={d.style === "tratteggiata" ? "3 2" : undefined}
          opacity="0.85"
        />
      ))}

      {players.map((p) => (
        <circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r="3.4"
          fill={p.team === "nostri" ? "white" : "#dc2626"}
          stroke={p.team === "nostri" ? "var(--brand)" : "white"}
          strokeWidth="0.6"
        />
      ))}
    </svg>
  );
}
