import { z } from "zod";

export const trainingSessionSchema = z.object({
  date: z.string().min(1, "Inserisci la data"),
  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => v || null),
});

export type TrainingSessionInput = z.infer<typeof trainingSessionSchema>;
