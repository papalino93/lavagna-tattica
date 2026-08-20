import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TacticalBoardEditor } from "@/components/tactical-board/tactical-board-editor";
import { EMPTY_FIELD_DATA, type FieldData, type SchemeCategory } from "@/lib/types/tactical";

export default async function NuovoSchemaPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;

  let initial = {
    name: "",
    category: "offensivo" as SchemeCategory,
    subcategory: null as string | null,
    description: null as string | null,
    fieldData: EMPTY_FIELD_DATA,
  };

  if (template) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tactical_schemes")
      .select("name, category, subcategory, description, field_data")
      .eq("id", template)
      .eq("is_template", true)
      .maybeSingle();

    if (data) {
      initial = {
        name: data.name,
        category: data.category as SchemeCategory,
        subcategory: data.subcategory,
        description: data.description,
        fieldData: data.field_data as unknown as FieldData,
      };
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/lavagna" className="text-sm text-zinc-500 hover:text-zinc-700">
        ← Lavagna
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">Nuovo schema</h1>

      <div className="mt-6">
        <TacticalBoardEditor initial={initial} />
      </div>
    </div>
  );
}
