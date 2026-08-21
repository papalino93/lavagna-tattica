import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Lavagna Tattica</h1>
        <p className="mt-1 text-sm text-[var(--ink-dim)]">
          Accedi per gestire squadra e schemi tattici.
        </p>
        <div className="mt-6">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
