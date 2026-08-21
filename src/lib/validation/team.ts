import { z } from "zod";

const hexColor = z
  .string()
  .trim()
  .regex(/^#[0-9a-fA-F]{6}$/, "Colore non valido")
  .nullable()
  .optional()
  .transform((v) => v || null);

export const teamSettingsSchema = z.object({
  name: z.string().trim().max(100).optional().transform((v) => v || null),
  logoUrl: z.string().url().nullable().optional(),
  primaryColor: hexColor,
  secondaryColor: hexColor,
  kitSocksColor: hexColor,
});

export type TeamSettingsInput = z.infer<typeof teamSettingsSchema>;
