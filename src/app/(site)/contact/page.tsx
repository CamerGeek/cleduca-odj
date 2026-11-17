import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Handshake,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";

import { ContactForm } from "@/components/site/contact-form";
import { CtaBand } from "@/components/site/cta-band";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSettings } from "@/lib/content/queries";
import {
  INQUIRY_TYPE_LABELS,
  type InquiryType,
} from "@/lib/content/types";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact et engagement",
  description:
    "Contacter CLEDUCA-ODJ, proposer un partenariat, devenir bénévole ou demander une information. Formulaire sécurisé et coordonnées institutionnelles.",
  path: "/contact",
});

const engagementPaths = [
  {
    icon: Users,
    title: "Devenir bénévole",
    description:
      "Contribuer à une initiative éducative, numérique, communautaire ou de justice de proximité, selon vos compétences et votre disponibilité.",
    href: "/contact?type=benevolat#formulaire",
    label: "Proposer mon appui",
  },
  {
    icon: Handshake,
    title: "Proposer un partenariat",
    description:
      "Institutions, organisations de la société civile, universités, bailleurs ou structures locales : construire une collaboration documentée.",
    href: "/contact?type=partenariat#formulaire",
    label: "Présenter un partenariat",
  },
  {
    icon: Newspaper,
    title: "Presse et médias",
    description:
      "Demandes d’information, interviews, autorisations d’usage d’images ou éclaircissements sur une publication institutionnelle.",
    href: "/contact?type=presse#formulaire",
    label: "Contacter la presse",
  },
  {
    icon: ShieldCheck,
    title: "Signalement et protection",
    description:
      "Signaler une erreur, une difficulté d’accessibilité, un problème lié à une image ou une atteinte aux droits des personnes.",
    href: "/contact?type=autre#formulaire",
    label: "Effectuer un signalement",
  },
];

const faqs = [
  {
    question: "Comment obtenir un document institutionnel ?",
    answer:
      "Les documents validés sont publiés dans le centre de ressources. Pour un document non disponible ou une version accessible, utilisez le formulaire en précisant le titre, l’usage envisagé et le format souhaité. L’association indiquera si le document peut être communiqué.",
  },
  {
    question: "Puis-je transmettre des informations sur des bénéficiaires ?",
    answer:
      "Non. Le site et le formulaire ne doivent pas être utilisés pour transmettre des dossiers individuels, des informations sensibles ou des données concernant des personnes déplacées, des enfants ou des personnes en situation de handicap. Les échanges doivent rester au niveau institutionnel et programmatique.",
  },
  {
    question: "Comment demander le retrait d’une photographie ?",
    answer:
      "Les photographies du site sont des illustrations sous licence libre, créditées sur la page dédiée. Si vous êtes représenté sur une image ou si vous estimez qu’une image porte atteinte à vos droits, écrivez-nous en précisant la page concernée. La demande sera examinée avec attention.",
  },
  {
    question: "Quel est le délai de réponse ?",
    answer:
      "Les demandes sont traitées dans un délai raisonnable, généralement sous plusieurs jours ouvrés. Les demandes urgentes liées à la sécurité ou aux droits des personnes sont examinées en priorité. Aucun délai contractuel n’est garanti à ce stade.",
  },
  {
    question: "Les coordonnées téléphoniques et e-mail sont-elles publiques ?",
    answer:
      "Les coordonnées officielles seront publiées après validation par l’association. En attendant, le formulaire de contact est le canal recommandé. Cette page n’affiche aucune coordonnée inventée.",
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const [params, settings] = await Promise.all([searchParams, getSettings()]);

  const requestedType = params.type;
  const defaultInquiryType: InquiryType =
    requestedType && requestedType in INQUIRY_TYPE_LABELS
      ? (requestedType as InquiryType)
      : "information";

  const address =
    settings.contactAddress ||
    `${settings.city}, ${settings.region}, ${settings.country}`;

  return (
    <>
      <PageHero
        eyebrow="Contact et engagement"
        title="Écrivez-nous. La qualité d’un échange commence par la clarté."
        intro="CLEDUCA-ODJ reçoit les demandes d’information, de partenariat, de bénévolat, de collaboration, de presse et les signalements. Utilisez le formulaire pour joindre l’équipe : il est le canal recommandé tant que les coordonnées officielles ne sont pas publiées."
        crumbs={[{ label: "Contact" }]}
        image="/images/local-market.jpg"
        imageAlt="Marché alimentaire traditionnel à Logobou, Burkina Faso."
        imageCaption="Photo d’illustration : marché local au Burkina Faso. Crédit : Ye Shan, CC BY-SA 4.0."
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="green">Formulaire sécurisé</Badge>
          <Badge tone="outline">Sans données sensibles</Badge>
        </div>
      </PageHero>

      <section className="border-b border-sand-300/70 bg-sand-50 py-12 sm:py-14">
        <div className="container-site">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border border-sand-300 bg-white p-5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                <MapPin aria-hidden className="size-5" />
              </span>
              <h2 className="mt-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-forest-800">
                Siège
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{address}</p>
            </article>

            <article className="rounded-2xl border border-sand-300 bg-white p-5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                <Mail aria-hidden className="size-5" />
              </span>
              <h2 className="mt-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-forest-800">
                Adresse e-mail
              </h2>
              {settings.contactEmail ? (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="mt-2 block break-all text-sm font-medium text-forest-700 underline underline-offset-4"
                >
                  {settings.contactEmail}
                </a>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Coordonnée à publier après validation. Utilisez le formulaire.
                </p>
              )}
            </article>

            <article className="rounded-2xl border border-sand-300 bg-white p-5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                <Phone aria-hidden className="size-5" />
              </span>
              <h2 className="mt-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-forest-800">
                Téléphone
              </h2>
              {settings.contactPhone ? (
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="mt-2 block text-sm font-medium text-forest-700 underline underline-offset-4"
                >
                  {settings.contactPhone}
                </a>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Numéro à publier après validation. Aucun numéro n’est inventé.
                </p>
              )}
            </article>

            <article className="rounded-2xl border border-sand-300 bg-white p-5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                <Clock aria-hidden className="size-5" />
              </span>
              <h2 className="mt-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-forest-800">
                Horaires
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {settings.contactHours ||
                  "Horaires d’accueil à confirmer auprès de l’association."}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="s-engager" className="scroll-mt-28 bg-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="S’engager"
            title="Quatre manières d’entrer en relation."
            description="Choisissez le motif qui correspond à votre démarche. Le formulaire s’adapte automatiquement à votre choix et permet à l’équipe d’orienter votre demande."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {engagementPaths.map((path) => {
              const Icon = path.icon;
              return (
                <article
                  key={path.title}
                  className="flex h-full flex-col rounded-2xl border border-sand-300/80 bg-sand-50 p-6"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-white text-forest-700 shadow-soft">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-[1.02rem] font-bold text-forest-950">
                    {path.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {path.description}
                  </p>
                  <Link
                    href={path.href}
                    className="mt-auto inline-flex items-center pt-4 text-[0.78rem] font-semibold text-forest-700 underline underline-offset-4"
                  >
                    {path.label}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="formulaire"
        className="scroll-mt-28 border-y border-sand-300/70 bg-sand-100 py-16 sm:py-20"
      >
        <div className="container-site grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="rounded-3xl border border-sand-300 bg-white p-6 sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="Formulaire de contact"
              title="Votre message, transmis de manière sécurisée."
              description="Les champs sont validés côté serveur. Les envois automatisés sont limités. Ne transmettez pas de données personnelles sensibles."
            />
            <div className="mt-8">
              <ContactForm defaultInquiryType={defaultInquiryType} />
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-sand-300 bg-white p-6">
              <h2 className="font-display text-lg font-bold text-forest-950">
                Ce que vous pouvez nous écrire
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
                <li>Demande d’information institutionnelle ou documentaire.</li>
                <li>Proposition de partenariat ou de collaboration.</li>
                <li>Candidature de bénévolat ou de stage.</li>
                <li>Demande presse, interview ou autorisation d’image.</li>
                <li>Signalement d’erreur, d’accessibilité ou de droits.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-forest-200 bg-forest-50 p-6">
              <h2 className="font-display text-lg font-bold text-forest-950">
                À ne pas transmettre
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Aucun dossier individuel de bénéficiaire, aucune information
                sensible concernant des personnes déplacées, des enfants ou des
                personnes vulnérables, et aucun document d’identité ne doit être
                envoyé via ce formulaire.
              </p>
              <p className="mt-3 text-[0.72rem] leading-relaxed text-ink-muted">
                Pour les situations individuelles urgentes, adressez-vous aux
                services compétents. CLEDUCA-ODJ ne traite pas les urgences
                individuelles par ce canal.
              </p>
            </div>

            <div className="rounded-2xl border border-sand-300 bg-white p-6">
              <h2 className="font-display text-lg font-bold text-forest-950">
                Protection des données
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Les informations transmises servent uniquement à traiter votre
                demande. Leur durée de conservation et vos droits sont précisés
                dans la politique de confidentialité.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <ButtonLink
                  href="/confidentialite"
                  variant="secondary"
                  size="sm"
                >
                  Politique de confidentialité
                </ButtonLink>
                <ButtonLink href="/accessibilite" variant="ghost" size="sm">
                  Accessibilité
                </ButtonLink>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <SectionHeading
            eyebrow="Questions fréquentes"
            title="Avant de nous écrire."
            description="Ces réponses portent sur les demandes les plus courantes. Si votre question n’y figure pas, utilisez le formulaire."
          />
          <div className="divide-y divide-sand-300/80 border-y border-sand-300/80">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-[1rem] font-bold text-forest-900 marker:content-none">
                  {faq.question}
                  <span
                    aria-hidden
                    className="flex size-7 shrink-0 items-center justify-center rounded-full border border-sand-400 text-forest-700 transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Aller plus loin"
        title="Vous cherchez un document ou une donnée précise ?"
        description="Le centre de ressources rassemble les documents institutionnels publiés. Les indicateurs d’impact sont présentés avec leur source, leur période et leur niveau de vérification."
        primaryHref="/ressources"
        primaryLabel="Consulter les ressources"
        secondaryHref="/impact"
        secondaryLabel="Voir les données d’impact"
      />
    </>
  );
}
