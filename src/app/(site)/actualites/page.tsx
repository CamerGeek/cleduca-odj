import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, Search, X } from "lucide-react";

import { ArticleCard } from "@/components/site/cards";
import { CtaBand } from "@/components/site/cta-band";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, PageHero } from "@/components/ui/page-hero";
import { getArticles } from "@/lib/content/queries";
import {
  ARTICLE_CATEGORY_LABELS,
  type ArticleCategory,
} from "@/lib/content/types";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Actualités et publications",
  description:
    "Actualités, annonces, notes de terrain et publications de CLEDUCA-ODJ sur l’éducation, la jeunesse, l’inclusion, le numérique et la justice de proximité.",
  path: "/actualites",
});

const categoryKeys = Object.keys(ARTICLE_CATEGORY_LABELS) as ArticleCategory[];

interface NewsSearchParams {
  q?: string;
  categorie?: string;
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<NewsSearchParams>;
}) {
  const [params, articles] = await Promise.all([searchParams, getArticles()]);

  const category = categoryKeys.includes(params.categorie as ArticleCategory)
    ? (params.categorie as ArticleCategory)
    : null;
  const query = (params.q ?? "").trim();
  const normalizedQuery = query.toLowerCase();

  const filtered = articles
    .filter((article) => {
      if (category && article.category !== category) return false;
      if (normalizedQuery) {
        const haystack = [article.title, article.excerpt, ...article.tags]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const hasFilters = Boolean(category || query);

  const categoryHref = (value: ArticleCategory | null) => {
    const search = new URLSearchParams();
    if (value) search.set("categorie", value);
    if (query) search.set("q", query);
    const suffix = search.toString();
    return suffix ? `/actualites?${suffix}` : "/actualites";
  };

  return (
    <>
      <PageHero
        eyebrow="Actualités et publications"
        title="Comprendre nos actions, suivre nos avancées."
        intro="Annonces institutionnelles, notes de terrain et publications : des contenus datés, attribués et mis à jour par l’équipe de CLEDUCA-ODJ."
        crumbs={[{ label: "Actualités" }]}
        image="/images/community-radio.jpg"
        imageAlt="Journaliste dans un studio de radio communautaire au Burkina Faso."
        imageCaption="Photo d’illustration : radio communautaire au Burkina Faso. Crédit : BuduMC, CC BY-SA 4.0."
      >
        <Badge tone="green">{articles.length} publications en ligne</Badge>
      </PageHero>

      <section className="border-b border-sand-300/70 bg-sand-50 py-8">
        <div className="container-site">
          <form
            method="get"
            action="/actualites"
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            {category ? (
              <input type="hidden" name="categorie" value={category} />
            ) : null}
            <div className="flex-1">
              <label
                htmlFor="news-search"
                className="field-label flex items-center gap-2"
              >
                <Search aria-hidden className="size-4 text-forest-600" />
                Rechercher
              </label>
              <input
                id="news-search"
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
                href="/actualites"
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
              Toutes
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
                {ARTICLE_CATEGORY_LABELS[key]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-muted">
              {filtered.length} publication{filtered.length > 1 ? "s" : ""}
              {query ? ` pour « ${query} »` : ""}
            </p>
            <p className="text-[0.7rem] text-ink-muted">
              Les contenus sont classés du plus récent au plus ancien.
            </p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Newspaper aria-hidden className="size-5" />}
              title="Aucune publication ne correspond à votre recherche"
              description="Essayez un autre mot-clé ou retirez le filtre de catégorie."
              action={
                <ButtonLink href="/actualites" variant="secondary" withArrow>
                  Afficher toutes les actualités
                </ButtonLink>
              }
            />
          )}

          <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-sand-300 bg-sand-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-forest-950">
                Documents institutionnels
              </h2>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-soft">
                Les rapports, guides et notes de politique validés seront publiés
                dans le centre de ressources.
              </p>
            </div>
            <ButtonLink href="/ressources" variant="secondary" size="sm" withArrow>
              Centre de ressources
            </ButtonLink>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Rester informé"
        title="Recevez nos publications et annonces institutionnelles."
        description="La lettre d’information de CLEDUCA-ODJ vous permet de suivre les avancées de nos projets et la mise à disposition de nouveaux documents. Inscription sur la base du consentement."
        primaryHref="/#newsletter"
        primaryLabel="S’inscrire à la lettre"
        secondaryHref="/contact"
        secondaryLabel="Nous contacter"
      />
    </>
  );
}
