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
    primaryColor: formData.get("primaryColor") || null,
    secondaryColor: formData.get("secondaryColor") || null,
    kitSocksColor: formData.get("kitSocksColor") || null,
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
    primary_color: result.data.primaryColor,
    secondary_color: result.data.secondaryColor,
    kit_socks_color: result.data.kitSocksColor,
  });

  if (error) {
    return { error: "Salvataggio non riuscito. Riprova." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
