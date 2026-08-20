"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function setCallUp(matchId: string, playerId: string, calledUp: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("match_call_ups")
    .upsert(
      { match_id: matchId, player_id: playerId, called_up: calledUp },
      { onConflict: "match_id,player_id" },
    );

  revalidatePath(`/partite/${matchId}/convocati`);
  revalidatePath(`/partite/${matchId}/formazione`);

  if (error) {
    throw new Error("Salvataggio convocazione non riuscito.");
  }
}
