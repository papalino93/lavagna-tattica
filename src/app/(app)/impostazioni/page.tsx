import { createClient } from "@/lib/supabase/server";
import { TeamSettingsForm } from "@/components/team/team-settings-form";

export default async function ImpostazioniPage() {
  const supabase = await createClient();
  const { data: team } = await supabase
    .from("team_settings")
    .select("name, logo_url, primary_color, secondary_color, kit_socks_color")
    .maybeSingle();

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-semibold text-[var(--ink)]">Impostazioni</h1>
      <p className="mt-1 text-sm text-[var(--ink-dim)]">
        Nome, logo, colori e kit della squadra — usati in tutta l&apos;app.
      </p>

      <div className="mt-6">
        <TeamSettingsForm
          defaultValues={{
            name: team?.name ?? null,
            logoUrl: team?.logo_url ?? null,
            primaryColor: team?.primary_color ?? null,
            secondaryColor: team?.secondary_color ?? null,
            kitSocksColor: team?.kit_socks_color ?? null,
          }}
        />
      </div>
    </div>
  );
}
