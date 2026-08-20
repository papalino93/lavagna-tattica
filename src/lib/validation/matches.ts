import { z } from "zod";

export const matchSchema = z.object({
  date: z.string().min(1, "Inserisci data e ora"),
  opponent: z.string().trim().min(1, "Inserisci l'avversario").max(200),
  notes: z.string().trim().max(2000).optional().transform((v) => v || null),
  result: z.string().trim().max(20).optional().transform((v) => v || null),
});

export type MatchInput = z.infer<typeof matchSchema>;
