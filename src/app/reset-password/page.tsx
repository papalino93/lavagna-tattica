"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { newPasswordSchema } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Il link di recupero email autentica automaticamente il browser
    // (sessione temporanea) prima che questa pagina venga mostrata.
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session);
      if (!data.session) {
        setFormError(
          "Il link non è valido o è scaduto. Richiedine uno nuovo.",
        );
      }
    });
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const result = newPasswordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        errors[issue.path[0] as string] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: result.data.password,
    });
    setLoading(false);

    if (error) {
      setFormError("Non è stato possibile aggiornare la password.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1500);
  }

  return (
    <main className="flex min-h-full flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">
          Imposta la password
        </h1>

        {success ? (
          <p className="mt-4 text-sm text-emerald-600">
            Password aggiornata. Reindirizzamento…
          </p>
        ) : ready ? (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
            <Input
              id="password"
              type="password"
              label="Nuova password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
            />
            <Input
              id="confirmPassword"
              type="password"
              label="Conferma password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={fieldErrors.confirmPassword}
            />
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <Button type="submit" disabled={loading} className="mt-1">
              {loading ? "Salvataggio…" : "Salva password"}
            </Button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-red-600">{formError ?? "Verifica in corso…"}</p>
        )}
      </div>
    </main>
  );
}
