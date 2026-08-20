import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--brand)] text-[var(--brand-fg)] hover:bg-[var(--brand-hover)] disabled:bg-[var(--brand-border)]",
  secondary:
    "bg-white text-zinc-900 border border-zinc-300 hover:bg-zinc-50 disabled:text-zinc-400",
  ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100 disabled:text-zinc-300",
  danger: "bg-[var(--danger)] text-white hover:opacity-90 disabled:opacity-50",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
