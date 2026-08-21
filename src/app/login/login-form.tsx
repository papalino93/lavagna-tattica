"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { loginSchema } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"password" | "google" | null>(null);

  async function handlePasswordLogin(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        errors[issue.path[0] as string] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setLoading("password");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(result.data);
    setLoading(null);

    if (error) {
      setFormError("Email o password non corrette.");
      return;
    }

    router.push(next);
    router.refresh();
  }

  async function handleGoogleLogin() {
    setFormError(null);
    setLoading("google");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setFormError("Impossibile avviare l'accesso con Google.");
      setLoading(null);
    }
    // In caso di successo il browser viene reindirizzato a Google: nessun
    // altro stato da gestire qui.
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading !== null}
        className="inline-flex items-center justify-center gap-3 rounded-lg border border-[var(--line-strong)] bg-[var(--surface-raised)] px-4 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleIcon />
        {loading === "google" ? "Accesso in corso…" : "Accedi con Google"}
      </button>

      <div className="flex items-center gap-3 text-xs text-[var(--ink-faint)]">
        <div className="h-px flex-1 bg-[var(--surface-hover-strong)]" />
        oppure
        <div className="h-px flex-1 bg-[var(--surface-hover-strong)]" />
      </div>

      <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4" noValidate>
        <Input
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <Button type="submit" disabled={loading !== null} className="mt-1">
          {loading === "password" ? "Accesso in corso…" : "Accedi"}
        </Button>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
