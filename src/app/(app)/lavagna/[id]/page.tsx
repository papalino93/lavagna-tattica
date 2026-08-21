import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TacticalBoardEditor } from "@/components/tactical-board/tactical-board-editor";
import { AddToSessionForm } from "@/components/training/add-to-session-form";
import { PresentationButton } from "@/components/tactical-board/presentation-view";
import type { FieldData, SchemeCategory } from "@/lib/types/tactical";

export default async function SchemaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: scheme }, { data: sessions }, { data: team }] = await Promise.all([
    supabase
      .from("tactical_schemes")
      .select("name, category, subcategory, description, field_data")
      .eq("id", id)
      .eq("is_template", false)
      .maybeSingle(),
    supabase
      .from("training_sessions")
      .select("id, date")
      .gte("date", new Date().toISOString().slice(0, 10))
      .order("date", { ascending: true })
      .limit(10),
    supabase.from("team_settings").select("logo_url").maybeSingle(),
  ]);

  if (!scheme) {
    notFound();
  }

  const fieldData = scheme.field_data as unknown as FieldData;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/lavagna" className="text-sm text-zinc-500 hover:text-zinc-700">
        ← Lavagna
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold text-zinc-900">{scheme.name}</h1>
        <PresentationButton name={scheme.name} fieldData={fieldData} teamLogoUrl={team?.logo_url} />
      </div>

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
            description: scheme.description,
            fieldData,
          }}
        />
      </div>
    </div>
  );
}
