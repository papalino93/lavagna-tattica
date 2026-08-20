import { signOut } from "@/lib/actions/auth";

export function MobileHeader() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
      <p className="text-base font-semibold text-zinc-900">Lavagna Tattica</p>
      <form action={signOut}>
        <button
          type="submit"
          className="text-sm font-medium text-zinc-500"
          aria-label="Esci"
        >
          Esci
        </button>
      </form>
    </header>
  );
}
