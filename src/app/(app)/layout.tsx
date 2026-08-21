import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MobileHeader } from "@/components/layout/mobile-header";
import { buildBrandStyle } from "@/lib/theme/team-theme";
import { ConfirmProvider } from "@/components/ui/confirm-provider";
import { ToastProvider } from "@/components/ui/toast-provider";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Rete di sicurezza oltre al middleware: nessun contenuto senza sessione.
  if (!user) {
    redirect("/login");
  }

  const { data: team } = await supabase
    .from("team_settings")
    .select("name, logo_url, primary_color, secondary_color")
    .maybeSingle();

  // Prima squadra mai configurata → onboarding, non la dashboard vuota.
  if (!team) {
    redirect("/onboarding");
  }

  const teamName = team?.name ?? "Lavagna Tattica";
  const teamLogoUrl = team?.logo_url ?? null;

  return (
    <>
      {/* Colore squadra: sovrascrive i token --brand definiti in globals.css */}
      <style dangerouslySetInnerHTML={{ __html: buildBrandStyle(team?.primary_color) }} />
      <ToastProvider>
        <ConfirmProvider>
          <div className="flex min-h-full flex-1">
            <SidebarNav userEmail={user.email ?? null} teamName={teamName} teamLogoUrl={teamLogoUrl} />
            <div className="flex flex-1 flex-col">
              <MobileHeader teamName={teamName} teamLogoUrl={teamLogoUrl} />
              <main className="flex-1 pb-20 md:pb-0">{children}</main>
              <MobileNav />
            </div>
          </div>
        </ConfirmProvider>
      </ToastProvider>
    </>
  );
}
