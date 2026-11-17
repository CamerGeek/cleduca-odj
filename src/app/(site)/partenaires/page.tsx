import type { Metadata } from "next";
import { BadgeCheck, Handshake, SearchCheck, ShieldCheck, Users } from "lucide-react";

import { CtaBand } from "@/components/site/cta-band";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPartners } from "@/lib/content/queries";
import {
  PARTNER_TYPE_LABELS,
  type PartnerType,
} from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Partenaires",
  description:
    "Politique de partenariat de CLEDUCA-ODJ : principes, catégories de partenaires, processus de validation et publication des collaborations autorisées.",
  alternates: { canonical: "/partenaires" },
};

const partnerTypeKeys = Object.keys(PARTNER_TYPE_LABELS) as PartnerType[];

const categoryDescriptions: Record<PartnerType, string> = {
  institutionnel:
    "Ministères, collectivités, services publics et organismes de coordination dont le mandat rejoint nos domaines d’intervention.",
  technique:
    "Organisations de la société civile, réseaux, universités et structures spécialisées qui apportent une expertise complémentaire.",
  financier:
    "Bailleurs, fondations et mécanismes de financement qui soutiennent des initiatives identifiées et documentées.",
  communautaire:
    "Associations locales, groupements, comités villageois et dynamiques de quartier ancrés dans les territoires d’intervention.",
  local:
    "Écoles, radios communautaires, structures de santé, autorités locales et acteurs de proximité mobilisés autour d’un projet.",
};

const principles = [
  {
    icon: ShieldCheck,
    title: "Autorisation préalable",
    description:
      "Aucun nom, logo, financement ou partenariat n’est publié sans accord explicite de l’organisation concernée.",
  },
  {
    icon: SearchCheck,
    title: "Vérification",
    description:
      "Le périmètre réel de la collaboration, sa période et sa nature sont vérifiés avant toute mention publique.",
  },
  {
    icon: Users,
    title: "Utilité pour les communautés",
    description:
      "Un partenariat est apprécié à l’aune de sa contribution effective aux priorités exprimées par les communautés.",
  },
  {
    icon: Handshake,
    title: "Clarté des rôles",
    description:
      "Les responsabilités, les contributions et les modalités de communication sont définies et documentées.",
  },
];

const processSteps = [
  {
    title: "Prise de contact",
    description:
      "Présentation de votre organisation, de votre intérêt et du type de collaboration envisagé.",
  },
  {
    title: "Échange de cadrage",
    description:
      "Clarification des objectifs communs, du périmètre, des contributions et des attentes de chaque partie.",
  },
  {
    title: "Vérification et accord",
    description:
      "Validation interne par les instances compétentes de CLEDUCA-ODJ et formalisation de l’accord.",
  },
  {
    title: "Publication encadrée",
    description:
      "Mention du partenariat sur le site uniquement après autorisation, avec les éléments convenus.",
  },
];

export default async function PartnersPage() {
  const partners = await getPartners();
  const published = partners.filter((partner) => partner.published);

  return (
    <>
      <PageHero
        eyebrow="Partenaires"
        title="Des collaborations choisies, vérifiées et autorisées."
        intro="CLEDUCA-ODJ travaille avec des acteurs institutionnels, techniques, financiers, communautaires et locaux. Cette page présente sa politique de partenariat et ne publie que les collaborations confirmées et autorisées."
        crumbs={[{ label: "Partenaires" }]}
        image="/images/women-cooperative.jpg"
        imageAlt="Femmes travaillant ensemble dans une coopérative au Burkina Faso."
        imageCaption="Photo d’illustration : coopérative féminine au Burkina Faso. Crédit : TREEAID, CC BY 2.0."
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="green">{published.length} partenariat publié</Badge>
          <Badge tone="outline">Publication soumise à autorisation</Badge>
        </div>
      </PageHero>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Notre politique"
            title="Un partenariat n’est pas une décoration institutionnelle."
            description="La crédibilité d’une organisation se mesure aussi à la rigueur avec laquelle elle présente ses alliances. Quatre principes encadrent toute collaboration et toute mention publique."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                  <h3 className="mt-4 font-display text-[1.02rem] font-bold text-forest-950">
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
            eyebrow="Catégories"
            title="Les formes de collaboration que nous recherchons."
            description="Les catégories ci-dessous décrivent les types d’acteurs avec lesquels CLEDUCA-ODJ peut collaborer. Elles ne constituent pas une liste de partenaires existants."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partnerTypeKeys.map((type) => {
              const typePartners = published.filter(
                (partner) => partner.type === type,
              );
              return (
                <article
                  key={type}
                  className="flex h-full flex-col rounded-2xl border border-sand-300 bg-white p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-base font-bold text-forest-950">
                      {PARTNER_TYPE_LABELS[type]}
                    </h3>
                    <Badge tone="outline">
                      {typePartners.length} publié{typePartners.length > 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {categoryDescriptions[type]}
                  </p>
                  {typePartners.length > 0 ? (
                    <ul className="mt-4 space-y-2 border-t border-sand-200 pt-4">
                      {typePartners.map((partner) => (
                        <li key={partner.id}>
                          <p className="font-display text-sm font-bold text-forest-900">
                            {partner.name}
                          </p>
                          {partner.description ? (
                            <p className="mt-0.5 text-[0.78rem] leading-relaxed text-ink-muted">
                              {partner.description}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-auto border-t border-sand-200 pt-4 text-[0.72rem] text-ink-muted">
                      Aucun partenaire publié dans cette catégorie à ce stade.
                    </p>
                  )}
                </article>
              );
            })}
          </div>

          {published.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                icon={<BadgeCheck aria-hidden className="size-5" />}
                title="Aucun partenariat publié à ce stade"
                description="Les partenaires, logos et financements seront publiés après vérification et obtention des autorisations nécessaires. Cette page ne contient aucun partenaire, aucun logo et aucun financement fictif."
                action={
                  <ButtonLink href="/contact?type=partenariat" withArrow>
                    Proposer un partenariat
                  </ButtonLink>
                }
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading
            eyebrow="Processus"
            title="Comment se construit une collaboration."
            description="Chaque étape est documentée. L’absence d’accord formalisé ne permet pas la publication d’une mention ou d’un logo."
          />
          <ol className="divide-y divide-sand-300/80 border-y border-sand-300/80">
            {processSteps.map((step, index) => (
              <li key={step.title} className="flex gap-5 py-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-forest-50 font-display text-sm font-bold text-forest-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-[1.02rem] font-bold text-forest-900">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-sand-300/70 bg-sand-50 py-16">
        <div className="container-site">
          <div className="grid gap-6 rounded-3xl border border-sand-300 bg-white p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h2 className="font-display text-xl font-bold text-forest-950">
                Ce que nous ne publions pas
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Aucun partenaire pressenti, aucun logo non autorisé, aucun
                financement non confirmé et aucune caution institutionnelle
                implicite ne sont publiés. Les collaborations en discussion restent
                confidentielles jusqu’à leur formalisation. Une organisation qui
                souhaite retirer sa mention peut en faire la demande à tout moment.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ButtonLink href="/contact?type=partenariat" withArrow>
                Échanger avec nous
              </ButtonLink>
              <ButtonLink href="/gouvernance" variant="secondary">
                Gouvernance
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Construire ensemble"
        title="Un partenariat utile commence par un échange honnête."
        description="Institutions, organisations de la société civile, universités, médias, structures communautaires ou bailleurs : présentez votre intention, votre périmètre et vos contraintes. Nous répondrons avec la même clarté."
        primaryHref="/contact?type=partenariat"
        primaryLabel="Proposer un partenariat"
        secondaryHref="/projets"
        secondaryLabel="Découvrir nos initiatives"
      />
    </>
  );
}
