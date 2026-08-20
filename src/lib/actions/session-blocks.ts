"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface AddToSessionResult {
  error?: string;
  trainingSessionId?: string;
}

/**
 * Aggiunge uno schema tattico o un esercizio come blocco di un allenamento.
 * Se `trainingSessionId` è "nuovo", crea prima una sessione con la data di oggi.
 */
export async function addToTrainingSession(
  kind: "schema" | "esercizio",
  contentId: string,
  trainingSessionId: string,
  durationMinutes: number | null,
): Promise<AddToSessionResult> {
  const supabase = await createClient();

  let sessionId = trainingSessionId;
  if (trainingSessionId === "nuovo") {
    const { data: session, error: sessionError } = await supabase
      .from("training_sessions")
      .insert({ date: new Date().toISOString().slice(0, 10) })
      .select("id")
      .single();
    if (sessionError || !session) {
      return { error: "Creazione allenamento non riuscita." };
    }
    sessionId = session.id;
  }

  const { data: maxPositionRow } = await supabase
    .from("session_blocks")
    .select("position")
    .eq("training_session_id", sessionId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = (maxPositionRow?.position ?? -1) + 1;

  const { error } = await supabase.from("session_blocks").insert({
    training_session_id: sessionId,
    position: nextPosition,
    tactical_scheme_id: kind === "schema" ? contentId : null,
    exercise_id: kind === "esercizio" ? contentId : null,
    duration_minutes: durationMinutes,
  });

  if (error) {
    return { error: "Aggiunta all'allenamento non riuscita." };
  }

  revalidatePath(`/allenamenti/${sessionId}`);
  revalidatePath("/allenamenti");
  return { trainingSessionId: sessionId };
}

export async function removeSessionBlock(blockId: string, trainingSessionId: string) {
  const supabase = await createClient();
  await supabase.from("session_blocks").delete().eq("id", blockId);
  revalidatePath(`/allenamenti/${trainingSessionId}`);
}

export async function updateSessionBlock(
  blockId: string,
  trainingSessionId: string,
  fields: {
    durationMinutes: number | null;
    sets: number | null;
    reps: number | null;
    restSeconds: number | null;
    intensity: string | null;
    notes: string | null;
  },
) {
  const supabase = await createClient();
  await supabase
    .from("session_blocks")
    .update({
      duration_minutes: fields.durationMinutes,
      sets: fields.sets,
      reps: fields.reps,
      rest_seconds: fields.restSeconds,
      intensity: fields.intensity,
      notes: fields.notes,
    })
    .eq("id", blockId);
  revalidatePath(`/allenamenti/${trainingSessionId}`);
}
