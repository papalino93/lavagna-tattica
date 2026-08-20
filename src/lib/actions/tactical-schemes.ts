"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { tacticalSchemeSchema } from "@/lib/validation/tactical-schemes";
import type { FieldData, SchemeCategory } from "@/lib/types/tactical";

export interface SchemeActionResult {
  id?: string;
  error?: string;
}

interface SchemeInput {
  name: string;
  category: SchemeCategory;
  subcategory: string | null;
  description: string | null;
  fieldData: FieldData;
}

export async function createScheme(input: SchemeInput): Promise<SchemeActionResult> {
  const result = tacticalSchemeSchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Dati non validi." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tactical_schemes")
    .insert({
      name: result.data.name,
      category: result.data.category,
      subcategory: result.data.subcategory,
      description: result.data.description,
      field_data: result.data.fieldData,
      is_template: false,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Salvataggio non riuscito. Riprova." };
  }

  revalidatePath("/lavagna");
  return { id: data.id };
}

export async function updateScheme(
  id: string,
  input: SchemeInput,
): Promise<SchemeActionResult> {
  const result = tacticalSchemeSchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Dati non validi." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("tactical_schemes")
    .update({
      name: result.data.name,
      category: result.data.category,
      subcategory: result.data.subcategory,
      description: result.data.description,
      field_data: result.data.fieldData,
    })
    .eq("id", id)
    .eq("is_template", false);

  if (error) {
    return { error: "Salvataggio non riuscito. Riprova." };
  }

  revalidatePath("/lavagna");
  revalidatePath(`/lavagna/${id}`);
  return { id };
}

export async function deleteScheme(id: string) {
  const supabase = await createClient();
  await supabase.from("tactical_schemes").delete().eq("id", id).eq("is_template", false);
  revalidatePath("/lavagna");
  redirect("/lavagna");
}

export async function duplicateScheme(id: string) {
  const supabase = await createClient();
  const { data: original } = await supabase
    .from("tactical_schemes")
    .select("name, category, subcategory, description, field_data")
    .eq("id", id)
    .single();

  if (!original) {
    return;
  }

  const { data: copy } = await supabase
    .from("tactical_schemes")
    .insert({
      name: `${original.name} (copia)`,
      category: original.category,
      subcategory: original.subcategory,
      description: original.description,
      field_data: original.field_data,
      is_template: false,
    })
    .select("id")
    .single();

  revalidatePath("/lavagna");
  if (copy) {
    redirect(`/lavagna/${copy.id}`);
  }
}
