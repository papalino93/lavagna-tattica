import { z } from "zod";

export const teamSettingsSchema = z.object({
  name: z.string().trim().max(100).optional().transform((v) => v || null),
  logoUrl: z.string().url().nullable().optional(),
});

export type TeamSettingsInput = z.infer<typeof teamSettingsSchema>;
