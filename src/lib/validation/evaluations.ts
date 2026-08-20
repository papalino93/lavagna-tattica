import { z } from "zod";

const score = z.coerce.number().int().min(1, "1-10").max(10, "1-10");

export const evaluationSchema = z.object({
  date: z.string().min(1, "Inserisci la data"),
  tecnica: score,
  tattica: score,
  fisica: score,
  mentale: score,
  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => v || null),
});

export type EvaluationInput = z.infer<typeof evaluationSchema>;
