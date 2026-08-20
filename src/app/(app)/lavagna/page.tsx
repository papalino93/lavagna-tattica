import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { SCHEME_CATEGORIES, SCHEME_CATEGORY_LABELS, type SchemeCategory } from "@/lib/types/tactical";

export default async function LavagnaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("tactical_schemes")
    .select("id, name, category, subcategory")
    .eq("is_template", false)
    .order("updated_at", { ascending: false });

  if (categoria) {
    query = query.eq("category", categoria);
  }

  const [{ data: schemes, error }, { data: templates }] = await Promise.all([
    query,
    supabase
      .from("tactical_schemes")
      .select("id, name, category, subcategory")
      .eq("is_template", true)
      .order("name"),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Lavagna tattica</h1>
        <Link
          href="/lavagna/nuovo"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          + Schema
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterLink label="Tutti" active={!categoria} href="/lavagna" />
        {SCHEME_CATEGORIES.map((c) => (
          <FilterLink
            key={c}
            label={SCHEME_CATEGORY_LABELS[c]}
            active={categoria === c}
            href={`/lavagna?categoria=${c}`}
          />
        ))}
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-600">Non è stato possibile caricare gli schemi.</p>
      )}

      {!error && schemes?.length === 0 && (
        <p className="mt-6 text-sm text-zinc-500">
          Nessuno schema {categoria ? "in questa categoria" : "ancora salvato"}.
        </p>
      )}

      <ul className="mt-4 flex flex-col gap-2">
        {schemes?.map((scheme) => (
          <li key={scheme.id}>
            <Link
              href={`/lavagna/${scheme.id}`}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
            >
              <div>
                <p className="font-medium text-zinc-900">{scheme.name}</p>
                {scheme.subcategory && (
                  <p className="mt-0.5 text-sm text-zinc-500">{scheme.subcategory}</p>
                )}
              </div>
              <Badge tone="zinc">{SCHEME_CATEGORY_LABELS[scheme.category as SchemeCategory]}</Badge>
            </Link>
          </li>
        ))}
      </ul>

      {templates && templates.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900">Template palle inattive</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Apri un template e salvalo per personalizzarlo, senza partire da campo vuoto.
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {templates.map((tpl) => (
              <li key={tpl.id}>
                <Link
                  href={`/lavagna/nuovo?template=${tpl.id}`}
                  className="flex items-center justify-between rounded-xl border border-dashed border-zinc-300 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
                >
                  <div>
                    <p className="font-medium text-zinc-900">{tpl.name}</p>
                    {tpl.subcategory && (
                      <p className="mt-0.5 text-sm text-zinc-500">{tpl.subcategory}</p>
                    )}
                  </div>
                  <span className="text-emerald-600 text-sm">Usa →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FilterLink({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
      }`}
    >
      {label}
    </Link>
  );
}
