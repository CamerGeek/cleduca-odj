import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, House } from "lucide-react";

import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({
  items,
  tone = "dark",
}: {
  items: Crumb[];
  tone?: "dark" | "light";
}) {
  return (
    <nav aria-label="Fil d’Ariane" className="mb-7">
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-[0.78rem]",
          tone === "light" ? "text-white/65" : "text-ink-muted",
        )}
      >
        <li>
          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-1.5 rounded transition",
              tone === "light" ? "hover:text-white" : "hover:text-forest-700",
            )}
          >
            <House aria-hidden className="size-3.5" />
            Accueil
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
            <ChevronRight aria-hidden className="size-3.5 opacity-50" />
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "rounded transition",
                  tone === "light" ? "hover:text-white" : "hover:text-forest-700",
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className={tone === "light" ? "text-white" : "text-forest-800"}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  image,
  imageAlt,
  imageCaption,
  children,
  aside,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  crumbs?: Crumb[];
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-sand-300/80 bg-sand-100">
      <div
        aria-hidden
        className="absolute -right-32 -top-40 size-[30rem] rounded-full bg-leaf-200/45 blur-3xl"
      />
      <div
        aria-hidden
        className="pattern-weave absolute inset-y-0 right-0 w-1/3 opacity-70"
      />
      <div className="container-site relative py-12 md:py-16 lg:py-20">
        {crumbs ? <Breadcrumbs items={crumbs} /> : null}
        <div
          className={cn(
            "grid items-center gap-10",
            image ? "lg:grid-cols-[1.15fr_0.85fr]" : "max-w-4xl",
          )}
        >
          <div>
            <p className="eyebrow flex items-center gap-2 text-forest-600">
              <span aria-hidden className="h-px w-8 bg-gold-400" />
              {eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.04] tracking-[-0.04em] text-forest-950 sm:text-5xl lg:text-[3.6rem]">
              {title}
            </h1>
            {intro ? (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
                {intro}
              </p>
            ) : null}
            {children ? <div className="mt-8">{children}</div> : null}
          </div>
          {image ? (
            <figure className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-sand-200 shadow-card">
                <Image
                  src={image}
                  alt={imageAlt || ""}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  priority
                />
              </div>
              {imageCaption ? (
                <figcaption className="mt-3 max-w-md text-[0.7rem] leading-relaxed text-ink-muted">
                  {imageCaption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
          {aside}
        </div>
      </div>
    </section>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-sand-400 bg-sand-50 px-6 py-14 text-center">
      {icon ? (
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-white text-forest-600 shadow-soft">
          {icon}
        </div>
      ) : null}
      <h3 className="font-display text-lg font-bold text-forest-900">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
