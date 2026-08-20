import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MobileHeader } from "@/components/layout/mobile-header";
import { buildBrandStyle } from "@/lib/theme/team-theme";

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

  const teamName = team?.name ?? "Lavagna Tattica";
  const teamLogoUrl = team?.logo_url ?? null;

  return (
    <>
      {/* Colore squadra: sovrascrive i token --brand definiti in globals.css */}
      <style dangerouslySetInnerHTML={{ __html: buildBrandStyle(team?.primary_color) }} />
      <div className="flex min-h-full flex-1">
        <SidebarNav userEmail={user.email ?? null} teamName={teamName} teamLogoUrl={teamLogoUrl} />
        <div className="flex flex-1 flex-col">
          <MobileHeader teamName={teamName} teamLogoUrl={teamLogoUrl} />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <MobileNav />
        </div>
      </div>
    </>
  );
}
