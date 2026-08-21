import { type SelectHTMLAttributes, forwardRef } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className = "", children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-[var(--ink)]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error}
          className={`rounded-lg border bg-[var(--surface-raised)] px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--brand-ring)] ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-[var(--line-strong)] focus:border-[var(--brand)]"
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);
Select.displayName = "Select";
