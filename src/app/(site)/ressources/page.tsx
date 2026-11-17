import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenCheck,
  Download,
  FileText,
  FolderOpen,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import { CtaBand } from "@/components/site/cta-band";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublications } from "@/lib/content/queries";
import {
  PUBLICATION_CATEGORY_LABELS,
  type PublicationCategory,
} from "@/lib/content/types";
import { pageMetadata } from "@/lib/seo";
import { cn, formatDate, isExternalHref } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Centre de ressources",
  description:
    "Rapports, notes, guides et documents institutionnels de CLEDUCA-ODJ. Les documents sont publiés après validation et précisent leur source, leur date et leur format.",
  path: "/ressources",
});

const categoryKeys = Object.keys(
  PUBLICATION_CATEGORY_LABELS,
) as PublicationCategory[];

const referenceDocuments = [
  {
    title: "Gouvernance et redevabilité",
    description:
      "Principes de gouvernance associative, séparation des fonctions, redevabilité et documents institutionnels.",
    href: "/gouvernance",
    icon: ShieldCheck,
  },
  {
    title: "Politique de confidentialité",
    description:
      "Données collectées, finalités, durées de conservation, destinataires et exercice des droits.",
    href: "/confidentialite",
    icon: FileText,
  },
  {
    title: "Politique de cookies",
    description:
      "Cookies strictement nécessaires, absence de traceurs publicitaires et modalités de gestion.",
    href: "/cookies",
    icon: FileText,
  },
  {
    title: "Mentions légales",
    description:
      "Éditeur du site, hébergement, propriété intellectuelle et conditions d’utilisation.",
    href: "/mentions-legales",
    icon: FileText,
  },
  {
    title: "Déclaration d’accessibilité",
    description:
      "Engagements d’accessibilité numérique, limites connues et procédure de signalement.",
    href: "/accessibilite",
    icon: BookOpenCheck,
  },
  {
    title: "Crédits photographiques",
    description:
      "Auteurs, licences et sources des photographies d’illustration utilisées sur le site.",
    href: "/credits-photographiques",
    icon: FileText,
  },
];

interface ResourceSearchParams {
  q?: string;
  categorie?: string;
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<ResourceSearchParams>;
}) {
  const [params, publications] = await Promise.all([
    searchParams,
    getPublications(),
  ]);

  const category = categoryKeys.includes(params.categorie as PublicationCategory)
    ? (params.categorie as PublicationCategory)
    : null;
  const query = (params.q ?? "").trim();
  const normalizedQuery = query.toLowerCase();

  const filtered = publications
    .filter((publication) => {
      if (category && publication.category !== category) return false;
      if (normalizedQuery) {
        const haystack = [publication.title, publication.description]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const hasFilters = Boolean(category || query);

  const categoryHref = (value: PublicationCategory | null) => {
    const search = new URLSearchParams();
    if (value) search.set("categorie", value);
    if (query) search.set("q", query);
    const suffix = search.toString();
    return suffix ? `/ressources?${suffix}` : "/ressources";
  };

  return (
    <>
      <PageHero
        eyebrow="Centre de ressources"
        title="Des documents traçables, disponibles sans intermédiaire."
        intro="Rapports, notes de politique, guides et supports de formation : les documents de CLEDUCA-ODJ sont publiés dans leur format d’origine, avec leur date, leur langue et leur catégorie. Aucun document n’est présenté comme disponible avant sa validation."
        crumbs={[{ label: "Ressources" }]}
        image="/images/literacy-class.jpg"
        imageAlt="Participants dans un centre d’alphabétisation au Burkina Faso."
        imageCaption="Photo d’illustration : centre d’alphabétisation au Burkina Faso. Crédit : Le Soleil dans la Main, CC BY-SA 4.0."
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="green">{publications.length} document publié</Badge>
          <Badge tone="outline">Sources et dates indiquées</Badge>
        </div>
      </PageHero>

      <section className="border-b border-sand-300/70 bg-sand-50 py-8">
        <div className="container-site">
          <form
            method="get"
            action="/ressources"
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            {category ? (
              <input type="hidden" name="categorie" value={category} />
            ) : null}
            <div className="flex-1">
              <label
                htmlFor="resource-search"
                className="field-label flex items-center gap-2"
              >
                <Search aria-hidden className="size-4 text-forest-600" />
                Rechercher un document
              </label>
              <input
                id="resource-search"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Titre, thème, mot-clé…"
                className="field"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-700 px-5 py-3 font-display text-sm font-semibold text-white transition hover:bg-forest-800"
            >
              Rechercher
            </button>
            {hasFilters ? (
              <Link
                href="/ressources"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-sand-400 px-4 py-3 font-display text-sm font-semibold text-ink-soft transition hover:bg-white"
              >
                <X aria-hidden className="size-4" />
                Réinitialiser
              </Link>
            ) : null}
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={categoryHref(null)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[0.72rem] font-semibold transition",
                !category
                  ? "border-forest-700 bg-forest-700 text-white"
                  : "border-sand-400 bg-white text-ink-soft hover:border-forest-300",
              )}
            >
              Toutes les catégories
            </Link>
            {categoryKeys.map((key) => (
              <Link
                key={key}
                href={categoryHref(key)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[0.72rem] font-semibold transition",
                  category === key
                    ? "border-forest-700 bg-forest-700 text-white"
                    : "border-sand-400 bg-white text-ink-soft hover:border-forest-300",
                )}
              >
                {PUBLICATION_CATEGORY_LABELS[key]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-muted">
              {filtered.length} document{filtered.length > 1 ? "s" : ""}
              {query ? ` pour « ${query} »` : ""}
            </p>
            <p className="text-[0.7rem] text-ink-muted">
              Documents classés du plus récent au plus ancien.
            </p>
          </div>

          {filtered.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {filtered.map((publication) => (
                <li
                  key={publication.id}
                  className="flex h-full flex-col rounded-2xl border border-sand-300/80 bg-sand-50 p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-white text-forest-700 shadow-soft">
                      <FileText aria-hidden className="size-5" />
                    </span>
                    <Badge tone="outline">
                      {PUBLICATION_CATEGORY_LABELS[publication.category]}
                    </Badge>
                  </div>
                  <h2 className="mt-4 font-display text-lg font-bold leading-snug text-forest-950">
                    {publication.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {publication.description}
                  </p>
                  <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] text-ink-muted">
                    <div>
                      <dt className="inline font-semibold text-ink-soft">Publié le : </dt>
                      <dd className="inline">{formatDate(publication.publishedAt)}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-ink-soft">Langue : </dt>
                      <dd className="inline">{publication.language}</dd>
                    </div>
                    {publication.fileSize ? (
                      <div>
                        <dt className="inline font-semibold text-ink-soft">Format : </dt>
                        <dd className="inline">{publication.fileSize}</dd>
                      </div>
                    ) : null}
                  </dl>
                  <div className="mt-auto pt-5">
                    {publication.fileUrl ? (
                      isExternalHref(publication.fileUrl) ? (
                        <a
                          href={publication.fileUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-2 font-display text-sm font-semibold text-forest-700 underline underline-offset-4"
                        >
                          <Download aria-hidden className="size-4" />
                          Télécharger le document
                        </a>
                      ) : (
                        <Link
                          href={publication.fileUrl}
                          className="inline-flex items-center gap-2 font-display text-sm font-semibold text-forest-700 underline underline-offset-4"
                        >
                          <Download aria-hidden className="size-4" />
                          Consulter le document
                        </Link>
                      )
                    ) : (
                      <p className="text-[0.72rem] text-ink-muted">
                        Fichier en cours de mise à disposition. Contactez
                        l’association pour le demander.
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<FolderOpen aria-hidden className="size-5" />}
              title="Aucun document ne correspond à cette recherche"
              description={
                publications.length === 0
                  ? "Les rapports, notes et guides seront publiés dans cet espace après validation par l’association. Aucun document fictif n’est affiché en attendant."
                  : "Modifiez le mot-clé ou retirez le filtre de catégorie pour afficher l’ensemble des documents disponibles."
              }
              action={
                hasFilters ? (
                  <ButtonLink href="/ressources" variant="secondary" withArrow>
                    Afficher toutes les ressources
                  </ButtonLink>
                ) : (
                  <ButtonLink href="/contact?type=information" withArrow>
                    Demander un document
                  </ButtonLink>
                )
              }
            />
          )}
        </div>
      </section>

      <section className="border-y border-sand-300/70 bg-sand-100 py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Documents de référence"
            title="Les règles du site, accessibles à tous."
            description="Les politiques et informations institutionnelles publiées par l’association sont consultables directement en ligne, dans un format lisible sur téléphone."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {referenceDocuments.map((document) => {
              const Icon = document.icon;
              return (
                <li key={document.href}>
                  <Link
                    href={document.href}
                    className="group flex h-full flex-col rounded-2xl border border-sand-300 bg-white p-6 transition hover:border-forest-300"
                  >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <h3 className="mt-4 font-display text-base font-bold text-forest-950">
                      {document.title}
                    </h3>
                    <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-soft">
                      {document.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.76rem] font-semibold text-forest-700">
                      Consulter
                      <ArrowUpRight
                        aria-hidden
                        className="size-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Demander un document"
              title="Un besoin spécifique ou une version accessible ?"
              description="Les documents peuvent être demandés pour un usage institutionnel, pédagogique, journalistique ou de recherche. L’association précise la disponibilité, le format et, le cas échéant, les conditions d’utilisation."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/contact?type=information" withArrow>
                Formuler une demande
              </ButtonLink>
              <ButtonLink href="/accessibilite" variant="secondary">
                Accessibilité des documents
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-2xl border border-sand-300 bg-sand-50 p-6 sm:p-8">
            <h3 className="font-display text-lg font-bold text-forest-950">
              Conditions de réutilisation
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
              <li>
                Les documents sont fournis dans leur format d’origine. Une version
                alternative peut être demandée sans garantie de disponibilité
                immédiate.
              </li>
              <li>
                Toute citation doit mentionner CLEDUCA-ODJ, le titre du document et
                sa date de publication.
              </li>
              <li>
                Les données à caractère personnel, les informations sensibles et
                les éléments non publics sont retirés des documents diffusés.
              </li>
            </ul>
            <p className="mt-4 border-t border-sand-300 pt-4 text-[0.72rem] leading-relaxed text-ink-muted">
              Les documents ne sont publiés qu’après validation par l’association
              et, le cas échéant, autorisation des partenaires concernés.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Contribuer"
        title="Vous produisez des ressources utiles aux communautés ?"
        description="CLEDUCA-ODJ peut accueillir des travaux de recherche, des guides pédagogiques ou des supports de formation dans une démarche de partage, sous réserve de validation éditoriale et du respect des droits des personnes."
        primaryHref="/contact?type=collaboration"
        primaryLabel="Proposer une ressource"
        secondaryHref="/actualites"
        secondaryLabel="Lire nos publications"
      />
    </>
  );
}
