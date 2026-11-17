import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  FileText,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import { ArticleCard } from "@/components/site/cards";
import { CtaBand } from "@/components/site/cta-band";
import { Badge, ProjectStatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { Prose } from "@/components/ui/prose";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  articlesForProject,
  getArticles,
  getProjectBySlug,
  getProjects,
} from "@/lib/content/queries";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Projet introuvable" };
  return {
    title: `${project.acronym} — ${project.title}`,
    description: project.summary,
    alternates: { canonical: `/projets/${project.slug}` },
    openGraph: {
      type: "website",
      url: `/projets/${project.slug}`,
      title: `${project.acronym} | CLEDUCA-ODJ`,
      description: project.summary,
      images: [{ url: project.image, alt: project.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.acronym} | CLEDUCA-ODJ`,
      description: project.summary,
      images: [project.image],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, projects, articles] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getArticles(),
  ]);

  if (!project) notFound();

  const relatedArticles = articlesForProject(project.slug, articles);
  const otherProjects = projects.filter((item) => item.slug !== project.slug);

  return (
    <>
      <PageHero
        eyebrow={`Projet · ${project.acronym}`}
        title={project.title}
        intro={project.summary}
        crumbs={[{ label: "Projets", href: "/projets" }, { label: project.acronym }]}
        image={project.image}
        imageAlt={project.imageAlt}
        imageCaption="Photographie d’illustration. Voir les crédits photographiques."
      >
        <div className="flex flex-wrap items-center gap-2">
          <ProjectStatusBadge status={project.status} />
          <Badge tone="outline">
            <CalendarClock aria-hidden className="size-3" />
            {project.periodLabel}
          </Badge>
        </div>
      </PageHero>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div className="min-w-0">
            <div className="flex items-start gap-3 rounded-2xl border border-gold-200 bg-gold-100/50 p-5">
              <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-gold-600" />
              <p className="text-sm leading-relaxed text-ink-soft">
                {project.statusNote}
              </p>
            </div>

            <h2 className="mt-10 font-display text-2xl font-bold tracking-[-0.02em] text-forest-950">
              Contexte et logique d’intervention
            </h2>
            <div className="mt-4">
              <Prose>{project.context}</Prose>
            </div>

            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-forest-950">
                Objectifs
              </h2>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                {project.objectives.map((objective, index) => (
                  <li
                    key={objective}
                    className="flex items-start gap-3 rounded-xl border border-sand-300/80 bg-sand-50 p-4 text-sm leading-relaxed text-ink-soft"
                  >
                    <span className="font-display text-xs font-bold tabular-nums text-forest-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {objective}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-sand-300/80 bg-white p-6">
                <h3 className="flex items-center gap-2 font-display text-base font-bold text-forest-950">
                  <MapPin aria-hidden className="size-4 text-forest-600" />
                  Couverture
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {project.coverage.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-ink-soft">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-sand-300/80 bg-white p-6">
                <h3 className="flex items-center gap-2 font-display text-base font-bold text-forest-950">
                  <Users aria-hidden className="size-4 text-forest-600" />
                  Publics concernés
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {project.beneficiaries.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-ink-soft">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-forest-950">
                Activités principales
              </h2>
              <ul className="mt-5 grid gap-2.5">
                {project.activities.map((activity) => (
                  <li
                    key={activity}
                    className="flex items-start gap-3 border-b border-sand-200 pb-3 text-sm leading-relaxed text-ink-soft last:border-0"
                  >
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-400"
                    />
                    {activity}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 rounded-2xl border border-sand-300 bg-sand-50 p-6">
              <h2 className="font-display text-xl font-bold text-forest-950">
                Résultats publiés
              </h2>
              {project.results.length > 0 ? (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {project.results.map((result) => (
                    <li
                      key={result}
                      className="rounded-xl border border-sand-300 bg-white p-4 text-sm leading-relaxed text-ink-soft"
                    >
                      {result}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  Les résultats de ce projet ne sont pas encore publiés. Ils le
                  seront après vérification et consolidation des informations
                  disponibles. Aucun résultat n’est estimé ou extrapolé sur ce site.
                </p>
              )}
            </div>

            {project.slug === "civi-link" ? (
              <div className="mt-12 rounded-2xl border border-forest-200 bg-forest-50 p-6 sm:p-8">
                <p className="eyebrow flex items-center gap-2 text-forest-700">
                  <span aria-hidden className="h-px w-8 bg-gold-400" />
                  Gouvernance des données
                </p>
                <h2 className="mt-3 font-display text-2xl font-bold tracking-[-0.02em] text-forest-950">
                  Des principes non négociables.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  CIVI-LINK est conçu pour rester utile sans dépendre directement de
                  la participation des autorités publiques. Sa conception repose sur
                  les garanties suivantes :
                </p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    "Aucune donnée nominative sensible concernant des personnes déplacées n’est collectée ou exposée.",
                    "Les informations diffusées restent agrégées et ne permettent pas l’identification individuelle.",
                    "La gouvernance des données est partagée entre les parties prenantes.",
                    "La participation communautaire est centrale dans la conception et le suivi.",
                    "Toute analyse assistée par l’IA reste sélective, encadrée et respectueuse de principes éthiques.",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-xl border border-forest-200 bg-white p-4 text-[0.82rem] leading-relaxed text-ink-soft"
                    >
                      <ShieldCheck
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-forest-600"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {project.gallery.length > 0 ? (
              <div className="mt-12">
                <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-forest-950">
                  Illustrations
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {project.gallery.map((image) => (
                    <figure key={image.url}>
                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-sand-200">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          sizes="(min-width: 768px) 30vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="mt-2 text-[0.7rem] leading-relaxed text-ink-muted">
                        {image.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}

            {project.documents.length > 0 ? (
              <div className="mt-12">
                <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-forest-950">
                  Documents
                </h2>
                <ul className="mt-4 space-y-2">
                  {project.documents.map((document) => (
                    <li key={document.url}>
                      <a
                        href={document.url}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-forest-700 underline underline-offset-4"
                      >
                        <FileText aria-hidden className="size-4" />
                        {document.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-sand-300 bg-white p-6 shadow-soft">
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-forest-800">
                Fiche du projet
              </h2>
              <dl className="mt-4 space-y-3.5 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ink-muted">Acronyme</dt>
                  <dd className="font-display font-bold text-forest-900">
                    {project.acronym}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-sand-200 pt-3">
                  <dt className="text-ink-muted">Statut</dt>
                  <dd>
                    <ProjectStatusBadge status={project.status} />
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3 border-t border-sand-200 pt-3">
                  <dt className="text-ink-muted">Période</dt>
                  <dd className="text-right text-[0.8rem] font-medium text-forest-900">
                    {project.periodLabel}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3 border-t border-sand-200 pt-3">
                  <dt className="text-ink-muted">Couverture</dt>
                  <dd className="text-right text-[0.8rem] font-medium text-forest-900">
                    {project.coverage.join(" · ")}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-sand-300 bg-sand-50 p-6">
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-forest-800">
                Partenaires et financements
              </h2>
              {project.partners.length > 0 || project.funders.length > 0 ? (
                <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                  {[...project.partners, ...project.funders].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-[0.8rem] leading-relaxed text-ink-muted">
                  Aucun partenaire ni financement n’est publié pour ce projet à ce
                  stade. Les partenariats ne sont mentionnés qu’après vérification
                  et autorisation.
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-forest-900 p-6 text-white">
              <p className="font-display text-base font-bold">
                Ce projet vous intéresse ?
              </p>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-white/70">
                Pour toute question, proposition de collaboration ou demande
                d’information complémentaire, écrivez à l’équipe.
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

      {relatedArticles.length > 0 ? (
        <section className="border-y border-sand-300/70 bg-sand-50 py-16">
          <div className="container-site">
            <SectionHeading
              eyebrow="Publications liées"
              title="Pour aller plus loin."
              action={
                <ButtonLink href="/actualites" variant="secondary" size="sm" withArrow>
                  Toutes les actualités
                </ButtonLink>
              }
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {relatedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="horizontal" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-14">
        <div className="container-site">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-forest-800">
            Autres projets
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {otherProjects.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/projets/${item.slug}`}
                  className="group flex h-full items-center justify-between gap-3 rounded-xl border border-sand-300 bg-white px-4 py-3.5 text-sm font-semibold text-forest-900 transition hover:border-forest-300 hover:bg-sand-50"
                >
                  {item.acronym}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 text-ink-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/projets"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-900"
          >
            Voir tout le portefeuille
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </section>

      <CtaBand
        eyebrow="Soutenir l’action"
        title="Chaque initiative progresse grâce à des alliances solides."
        description="Vous souhaitez contribuer techniquement, financièrement ou institutionnellement à l’un de nos projets ? Contactez-nous pour examiner les modalités dans un cadre transparent."
        primaryHref="/contact"
        primaryLabel="Proposer un appui"
        secondaryHref="/impact"
        secondaryLabel="Voir les données d’impact"
      />
    </>
  );
}
