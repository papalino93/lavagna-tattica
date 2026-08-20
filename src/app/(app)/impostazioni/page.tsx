import { createClient } from "@/lib/supabase/server";
import { TeamSettingsForm } from "@/components/team/team-settings-form";

export default async function ImpostazioniPage() {
  const supabase = await createClient();
  const { data: team } = await supabase
    .from("team_settings")
    .select("name, logo_url")
    .maybeSingle();

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900">Impostazioni</h1>
      <p className="mt-1 text-sm text-zinc-500">Nome e logo della squadra, mostrati nell&apos;app.</p>

      <div className="mt-6">
        <TeamSettingsForm
          defaultValues={{ name: team?.name ?? null, logoUrl: team?.logo_url ?? null }}
        />
      </div>
    </div>
  );
}
