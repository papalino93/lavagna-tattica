import Link from "next/link";
import { signOut } from "@/lib/actions/auth";

interface MobileHeaderProps {
  teamName: string;
  teamLogoUrl: string | null;
}

export function MobileHeader({ teamName, teamLogoUrl }: MobileHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
      <div className="flex min-w-0 items-center gap-2">
        {teamLogoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={teamLogoUrl} alt="" className="h-7 w-7 shrink-0 rounded-md object-cover" />
        )}
        <p className="truncate text-base font-semibold text-zinc-900">{teamName}</p>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <Link href="/impostazioni" className="text-sm font-medium text-zinc-500">
          Impostazioni
        </Link>
        <form action={signOut}>
          <button type="submit" className="text-sm font-medium text-zinc-500" aria-label="Esci">
            Esci
          </button>
        </form>
      </div>
    </header>
  );
}
