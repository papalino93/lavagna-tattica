"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { trainingSessionSchema } from "@/lib/validation/training-sessions";

export interface TrainingSessionFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createTrainingSession(
  _prevState: TrainingSessionFormState,
  formData: FormData,
): Promise<TrainingSessionFormState> {
  const result = trainingSessionSchema.safeParse({
    date: formData.get("date"),
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
  const { data, error } = await supabase
    .from("training_sessions")
    .insert({ date: result.data.date, notes: result.data.notes })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Salvataggio non riuscito. Riprova." };
  }

  revalidatePath("/allenamenti");
  redirect(`/allenamenti/${data.id}`);
}

export async function deleteTrainingSession(id: string) {
  const supabase = await createClient();
  await supabase.from("training_sessions").delete().eq("id", id);
  revalidatePath("/allenamenti");
  redirect("/allenamenti");
}
