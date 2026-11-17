import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock, Share2, User } from "lucide-react";

import { ArticleCard } from "@/components/site/cards";
import { FacebookIcon, LinkedinIcon, WhatsappIcon } from "@/components/site/social-icons";
import { Badge, ProjectStatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/page-hero";
import { Prose } from "@/components/ui/prose";
import {
  getArticleBySlug,
  getArticles,
  getProjects,
} from "@/lib/content/queries";
import { ARTICLE_CATEGORY_LABELS } from "@/lib/content/types";
import { absoluteUrl, formatDate, getSiteUrl, readingTime } from "@/lib/utils";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Publication introuvable" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/actualites/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.authorName],
      tags: article.tags,
      images: [{ url: article.coverImage, alt: article.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [article, articles, projects] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(),
    getProjects(),
  ]);

  if (!article) notFound();

  const url = absoluteUrl(`/actualites/${article.slug}`);
  const relatedProjects = projects.filter((project) =>
    article.projectSlugs.includes(project.slug),
  );
  const relatedArticles = articles
    .filter(
      (item) =>
        item.id !== article.id &&
        (item.category === article.category ||
          item.projectSlugs.some((slugValue) =>
            article.projectSlugs.includes(slugValue),
          )),
    )
    .slice(0, 2);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: article.authorName },
    publisher: {
      "@type": "Organization",
      name: "CLEDUCA-ODJ",
      logo: {
        "@type": "ImageObject",
        url: `${getSiteUrl()}/brand/cleduca-odj-logo.png`,
      },
    },
    image: [absoluteUrl(article.coverImage)],
    mainEntityOfPage: url,
    inLanguage: "fr",
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="relative overflow-hidden border-b border-sand-300/80 bg-sand-100">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-[26rem] rounded-full bg-leaf-200/40 blur-3xl"
        />
        <div className="container-site relative py-10 sm:py-14">
          <Breadcrumbs
            items={[
              { label: "Actualités", href: "/actualites" },
              { label: article.title },
            ]}
          />
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="gold">
                {ARTICLE_CATEGORY_LABELS[article.category]}
              </Badge>
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                {formatDate(article.publishedAt)}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-[1.06] tracking-[-0.04em] text-forest-950 sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-soft sm:text-lg">
              {article.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.78rem] text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <User aria-hidden className="size-3.5 text-forest-600" />
                {article.authorName}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden className="size-3.5 text-forest-600" />
                {readingTime(article.body)} min de lecture
              </span>
            </div>
          </div>

          <figure className="mt-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[1.75rem] bg-sand-200 shadow-card">
              <Image
                src={article.coverImage}
                alt={article.coverAlt}
                fill
                priority
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-[0.7rem] text-ink-muted">
              {article.coverAlt} —{" "}
              <Link
                href="/credits-photographiques"
                className="underline underline-offset-4 hover:text-forest-700"
              >
                Crédits photographiques
              </Link>
              . Photo d’illustration.
            </figcaption>
          </figure>
        </div>
      </header>

      <div className="bg-white py-14 sm:py-16">
        <div className="container-site grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
          <div className="min-w-0 max-w-3xl">
            <Prose>{article.body}</Prose>

            {article.tags.length > 0 ? (
              <ul className="mt-10 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <li key={tag}>
                    <span className="rounded-full border border-sand-300 bg-sand-50 px-3 py-1 text-[0.72rem] font-medium text-ink-soft">
                      #{tag}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-10 rounded-2xl border border-sand-300 bg-sand-50 p-6">
              <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-forest-800">
                À propos de cet article
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Cet article est publié par l’équipe de CLEDUCA-ODJ. Les données
                chiffrées sont rattachées à leurs sources lorsqu’elles sont
                disponibles. Les témoignages personnels et les photographies de
                bénéficiaires ne sont publiés qu’après consentement.
              </p>
              <p className="mt-3 text-[0.72rem] text-ink-muted">
                Une correction à signaler ?{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-forest-700 underline underline-offset-4"
                >
                  Écrivez-nous
                </Link>
                .
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/actualites"
                className="inline-flex items-center gap-2 text-sm font-semibold text-forest-700 underline underline-offset-4 hover:text-forest-900"
              >
                <ArrowLeft aria-hidden className="size-4" />
                Toutes les actualités
              </Link>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-sand-300 bg-white p-5 shadow-soft">
              <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-forest-800">
                <Share2 aria-hidden className="size-4" />
                Partager
              </h2>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${article.title} — ${url}`)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-lg border border-sand-300 px-3 py-2 text-sm font-medium text-ink-soft transition hover:border-forest-300 hover:bg-sand-50"
                >
                  <WhatsappIcon className="size-4 text-forest-700" />
                  WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-lg border border-sand-300 px-3 py-2 text-sm font-medium text-ink-soft transition hover:border-forest-300 hover:bg-sand-50"
                >
                  <FacebookIcon className="size-4 text-forest-700" />
                  Facebook
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-lg border border-sand-300 px-3 py-2 text-sm font-medium text-ink-soft transition hover:border-forest-300 hover:bg-sand-50"
                >
                  <LinkedinIcon className="size-4 text-forest-700" />
                  LinkedIn
                </a>
              </div>
            </div>

            {relatedProjects.length > 0 ? (
              <div className="rounded-2xl border border-sand-300 bg-sand-50 p-5">
                <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-forest-800">
                  Projet{relatedProjects.length > 1 ? "s" : ""} lié
                  {relatedProjects.length > 1 ? "s" : ""}
                </h2>
                <ul className="mt-4 space-y-3">
                  {relatedProjects.map((project) => (
                    <li key={project.id}>
                      <Link
                        href={`/projets/${project.slug}`}
                        className="group block rounded-xl border border-sand-300 bg-white p-4 transition hover:border-forest-300"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-display text-sm font-bold text-forest-900">
                            {project.acronym}
                          </span>
                          <ProjectStatusBadge status={project.status} />
                        </div>
                        <p className="mt-1.5 text-[0.78rem] leading-snug text-ink-soft group-hover:text-forest-700">
                          {project.title}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-2xl bg-forest-900 p-5 text-white">
              <p className="font-display text-base font-bold">
                Suivre nos publications
              </p>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-white/70">
                Inscrivez-vous à la lettre d’information pour recevoir les nouvelles
                publications institutionnelles.
              </p>
              <ButtonLink
                href="/#newsletter"
                variant="light"
                size="sm"
                withArrow
                className="mt-4"
              >
                S’inscrire
              </ButtonLink>
            </div>
          </aside>
        </div>
      </div>

      {relatedArticles.length > 0 ? (
        <section className="border-t border-sand-300/70 bg-sand-50 py-14">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-forest-950">
                À lire également
              </h2>
              <Link
                href="/actualites"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-900"
              >
                Toutes les actualités
                <ArrowUpRight aria-hidden className="size-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {relatedArticles.map((item) => (
                <ArticleCard key={item.id} article={item} variant="horizontal" />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
