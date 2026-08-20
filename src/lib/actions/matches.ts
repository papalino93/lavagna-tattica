"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { matchSchema } from "@/lib/validation/matches";

export interface MatchFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseMatchForm(formData: FormData) {
  const result = matchSchema.safeParse({
    date: formData.get("date"),
    opponent: formData.get("opponent"),
    notes: formData.get("notes"),
    result: formData.get("result"),
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

export async function createMatch(
  _prevState: MatchFormState,
  formData: FormData,
): Promise<MatchFormState> {
  const parsed = parseMatchForm(formData);
  if (parsed.fieldErrors) return { fieldErrors: parsed.fieldErrors };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .insert({
      date: new Date(parsed.data.date).toISOString(),
      opponent: parsed.data.opponent,
      notes: parsed.data.notes,
      result: parsed.data.result,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Salvataggio non riuscito. Riprova." };
  }

  revalidatePath("/partite");
  redirect(`/partite/${data.id}`);
}

export async function updateMatch(
  id: string,
  _prevState: MatchFormState,
  formData: FormData,
): Promise<MatchFormState> {
  const parsed = parseMatchForm(formData);
  if (parsed.fieldErrors) return { fieldErrors: parsed.fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase
    .from("matches")
    .update({
      date: new Date(parsed.data.date).toISOString(),
      opponent: parsed.data.opponent,
      notes: parsed.data.notes,
      result: parsed.data.result,
    })
    .eq("id", id);

  if (error) {
    return { error: "Salvataggio non riuscito. Riprova." };
  }

  revalidatePath("/partite");
  revalidatePath(`/partite/${id}`);
  redirect(`/partite/${id}`);
}

export async function deleteMatch(id: string) {
  const supabase = await createClient();
  await supabase.from("matches").delete().eq("id", id);
  revalidatePath("/partite");
  redirect("/partite");
}
