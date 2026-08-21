import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Applica il middleware a tutte le rotte tranne asset statici, immagini
     * e file interni di Next.js. icon/apple-icon/opengraph-image sono generati
     * da next/og su URL senza estensione: devono restare pubblici (li richiedono
     * i browser e i crawler di anteprima — es. WhatsApp — senza sessione).
     */
    "/((?!_next/static|_next/image|favicon.ico|icon$|apple-icon$|opengraph-image$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
