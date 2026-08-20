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
          <label htmlFor={id} className="text-sm font-medium text-zinc-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error}
          className={`rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500/30 ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-zinc-300 focus:border-emerald-500"
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
