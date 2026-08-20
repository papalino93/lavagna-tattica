"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface BlockStatusInput {
  blockId: string;
  status: "fatto" | "saltato" | "modificato";
  note: string | null;
}

export interface CloseSessionInput {
  actualDurationMinutes: number | null;
  actualIntensity: string | null;
  notes: string | null;
  blocks: BlockStatusInput[];
}

export async function closeTrainingSession(
  trainingSessionId: string,
  input: CloseSessionInput,
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error: logError } = await supabase.from("training_session_logs").upsert({
    training_session_id: trainingSessionId,
    actual_duration_minutes: input.actualDurationMinutes,
    actual_intensity: input.actualIntensity,
    notes: input.notes,
    closed_at: new Date().toISOString(),
  });

  if (logError) {
    return { error: "Chiusura seduta non riuscita." };
  }

  for (const block of input.blocks) {
    await supabase.from("session_block_logs").upsert({
      session_block_id: block.blockId,
      status: block.status,
      note: block.note,
    });
  }

  revalidatePath(`/allenamenti/${trainingSessionId}`);
  return {};
}
