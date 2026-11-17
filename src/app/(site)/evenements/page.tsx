import type { Metadata } from "next";
import { CalendarDays, MapPin, Newspaper } from "lucide-react";

import { CtaBand } from "@/components/site/cta-band";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { getEvents } from "@/lib/content/queries";
import type { Event } from "@/lib/content/types";
import { pageMetadata } from "@/lib/seo";
import { formatDate, isExternalHref } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Événements",
  description:
    "Agenda des rencontres, ateliers, formations et temps communautaires de CLEDUCA-ODJ. Les événements sont publiés après confirmation de leur date et de leur lieu.",
  path: "/evenements",
});

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function EventCard({ event, past = false }: { event: Event; past?: boolean }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-sand-300/80 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge tone={past ? "outline" : "green"}>
          {past ? "Événement passé" : "À venir"}
        </Badge>
        {event.location ? (
          <span className="inline-flex items-center gap-1.5 text-[0.7rem] text-ink-muted">
            <MapPin aria-hidden className="size-3.5" />
            {event.location}
          </span>
        ) : null}
      </div>
      <h3 className="mt-4 font-display text-xl font-bold leading-snug text-forest-950">
        {event.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        {event.description}
      </p>
      <p className="mt-4 inline-flex items-center gap-2 text-[0.8rem] font-semibold text-forest-800">
        <CalendarDays aria-hidden className="size-4" />
        {formatDate(event.startsAt)}
        {formatTime(event.startsAt) ? ` · ${formatTime(event.startsAt)}` : ""}
        {event.endsAt && event.endsAt !== event.startsAt
          ? ` — ${formatDate(event.endsAt)}`
          : ""}
      </p>
      {event.registrationUrl ? (
        <div className="mt-auto pt-5">
          {isExternalHref(event.registrationUrl) ? (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center text-sm font-semibold text-forest-700 underline underline-offset-4"
            >
              Informations et inscription
            </a>
          ) : (
            <ButtonLink href={event.registrationUrl} size="sm" withArrow>
              Informations et inscription
            </ButtonLink>
          )}
        </div>
      ) : null}
    </article>
  );
}

export default async function EventsPage() {
  const events = await getEvents();
  const now = Date.now();

  const sorted = [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const upcoming = sorted.filter(
    (event) => new Date(event.endsAt || event.startsAt).getTime() >= now,
  );
  const past = sorted
    .filter((event) => new Date(event.endsAt || event.startsAt).getTime() < now)
    .reverse();

  return (
    <>
      <PageHero
        eyebrow="Agenda"
        title="Se rencontrer, apprendre et agir ensemble."
        intro="Ateliers, formations, rencontres communautaires et temps institutionnels : les événements de CLEDUCA-ODJ sont publiés après confirmation de leur date, de leur lieu et de leurs modalités d’accès."
        crumbs={[{ label: "Événements" }]}
        image="/images/community-gathering.jpg"
        imageAlt="Rencontre communautaire en plein air au Burkina Faso."
        imageCaption="Photo d’illustration : dialogue communautaire au Burkina Faso. Crédit : DFID, CC BY 2.0."
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="green">{upcoming.length} événement à venir</Badge>
          <Badge tone="outline">{past.length} événement passé</Badge>
        </div>
      </PageHero>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="À venir"
            title="Les prochains rendez-vous."
            description="Seuls les événements confirmés sont affichés. Les dates en cours de validation ne sont pas publiées comme définitives."
          />

          {upcoming.length > 0 ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState
                icon={<CalendarDays aria-hidden className="size-5" />}
                title="Aucun événement programmé publiquement à ce stade"
                description="Les rencontres, ateliers et formations seront annoncés ici après confirmation de leurs dates et de leurs modalités. Aucun événement fictif n’est affiché."
                action={
                  <ButtonLink href="/#newsletter" withArrow>
                    Être informé des prochains rendez-vous
                  </ButtonLink>
                }
              />
            </div>
          )}
        </div>
      </section>

      {past.length > 0 ? (
        <section className="border-y border-sand-300/70 bg-sand-100 py-16 sm:py-20">
          <div className="container-site">
            <SectionHeading
              eyebrow="Retour sur les rencontres"
              title="Les événements passés."
              description="Les comptes rendus et ressources associées sont publiés dans la mesure où ils sont disponibles."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {past.map((event) => (
                <EventCard key={event.id} event={event} past />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-16">
        <div className="container-site">
          <div className="grid gap-6 rounded-3xl border border-sand-300 bg-sand-50 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h2 className="font-display text-xl font-bold text-forest-950">
                Organiser une rencontre avec CLEDUCA-ODJ
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Les organisations, établissements, collectifs et partenaires
                souhaitant proposer un atelier, une formation ou un temps
                d’échange peuvent nous écrire en précisant le thème, le public
                visé et le format envisagé.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ButtonLink href="/contact?type=collaboration" withArrow>
                Proposer un événement
              </ButtonLink>
              <ButtonLink href="/actualites" variant="secondary">
                <Newspaper aria-hidden className="size-4" />
                Lire les actualités
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Rester informé"
        title="Recevez les annonces d’événements et de publications."
        description="La lettre d’information de CLEDUCA-ODJ vous informe des prochains rendez-vous, des nouvelles publications et des avancées des projets. Inscription sur la base du consentement."
        primaryHref="/#newsletter"
        primaryLabel="S’inscrire à la lettre"
        secondaryHref="/contact"
        secondaryLabel="Nous contacter"
      />
    </>
  );
}
