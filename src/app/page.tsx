import { Suspense } from "react";
import { AuthLanding } from "./auth-landing";

/**
 * Pagina pubblica alla radice del sito. Non mostra contenuti: smista
 * l'utente verso la destinazione corretta lato client.
 *
 * Esiste perché Supabase reindirizza sempre qui i link generati via email
 * (recovery/magic link) e — a volte — anche il callback OAuth, ignorando il
 * path specifico richiesto (redirect_to). Vedi AuthLanding per la logica.
 */
export default function RootPage() {
  return (
    <Suspense fallback={null}>
      <AuthLanding />
    </Suspense>
  );
}
