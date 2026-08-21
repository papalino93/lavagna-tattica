import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ExerciseForm } from "@/components/exercises/exercise-form";
import { DeleteExerciseButton } from "@/components/exercises/delete-exercise-button";
import { AddToSessionForm } from "@/components/training/add-to-session-form";
import { updateExercise } from "@/lib/actions/exercises";

export default async function EsercizioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: exercise }, { data: sessions }] = await Promise.all([
    supabase.from("exercises").select("*").eq("id", id).eq("is_template", false).maybeSingle(),
    supabase
      .from("training_sessions")
      .select("id, date")
      .gte("date", new Date().toISOString().slice(0, 10))
      .order("date", { ascending: true })
      .limit(10),
  ]);

  if (!exercise) {
    notFound();
  }

  const action = updateExercise.bind(null, id);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href="/lavagna" className="text-sm text-[var(--ink-dim)] hover:text-[var(--ink)]">
        ← Lavagna
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-[var(--ink)]">{exercise.name}</h1>

      <div className="mt-4">
        <AddToSessionForm
          kind="esercizio"
          contentId={id}
          sessions={sessions ?? []}
          defaultDurationMinutes={exercise.duration_minutes}
        />
      </div>

      <div className="mt-6">
        <ExerciseForm
          action={action}
          submitLabel="Salva modifiche"
          defaultValues={{
            name: exercise.name,
            category: exercise.category,
            description: exercise.description,
            objective: exercise.objective,
            playersMin: exercise.players_min,
            playersMax: exercise.players_max,
            durationMinutes: exercise.duration_minutes,
            intensity: exercise.intensity,
            fieldSize: exercise.field_size,
            equipment: exercise.equipment,
            coachingPoints: exercise.coaching_points,
            variants: exercise.variants,
            tags: exercise.tags ?? [],
          }}
        />
      </div>

      <div className="mt-6 border-t border-[var(--line)] pt-6">
        <DeleteExerciseButton exerciseId={exercise.id} />
      </div>
    </div>
  );
}
