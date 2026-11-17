import type { Metadata } from "next";
import Image from "next/image";
import {
  BadgeCheck,
  Building2,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { CtaBand } from "@/components/site/cta-band";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { organisationValues } from "@/content/values";
import {
  getMilestones,
  getPartners,
  getSettings,
} from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Histoire, mission, vision, valeurs, approche et gouvernance de CLEDUCA-ODJ, organisation de la société civile burkinabè créée en 1997 à Bobo-Dioulasso.",
  alternates: { canonical: "/a-propos" },
};

const approachSteps = [
  {
    title: "Écouter et comprendre",
    description:
      "Partir des réalités vécues, des priorités exprimées et des mécanismes communautaires existants, sans plaquer de réponse extérieure.",
  },
  {
    title: "Co-construire",
    description:
      "Associer les communautés, les écoles, les familles et les acteurs locaux à la conception et au suivi des actions.",
  },
  {
    title: "Documenter et partager",
    description:
      "Vérifier les informations, expliciter les sources et rendre compte des résultats, y compris lorsque les données restent incomplètes.",
  },
];

const presence = [
  {
    place: "Bobo-Dioulasso",
    region: "Hauts-Bassins",
    detail: "Siège de l’association et ancrage historique de son action.",
  },
  {
    place: "Région des Cascades",
    region: "2 écoles",
    detail: "Présence documentée dans le cadre du dispositif PASEDI.",
  },
  {
    place: "Boucle du Mouhoun",
    region: "3 écoles",
    detail: "Présence documentée dans le cadre du dispositif PASEDI.",
  },
];

export default async function AboutPage() {
  const [settings, milestones, partners] = await Promise.all([
    getSettings(),
    getMilestones(),
    getPartners(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="Éduquer, autonomiser et bâtir des communautés résilientes."
        intro={settings.positioning}
        crumbs={[{ label: "À propos" }]}
        image="/images/about-bobo.jpg"
        imageAlt="Artère commerçante de Bobo-Dioulasso, Burkina Faso."
        imageCaption="Bobo-Dioulasso, Hauts-Bassins. Photo d’illustration : Maarten van der Bent, CC BY-SA 2.0."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="green">Depuis {settings.foundedYear}</Badge>
          <Badge tone="outline">
            <MapPin aria-hidden className="size-3" />
            {settings.city}
          </Badge>
          <Badge tone="gold">À but non lucratif</Badge>
        </div>
      </PageHero>

      <section id="mission" className="scroll-mt-28 bg-white py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Mission et vision"
            title="Une mission claire, une vision au service des communautés."
            description="CLEDUCA-ODJ inscrit son action dans le champ de l’éducation, de la jeunesse, de l’inclusion sociale et du développement communautaire au Burkina Faso."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <article className="relative overflow-hidden rounded-3xl border border-sand-300/80 bg-sand-50 p-8 sm:p-10">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-2 top-3 font-display text-[6rem] font-extrabold leading-none text-forest-900/[0.05]"
              >
                01
              </span>
              <span className="flex size-11 items-center justify-center rounded-xl bg-forest-700 text-white">
                <Sparkles aria-hidden className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold tracking-[-0.03em] text-forest-950">
                Notre mission
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                Œuvrer pour l’éducation, l’autonomisation des jeunes, l’inclusion
                sociale et le développement communautaire, en plaçant la
                participation des communautés au cœur de la conception et du suivi
                des actions qui les concernent.
              </p>
              <p className="mt-4 text-[0.8rem] leading-relaxed text-ink-muted">
                Formulation éditoriale fondée sur le positionnement public et les
                valeurs de l’association. Elle sera remplacée par la formulation
                officielle après validation par les instances.
              </p>
            </article>

            <article className="relative overflow-hidden rounded-3xl border border-forest-800 bg-forest-900 p-8 text-white sm:p-10">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-2 top-3 font-display text-[6rem] font-extrabold leading-none text-white/[0.06]"
              >
                02
              </span>
              <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-gold-300">
                <ShieldCheck aria-hidden className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold tracking-[-0.03em]">
                Notre vision
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-white/75">
                Des communautés éduquées, inclusives et résilientes, capables de
                porter leur propre développement et de garantir à chacun la
                possibilité de participer à la vie collective.
              </p>
              <p className="mt-4 text-[0.8rem] leading-relaxed text-white/50">
                Formulation éditoriale à valider par les instances de
                l’association.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="valeurs" className="scroll-mt-28 border-y border-sand-300/70 bg-sand-50 py-20">
        <div className="container-site grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <SectionHeading
            eyebrow="Nos valeurs"
            title="Cinq repères pour guider nos choix."
            description="Les valeurs de CLEDUCA-ODJ ne sont pas des principes décoratifs : elles orientent la manière de concevoir, de conduire et d’évaluer les initiatives."
          />
          <ul className="divide-y divide-sand-300/80 border-y border-sand-300/80">
            {organisationValues.map((value, index) => (
              <li key={value.title} className="flex gap-5 py-5">
                <span className="font-display text-sm font-bold tabular-nums text-gold-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-[1.05rem] font-bold text-forest-900">
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
      </section>

      <section id="approche" className="scroll-mt-28 bg-white py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Notre approche"
            title="Une démarche de proximité, de co-construction et de redevabilité."
            description="CLEDUCA-ODJ privilégie des réponses ancrées dans les réalités locales, construites avec les acteurs concernés et documentées de manière transparente."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {approachSteps.map((step, index) => (
              <article
                key={step.title}
                className="relative rounded-2xl border border-sand-300/80 bg-sand-50 p-6"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-white font-display text-sm font-bold text-forest-700 shadow-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-forest-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="histoire" className="scroll-mt-28 border-y border-sand-300/70 bg-sand-100 py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Notre histoire"
            title="Depuis 1997, un engagement continu."
            description="Seuls les jalons documentés sont publiés. Les étapes dont la date ou le contenu ne sont pas vérifiés ne sont pas présentées comme des faits établis."
            action={
              <ButtonLink href="/gouvernance" variant="secondary" size="sm" withArrow>
                Gouvernance et redevabilité
              </ButtonLink>
            }
          />

          {milestones.length > 0 ? (
            <ol className="relative mt-12 space-y-8 border-l border-forest-300/60 pl-6 sm:pl-10">
              {milestones.map((milestone) => (
                <li key={milestone.id} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-[1.85rem] top-1.5 flex size-3 items-center justify-center rounded-full bg-gold-400 ring-4 ring-sand-100 sm:-left-[2.85rem]"
                  />
                  <div className="rounded-2xl border border-sand-300/80 bg-white p-6 sm:p-7">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-sm font-bold uppercase tracking-[0.16em] text-gold-600">
                        {milestone.year}
                      </span>
                      {milestone.verified ? (
                        <Badge tone="green">
                          <BadgeCheck aria-hidden className="size-3" />
                          Vérifié
                        </Badge>
                      ) : null}
                    </div>
                    <h3 className="mt-2 font-display text-xl font-bold text-forest-950">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {milestone.description}
                    </p>
                    <p className="mt-3 text-[0.7rem] text-ink-muted">
                      Source : {milestone.source}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-10">
              <EmptyState
                title="Aucun jalon historique publié"
                description="Les éléments historiques seront publiés après vérification auprès de l’association."
              />
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-sand-300 bg-white/70 p-5 text-sm leading-relaxed text-ink-soft sm:flex-row sm:items-center sm:justify-between">
            <p>
              Vous disposez d’archives ou de documents permettant de documenter
              l’histoire de l’association ?
            </p>
            <ButtonLink href="/contact" variant="ghost" size="sm" withArrow>
              Nous écrire
            </ButtonLink>
          </div>
        </div>
      </section>

      <section id="presence" className="scroll-mt-28 bg-white py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Présence"
              title="Un ancrage à Bobo-Dioulasso, une action qui s’étend."
              description="La présence géographique présentée ici est celle qui est documentée publiquement par les initiatives de l’association. Elle ne constitue pas une liste exhaustive de ses zones d’intervention."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/projets" variant="secondary" size="sm" withArrow>
                Voir les projets
              </ButtonLink>
              <ButtonLink href="/impact" variant="ghost" size="sm">
                Données d’impact
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {presence.map((item, index) => (
              <article
                key={item.place}
                className={`rounded-2xl border border-sand-300/80 bg-sand-50 p-6 ${
                  index === 0 ? "sm:col-span-2" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-white text-forest-700 shadow-soft">
                    {index === 0 ? (
                      <Building2 aria-hidden className="size-5" />
                    ) : (
                      <MapPin aria-hidden className="size-5" />
                    )}
                  </span>
                  <Badge tone="outline">{item.region}</Badge>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-forest-950">
                  {item.place}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="partenaires" className="scroll-mt-28 border-t border-sand-300/70 bg-sand-50 py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Partenaires"
            title="Des collaborations fondées sur la clarté et l’autorisation."
            description="CLEDUCA-ODJ ne publie un partenaire, un logo ou un financement qu’après vérification et autorisation. Les partenariats non confirmés ne sont pas présentés sur ce site."
            action={
              <ButtonLink href="/partenaires" variant="secondary" size="sm" withArrow>
                Espace partenaires
              </ButtonLink>
            }
          />
          {partners.length > 0 ? (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {partners.map((partner) => (
                <li
                  key={partner.id}
                  className="rounded-2xl border border-sand-300 bg-white p-5"
                >
                  <p className="font-display text-base font-bold text-forest-950">
                    {partner.name}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">{partner.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed border-sand-400 bg-white/70 px-6 py-10 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-forest-50 text-forest-700">
                <BadgeCheck aria-hidden className="size-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-forest-950">
                Aucun partenariat publié à ce stade
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                Les partenariats et financements seront publiés après vérification
                et obtention des autorisations nécessaires. Cette rubrique ne
                contient aucun partenaire fictif.
              </p>
              <div className="mt-6">
                <ButtonLink href="/contact" withArrow>
                  Proposer un partenariat
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white pt-16">
        <div className="container-site">
          <figure className="relative overflow-hidden rounded-[2rem]">
            <div className="relative aspect-[16/7] min-h-[16rem]">
              <Image
                src="/images/community-gathering.jpg"
                alt="Séance de dialogue communautaire en plein air au Burkina Faso."
                fill
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-forest-950/85 via-forest-950/35 to-transparent"
              />
              <figcaption className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-center p-7 text-white sm:p-10">
                <p className="eyebrow text-gold-300">Notre conviction</p>
                <p className="mt-3 font-display text-2xl font-bold leading-snug sm:text-3xl">
                  « Le développement durable commence par des communautés
                  écoutées, reconnues et capables d’agir. »
                </p>
                <p className="mt-4 text-[0.72rem] text-white/60">
                  Photo d’illustration : dialogue communautaire au Burkina Faso.
                  Crédit : DFID, CC BY 2.0.
                </p>
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      <CtaBand
        eyebrow="Travailler avec nous"
        title="Vous partagez notre engagement pour l’éducation et l’inclusion ?"
        description="Institutions, organisations de la société civile, acteurs de la recherche, médias ou personnes engagées : construisons une collaboration claire, utile et respectueuse des communautés."
        primaryHref="/contact"
        primaryLabel="Nous contacter"
        secondaryHref="/projets"
        secondaryLabel="Découvrir nos projets"
      />
    </>
  );
}
