"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import { signOut } from "@/lib/actions/auth";

export function SidebarNav({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-200 bg-white md:flex">
      <div className="px-5 py-6">
        <p className="text-lg font-semibold text-zinc-900">Lavagna Tattica</p>
        {userEmail && <p className="mt-0.5 truncate text-xs text-zinc-500">{userEmail}</p>}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Navigazione principale">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <form action={signOut} className="px-3 pb-6">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100"
        >
          Esci
        </button>
      </form>
    </aside>
  );
}
