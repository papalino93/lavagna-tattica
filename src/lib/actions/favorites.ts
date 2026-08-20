"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type FavoriteKind = "schema" | "esercizio";

export async function toggleFavorite(kind: FavoriteKind, id: string, isFavorite: boolean) {
  const supabase = await createClient();
  const column = kind === "schema" ? "tactical_scheme_id" : "exercise_id";

  if (isFavorite) {
    await supabase.from("favorites").delete().eq(column, id);
  } else {
    await supabase.from("favorites").insert({ [column]: id });
  }

  revalidatePath("/lavagna");
}
