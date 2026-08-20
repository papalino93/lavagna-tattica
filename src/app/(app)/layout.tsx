import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MobileHeader } from "@/components/layout/mobile-header";

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
    .select("name, logo_url")
    .maybeSingle();

  const teamName = team?.name ?? "Lavagna Tattica";
  const teamLogoUrl = team?.logo_url ?? null;

  return (
    <div className="flex min-h-full flex-1">
      <SidebarNav userEmail={user.email ?? null} teamName={teamName} teamLogoUrl={teamLogoUrl} />
      <div className="flex flex-1 flex-col">
        <MobileHeader teamName={teamName} teamLogoUrl={teamLogoUrl} />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}
