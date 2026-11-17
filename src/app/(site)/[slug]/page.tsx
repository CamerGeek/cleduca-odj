import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Mail } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { Prose } from "@/components/ui/prose";
import { getPageBySlug } from "@/lib/content/queries";
import { formatDate, getSiteUrl } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: "Page introuvable",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: page.title,
    description: page.intro,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      type: "article",
      title: page.title,
      description: page.intro,
      url: `/${page.slug}`,
      modifiedTime: page.updatedAt,
      images: [
        {
          url: "/images/community-gathering.jpg",
          width: 1200,
          height: 800,
          alt: "Séance de dialogue communautaire au Burkina Faso.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.intro,
      images: ["/images/community-gathering.jpg"],
    },
  };
}

export default async function InstitutionalPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.intro,
    url: `${getSiteUrl()}/${page.slug}`,
    inLanguage: "fr",
    dateModified: page.updatedAt,
    isPartOf: {
      "@type": "WebSite",
      name: "CLEDUCA-ODJ",
      url: getSiteUrl(),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        crumbs={[{ label: page.title }]}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.72rem] text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <FileText aria-hidden className="size-3.5" />
            {page.sections.length} section{page.sections.length > 1 ? "s" : ""}
          </span>
          <span>Dernière mise à jour : {formatDate(page.updatedAt)}</span>
        </div>
      </PageHero>

      <section className="bg-white py-14 sm:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-[0.32fr_0.68fr] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav aria-labelledby="sommaire" className="rounded-2xl border border-sand-300 bg-sand-50 p-5">
              <h2
                id="sommaire"
                className="font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-forest-800"
              >
                Sur cette page
              </h2>
              <ol className="mt-3 space-y-2">
                {page.sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex gap-2.5 rounded text-[0.82rem] leading-snug text-ink-soft transition hover:text-forest-700"
                    >
                      <span className="font-display text-[0.68rem] font-bold tabular-nums text-gold-500">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-5 rounded-2xl border border-forest-200 bg-forest-50 p-5">
              <h2 className="font-display text-sm font-bold text-forest-950">
                Une question sur ce document ?
              </h2>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-ink-soft">
                Écrivez à l’équipe en précisant la page et la section concernées.
              </p>
              <ButtonLink
                href="/contact?type=information"
                variant="secondary"
                size="sm"
                className="mt-4"
              >
                <Mail aria-hidden className="size-4" />
                Nous écrire
              </ButtonLink>
            </div>

            <Link
              href="/ressources"
              className="mt-5 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-forest-700 underline underline-offset-4"
            >
              <ArrowLeft aria-hidden className="size-3.5" />
              Centre de ressources
            </Link>
          </aside>

          <div className="max-w-3xl">
            {page.sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 border-t border-sand-300/70 py-8 first:border-t-0 first:pt-0"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-xs font-bold tabular-nums text-gold-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-2xl font-bold tracking-[-0.025em] text-forest-950">
                    {section.title}
                  </h2>
                </div>
                <Prose className="mt-4">{section.body}</Prose>
              </section>
            ))}

            <div className="mt-10 rounded-2xl border border-sand-300 bg-sand-50 p-6">
              <h2 className="font-display text-base font-bold text-forest-950">
                Validité et mise à jour
              </h2>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-soft">
                Cette page institutionnelle peut être mise à jour pour tenir compte
                de l’évolution des services, des obligations légales ou des
                décisions de l’association. Les informations dont la validation
                reste incomplète sont signalées comme telles et ne sont pas
                remplacées par des contenus fictifs.
              </p>
              <p className="mt-3 text-[0.72rem] text-ink-muted">
                Dernière mise à jour : {formatDate(page.updatedAt)} · Statut :
                publié
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
