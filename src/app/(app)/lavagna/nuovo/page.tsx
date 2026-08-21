import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TacticalBoardEditor } from "@/components/tactical-board/tactical-board-editor";
import { EMPTY_FIELD_DATA, type BoardPlayer, type FieldData, type SchemeCategory } from "@/lib/types/tactical";

export default async function NuovoSchemaPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;
  const supabase = await createClient();

  let initial = {
    name: "",
    category: "offensivo" as SchemeCategory,
    subcategory: null as string | null,
    description: null as string | null,
    fieldData: EMPTY_FIELD_DATA,
    animationFrames: null as BoardPlayer[][] | null,
  };

  if (template) {
    const { data } = await supabase
      .from("tactical_schemes")
      .select("name, category, subcategory, description, field_data, animation_frames")
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
        animationFrames: (data.animation_frames as unknown as BoardPlayer[][] | null) ?? null,
      };
    }
  }

  const { data: team } = await supabase.from("team_settings").select("logo_url").maybeSingle();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:max-w-5xl">
      <Link href="/lavagna" className="text-sm text-[var(--ink-dim)] hover:text-[var(--ink)]">
        ← Lavagna
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-[var(--ink)]">Nuovo schema</h1>

      <div className="mt-6">
        <TacticalBoardEditor teamLogoUrl={team?.logo_url} initial={initial} />
      </div>
    </div>
  );
}
