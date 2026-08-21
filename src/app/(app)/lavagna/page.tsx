import Link from "next/link";
import { FavoriteButton } from "@/components/library/favorite-button";
import { SchemeThumbnail } from "@/components/tactical-board/scheme-thumbnail";
import { ExerciseThumbnail } from "@/components/exercises/exercise-thumbnail";
import { fetchLibraryCards, type LibraryTab } from "@/lib/queries/library";
import { SCHEME_CATEGORIES, SCHEME_CATEGORY_LABELS, SET_PIECE_SUBCATEGORIES } from "@/lib/types/tactical";
import { EXERCISE_CATEGORIES, EXERCISE_CATEGORY_LABELS } from "@/lib/types/domain";

interface LavagnaSearchParams {
  tab?: string;
  tipo?: string;
  categoria?: string;
  sottocategoria?: string;
}

const TABS: { value: LibraryTab; label: string }[] = [
  { value: "libreria", label: "Libreria" },
  { value: "miei", label: "Miei schemi" },
  { value: "preferiti", label: "Preferiti" },
];

export default async function LavagnaPage({
  searchParams,
}: {
  searchParams: Promise<LavagnaSearchParams>;
}) {
  const { tab: rawTab, tipo: rawTipo, categoria, sottocategoria } = await searchParams;
  const tab: LibraryTab = rawTab === "miei" || rawTab === "preferiti" ? rawTab : "libreria";
  const tipo = rawTipo === "schema" || rawTipo === "esercizio" ? rawTipo : undefined;
  const isSetPiece = tipo === "schema" && categoria === "palla_inattiva";

  const cards = await fetchLibraryCards({
    tab,
    tipo,
    categoria,
    sottocategoria: isSetPiece ? sottocategoria : undefined,
  });

  function tabHref(value: LibraryTab) {
    return `/lavagna?tab=${value}`;
  }
  function tipoHref(value?: "schema" | "esercizio") {
    const params = new URLSearchParams({ tab });
    if (value) params.set("tipo", value);
    return `/lavagna?${params.toString()}`;
  }
  function categoriaHref(value?: string) {
    const params = new URLSearchParams({ tab });
    if (tipo) params.set("tipo", tipo);
    if (value) params.set("categoria", value);
    return `/lavagna?${params.toString()}`;
  }
  function sottocategoriaHref(value?: string) {
    const params = new URLSearchParams({ tab, tipo: "schema", categoria: "palla_inattiva" });
    if (value) params.set("sottocategoria", value);
    return `/lavagna?${params.toString()}`;
  }

  const categoryOptions =
    tipo === "schema"
      ? SCHEME_CATEGORIES.map((c) => ({ value: c, label: SCHEME_CATEGORY_LABELS[c] }))
      : tipo === "esercizio"
        ? EXERCISE_CATEGORIES.map((c) => ({ value: c, label: EXERCISE_CATEGORY_LABELS[c] }))
        : [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--ink)]">Lavagna tattica</h1>
        <div className="flex gap-2">
          <Link
            href="/lavagna/esercizi/nuovo"
            className="rounded-lg border border-[var(--line-strong)] px-3 py-2 text-sm font-medium text-[var(--ink)] hover:bg-[var(--surface)]"
          >
            + Esercizio
          </Link>
          <Link
            href="/lavagna/nuovo"
            className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--brand-hover)]"
          >
            + Schema
          </Link>
        </div>
      </div>

      <div className="mt-5 flex gap-1 rounded-lg bg-[var(--surface-sunken)] p-1">
        {TABS.map((t) => (
          <Link
            key={t.value}
            href={tabHref(t.value)}
            className={`flex-1 rounded-md py-1.5 text-center text-sm font-medium transition-colors ${
              tab === t.value ? "bg-[var(--surface-raised)] text-[var(--ink)] shadow-sm" : "text-[var(--ink-dim)]"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterChip label="Tutti" active={!tipo} href={tipoHref()} />
        <FilterChip label="Schemi tattici" active={tipo === "schema"} href={tipoHref("schema")} />
        <FilterChip label="Esercizi" active={tipo === "esercizio"} href={tipoHref("esercizio")} />
      </div>

      {categoryOptions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          <FilterChip label="Tutte le categorie" active={!categoria} href={categoriaHref()} muted />
          {categoryOptions.map((c) => (
            <FilterChip
              key={c.value}
              label={c.label}
              active={categoria === c.value}
              href={categoriaHref(c.value)}
              muted
            />
          ))}
        </div>
      )}

      {isSetPiece && (
        <div className="mt-2 flex flex-wrap gap-2">
          <FilterChip label="Tutti i tipi" active={!sottocategoria} href={sottocategoriaHref()} muted />
          {SET_PIECE_SUBCATEGORIES.map((s) => (
            <FilterChip
              key={s}
              label={s}
              active={sottocategoria === s}
              href={sottocategoriaHref(s)}
              muted
            />
          ))}
        </div>
      )}

      {cards.length === 0 && (
        <p className="mt-6 text-sm text-[var(--ink-dim)]">
          {tab === "preferiti"
            ? "Nessun preferito ancora. Tocca la stella su uno schema o esercizio per salvarlo qui."
            : tab === "miei"
              ? "Nessun contenuto ancora. Duplica qualcosa dalla Libreria o crealo da zero."
              : "Nessun contenuto in questa categoria."}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={`${card.kind}-${card.id}`}
            href={card.href}
            className="group relative overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-[var(--surface-sunken)]">
              {card.kind === "schema" ? (
                <SchemeThumbnail fieldData={card.fieldData} />
              ) : (
                <ExerciseThumbnail category={card.exerciseCategory ?? "riscaldamento"} intensity={card.intensity} />
              )}
              <div className="absolute top-1.5 right-1.5 rounded-full bg-white/90 backdrop-blur-sm">
                <FavoriteButton
                  kind={card.kind === "schema" ? "schema" : "esercizio"}
                  id={card.id}
                  initialFavorite={card.isFavorite}
                />
              </div>
            </div>
            <div className="p-2.5">
              <p className="truncate text-sm font-semibold text-[var(--ink)]">{card.name}</p>
              <div className="mt-1 flex items-center justify-between gap-1">
                <span className="truncate text-xs text-[var(--ink-dim)]">
                  {card.subLabel ?? card.categoryLabel}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  href,
  muted,
}: {
  label: string;
  active: boolean;
  href: string;
  muted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? muted
            ? "bg-zinc-700 text-white"
            : "bg-[var(--brand)] text-white"
          : "bg-[var(--surface-sunken)] text-[var(--ink-dim)] hover:bg-[var(--surface-hover-strong)]"
      }`}
    >
      {label}
    </Link>
  );
}
