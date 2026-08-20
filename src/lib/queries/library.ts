import { createClient } from "@/lib/supabase/server";
import { SCHEME_CATEGORY_LABELS, type SchemeCategory, type FieldData } from "@/lib/types/tactical";
import { EXERCISE_CATEGORY_LABELS, type ExerciseCategory } from "@/lib/types/domain";

export interface LibraryCard {
  id: string;
  kind: "schema" | "esercizio";
  name: string;
  categoryLabel: string;
  subLabel: string | null;
  href: string;
  isFavorite: boolean;
  fieldData: FieldData | null;
}

export type LibraryTab = "libreria" | "miei" | "preferiti";
export type LibraryTipo = "schema" | "esercizio";

interface FetchLibraryOptions {
  tab: LibraryTab;
  tipo?: LibraryTipo;
  categoria?: string;
}

export async function fetchLibraryCards({
  tab,
  tipo,
  categoria,
}: FetchLibraryOptions): Promise<LibraryCard[]> {
  const supabase = await createClient();
  const cards: LibraryCard[] = [];

  const includeSchemes = tipo !== "esercizio";
  const includeExercises = tipo !== "schema";

  const [favoriteSchemeIds, favoriteExerciseIds] = await Promise.all([
    supabase.from("favorites").select("tactical_scheme_id").not("tactical_scheme_id", "is", null),
    supabase.from("favorites").select("exercise_id").not("exercise_id", "is", null),
  ]);
  const favSchemeSet = new Set(favoriteSchemeIds.data?.map((f) => f.tactical_scheme_id));
  const favExerciseSet = new Set(favoriteExerciseIds.data?.map((f) => f.exercise_id));

  if (includeSchemes) {
    if (tab === "preferiti") {
      const ids = Array.from(favSchemeSet).filter((v): v is string => !!v);
      if (ids.length > 0) {
        let q = supabase
          .from("tactical_schemes")
          .select("id, name, category, subcategory, field_data, updated_at")
          .in("id", ids);
        if (categoria) q = q.eq("category", categoria);
        const { data } = await q;
        for (const s of data ?? []) {
          cards.push(schemeToCard(s, favSchemeSet, tab));
        }
      }
    } else {
      let q = supabase
        .from("tactical_schemes")
        .select("id, name, category, subcategory, field_data, updated_at")
        .eq("is_template", tab === "libreria");
      if (categoria) q = q.eq("category", categoria);
      const { data } = await q.order(tab === "libreria" ? "name" : "updated_at", {
        ascending: tab === "libreria",
      });
      for (const s of data ?? []) {
        cards.push(schemeToCard(s, favSchemeSet, tab));
      }
    }
  }

  if (includeExercises) {
    if (tab === "preferiti") {
      const ids = Array.from(favExerciseSet).filter((v): v is string => !!v);
      if (ids.length > 0) {
        let q = supabase
          .from("exercises")
          .select("id, name, category, duration_minutes, updated_at")
          .in("id", ids);
        if (categoria) q = q.eq("category", categoria);
        const { data } = await q;
        for (const e of data ?? []) {
          cards.push(exerciseToCard(e, favExerciseSet, tab));
        }
      }
    } else {
      let q = supabase
        .from("exercises")
        .select("id, name, category, duration_minutes, updated_at")
        .eq("is_template", tab === "libreria");
      if (categoria) q = q.eq("category", categoria);
      const { data } = await q.order(tab === "libreria" ? "name" : "updated_at", {
        ascending: tab === "libreria",
      });
      for (const e of data ?? []) {
        cards.push(exerciseToCard(e, favExerciseSet, tab));
      }
    }
  }

  if (!tipo) {
    cards.sort((a, b) => a.name.localeCompare(b.name));
  }

  return cards;
}

function schemeToCard(
  s: {
    id: string;
    name: string;
    category: string;
    subcategory: string | null;
    field_data: unknown;
  },
  favSet: Set<string | null | undefined>,
  tab: LibraryTab,
): LibraryCard {
  return {
    id: s.id,
    kind: "schema",
    name: s.name,
    categoryLabel: SCHEME_CATEGORY_LABELS[s.category as SchemeCategory] ?? s.category,
    subLabel: s.subcategory,
    href: tab === "libreria" ? `/lavagna/nuovo?template=${s.id}` : `/lavagna/${s.id}`,
    isFavorite: favSet.has(s.id),
    fieldData: (s.field_data as unknown as FieldData) ?? null,
  };
}

function exerciseToCard(
  e: { id: string; name: string; category: string; duration_minutes: number | null },
  favSet: Set<string | null | undefined>,
  tab: LibraryTab,
): LibraryCard {
  return {
    id: e.id,
    kind: "esercizio",
    name: e.name,
    categoryLabel: EXERCISE_CATEGORY_LABELS[e.category as ExerciseCategory] ?? e.category,
    subLabel: e.duration_minutes ? `${e.duration_minutes} min` : null,
    href:
      tab === "libreria"
        ? `/lavagna/esercizi/nuovo?template=${e.id}`
        : `/lavagna/esercizi/${e.id}`,
    isFavorite: favSet.has(e.id),
    fieldData: null,
  };
}
