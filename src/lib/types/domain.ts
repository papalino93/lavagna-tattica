export const PLAYER_ROLES = [
  "Portiere",
  "Difensore",
  "Centrocampista",
  "Attaccante",
] as const;
export type PlayerRole = (typeof PLAYER_ROLES)[number];

export const PLAYER_STATUSES = [
  "attivo",
  "infortunato",
  "squalificato",
  "altro",
] as const;
export type PlayerStatus = (typeof PLAYER_STATUSES)[number];

export const PLAYER_STATUS_LABELS: Record<PlayerStatus, string> = {
  attivo: "Attivo",
  infortunato: "Infortunato",
  squalificato: "Squalificato",
  altro: "Altro",
};

export const PLAYER_STATUS_TONE: Record<PlayerStatus, "emerald" | "amber" | "red" | "zinc"> = {
  attivo: "emerald",
  infortunato: "red",
  squalificato: "amber",
  altro: "zinc",
};

export interface FormationSlot {
  code: string;
  label: string;
  /** Percentuali 0-100 sul campo, origine in alto a sinistra. */
  x: number;
  y: number;
}

/**
 * Moduli più comuni per il calcio a 11. Coordinate pensate per un campo
 * verticale (porta in basso = nostra squadra attacca verso l'alto).
 */
export const FORMATION_MODULES: Record<string, FormationSlot[]> = {
  "4-3-3": [
    { code: "POR", label: "Portiere", x: 50, y: 92 },
    { code: "DS", label: "Dif. sinistro", x: 15, y: 74 },
    { code: "DC1", label: "Dif. centrale", x: 37, y: 78 },
    { code: "DC2", label: "Dif. centrale", x: 63, y: 78 },
    { code: "DD", label: "Dif. destro", x: 85, y: 74 },
    { code: "CS", label: "Centrocampista", x: 28, y: 54 },
    { code: "CC", label: "Centrocampista", x: 50, y: 58 },
    { code: "CD", label: "Centrocampista", x: 72, y: 54 },
    { code: "AS", label: "Ala sinistra", x: 18, y: 28 },
    { code: "PC", label: "Punta centrale", x: 50, y: 20 },
    { code: "AD", label: "Ala destra", x: 82, y: 28 },
  ],
  "4-4-2": [
    { code: "POR", label: "Portiere", x: 50, y: 92 },
    { code: "DS", label: "Dif. sinistro", x: 15, y: 74 },
    { code: "DC1", label: "Dif. centrale", x: 37, y: 78 },
    { code: "DC2", label: "Dif. centrale", x: 63, y: 78 },
    { code: "DD", label: "Dif. destro", x: 85, y: 74 },
    { code: "MS", label: "Esterno sinistro", x: 15, y: 50 },
    { code: "MC1", label: "Centrocampista", x: 40, y: 54 },
    { code: "MC2", label: "Centrocampista", x: 60, y: 54 },
    { code: "MD", label: "Esterno destro", x: 85, y: 50 },
    { code: "PC1", label: "Punta", x: 38, y: 22 },
    { code: "PC2", label: "Punta", x: 62, y: 22 },
  ],
  "3-5-2": [
    { code: "POR", label: "Portiere", x: 50, y: 92 },
    { code: "DC1", label: "Dif. centrale", x: 26, y: 78 },
    { code: "DC2", label: "Dif. centrale", x: 50, y: 82 },
    { code: "DC3", label: "Dif. centrale", x: 74, y: 78 },
    { code: "QS", label: "Quinto sinistro", x: 10, y: 54 },
    { code: "MC1", label: "Centrocampista", x: 34, y: 58 },
    { code: "MC2", label: "Centrocampista", x: 50, y: 62 },
    { code: "MC3", label: "Centrocampista", x: 66, y: 58 },
    { code: "QD", label: "Quinto destro", x: 90, y: 54 },
    { code: "PC1", label: "Punta", x: 38, y: 22 },
    { code: "PC2", label: "Punta", x: 62, y: 22 },
  ],
  "4-2-3-1": [
    { code: "POR", label: "Portiere", x: 50, y: 92 },
    { code: "DS", label: "Dif. sinistro", x: 15, y: 74 },
    { code: "DC1", label: "Dif. centrale", x: 37, y: 78 },
    { code: "DC2", label: "Dif. centrale", x: 63, y: 78 },
    { code: "DD", label: "Dif. destro", x: 85, y: 74 },
    { code: "MED1", label: "Mediano", x: 38, y: 60 },
    { code: "MED2", label: "Mediano", x: 62, y: 60 },
    { code: "TS", label: "Trequartista sin.", x: 18, y: 36 },
    { code: "TC", label: "Trequartista", x: 50, y: 34 },
    { code: "TD", label: "Trequartista des.", x: 82, y: 36 },
    { code: "PC", label: "Punta centrale", x: 50, y: 16 },
  ],
};

export type FormationModule = keyof typeof FORMATION_MODULES;

export const ATTENDANCE_STATUSES = ["presente", "assente", "giustificato", "ritardo"] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  presente: "Presente",
  assente: "Assente",
  giustificato: "Giustificato",
  ritardo: "Ritardo",
};

export const INTENSITY_LEVELS = ["bassa", "media", "alta"] as const;
export type Intensity = (typeof INTENSITY_LEVELS)[number];
export const INTENSITY_LABELS: Record<Intensity, string> = {
  bassa: "Bassa",
  media: "Media",
  alta: "Alta",
};

export const EXERCISE_CATEGORIES = [
  "riscaldamento",
  "tecnica_individuale",
  "passaggi",
  "rondo",
  "possesso",
  "pressing",
  "costruzione",
  "attacco",
  "finalizzazione",
  "transizione_offensiva",
  "transizione_difensiva",
  "difesa",
  "superiorita_numerica",
  "inferiorita_numerica",
  "small_sided_game",
  "partita_a_tema",
] as const;
export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];

export const EXERCISE_CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  riscaldamento: "Riscaldamento",
  tecnica_individuale: "Tecnica individuale",
  passaggi: "Passaggi",
  rondo: "Rondo",
  possesso: "Possesso",
  pressing: "Pressing",
  costruzione: "Costruzione",
  attacco: "Attacco",
  finalizzazione: "Finalizzazione",
  transizione_offensiva: "Transizione offensiva",
  transizione_difensiva: "Transizione difensiva",
  difesa: "Difesa",
  superiorita_numerica: "Superiorità numerica",
  inferiorita_numerica: "Inferiorità numerica",
  small_sided_game: "Small-sided game",
  partita_a_tema: "Partita a tema",
};

export const SESSION_BLOCK_STATUSES = ["fatto", "saltato", "modificato"] as const;
export type SessionBlockStatus = (typeof SESSION_BLOCK_STATUSES)[number];
export const SESSION_BLOCK_STATUS_LABELS: Record<SessionBlockStatus, string> = {
  fatto: "Fatto",
  saltato: "Saltato",
  modificato: "Modificato",
};
