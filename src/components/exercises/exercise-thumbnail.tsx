import type { ExerciseCategory, Intensity } from "@/lib/types/domain";

/**
 * Anteprima statica in SVG puro per un esercizio: gli esercizi non hanno dati
 * di campo (a differenza degli schemi, vedi SchemeThumbnail), quindi qui si
 * disegna un'icona rappresentativa della categoria su uno sfondo "da campo",
 * cosi ogni card in libreria si distingue dalle altre invece di mostrare
 * sempre la stessa icona generica.
 */
export function ExerciseThumbnail({
  category,
  intensity,
}: {
  category: ExerciseCategory;
  intensity?: Intensity | null;
}) {
  return (
    <svg viewBox="0 0 100 150" className="h-full w-full" aria-hidden="true">
      <rect x="0" y="0" width="100" height="150" fill="var(--brand)" opacity="0.9" />
      <rect x="2" y="2" width="96" height="146" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="0.6" />
      <line x1="2" y1="75" x2="98" y2="75" stroke="white" strokeOpacity="0.4" strokeWidth="0.6" />
      <circle cx="50" cy="75" r="9" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="0.6" />

      <CategoryIcon category={category} />

      {intensity && (
        <circle cx="88" cy="12" r="4" fill={INTENSITY_DOT[intensity]} stroke="white" strokeWidth="0.8" />
      )}
    </svg>
  );
}

const INTENSITY_DOT: Record<Intensity, string> = {
  bassa: "#34d399",
  media: "#fbbf24",
  alta: "#f87171",
};

/** Punto su una circonferenza di centro (cx, cy) e raggio r, ad un dato angolo (gradi, 0 = in alto). */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function Dots({ cx, cy, r, count, fill }: { cx: number; cy: number; r: number; count: number; fill: string }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const { x, y } = polar(cx, cy, r, (360 / count) * i);
        return <circle key={i} cx={x} cy={y} r="3" fill={fill} />;
      })}
    </>
  );
}

function CategoryIcon({ category }: { category: ExerciseCategory }) {
  const cx = 50;
  const cy = 68;
  const stroke = "white";

  switch (category) {
    case "riscaldamento":
      // Sole/energia: cerchio centrale con raggi.
      return (
        <g stroke={stroke} strokeWidth="1.6" strokeLinecap="round" fill="none">
          <circle cx={cx} cy={cy} r="7" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = polar(cx, cy, 11, (360 / 8) * i);
            const b = polar(cx, cy, 15, (360 / 8) * i);
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
          })}
        </g>
      );

    case "tecnica_individuale":
      // Dribbling: linea ondulata con la palla in punta.
      return (
        <g fill="none">
          <circle cx={cx - 15} cy={cy + 16} r="3.4" fill={stroke} />
          <path
            d={`M${cx - 15},${cy + 16} Q${cx - 5},${cy - 6} ${cx + 5},${cy} T${cx + 16},${cy - 16}`}
            stroke={stroke}
            strokeWidth="1.6"
            strokeDasharray="1 3"
            strokeLinecap="round"
          />
          <circle cx={cx + 16} cy={cy - 16} r="3.4" fill={stroke} />
        </g>
      );

    case "passaggi":
      // Due giocatori collegati da un passaggio con freccia.
      return (
        <g stroke={stroke} strokeWidth="1.8" strokeLinecap="round">
          <circle cx={cx - 16} cy={cy + 14} r="3.6" fill={stroke} stroke="none" />
          <circle cx={cx + 16} cy={cy - 14} r="3.6" fill={stroke} stroke="none" />
          <line x1={cx - 12} y1={cy + 10} x2={cx + 10} y2={cy - 10} />
          <path d={`M${cx + 5},${cy - 13} L${cx + 10},${cy - 10} L${cx + 6},${cy - 5}`} fill="none" />
        </g>
      );

    case "rondo":
      // Cerchio di giocatori attorno alla palla centrale.
      return (
        <g>
          <Dots cx={cx} cy={cy} r={16} count={6} fill={stroke} />
          <circle cx={cx} cy={cy} r="2.6" fill="#dc2626" />
        </g>
      );

    case "possesso":
      // Freccia circolare: la squadra fa girare palla.
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round">
          <path d={`M${cx - 12},${cy - 8} A14 14 0 1 1 ${cx - 12},${cy + 8}`} />
          <path d={`M${cx - 17},${cy - 3} L${cx - 12},${cy - 8} L${cx - 7},${cy - 4}`} />
        </g>
      );

    case "pressing":
      // Frecce convergenti verso la palla centrale.
      return (
        <g stroke={stroke} strokeWidth="1.8" strokeLinecap="round">
          <circle cx={cx} cy={cy} r="2.4" fill={stroke} stroke="none" />
          {[45, 135, 225, 315].map((deg) => {
            const a = polar(cx, cy, 17, deg);
            const b = polar(cx, cy, 6, deg);
            return <line key={deg} x1={a.x} y1={a.y} x2={b.x} y2={b.y} markerEnd="none" />;
          })}
        </g>
      );

    case "costruzione":
      // Progressione a "cheveron" verso l'alto.
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M${cx - 10},${cy + 16} L${cx},${cy + 8} L${cx + 10},${cy + 16}`} />
          <path d={`M${cx - 10},${cy + 4} L${cx},${cy - 4} L${cx + 10},${cy + 4}`} />
          <path d={`M${cx - 10},${cy - 8} L${cx},${cy - 16} L${cx + 10},${cy - 8}`} />
        </g>
      );

    case "attacco":
      // Freccia decisa verso la porta avversaria.
      return (
        <g fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1={cx} y1={cy + 16} x2={cx} y2={cy - 12} />
          <path d={`M${cx - 8},${cy - 6} L${cx},${cy - 16} L${cx + 8},${cy - 6}`} />
        </g>
      );

    case "finalizzazione": {
      // Porta con la palla che entra in rete.
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round">
          <path d={`M${cx - 12},${cy - 16} L${cx - 12},${cy} L${cx + 12},${cy} L${cx + 12},${cy - 16}`} />
          <path d={`M${cx - 12},${cy - 16} L${cx + 12},${cy - 16}`} />
          <line x1={cx - 6} y1={cy - 16} x2={cx - 6} y2={cy} strokeOpacity="0.5" strokeWidth="0.8" />
          <line x1={cx} y1={cy - 16} x2={cx} y2={cy} strokeOpacity="0.5" strokeWidth="0.8" />
          <line x1={cx + 6} y1={cy - 16} x2={cx + 6} y2={cy} strokeOpacity="0.5" strokeWidth="0.8" />
          <circle cx={cx} cy={cy + 12} r="3" fill={stroke} stroke="none" />
        </g>
      );
    }

    case "transizione_offensiva":
      // Da orizzontale (recupero) a verticale (attacco): freccia che svolta verso l'alto.
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M${cx - 16},${cy + 10} L${cx},${cy + 10} L${cx},${cy - 12}`} />
          <path d={`M${cx - 6},${cy - 6} L${cx},${cy - 16} L${cx + 6},${cy - 6}`} />
        </g>
      );

    case "transizione_difensiva":
      // Da attacco perso a rientro: freccia che svolta verso il basso.
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M${cx + 16},${cy - 10} L${cx},${cy - 10} L${cx},${cy + 12}`} />
          <path d={`M${cx - 6},${cy + 6} L${cx},${cy + 16} L${cx + 6},${cy + 6}`} />
        </g>
      );

    case "difesa":
      // Scudo.
      return (
        <path
          d={`M${cx},${cy - 16} L${cx + 11},${cy - 11} V${cy + 2} C${cx + 11},${cy + 12} ${cx},${cy + 17} ${cx},${cy + 17} C${cx},${cy + 17} ${cx - 11},${cy + 12} ${cx - 11},${cy + 2} V${cy - 11} Z`}
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      );

    case "superiorita_numerica":
      // Superiorità: tre compagni contro un avversario isolato.
      return (
        <g>
          <circle cx={cx - 13} cy={cy - 10} r="3.4" fill={stroke} />
          <circle cx={cx - 13} cy={cy + 10} r="3.4" fill={stroke} />
          <circle cx={cx - 2} cy={cy} r="3.4" fill={stroke} />
          <circle cx={cx + 15} cy={cy} r="3.4" fill="#dc2626" />
        </g>
      );

    case "inferiorita_numerica":
      // Inferiorità: un compagno contro tre avversari.
      return (
        <g>
          <circle cx={cx - 15} cy={cy} r="3.4" fill={stroke} />
          <circle cx={cx + 2} cy={cy} r="3.4" fill="#dc2626" />
          <circle cx={cx + 13} cy={cy - 10} r="3.4" fill="#dc2626" />
          <circle cx={cx + 13} cy={cy + 10} r="3.4" fill="#dc2626" />
        </g>
      );

    case "small_sided_game":
      // Mini campo orizzontale con due piccole porte.
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round">
          <rect x={cx - 20} y={cy - 10} width="40" height="20" rx="1.5" />
          <line x1={cx} y1={cy - 10} x2={cx} y2={cy + 10} strokeOpacity="0.6" />
          <rect x={cx - 22} y={cy - 4} width="3" height="8" />
          <rect x={cx + 19} y={cy - 4} width="3" height="8" />
          <circle cx={cx - 8} cy={cy} r="2.2" fill={stroke} stroke="none" />
          <circle cx={cx + 8} cy={cy} r="2.2" fill="#dc2626" stroke="none" />
        </g>
      );

    case "partita_a_tema":
      // Bandierina d'angolo: il "tema" della partita.
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1={cx - 12} y1={cy - 17} x2={cx - 12} y2={cy + 17} />
          <path d={`M${cx - 12},${cy - 17} L${cx + 8},${cy - 11} L${cx - 12},${cy - 5} Z`} fill={stroke} stroke="none" />
        </g>
      );

    default:
      return null;
  }
}
