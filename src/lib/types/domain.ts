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

export const ATTENDANCE_STATUSES = ["presente", "assente", "giustificato"] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  presente: "Presente",
  assente: "Assente",
  giustificato: "Giustificato",
};
