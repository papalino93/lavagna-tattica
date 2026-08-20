"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AttendanceStatus } from "@/lib/types/domain";

export async function setAttendance(
  sessionId: string,
  playerId: string,
  status: AttendanceStatus,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("attendances")
    .upsert(
      { training_session_id: sessionId, player_id: playerId, status },
      { onConflict: "training_session_id,player_id" },
    );

  revalidatePath(`/allenamenti/${sessionId}`);

  if (error) {
    throw new Error("Salvataggio presenza non riuscito.");
  }
}
