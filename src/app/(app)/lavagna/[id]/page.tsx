import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TacticalBoardEditor } from "@/components/tactical-board/tactical-board-editor";
import { AddToSessionForm } from "@/components/training/add-to-session-form";
import type { FieldData, SchemeCategory } from "@/lib/types/tactical";

export default async function SchemaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: scheme }, { data: sessions }] = await Promise.all([
    supabase
      .from("tactical_schemes")
      .select("name, category, subcategory, field_data")
      .eq("id", id)
      .eq("is_template", false)
      .maybeSingle(),
    supabase
      .from("training_sessions")
      .select("id, date")
      .gte("date", new Date().toISOString().slice(0, 10))
      .order("date", { ascending: true })
      .limit(10),
  ]);

  if (!scheme) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/lavagna" className="text-sm text-zinc-500 hover:text-zinc-700">
        ← Lavagna
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">{scheme.name}</h1>

      <div className="mt-4">
        <AddToSessionForm
          kind="schema"
          contentId={id}
          sessions={sessions ?? []}
          defaultDurationMinutes={null}
        />
      </div>

      <div className="mt-6">
        <TacticalBoardEditor
          schemeId={id}
          initial={{
            name: scheme.name,
            category: scheme.category as SchemeCategory,
            subcategory: scheme.subcategory,
            fieldData: scheme.field_data as unknown as FieldData,
          }}
        />
      </div>
    </div>
  );
}
