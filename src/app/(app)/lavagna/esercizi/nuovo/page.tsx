import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ExerciseForm } from "@/components/exercises/exercise-form";
import { createExercise } from "@/lib/actions/exercises";
import { EXERCISE_CATEGORIES } from "@/lib/types/domain";

export default async function NuovoEsercizioPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;

  let defaultValues = undefined;

  if (template) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("exercises")
      .select("*")
      .eq("id", template)
      .eq("is_template", true)
      .maybeSingle();

    if (data) {
      defaultValues = {
        name: data.name,
        category: data.category,
        description: data.description,
        objective: data.objective,
        playersMin: data.players_min,
        playersMax: data.players_max,
        durationMinutes: data.duration_minutes,
        intensity: data.intensity,
        fieldSize: data.field_size,
        equipment: data.equipment,
        coachingPoints: data.coaching_points,
        variants: data.variants,
        tags: data.tags ?? [],
      };
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href="/lavagna" className="text-sm text-[var(--ink-dim)] hover:text-[var(--ink)]">
        ← Lavagna
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-[var(--ink)]">Nuovo esercizio</h1>

      <div className="mt-6">
        <ExerciseForm
          action={createExercise}
          defaultValues={
            defaultValues ?? {
              name: "",
              category: EXERCISE_CATEGORIES[0],
              description: null,
              objective: null,
              playersMin: null,
              playersMax: null,
              durationMinutes: null,
              intensity: null,
              fieldSize: null,
              equipment: null,
              coachingPoints: null,
              variants: null,
              tags: [],
            }
          }
          submitLabel="Crea esercizio"
        />
      </div>
    </div>
  );
}
