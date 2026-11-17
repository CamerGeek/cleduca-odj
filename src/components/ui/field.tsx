import type {
  ComponentProps,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

export function Label({
  children,
  htmlFor,
  required,
  className,
}: {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn("field-label", className)}>
      {children}
      {required ? (
        <span className="ml-1 text-gold-600" aria-hidden>
          *
        </span>
      ) : null}
    </label>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input {...props} className={cn("field", className)} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className={cn("field min-h-32 resize-y leading-relaxed", className)}
    />
  );
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select {...props} className={cn("field pr-9", className)}>
      {children}
    </select>
  );
}

export function Checkbox({
  label,
  description,
  className,
  ...props
}: ComponentProps<"input"> & {
  label: ReactNode;
  description?: ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border border-sand-400/70 bg-white p-4 text-sm leading-relaxed text-ink-soft transition hover:border-forest-400/60",
        className,
      )}
    >
      <input
        type="checkbox"
        {...props}
        className="mt-0.5 size-4 shrink-0 rounded border-sand-400 text-forest-700 accent-forest-700"
      />
      <span>
        <span className="font-medium text-ink">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs text-ink-muted">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
      {children}
    </p>
  );
}

export function HelpText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <p className="field-help">{children}</p>;
}
