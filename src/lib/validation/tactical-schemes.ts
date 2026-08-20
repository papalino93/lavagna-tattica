import { z } from "zod";
import { SCHEME_CATEGORIES } from "@/lib/types/tactical";

const boardPlayer = z.object({
  id: z.string(),
  team: z.enum(["nostri", "avversari"]),
  x: z.number(),
  y: z.number(),
  label: z.string(),
});

const boardDrawing = z.object({
  id: z.string(),
  kind: z.enum(["freccia", "linea"]),
  style: z.enum(["piena", "tratteggiata"]),
  x1: z.number(),
  y1: z.number(),
  x2: z.number(),
  y2: z.number(),
});

export const fieldDataSchema = z.object({
  players: z.array(boardPlayer),
  drawings: z.array(boardDrawing),
});

export const tacticalSchemeSchema = z.object({
  name: z.string().trim().min(1, "Inserisci un nome").max(100),
  category: z.enum(SCHEME_CATEGORIES, { message: "Seleziona una categoria" }),
  subcategory: z
    .string()
    .trim()
    .max(100)
    .nullable()
    .optional()
    .transform((v) => v || null),
  fieldData: fieldDataSchema,
});

export type TacticalSchemeInput = z.infer<typeof tacticalSchemeSchema>;
