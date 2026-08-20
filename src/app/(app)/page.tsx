import Link from "next/link";
import { NAV_ITEMS } from "@/components/layout/nav-items";

export default function DashboardPage() {
  const sections = NAV_ITEMS.filter((item) => item.href !== "/");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Impalcatura pronta: rosa, allenamenti, partite e lavagna tattica
        arrivano nelle prossime fasi.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Icon className="h-6 w-6" />
            </span>
            <span className="font-medium text-zinc-800">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
