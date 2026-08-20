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

  return (
    <div className="flex min-h-full flex-1">
      <SidebarNav userEmail={user.email ?? null} />
      <div className="flex flex-1 flex-col">
        <MobileHeader />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}
