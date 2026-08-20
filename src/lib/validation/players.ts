import { z } from "zod";
import { PLAYER_ROLES, PLAYER_STATUSES } from "@/lib/types/domain";

export const playerSchema = z.object({
  name: z.string().trim().min(1, "Inserisci il nome").max(100),
  role: z.enum(PLAYER_ROLES, { message: "Seleziona un ruolo" }),
  jerseyNumber: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().int().min(1).max(99).optional(),
  ).transform((v) => v ?? null),
  status: z.enum(PLAYER_STATUSES),
  notes: z.string().trim().max(2000).optional().transform((v) => v || null),
  photoUrl: z.string().url().nullable().optional(),
});

export type PlayerInput = z.infer<typeof playerSchema>;
