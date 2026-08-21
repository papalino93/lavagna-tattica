import { type TextareaHTMLAttributes, forwardRef } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-[var(--ink)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          aria-invalid={!!error}
          className={`rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--brand-ring)] ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-[var(--line-strong)] focus:border-[var(--brand)]"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
