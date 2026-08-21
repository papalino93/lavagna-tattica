import Link from "next/link";
import { signOut } from "@/lib/actions/auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface MobileHeaderProps {
  teamName: string;
  teamLogoUrl: string | null;
}

export function MobileHeader({ teamName, teamLogoUrl }: MobileHeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-4 py-3 md:hidden"
      style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
    >
      <div className="flex min-w-0 items-center gap-2">
        {teamLogoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={teamLogoUrl} alt="" className="h-7 w-7 shrink-0 rounded-md object-cover" />
        ) : (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/15 font-display text-xs font-bold">
            {teamName.slice(0, 2).toUpperCase()}
          </div>
        )}
        <p className="truncate font-display text-base font-bold">{teamName}</p>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <ThemeToggle className="-m-2.5 flex h-10 w-10 items-center justify-center opacity-90" />
        <Link href="/impostazioni" className="text-sm font-medium opacity-90">
          Impostazioni
        </Link>
        <form action={signOut}>
          <button type="submit" className="text-sm font-medium opacity-90" aria-label="Esci">
            Esci
          </button>
        </form>
      </div>
    </header>
  );
}
