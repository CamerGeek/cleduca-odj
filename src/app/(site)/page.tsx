import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  FileText,
  Handshake,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { organisationValues } from "@/content/values";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { AreaIcon } from "@/components/ui/area-icon";
import { Badge, ProjectStatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getAreas,
  getArticles,
  getIndicators,
  getProjects,
  getSettings,
} from "@/lib/content/queries";
import {
  ARTICLE_CATEGORY_LABELS,
  type AreaStatus,
} from "@/lib/content/types";
import { formatDate, formatNumber, getSiteUrl } from "@/lib/utils";

const AREA_STATUS_SHORT: Record<AreaStatus, string> = {
  documented: "Documenté",
  developing: "En développement",
  positioning: "Positionnement",
};

const AREA_STATUS_TONE: Record<AreaStatus, "green" | "gold" | "outline"> = {
  documented: "green",
  developing: "gold",
  positioning: "outline",
};

const approach = [
  "Partir des réalités et des savoirs locaux",
  "Co-construire avec les communautés et les acteurs du territoire",
  "Documenter, vérifier et rendre compte publiquement",
];

export default async function HomePage() {
  const [settings, areas, projects, articles, indicators] = await Promise.all([
    getSettings(),
    getAreas(),
    getProjects(),
    getArticles(),
    getIndicators(),
  ]);

  const verifiedIndicators = indicators.filter(
    (indicator) => indicator.verified && indicator.value !== null,
  );
  const indicatorValue = (category: string) =>
    verifiedIndicators.find((indicator) => indicator.category === category)
      ?.value ?? null;

  const heroStats = [
    { value: String(settings.foundedYear), label: "Année de création" },
    {
      value:
        indicatorValue("institutionnel") !== null
          ? formatNumber(indicatorValue("institutionnel"))
          : "—",
      label: "Années d’engagement",
    },
    {
      value:
        indicatorValue("projets") !== null
          ? formatNumber(indicatorValue("projets"))
          : "—",
      label: "Initiatives documentées",
    },
    {
      value:
        indicatorValue("education") !== null
          ? formatNumber(indicatorValue("education"))
          : "—",
      label: "Écoles mobilisées",
    },
  ];

  const latestArticles = [...articles]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);
  const leadArticle = latestArticles[0] ?? null;
  const secondaryArticles = latestArticles.slice(1, 3);
  const featuredProjects = projects.filter((project) => project.featured);
  const homepageProjects =
    featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 4);

  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NGO",
        "@id": `${siteUrl}/#organisation`,
        name: settings.siteName,
        alternateName: settings.fullName,
        url: siteUrl,
        logo: `${siteUrl}/brand/cleduca-odj-logo.png`,
        description: settings.positioning,
        foundingDate: String(settings.foundedYear),
        address: {
          "@type": "PostalAddress",
          addressLocality: settings.city,
          addressRegion: settings.region,
          addressCountry: "BF",
        },
        areaServed: "Burkina Faso",
        slogan: settings.tagline,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: settings.siteName,
        inLanguage: "fr",
        publisher: { "@id": `${siteUrl}/#organisation` },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative overflow-hidden bg-sand-100">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-32 size-[34rem] rounded-full bg-leaf-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-2/5 opacity-60 pattern-weave"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-10 left-1/2 hidden select-none font-display text-[16rem] font-extrabold leading-none tracking-[-0.06em] text-forest-900/[0.035] lg:block"
        >
          1997
        </span>

        <div className="container-site relative grid gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-20">
          <div className="animate-rise">
            <p className="eyebrow flex flex-wrap items-center gap-2 text-forest-700">
              <span aria-hidden className="h-px w-9 bg-gold-400" />
              {settings.hero.eyebrow}
            </p>
            <h1 className="mt-5 max-w-2xl text-[2.55rem] font-bold leading-[1.03] tracking-[-0.045em] text-forest-950 sm:text-[3.2rem] lg:text-[3.65rem]">
              {settings.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-[1.08rem]">
              {settings.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href={settings.hero.primaryHref}
                size="lg"
                withArrow
                className="justify-center"
              >
                {settings.hero.primaryLabel}
              </ButtonLink>
              <ButtonLink
                href={settings.hero.secondaryHref}
                variant="secondary"
                size="lg"
                className="justify-center"
              >
                {settings.hero.secondaryLabel}
              </ButtonLink>
            </div>

            <p className="mt-6 flex items-center gap-2 text-[0.78rem] font-medium text-ink-muted">
              <ShieldCheck aria-hidden className="size-4 text-forest-600" />
              Organisation à but non lucratif, reconnue, créée en{" "}
              {settings.foundedYear}.
            </p>

            <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-forest-900/10 pt-6 sm:grid-cols-4">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-2xl font-extrabold tracking-[-0.03em] text-forest-800 sm:text-[1.7rem]">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative animate-fade">
            <div
              aria-hidden
              className="absolute -right-3 -top-3 hidden h-full w-full rounded-[2.25rem] border border-gold-400/50 sm:block"
            />
            <figure className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-sand-200 shadow-lift sm:aspect-[16/11] lg:aspect-[4/5]">
                <Image
                  src={settings.hero.image}
                  alt={settings.hero.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-forest-950/55 via-forest-950/5 to-transparent"
                />
                <p className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-forest-950/45 px-3 py-1.5 font-display text-[0.66rem] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
                  <BadgeCheck aria-hidden className="size-3.5 text-gold-300" />
                  {settings.city} · {settings.country}
                </p>
                <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-forest-950/55 px-4 py-3 text-[0.68rem] leading-relaxed text-white/80 backdrop-blur-sm">
                  {settings.hero.caption}
                </figcaption>
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-site grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Notre identité"
              title="Une organisation de la société civile, ancrée dans les communautés."
              description={settings.positioning}
            />
            <ul className="mt-8 space-y-3">
              {approach.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-soft">
                  <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-700">
                    <BadgeCheck aria-hidden className="size-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/a-propos" variant="primary" withArrow>
                Découvrir notre histoire
              </ButtonLink>
              <ButtonLink href="/a-propos#gouvernance" variant="ghost">
                Gouvernance et redevabilité
              </ButtonLink>
            </div>

            <figure className="mt-10">
              <div className="relative aspect-[16/7] overflow-hidden rounded-2xl bg-sand-200">
                <Image
                  src="/images/about-bobo.jpg"
                  alt="Artère commerçante de Bobo-Dioulasso, Burkina Faso."
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2 text-[0.68rem] text-ink-muted">
                Bobo-Dioulasso, Hauts-Bassins. Photo d’illustration : Maarten van der
                Bent, CC BY-SA 2.0.
              </figcaption>
            </figure>
          </div>

          <div>
            <p className="eyebrow flex items-center gap-2 text-forest-600">
              <span aria-hidden className="h-px w-8 bg-gold-400" />
              Nos valeurs
            </p>
            <ul className="mt-5 divide-y divide-sand-200 border-y border-sand-200">
              {organisationValues.map((value, index) => (
                <li key={value.title} className="group flex gap-5 py-5">
                  <span className="font-display text-sm font-bold tabular-nums text-gold-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.02rem] font-bold text-forest-900">
                      {value.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                      {value.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-sand-300/70 bg-sand-50 py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Domaines d’intervention"
            title="Neuf domaines, une même exigence : agir avec les communautés."
            description="Les initiatives de CLEDUCA-ODJ couvrent l’éducation, l’autonomisation des jeunes, le numérique, l’inclusion, l’égalité de genre, la justice de proximité et la cohésion sociale."
            action={
              <ButtonLink href="/domaines" variant="secondary" size="sm" withArrow>
                Tous les domaines
              </ButtonLink>
            }
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <Link
                key={area.id}
                href={`/domaines/${area.slug}`}
                className="group card-hover flex h-full flex-col rounded-2xl border border-sand-300/80 bg-white p-6 hover:border-forest-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700 transition group-hover:bg-forest-700 group-hover:text-white">
                    <AreaIcon name={area.icon} className="size-5" />
                  </span>
                  <Badge tone={AREA_STATUS_TONE[area.status]}>
                    {AREA_STATUS_SHORT[area.status]}
                  </Badge>
                </div>
                <h3 className="mt-5 font-display text-[1.05rem] font-bold leading-snug text-forest-950">
                  {area.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {area.tagline}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 pt-4 text-[0.78rem] font-semibold text-forest-700">
                  Découvrir
                  <ArrowUpRight
                    aria-hidden
                    className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-forest-950 py-20 text-white">
        <div
          aria-hidden
          className="pattern-weave pointer-events-none absolute inset-0 opacity-30"
        />
        <div className="container-site relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Impact et redevabilité"
              tone="light"
              title="Des chiffres documentés, des sources explicites."
              description="CLEDUCA-ODJ publie uniquement des indicateurs vérifiés, rattachés à une initiative et à une période identifiées. Les données incomplètes restent signalées comme telles."
            />
            <div className="mt-8">
              <ButtonLink href="/impact" variant="gold" withArrow>
                Explorer le tableau d’impact
              </ButtonLink>
            </div>
            <p className="mt-6 flex max-w-sm items-start gap-2 text-[0.72rem] leading-relaxed text-white/50">
              <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-gold-300" />
              Aucun résultat n’est extrapolé ni présenté comme acquis sans
              documentation disponible.
            </p>
          </div>

          <div>
            <dl className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
              {verifiedIndicators.slice(0, 4).map((indicator) => (
                <div key={indicator.id} className="bg-forest-950 p-6">
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-white/55">
                    {indicator.label}
                  </dt>
                  <dd className="mt-4">
                    <span className="font-display text-4xl font-extrabold tracking-[-0.04em] text-gold-300">
                      {formatNumber(indicator.value)}
                    </span>
                    <span className="ml-2 text-xs font-medium uppercase tracking-[0.1em] text-white/50">
                      {indicator.unit}
                    </span>
                    <p className="mt-3 text-[0.72rem] leading-relaxed text-white/45">
                      {indicator.periodLabel}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[0.7rem] leading-relaxed text-white/40">
              Source : {verifiedIndicators[0]?.source ?? "informations institutionnelles fournies"}.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Portefeuille de projets"
            title="Des initiatives pensées avec et pour les communautés."
            description="Chaque projet est présenté avec son contexte, ses objectifs, sa couverture et son statut réel. Les périodes et résultats non confirmés sont explicitement signalés."
            action={
              <ButtonLink href="/projets" variant="secondary" size="sm" withArrow>
                Tous les projets
              </ButtonLink>
            }
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {homepageProjects.map((project) => (
              <article
                key={project.id}
                className="group card-hover overflow-hidden rounded-3xl border border-sand-300/80 bg-white hover:border-forest-300"
              >
                <Link href={`/projets/${project.slug}`} className="block">
                  <div className="relative aspect-[16/9] overflow-hidden bg-sand-200">
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-forest-950/45 to-transparent"
                    />
                    <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                      <ProjectStatusBadge status={project.status} />
                      <Badge tone="dark">{project.acronym}</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold leading-snug tracking-[-0.02em] text-forest-950">
                      {project.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                      {project.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.coverage.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-sand-300 bg-sand-50 px-2.5 py-1 text-[0.68rem] font-medium text-ink-soft"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-forest-700">
                      Découvrir le projet
                      <ArrowRight
                        aria-hidden
                        className="size-4 transition group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-sand-300/70 bg-sand-50 py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Actualités et publications"
            title="Comprendre nos actions, suivre nos avancées."
            description="Annonces institutionnelles, notes de terrain et publications : les informations sont datées, attribuées et mises à jour par l’équipe."
            action={
              <ButtonLink href="/actualites" variant="secondary" size="sm" withArrow>
                Toutes les actualités
              </ButtonLink>
            }
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {leadArticle ? (
              <article className="group card-hover overflow-hidden rounded-3xl border border-sand-300/80 bg-white">
                <Link href={`/actualites/${leadArticle.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-sand-200">
                    <Image
                      src={leadArticle.coverImage}
                      alt={leadArticle.coverAlt}
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute left-4 top-4">
                      <Badge tone="gold">
                        {ARTICLE_CATEGORY_LABELS[leadArticle.category]}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 sm:p-7">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-ink-muted">
                      {formatDate(leadArticle.publishedAt)}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-forest-950">
                      {leadArticle.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {leadArticle.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-forest-700">
                      Lire l’article
                      <ArrowRight
                        aria-hidden
                        className="size-4 transition group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </article>
            ) : null}

            <div className="flex flex-col gap-4">
              {secondaryArticles.map((article) => (
                <article
                  key={article.id}
                  className="group rounded-2xl border border-sand-300/80 bg-white p-4 transition hover:border-forest-300"
                >
                  <Link
                    href={`/actualites/${article.slug}`}
                    className="flex items-start gap-4"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-sand-200">
                      <Image
                        src={article.coverImage}
                        alt={article.coverAlt}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-[0.64rem] font-bold uppercase tracking-[0.12em] text-gold-600">
                        {ARTICLE_CATEGORY_LABELS[article.category]} ·{" "}
                        {formatDate(article.publishedAt)}
                      </p>
                      <h3 className="mt-1.5 font-display text-[0.98rem] font-bold leading-snug text-forest-950 group-hover:text-forest-700">
                        {article.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-[0.78rem] leading-relaxed text-ink-muted">
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}

              <Link
                href="/ressources"
                className="group mt-auto flex items-center gap-4 rounded-2xl border border-forest-200 bg-forest-50 p-4 transition hover:border-forest-300"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-forest-700 shadow-soft">
                  <FileText aria-hidden className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-sm font-bold text-forest-900">
                    Centre de ressources
                  </span>
                  <span className="mt-0.5 block text-[0.76rem] leading-relaxed text-ink-soft">
                    Les rapports et documents validés seront publiés dans cet espace.
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="ml-auto size-4 shrink-0 text-forest-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-site">
          <div className="relative overflow-hidden rounded-[2.25rem] bg-forest-900 text-white">
            <div
              aria-hidden
              className="pattern-weave absolute inset-0 opacity-25"
            />
            <div className="relative grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-8 sm:p-12 lg:p-14">
                <p className="eyebrow flex items-center gap-2 text-gold-300">
                  <span aria-hidden className="h-px w-8 bg-gold-400" />
                  Partenariats
                </p>
                <h2 className="mt-4 max-w-lg font-display text-3xl font-bold leading-[1.08] tracking-[-0.035em] sm:text-4xl">
                  Un partenariat se construit sur la confiance et la clarté.
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                  CLEDUCA-ODJ collabore avec des institutions, des organisations de la
                  société civile, des acteurs de la recherche et des partenaires
                  techniques. Les partenariats publiés sur ce site sont uniquement ceux
                  qui sont vérifiés et autorisés.
                </p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    "Institutions et collectivités",
                    "ONG et société civile",
                    "Recherche et médias",
                    "Partenaires techniques",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-[0.82rem] text-white/75"
                    >
                      <Handshake aria-hidden className="size-4 shrink-0 text-leaf-300" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/contact" variant="light" withArrow>
                    Proposer un partenariat
                  </ButtonLink>
                  <ButtonLink
                    href="/partenaires"
                    variant="outline-light"
                    className="justify-center"
                  >
                    Voir les partenaires
                  </ButtonLink>
                </div>
              </div>
              <div className="relative min-h-[18rem] lg:min-h-0">
                <Image
                  src="/images/women-cooperative.jpg"
                  alt="Femmes transformant des noix de karité dans un cadre coopératif au Burkina Faso."
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-forest-900 via-forest-900/20 to-transparent lg:bg-gradient-to-r lg:from-forest-900 lg:via-forest-900/10"
                />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-forest-950/60 px-2.5 py-2 text-[0.62rem] leading-relaxed text-white/60 backdrop-blur-sm sm:left-auto sm:right-4 sm:max-w-[16rem]">
                  Photo d’illustration : coopérative féminine au Burkina Faso. Crédit :
                  TREEAID, CC BY 2.0.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="newsletter"
        className="relative overflow-hidden border-t border-sand-300/70 bg-sand-100 py-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-0 size-[26rem] rounded-full bg-leaf-200/40 blur-3xl"
        />
        <div className="container-site relative">
          <div className="grid gap-10 rounded-[2rem] border border-sand-300 bg-white p-8 shadow-card sm:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:p-12">
            <div>
              <p className="eyebrow flex items-center gap-2 text-forest-600">
                <span aria-hidden className="h-px w-8 bg-gold-400" />
                Lettre d’information
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-[-0.035em] text-forest-950">
                {settings.newsletter.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
                {settings.newsletter.description}
              </p>
              <ul className="mt-6 space-y-2.5 text-[0.82rem] text-ink-soft">
                {[
                  "Publications institutionnelles et prises de position",
                  "Avancées et enseignements de nos projets",
                  "Ressources et rendez-vous communautaires",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <BadgeCheck
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-forest-600"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 flex items-center gap-2 text-[0.7rem] text-ink-muted">
                <MapPin aria-hidden className="size-3.5 text-forest-600" />
                {settings.city} · {settings.region} · {settings.country}
              </p>
            </div>
            <div className="rounded-2xl bg-sand-50 p-5 sm:p-6">
              <NewsletterForm
                consentLabel={settings.newsletter.consentLabel}
                source="page-accueil"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
