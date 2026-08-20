import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Inserisci l'email").email("Email non valida"),
  password: z.string().min(1, "Inserisci la password"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const newPasswordSchema = z
  .object({
    password: z.string().min(8, "Almeno 8 caratteri"),
    confirmPassword: z.string().min(1, "Conferma la password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono",
    path: ["confirmPassword"],
  });

export type NewPasswordInput = z.infer<typeof newPasswordSchema>;
