import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";

export function CtaBand({
  eyebrow = "Passer à l’action",
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-[2rem] bg-forest-900 px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14">
          <div
            aria-hidden
            className="pattern-weave pointer-events-none absolute inset-0 opacity-25"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-leaf-500/20 blur-3xl"
          />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="eyebrow flex items-center gap-2 text-gold-300">
                <span aria-hidden className="h-px w-8 bg-gold-400" />
                {eyebrow}
              </p>
              <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[1.08] tracking-[-0.035em] sm:text-[2.4rem]">
                {title}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                {description}
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <ButtonLink href={primaryHref} variant="light" withArrow>
                {primaryLabel}
              </ButtonLink>
              {secondaryHref && secondaryLabel ? (
                <Link
                  href={secondaryHref}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/75 underline decoration-gold-400/60 underline-offset-4 transition hover:text-white"
                >
                  {secondaryLabel}
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
