import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarRange,
  CircleHelp,
  Database,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

import { CtaBand } from "@/components/site/cta-band";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getIndicators,
  getProjects,
  getReportingPeriods,
} from "@/lib/content/queries";
import {
  INDICATOR_CATEGORY_LABELS,
  PROJECT_STATUS_LABELS,
  type ProjectStatus,
} from "@/lib/content/types";
import { formatDate, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Impact et redevabilité",
  description:
    "Indicateurs vérifiés, sources, périodes de référence et limites des données publiées par CLEDUCA-ODJ. Aucun chiffre n’est extrapolé.",
  alternates: { canonical: "/impact" },
};

const principles = [
  {
    icon: Database,
    title: "Source explicite",
    description:
      "Chaque indicateur est rattaché à une source documentaire ou à une information institutionnelle identifiée.",
  },
  {
    icon: CalendarRange,
    title: "Période identifiée",
    description:
      "La période de référence est affichée. Lorsqu’elle reste à confirmer, la mention correspondante est visible.",
  },
  {
    icon: FileCheck2,
    title: "Vérification",
    description:
      "Un indicateur n’est présenté comme vérifié qu’après validation par l’équipe. Les données manquantes restent visibles.",
  },
];

const statusOrder: ProjectStatus[] = [
  "ongoing",
  "proposed",
  "development",
  "completed",
];

export default async function ImpactPage() {
  const [indicators, periods, projects] = await Promise.all([
    getIndicators(),
    getReportingPeriods(),
    getProjects(),
  ]);

  const verified = indicators.filter(
    (indicator) => indicator.verified && indicator.value !== null,
  );
  const pending = indicators.filter(
    (indicator) => !indicator.verified || indicator.value === null,
  );

  const statusCounts = statusOrder.map((status) => ({
    status,
    count: projects.filter((project) => project.status === status).length,
  }));
  const maxStatusCount = Math.max(...statusCounts.map((item) => item.count), 1);

  return (
    <>
      <PageHero
        eyebrow="Impact et redevabilité"
        title="Mesurer ce qui est documenté, publier ce qui est vérifié."
        intro="CLEDUCA-ODJ présente ici ses indicateurs avec leur source, leur période et leur niveau de vérification. Les chiffres ne sont ni extrapolés ni présentés comme acquis lorsqu’ils restent incomplets."
        crumbs={[{ label: "Impact" }]}
        image="/images/community-resilience.jpg"
        imageAlt="Femmes construisant collectivement des diguettes anti-érosives au Burkina Faso."
        imageCaption="Photo d’illustration : action communautaire au Burkina Faso. Crédit : Hadepté, CC BY-SA 4.0."
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="green">{verified.length} indicateurs vérifiés</Badge>
          {pending.length > 0 ? (
            <Badge tone="outline">{pending.length} donnée à compléter</Badge>
          ) : null}
        </div>
      </PageHero>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Notre méthode"
            title="La transparence commence par la traçabilité."
            description="Un indicateur sans source ni période n’est pas un résultat. La publication des données obéit à trois exigences simples."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <article
                  key={principle.title}
                  className="rounded-2xl border border-sand-300/80 bg-sand-50 p-6"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-white text-forest-700 shadow-soft">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-forest-950">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {principle.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-sand-300/70 bg-sand-100 py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Indicateurs"
            title="Les données publiées."
            description="Les valeurs ci-dessous se rapportent au dispositif PASEDI et au portefeuille institutionnel présenté sur ce site. Elles ne constituent pas une mesure de l’ensemble de l’action de l’association."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {indicators.map((indicator) => (
              <article
                key={indicator.id}
                className="flex h-full flex-col rounded-2xl border border-sand-300 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <Badge tone="outline">
                    {INDICATOR_CATEGORY_LABELS[indicator.category]}
                  </Badge>
                  {indicator.verified ? (
                    <span className="inline-flex items-center gap-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-forest-700">
                      <BadgeCheck aria-hidden className="size-3.5" />
                      Vérifié
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-ink-muted">
                      <CircleHelp aria-hidden className="size-3.5" />
                      À compléter
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-sm font-bold leading-snug text-forest-950">
                  {indicator.label}
                </h3>
                <p className="mt-3">
                  <span className="font-display text-4xl font-extrabold tracking-[-0.04em] text-forest-800">
                    {formatNumber(indicator.value)}
                  </span>
                  <span className="ml-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                    {indicator.value === null ? "donnée non disponible" : indicator.unit}
                  </span>
                </p>
                <p className="mt-3 text-[0.82rem] leading-relaxed text-ink-soft">
                  {indicator.description}
                </p>
                <dl className="mt-auto space-y-2 border-t border-sand-200 pt-4 text-[0.68rem] leading-relaxed text-ink-muted">
                  <div>
                    <dt className="inline font-semibold text-ink-soft">Période : </dt>
                    <dd className="inline">{indicator.periodLabel}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold text-ink-soft">Source : </dt>
                    <dd className="inline">{indicator.source}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Périodes de référence"
              title="Savoir à quoi se rapportent les chiffres."
              description="Les périodes ci-dessous accompagnent les données publiées. Lorsqu’une période reste à confirmer, elle est signalée sans être remplacée par une estimation."
            />
            <ul className="mt-8 space-y-3">
              {periods.map((period) => (
                <li
                  key={period.id}
                  className="rounded-2xl border border-sand-300 bg-sand-50 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-sm font-bold text-forest-950">
                      {period.label}
                    </h3>
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                      {period.startsOn
                        ? `${formatDate(period.startsOn)} — ${formatDate(period.endsOn)}`
                        : "Dates à confirmer"}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-soft">
                    {period.description}
                  </p>
                  <p className="mt-2 text-[0.68rem] text-ink-muted">
                    Document de référence : {period.sourceDocument}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-forest-200 bg-forest-50 p-6 sm:p-8">
            <p className="eyebrow flex items-center gap-2 text-forest-700">
              <span aria-hidden className="h-px w-8 bg-gold-400" />
              Statut du portefeuille
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-[-0.02em] text-forest-950">
              Quatre initiatives, quatre niveaux de maturité.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Le statut des projets est distinct de leur niveau de documentation.
              Une initiative peut être active et comporter encore des données à
              confirmer.
            </p>
            <ul className="mt-6 space-y-4">
              {statusCounts.map((item) => (
                <li key={item.status}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-forest-900">
                      {PROJECT_STATUS_LABELS[item.status]}
                    </span>
                    <span className="font-display text-sm font-bold tabular-nums text-forest-800">
                      {item.count}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-forest-500"
                      style={{
                        width: `${Math.max((item.count / maxStatusCount) * 100, item.count > 0 ? 8 : 0)}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-forest-200 pt-5">
              <ButtonLink href="/projets" variant="secondary" size="sm" withArrow>
                Voir le portefeuille
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-sand-300/70 bg-sand-50 py-16">
        <div className="container-site grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-sand-300 bg-white p-6 sm:p-8">
            <span className="flex size-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
              <ShieldCheck aria-hidden className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-xl font-bold text-forest-950">
              Limites des données
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Les données présentées ne couvrent pas l’ensemble des activités de
              l’association. Les résultats des projets PALVEN, Guiriko et CIVI-LINK
              ne sont pas encore publiés. Les périodes de mise en œuvre de PASEDI
              restent à confirmer. Aucune estimation n’est produite pour combler ces
              absences.
            </p>
          </div>
          <div className="rounded-2xl border border-sand-300 bg-white p-6 sm:p-8">
            <span className="flex size-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
              <FileCheck2 aria-hidden className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-xl font-bold text-forest-950">
              Signaler une correction
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Si vous identifiez une erreur, une source manquante ou une donnée
              obsolète, contactez l’équipe en précisant l’indicateur concerné. Les
              corrections vérifiées seront publiées avec leur date de mise à jour.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/contact" size="sm" withArrow>
                Signaler une correction
              </ButtonLink>
              <Link
                href="/credits-photographiques"
                className="inline-flex items-center text-sm font-semibold text-forest-700 underline underline-offset-4"
              >
                Crédits photographiques
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Redevabilité"
        title="La confiance se construit par la preuve, pas par la promesse."
        description="Nous documentons nos sources, signalons nos limites et publions nos résultats après vérification. Pour toute question méthodologique, écrivez-nous."
        primaryHref="/contact"
        primaryLabel="Poser une question"
        secondaryHref="/actualites"
        secondaryLabel="Lire nos publications"
      />
    </>
  );
}
