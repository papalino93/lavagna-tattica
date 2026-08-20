"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { exerciseSchema } from "@/lib/validation/exercises";

export interface ExerciseFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseTags(raw: FormDataEntryValue | null): string[] {
  if (!raw || typeof raw !== "string") return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 10);
}

function parseExerciseForm(formData: FormData) {
  const result = exerciseSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description"),
    objective: formData.get("objective"),
    playersMin: formData.get("playersMin"),
    playersMax: formData.get("playersMax"),
    durationMinutes: formData.get("durationMinutes"),
    intensity: formData.get("intensity") || null,
    fieldSize: formData.get("fieldSize"),
    equipment: formData.get("equipment"),
    coachingPoints: formData.get("coachingPoints"),
    variants: formData.get("variants"),
    tags: parseTags(formData.get("tags")),
  });

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    return { fieldErrors };
  }

  return { data: result.data };
}

function toRow(data: ReturnType<typeof exerciseSchema.parse>) {
  return {
    name: data.name,
    category: data.category,
    description: data.description,
    objective: data.objective,
    players_min: data.playersMin,
    players_max: data.playersMax,
    duration_minutes: data.durationMinutes,
    intensity: data.intensity ?? null,
    field_size: data.fieldSize,
    equipment: data.equipment,
    coaching_points: data.coachingPoints,
    variants: data.variants,
    tags: data.tags,
  };
}

export async function createExercise(
  _prevState: ExerciseFormState,
  formData: FormData,
): Promise<ExerciseFormState> {
  const parsed = parseExerciseForm(formData);
  if (parsed.fieldErrors) return { fieldErrors: parsed.fieldErrors };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .insert({ ...toRow(parsed.data), is_template: false })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Salvataggio non riuscito. Riprova." };
  }

  revalidatePath("/lavagna");
  redirect(`/lavagna/esercizi/${data.id}`);
}

export async function updateExercise(
  id: string,
  _prevState: ExerciseFormState,
  formData: FormData,
): Promise<ExerciseFormState> {
  const parsed = parseExerciseForm(formData);
  if (parsed.fieldErrors) return { fieldErrors: parsed.fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase
    .from("exercises")
    .update(toRow(parsed.data))
    .eq("id", id)
    .eq("is_template", false);

  if (error) {
    return { error: "Salvataggio non riuscito. Riprova." };
  }

  revalidatePath("/lavagna");
  revalidatePath(`/lavagna/esercizi/${id}`);
  redirect(`/lavagna/esercizi/${id}`);
}

export async function deleteExercise(id: string) {
  const supabase = await createClient();
  await supabase.from("exercises").delete().eq("id", id).eq("is_template", false);
  revalidatePath("/lavagna");
  redirect("/lavagna");
}

export async function duplicateExercise(id: string) {
  const supabase = await createClient();
  const { data: original } = await supabase
    .from("exercises")
    .select(
      "name, category, description, objective, players_min, players_max, duration_minutes, intensity, field_size, equipment, coaching_points, variants, tags",
    )
    .eq("id", id)
    .single();

  if (!original) return;

  const { data: copy } = await supabase
    .from("exercises")
    .insert({ ...original, name: `${original.name} (copia)`, is_template: false })
    .select("id")
    .single();

  revalidatePath("/lavagna");
  if (copy) {
    redirect(`/lavagna/esercizi/${copy.id}`);
  }
}
