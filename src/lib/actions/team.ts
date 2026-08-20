"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { teamSettingsSchema } from "@/lib/validation/team";

export interface TeamSettingsFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
}

export async function updateTeamSettings(
  _prevState: TeamSettingsFormState,
  formData: FormData,
): Promise<TeamSettingsFormState> {
  const result = teamSettingsSchema.safeParse({
    name: formData.get("name"),
    logoUrl: formData.get("logoUrl") || null,
  });

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    return { fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("team_settings").upsert({
    id: true,
    name: result.data.name,
    logo_url: result.data.logoUrl ?? null,
  });

  if (error) {
    return { error: "Salvataggio non riuscito. Riprova." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
