import { z } from "zod";
import { EXERCISE_CATEGORIES, INTENSITY_LEVELS } from "@/lib/types/domain";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || null);

const optionalInt = (min: number, max: number) =>
  z
    .preprocess(
      (v) => (v === "" || v === null || v === undefined ? undefined : v),
      z.coerce.number().int().min(min).max(max).optional(),
    )
    .transform((v) => v ?? null);

export const exerciseSchema = z.object({
  name: z.string().trim().min(1, "Inserisci un nome").max(150),
  category: z.enum(EXERCISE_CATEGORIES, { message: "Seleziona una categoria" }),
  description: optionalText(4000),
  objective: optionalText(500),
  playersMin: optionalInt(1, 30),
  playersMax: optionalInt(1, 30),
  durationMinutes: optionalInt(1, 180),
  intensity: z.enum(INTENSITY_LEVELS).nullable().optional(),
  fieldSize: optionalText(100),
  equipment: optionalText(300),
  coachingPoints: optionalText(2000),
  variants: optionalText(2000),
  tags: z.array(z.string().trim().min(1).max(30)).max(10),
});

export type ExerciseInput = z.infer<typeof exerciseSchema>;
