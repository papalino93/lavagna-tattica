import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TacticalBoardEditor } from "@/components/tactical-board/tactical-board-editor";
import type { FieldData, SchemeCategory } from "@/lib/types/tactical";

export default async function SchemaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: scheme } = await supabase
    .from("tactical_schemes")
    .select("name, category, subcategory, field_data")
    .eq("id", id)
    .eq("is_template", false)
    .maybeSingle();

  if (!scheme) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/lavagna" className="text-sm text-zinc-500 hover:text-zinc-700">
        ← Lavagna
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">{scheme.name}</h1>

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
