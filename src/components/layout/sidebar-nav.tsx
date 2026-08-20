"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import { signOut } from "@/lib/actions/auth";

interface SidebarNavProps {
  userEmail: string | null;
  teamName: string;
  teamLogoUrl: string | null;
}

export function SidebarNav({ userEmail, teamName, teamLogoUrl }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white md:flex">
      <div
        className="flex items-center gap-3 px-5 py-6"
        style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
      >
        {teamLogoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={teamLogoUrl} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 font-display text-base font-bold">
            {teamName.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold">{teamName}</p>
          {userEmail && <p className="mt-0.5 truncate text-xs opacity-75">{userEmail}</p>}
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 pt-4" aria-label="Navigazione principale">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--brand-soft)] text-[var(--brand-hover)]"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 px-3 pb-6">
        <Link
          href="/impostazioni"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname.startsWith("/impostazioni")
              ? "bg-[var(--brand-soft)] text-[var(--brand-hover)]"
              : "text-zinc-500 hover:bg-zinc-100"
          }`}
        >
          Impostazioni
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100"
          >
            Esci
          </button>
        </form>
      </div>
    </aside>
  );
}
