import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, House, LifeBuoy } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-sand-100 px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-[26rem] rounded-full bg-leaf-200/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pattern-weave pointer-events-none absolute inset-y-0 right-0 w-1/3 opacity-60"
      />
      <div className="container-site relative">
        <div className="mx-auto max-w-2xl text-center">
          <Link
            href="/"
            className="mx-auto flex w-fit items-center gap-3 rounded-full bg-white/70 px-3 py-2 ring-1 ring-sand-300"
          >
            <Image
              src={siteConfig.logoPath}
              alt="Logo de CLEDUCA-ODJ"
              width={44}
              height={44}
              className="size-11 object-contain"
            />
            <span className="text-left">
              <span className="block font-display text-sm font-extrabold tracking-[-0.01em] text-forest-950">
                CLEDUCA-ODJ
              </span>
              <span className="block text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-forest-600">
                Depuis 1997 · Burkina Faso
              </span>
            </span>
          </Link>

          <p className="eyebrow mt-10 flex items-center justify-center gap-2 text-forest-600">
            <span aria-hidden className="h-px w-8 bg-gold-400" />
            Erreur 404
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-forest-950 sm:text-5xl">
            Cette page n’existe pas ou n’est plus publiée.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-soft">
            Le lien est peut-être incomplet, l’adresse a changé ou le contenu a été
            retiré. Vous pouvez revenir à l’accueil, explorer les projets ou nous
            signaler le problème.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/" withArrow>
              <House aria-hidden className="size-4" />
              Retour à l’accueil
            </ButtonLink>
            <ButtonLink href="/projets" variant="secondary">
              <ArrowLeft aria-hidden className="size-4" />
              Voir les projets
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              <LifeBuoy aria-hidden className="size-4" />
              Signaler un lien
            </ButtonLink>
          </div>

          <nav aria-label="Pages utiles" className="mt-12">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.78rem]">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink-muted underline decoration-sand-400 underline-offset-4 transition hover:text-forest-700"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="text-ink-muted underline decoration-sand-400 underline-offset-4 transition hover:text-forest-700"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}
