import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { AreaIcon } from "@/components/ui/area-icon";
import { Badge, ProjectStatusBadge } from "@/components/ui/badge";
import {
  ARTICLE_CATEGORY_LABELS,
  type AreaStatus,
  type Article,
  type InterventionArea,
  type Project,
} from "@/lib/content/types";
import { formatDate } from "@/lib/utils";

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

export function AreaCard({ area }: { area: InterventionArea }) {
  return (
    <Link
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
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{area.tagline}</p>
      <p className="mt-3 line-clamp-3 text-[0.82rem] leading-relaxed text-ink-muted">
        {area.summary}
      </p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.78rem] font-semibold text-forest-700">
        Découvrir
        <ArrowUpRight
          aria-hidden
          className="size-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group card-hover flex h-full flex-col overflow-hidden rounded-3xl border border-sand-300/80 bg-white hover:border-forest-300">
      <Link href={`/projets/${project.slug}`} className="flex h-full flex-col">
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
            className="absolute inset-0 bg-gradient-to-t from-forest-950/40 to-transparent"
          />
          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
            <ProjectStatusBadge status={project.status} />
            <Badge tone="dark">{project.acronym}</Badge>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-xl font-bold leading-snug tracking-[-0.02em] text-forest-950">
            {project.title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
            {project.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.coverage.slice(0, 2).map((item) => (
              <span
                key={item}
                className="rounded-full border border-sand-300 bg-sand-50 px-2.5 py-1 text-[0.68rem] font-medium text-ink-soft"
              >
                {item}
              </span>
            ))}
          </div>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.8rem] font-semibold text-forest-700">
            Découvrir le projet
            <ArrowRight
              aria-hidden
              className="size-4 transition group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}

export function ArticleCard({
  article,
  variant = "vertical",
}: {
  article: Article;
  variant?: "vertical" | "horizontal";
}) {
  if (variant === "horizontal") {
    return (
      <article className="group rounded-2xl border border-sand-300/80 bg-white p-4 transition hover:border-forest-300">
        <Link href={`/actualites/${article.slug}`} className="flex items-start gap-4">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-sand-200 sm:size-24">
            <Image
              src={article.coverImage}
              alt={article.coverAlt}
              fill
              sizes="96px"
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
    );
  }

  return (
    <article className="group card-hover flex h-full flex-col overflow-hidden rounded-3xl border border-sand-300/80 bg-white hover:border-forest-300">
      <Link href={`/actualites/${article.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-sand-200">
          <Image
            src={article.coverImage}
            alt={article.coverAlt}
            fill
            sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute left-4 top-4">
            <Badge tone="gold">{ARTICLE_CATEGORY_LABELS[article.category]}</Badge>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-ink-muted">
            {formatDate(article.publishedAt)}
          </p>
          <h3 className="mt-2 font-display text-xl font-bold leading-snug tracking-[-0.02em] text-forest-950">
            {article.title}
          </h3>
          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-ink-soft">
            {article.excerpt}
          </p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.8rem] font-semibold text-forest-700">
            Lire l’article
            <ArrowRight
              aria-hidden
              className="size-4 transition group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
