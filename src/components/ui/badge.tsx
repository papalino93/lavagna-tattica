import type { ReactNode } from "react";

type Tone = "emerald" | "amber" | "red" | "zinc";

const toneClasses: Record<Tone, string> = {
  emerald: "bg-[var(--brand-soft)] text-[var(--brand-hover)]",
  amber: "bg-[var(--warn-soft)] text-[var(--warn)]",
  red: "bg-[var(--danger-soft)] text-[var(--danger)]",
  zinc: "bg-[var(--surface-sunken)] text-[var(--ink-dim)]",
};

export function Badge({ tone = "zinc", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
