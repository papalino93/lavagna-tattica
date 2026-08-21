import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Onboarding già completato (la squadra esiste) → dritti in dashboard, non si rivede più.
  const { data: team } = await supabase.from("team_settings").select("name").maybeSingle();
  if (team) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-[var(--surface)] p-4">
      <OnboardingWizard />
    </main>
  );
}
