"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface StarterAssignment {
  slotCode: string;
  playerId: string;
}

export async function saveFormation(
  matchId: string,
  module: string,
  starters: StarterAssignment[],
  benchPlayerIds: string[],
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data: formation, error: upsertError } = await supabase
    .from("formations")
    .upsert({ match_id: matchId, module }, { onConflict: "match_id" })
    .select("id")
    .single();

  if (upsertError || !formation) {
    return { error: "Salvataggio formazione non riuscito." };
  }

  await supabase.from("formation_slots").delete().eq("formation_id", formation.id);

  const rows = [
    ...starters.map((s) => ({
      formation_id: formation.id,
      player_id: s.playerId,
      is_starter: true,
      slot_code: s.slotCode,
      bench_order: null,
    })),
    ...benchPlayerIds.map((playerId, index) => ({
      formation_id: formation.id,
      player_id: playerId,
      is_starter: false,
      slot_code: null,
      bench_order: index,
    })),
  ];

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from("formation_slots").insert(rows);
    if (insertError) {
      return { error: "Salvataggio formazione non riuscito." };
    }
  }

  revalidatePath(`/partite/${matchId}/formazione`);
  revalidatePath(`/partite/${matchId}`);
  return {};
}
