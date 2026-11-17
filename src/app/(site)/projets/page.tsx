import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { ProjectCard } from "@/components/site/cards";
import { CtaBand } from "@/components/site/cta-band";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, PageHero } from "@/components/ui/page-hero";
import {
  getAreas,
  getProjects,
} from "@/lib/content/queries";
import {
  PROJECT_STATUS_LABELS,
  type ProjectStatus,
} from "@/lib/content/types";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Projets",
  description:
    "Le portefeuille de projets de CLEDUCA-ODJ : PASEDI, PALVEN, Justice de proximité – Guiriko et CIVI-LINK, avec leur statut, leur couverture et leur niveau de documentation.",
  path: "/projets",
});

const statusKeys = Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[];

interface ProjectsSearchParams {
  statut?: string;
  domaine?: string;
  q?: string;
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<ProjectsSearchParams>;
}) {
  const [params, projects, areas] = await Promise.all([
    searchParams,
    getProjects(),
    getAreas(),
  ]);

  const status = statusKeys.includes(params.statut as ProjectStatus)
    ? (params.statut as ProjectStatus)
    : null;
  const areaSlug = areas.some((area) => area.slug === params.domaine)
    ? params.domaine
    : null;
  const query = (params.q ?? "").trim();
  const normalizedQuery = query.toLowerCase();

  const filtered = projects.filter((project) => {
    if (status && project.status !== status) return false;
    if (areaSlug && !project.areaSlugs.includes(areaSlug)) return false;
    if (normalizedQuery) {
      const haystack = [
        project.title,
        project.acronym,
        project.summary,
        project.coverage.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(normalizedQuery)) return false;
    }
    return true;
  });

  const activeFilters = [
    status ? PROJECT_STATUS_LABELS[status] : null,
    areaSlug ? areas.find((area) => area.slug === areaSlug)?.shortTitle : null,
    query || null,
  ].filter(Boolean) as string[];

  const hasFilters = Boolean(status || areaSlug || query);

  return (
    <>
      <PageHero
        eyebrow="Portefeuille de projets"
        title="Des initiatives documentées, présentées avec leur statut réel."
        intro="PASEDI, PALVEN, Justice de proximité – Guiriko et CIVI-LINK : chaque projet est présenté avec son contexte, ses objectifs, sa couverture et le niveau de confirmation de ses informations."
        crumbs={[{ label: "Projets" }]}
        image="/images/hero-classroom.jpg"
        imageAlt="Élèves dans une salle de classe au Burkina Faso."
        imageCaption="Photo d’illustration : école au Burkina Faso. Crédit : KKB, CC BY-SA 4.0."
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="green">{projects.length} initiatives publiées</Badge>
          <Badge tone="outline">{areas.length} domaines mobilisés</Badge>
        </div>
      </PageHero>

      <section className="border-b border-sand-300/70 bg-sand-50 py-8">
        <div className="container-site">
          <form
            method="get"
            action="/projets"
            className="flex flex-col gap-4 lg:flex-row lg:items-end"
          >
            <div className="flex-1">
              <label
                htmlFor="project-search"
                className="field-label flex items-center gap-2"
              >
                <Search aria-hidden className="size-4 text-forest-600" />
                Rechercher un projet
              </label>
              <input
                id="project-search"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Nom, acronyme, zone couverte…"
                className="field"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:w-[36rem]">
              <div>
                <label htmlFor="project-status" className="field-label">
                  Statut
                </label>
                <select
                  id="project-status"
                  name="statut"
                  defaultValue={status ?? ""}
                  className="field"
                >
                  <option value="">Tous les statuts</option>
                  {statusKeys.map((key) => (
                    <option key={key} value={key}>
                      {PROJECT_STATUS_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="project-area" className="field-label">
                  Domaine
                </label>
                <select
                  id="project-area"
                  name="domaine"
                  defaultValue={areaSlug ?? ""}
                  className="field"
                >
                  <option value="">Tous les domaines</option>
                  {areas.map((area) => (
                    <option key={area.slug} value={area.slug}>
                      {area.shortTitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-700 px-5 py-3 font-display text-sm font-semibold text-white transition hover:bg-forest-800"
              >
                <SlidersHorizontal aria-hidden className="size-4" />
                Filtrer
              </button>
              {hasFilters ? (
                <Link
                  href="/projets"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-sand-400 px-4 py-3 font-display text-sm font-semibold text-ink-soft transition hover:bg-white"
                >
                  <X aria-hidden className="size-4" />
                  Réinitialiser
                </Link>
              ) : null}
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-ink-soft">
              {filtered.length} projet{filtered.length > 1 ? "s" : ""} affiché
              {filtered.length > 1 ? "s" : ""}
            </span>
            {activeFilters.map((filter) => (
              <Badge key={filter} tone="outline">
                {filter}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site">
          {filtered.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Search aria-hidden className="size-5" />}
              title="Aucun projet ne correspond à ces critères"
              description="Modifiez les filtres ou réinitialisez la recherche pour afficher l’ensemble du portefeuille."
              action={
                <ButtonLink href="/projets" variant="secondary" withArrow>
                  Réinitialiser les filtres
                </ButtonLink>
              }
            />
          )}

          <div className="mt-12 rounded-2xl border border-sand-300 bg-sand-50 p-6">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-forest-800">
              Comprendre les statuts
            </h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {statusKeys.map((key) => (
                <div key={key}>
                  <dt className="font-display font-bold text-forest-900">
                    {PROJECT_STATUS_LABELS[key]}
                  </dt>
                  <dd className="mt-1 text-[0.8rem] leading-relaxed text-ink-muted">
                    {key === "ongoing"
                      ? "Initiative documentée et présentée comme active. La période et les résultats restent à confirmer lorsqu’ils ne sont pas publiés."
                      : key === "completed"
                        ? "Initiative achevée dont les résultats ont été documentés."
                        : key === "development"
                          ? "Initiative en cours de structuration, pas encore opérationnelle."
                          : "Initiative proposée, en phase de conception, sans statut opérationnel confirmé."}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Collaborer"
        title="Un projet peut s’enrichir d’un regard complémentaire."
        description="Les partenariats techniques, institutionnels et de recherche peuvent renforcer la qualité et la portée des initiatives, dans le respect des communautés et des règles de protection des données."
        primaryHref="/contact"
        primaryLabel="Échanger avec l’équipe"
        secondaryHref="/impact"
        secondaryLabel="Consulter les données d’impact"
      />
    </>
  );
}
