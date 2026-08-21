"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import { signOut } from "@/lib/actions/auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface SidebarNavProps {
  userEmail: string | null;
  teamName: string;
  teamLogoUrl: string | null;
}

export function SidebarNav({ userEmail, teamName, teamLogoUrl }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--surface-raised)] md:flex">
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
                  : "text-[var(--ink-dim)] hover:bg-[var(--surface-sunken)]"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 px-3 pb-6">
        <div className="flex items-center gap-2 px-3 py-1.5">
          <ThemeToggle className="flex items-center justify-center rounded-lg p-1.5 text-[var(--ink-dim)] transition-colors hover:bg-[var(--surface-sunken)]" />
          <span className="text-xs text-[var(--ink-dim)]">Tema</span>
        </div>
        <Link
          href="/impostazioni"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname.startsWith("/impostazioni")
              ? "bg-[var(--brand-soft)] text-[var(--brand-hover)]"
              : "text-[var(--ink-dim)] hover:bg-[var(--surface-sunken)]"
          }`}
        >
          Impostazioni
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--ink-dim)] transition-colors hover:bg-[var(--surface-sunken)]"
          >
            Esci
          </button>
        </form>
      </div>
    </aside>
  );
}
