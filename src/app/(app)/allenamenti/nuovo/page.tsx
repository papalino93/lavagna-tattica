import Link from "next/link";
import { TrainingSessionForm } from "@/components/attendance/training-session-form";

export default function NuovoAllenamentoPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href="/allenamenti" className="text-sm text-zinc-500 hover:text-zinc-700">
        ← Allenamenti
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">Nuovo allenamento</h1>

      <div className="mt-6">
        <TrainingSessionForm />
      </div>
    </div>
  );
}
