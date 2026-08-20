"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { playerSchema } from "@/lib/validation/players";

export interface PlayerFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parsePlayerForm(formData: FormData) {
  const result = playerSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    jerseyNumber: formData.get("jerseyNumber"),
    status: formData.get("status"),
    notes: formData.get("notes"),
    photoUrl: formData.get("photoUrl") || null,
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

export async function createPlayer(
  _prevState: PlayerFormState,
  formData: FormData,
): Promise<PlayerFormState> {
  const parsed = parsePlayerForm(formData);
  if (parsed.fieldErrors) {
    return { fieldErrors: parsed.fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("players").insert({
    name: parsed.data.name,
    role: parsed.data.role,
    jersey_number: parsed.data.jerseyNumber,
    status: parsed.data.status,
    notes: parsed.data.notes,
    photo_url: parsed.data.photoUrl ?? null,
  });

  if (error) {
    return { error: "Salvataggio non riuscito. Riprova." };
  }

  revalidatePath("/rosa");
  redirect("/rosa");
}

export async function updatePlayer(
  id: string,
  _prevState: PlayerFormState,
  formData: FormData,
): Promise<PlayerFormState> {
  const parsed = parsePlayerForm(formData);
  if (parsed.fieldErrors) {
    return { fieldErrors: parsed.fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("players")
    .update({
      name: parsed.data.name,
      role: parsed.data.role,
      jersey_number: parsed.data.jerseyNumber,
      status: parsed.data.status,
      notes: parsed.data.notes,
      photo_url: parsed.data.photoUrl ?? null,
    })
    .eq("id", id);

  if (error) {
    return { error: "Salvataggio non riuscito. Riprova." };
  }

  revalidatePath("/rosa");
  revalidatePath(`/rosa/${id}`);
  redirect(`/rosa/${id}`);
}

export async function deletePlayer(id: string) {
  const supabase = await createClient();

  const { data: player } = await supabase
    .from("players")
    .select("photo_url")
    .eq("id", id)
    .single();

  await supabase.from("players").delete().eq("id", id);

  if (player?.photo_url) {
    const path = extractStoragePath(player.photo_url);
    if (path) {
      await supabase.storage.from("player-photos").remove([path]);
    }
  }

  revalidatePath("/rosa");
  redirect("/rosa");
}

function extractStoragePath(publicUrl: string): string | null {
  const marker = "/object/public/player-photos/";
  const index = publicUrl.indexOf(marker);
  return index === -1 ? null : publicUrl.slice(index + marker.length);
}
