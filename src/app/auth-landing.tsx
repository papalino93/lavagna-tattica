"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthLanding() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Caso 1: callback OAuth (Google) finito qui invece che su
    // /auth/callback — inoltra il code preservandolo.
    const code = searchParams.get("code");
    if (code) {
      router.replace(`/auth/callback?code=${encodeURIComponent(code)}&next=/dashboard`);
      return;
    }

    // Caso 2: link di recovery/magic link, i cui token arrivano come
    // frammento hash (#access_token=...&type=recovery), invisibile al
    // server. Il client Supabase lo elabora automaticamente all'avvio;
    // qui basta guardare il tipo per decidere dove mandare l'utente.
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      router.replace(`/reset-password${hash}`);
      return;
    }

    // Caso 3: nessun parametro speciale, arrivo "normale" sulla home.
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      router.replace(data.session ? "/dashboard" : "/login");
    });
  }, [router, searchParams]);

  return null;
}
