export type BoardTeam = "nostri" | "avversari";
export type DrawingKind = "freccia" | "linea";
export type DrawingStyle = "piena" | "tratteggiata";

export interface BoardPlayer {
  id: string;
  team: BoardTeam;
  /** Percentuali 0-100 rispetto al campo. */
  x: number;
  y: number;
  label: string;
}

export interface BoardDrawing {
  id: string;
  kind: DrawingKind;
  style: DrawingStyle;
  /** Percentuali 0-100: punto di partenza e di arrivo. */
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface FieldData {
  players: BoardPlayer[];
  drawings: BoardDrawing[];
}

export const EMPTY_FIELD_DATA: FieldData = { players: [], drawings: [] };

export const SCHEME_CATEGORIES = ["palla_inattiva", "offensivo", "difensivo"] as const;
export type SchemeCategory = (typeof SCHEME_CATEGORIES)[number];

export const SCHEME_CATEGORY_LABELS: Record<SchemeCategory, string> = {
  palla_inattiva: "Palla inattiva",
  offensivo: "Offensivo",
  difensivo: "Difensivo",
};

export const SET_PIECE_SUBCATEGORIES = [
  "Corner",
  "Punizione laterale",
  "Punizione centrale",
  "Rimessa laterale",
] as const;
