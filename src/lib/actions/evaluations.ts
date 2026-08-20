"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { evaluationSchema } from "@/lib/validation/evaluations";

export interface EvaluationFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
}

export async function createEvaluation(
  playerId: string,
  _prevState: EvaluationFormState,
  formData: FormData,
): Promise<EvaluationFormState> {
  const result = evaluationSchema.safeParse({
    date: formData.get("date"),
    tecnica: formData.get("tecnica"),
    tattica: formData.get("tattica"),
    fisica: formData.get("fisica"),
    mentale: formData.get("mentale"),
    notes: formData.get("notes"),
  });

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    return { fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("evaluations").insert({
    player_id: playerId,
    date: result.data.date,
    tecnica: result.data.tecnica,
    tattica: result.data.tattica,
    fisica: result.data.fisica,
    mentale: result.data.mentale,
    notes: result.data.notes,
  });

  if (error) {
    return { error: "Salvataggio non riuscito. Riprova." };
  }

  revalidatePath(`/rosa/${playerId}`);
  return { success: true };
}

export async function deleteEvaluation(playerId: string, evaluationId: string) {
  const supabase = await createClient();
  await supabase.from("evaluations").delete().eq("id", evaluationId);
  revalidatePath(`/rosa/${playerId}`);
}
