import Link from "next/link";
import { TrainingSessionForm } from "@/components/attendance/training-session-form";

export default function NuovoAllenamentoPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href="/allenamenti" className="text-sm text-[var(--ink-dim)] hover:text-[var(--ink)]">
        ← Allenamenti
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-[var(--ink)]">Nuovo allenamento</h1>

      <div className="mt-6">
        <TrainingSessionForm />
      </div>
    </div>
  );
}
