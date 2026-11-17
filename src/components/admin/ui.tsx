import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type AdminTone = "green" | "gold" | "neutral" | "danger" | "forest";

const badgeTones: Record<AdminTone, string> = {
  green: "bg-forest-50 text-forest-800 border-forest-200",
  gold: "bg-gold-100 text-gold-600 border-gold-200",
  neutral: "bg-sand-200 text-ink-soft border-sand-300",
  danger: "bg-red-50 text-red-800 border-red-200",
  forest: "bg-forest-800 text-white border-forest-800",
};

export function AdminBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: AdminTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-display text-[0.66rem] font-bold uppercase tracking-[0.1em]",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="font-display text-[0.68rem] font-bold uppercase tracking-[0.2em] text-forest-600">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-forest-900 sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}

export function AdminPanel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-sand-300/80 bg-white shadow-soft",
        className,
      )}
    >
      {title || actions ? (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-sand-200 px-5 py-4 sm:px-6">
          <div>
            {title ? (
              <h2 className="font-display text-base font-bold text-forest-900">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      <div className={cn("px-5 py-4 sm:px-6 sm:py-5", bodyClassName)}>
        {children}
      </div>
    </section>
  );
}

export function AdminStat({
  label,
  value,
  hint,
  href,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  tone?: "neutral" | "green" | "gold";
}) {
  const tones = {
    neutral: "bg-white border-sand-300/80",
    green: "bg-forest-800 border-forest-800 text-white",
    gold: "bg-gold-100 border-gold-200",
  } as const;

  const inner = (
    <>
      <p
        className={cn(
          "font-display text-[0.66rem] font-bold uppercase tracking-[0.16em]",
          tone === "green" ? "text-white/70" : "text-forest-600",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-display text-3xl font-bold tabular-nums",
          tone === "green" ? "text-white" : "text-forest-900",
        )}
      >
        {value}
      </p>
      {hint ? (
        <p
          className={cn(
            "mt-1 text-xs leading-relaxed",
            tone === "green" ? "text-white/70" : "text-ink-muted",
          )}
        >
          {hint}
        </p>
      ) : null}
    </>
  );

  const className = cn(
    "block rounded-2xl border p-4 shadow-soft transition sm:p-5",
    tones[tone],
    href && "hover:-translate-y-0.5 hover:shadow-card",
  );

  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}

export function AdminEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-sand-400/80 bg-sand-50 px-5 py-10 text-center">
      <p className="font-display text-base font-semibold text-forest-900">
        {title}
      </p>
      {description ? (
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function AdminNotice({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: "info" | "success" | "warning" | "danger";
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    info: "border-forest-200 bg-forest-50 text-forest-900",
    success: "border-forest-300 bg-forest-50 text-forest-900",
    warning: "border-gold-200 bg-gold-100 text-gold-600",
    danger: "border-red-200 bg-red-50 text-red-900",
  } as const;

  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm leading-relaxed",
        tones[tone],
        className,
      )}
    >
      {title ? <p className="font-display font-semibold">{title}</p> : null}
      <div className={cn(title && "mt-1")}>{children}</div>
    </div>
  );
}

export function AdminLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 font-display text-sm font-semibold text-forest-700 underline-offset-4 hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}
