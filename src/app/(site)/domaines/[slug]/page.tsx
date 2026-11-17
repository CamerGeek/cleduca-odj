import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Info, MapPin, Users } from "lucide-react";

import { ProjectCard } from "@/components/site/cards";
import { CtaBand } from "@/components/site/cta-band";
import { AreaStatusBadge, Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, PageHero } from "@/components/ui/page-hero";
import { Prose } from "@/components/ui/prose";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getAreaBySlug,
  getAreas,
  getProjects,
  projectsForArea,
} from "@/lib/content/queries";

interface AreaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: AreaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = await getAreaBySlug(slug);
  if (!area) return { title: "Domaine introuvable" };
  return {
    title: area.title,
    description: area.summary,
    alternates: { canonical: `/domaines/${area.slug}` },
    openGraph: {
      type: "website",
      url: `/domaines/${area.slug}`,
      title: `${area.title} | CLEDUCA-ODJ`,
      description: area.summary,
      images: [{ url: area.image, alt: area.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${area.title} | CLEDUCA-ODJ`,
      description: area.summary,
      images: [area.image],
    },
  };
}

export default async function AreaPage({ params }: AreaPageProps) {
  const { slug } = await params;
  const [area, areas, projects] = await Promise.all([
    getAreaBySlug(slug),
    getAreas(),
    getProjects(),
  ]);

  if (!area) notFound();

  const relatedProjects = projectsForArea(area.slug, projects);
  const otherAreas = areas.filter((item) => item.slug !== area.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Domaine d’intervention"
        title={area.title}
        intro={area.tagline}
        crumbs={[
          { label: "Domaines d’intervention", href: "/domaines" },
          { label: area.shortTitle },
        ]}
        image={area.image}
        imageAlt={area.imageAlt}
        imageCaption="Photographie d’illustration. Voir les crédits photographiques."
      >
        <div className="flex flex-wrap items-center gap-2">
          <AreaStatusBadge status={area.status} />
          <Badge tone="outline">
            {relatedProjects.length} initiative{relatedProjects.length > 1 ? "s" : ""} liée
            {relatedProjects.length > 1 ? "s" : ""}
          </Badge>
        </div>
      </PageHero>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div className="min-w-0">
            <div className="flex items-start gap-3 rounded-2xl border border-sand-300 bg-sand-50 p-5">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-forest-600" />
              <p className="text-sm leading-relaxed text-ink-soft">
                {area.statusNote}
              </p>
            </div>

            <div className="mt-8">
              <Prose>{area.description}</Prose>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-sand-300/80 bg-sand-50 p-6">
                <h2 className="font-display text-lg font-bold text-forest-950">
                  Enjeux identifiés
                </h2>
                <ul className="mt-4 space-y-3">
                  {area.challenges.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
                      <span
                        aria-hidden
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-400"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-forest-200 bg-forest-50 p-6">
                <h2 className="font-display text-lg font-bold text-forest-950">
                  Objectifs
                </h2>
                <ol className="mt-4 space-y-3">
                  {area.objectives.map((item, index) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                      <span className="font-display text-xs font-bold tabular-nums text-forest-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-forest-950">
                Notre approche
              </h2>
              <div className="mt-4">
                <Prose>{area.methodology}</Prose>
              </div>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-sand-300 bg-white p-6 shadow-soft">
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-forest-800">
                En bref
              </h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                    Publics
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {area.audiences.map((audience) => (
                      <span
                        key={audience}
                        className="rounded-full bg-sand-100 px-2.5 py-1 text-[0.7rem] text-ink-soft"
                      >
                        {audience}
                      </span>
                    ))}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-sand-200 pt-3">
                  <dt className="flex items-center gap-2 text-ink-soft">
                    <Users aria-hidden className="size-4 text-forest-600" />
                    Initiatives liées
                  </dt>
                  <dd className="font-display font-bold text-forest-900">
                    {relatedProjects.length}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-sand-200 pt-3">
                  <dt className="flex items-center gap-2 text-ink-soft">
                    <MapPin aria-hidden className="size-4 text-forest-600" />
                    Ancrage
                  </dt>
                  <dd className="text-right text-[0.8rem] font-medium text-forest-900">
                    Bobo-Dioulasso
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl bg-forest-900 p-6 text-white">
              <p className="font-display text-base font-bold">
                Une question sur ce domaine ?
              </p>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-white/70">
                Écrivez-nous pour obtenir des informations complémentaires ou
                proposer une collaboration.
              </p>
              <ButtonLink
                href="/contact"
                variant="light"
                size="sm"
                withArrow
                className="mt-4"
              >
                Nous contacter
              </ButtonLink>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-sand-300/70 bg-sand-50 py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Initiatives liées"
            title="Ce domaine en pratique."
            description="Les projets ci-dessous contribuent à ce domaine d’intervention. Chaque fiche précise le statut, la couverture et le niveau de documentation disponible."
            action={
              <ButtonLink href="/projets" variant="secondary" size="sm" withArrow>
                Tous les projets
              </ButtonLink>
            }
          />
          {relatedProjects.length > 0 ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState
                title="Aucune initiative active publiée"
                description="Ce domaine est un axe de positionnement institutionnel. Les initiatives seront publiées après vérification et documentation."
              />
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-site">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-forest-800">
            Poursuivre l’exploration
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {otherAreas.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/domaines/${item.slug}`}
                  className="group flex h-full items-center justify-between gap-3 rounded-xl border border-sand-300 bg-white px-4 py-3.5 text-sm font-semibold text-forest-900 transition hover:border-forest-300 hover:bg-sand-50"
                >
                  {item.shortTitle}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 text-ink-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/domaines"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-900"
          >
            Voir les neuf domaines
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </section>

      <CtaBand
        eyebrow="Agir ensemble"
        title="Ce domaine rejoint votre mandat ou vos priorités ?"
        description="Échangeons sur les complémentarités possibles, dans le respect des mandats, des communautés et des règles de protection des données."
        primaryHref="/contact"
        primaryLabel="Proposer une collaboration"
        secondaryHref="/partenaires"
        secondaryLabel="Comprendre notre politique de partenariat"
      />
    </>
  );
}
