import "server-only";

import { cache } from "react";

import type {
  Article,
  DashboardStats,
  InterventionArea,
  Project,
} from "@/lib/content/types";
import { getRepository } from "./index";

export const getSettings = cache(async () => {
  const repository = await getRepository();
  return repository.getSettings();
});

export const getAreas = cache(async () => {
  const repository = await getRepository();
  return repository.list("areas");
});

export const getAreaBySlug = cache(async (slug: string) => {
  const repository = await getRepository();
  return repository.getBySlug("areas", slug);
});

export const getProjects = cache(async () => {
  const repository = await getRepository();
  return repository.list("projects");
});

export const getFeaturedProjects = cache(async () => {
  const projects = await getProjects();
  return projects.filter((project) => project.featured);
});

export const getProjectBySlug = cache(async (slug: string) => {
  const repository = await getRepository();
  return repository.getBySlug("projects", slug);
});

export const getArticles = cache(async () => {
  const repository = await getRepository();
  return repository.list("articles");
});

export const getArticleBySlug = cache(async (slug: string) => {
  const repository = await getRepository();
  return repository.getBySlug("articles", slug);
});

export const getPublications = cache(async () => {
  const repository = await getRepository();
  return repository.list("publications");
});

export const getPartners = cache(async () => {
  const repository = await getRepository();
  return repository.list("partners");
});

export const getIndicators = cache(async () => {
  const repository = await getRepository();
  return repository.list("indicators");
});

export const getVerifiedIndicators = cache(async () => {
  const indicators = await getIndicators();
  return indicators.filter((indicator) => indicator.verified && indicator.value !== null);
});

export const getMilestones = cache(async () => {
  const repository = await getRepository();
  return repository.list("milestones");
});

export const getTestimonials = cache(async () => {
  const repository = await getRepository();
  return repository.list("testimonials");
});

export const getEvents = cache(async () => {
  const repository = await getRepository();
  return repository.list("events");
});

export const getPages = cache(async () => {
  const repository = await getRepository();
  return repository.list("pages");
});

export const getPageBySlug = cache(async (slug: string) => {
  const repository = await getRepository();
  return repository.getBySlug("pages", slug);
});

export const getReportingPeriods = cache(async () => {
  const repository = await getRepository();
  return repository.list("reportingPeriods");
});

export function projectsForArea(areaSlug: string, projects: Project[]) {
  return projects.filter((project) => project.areaSlugs.includes(areaSlug));
}

export function articlesForProject(projectSlug: string, articles: Article[]) {
  return articles.filter((article) =>
    article.projectSlugs.includes(projectSlug),
  );
}

export function areaBySlug(
  slug: string,
  areas: InterventionArea[],
): InterventionArea | undefined {
  return areas.find((area) => area.slug === slug);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const repository = await getRepository();
  const [projects, articles, messages, subscribers, indicators, media] =
    await Promise.all([
      repository.list("projects", { includeUnpublished: true }),
      repository.list("articles", { includeUnpublished: true }),
      repository.listMessages(),
      repository.listSubscribers(),
      repository.list("indicators", { includeUnpublished: true }),
      repository.list("media", { includeUnpublished: true }),
    ]);
  return {
    publishedProjects: projects.filter((p) => p.contentStatus === "published")
      .length,
    draftProjects: projects.filter((p) => p.contentStatus !== "published").length,
    publishedArticles: articles.filter((a) => a.status === "published").length,
    draftArticles: articles.filter((a) => a.status !== "published").length,
    newMessages: messages.filter((m) => m.status === "new").length,
    subscribers: subscribers.filter((s) => s.status === "confirmed").length,
    indicators: indicators.length,
    mediaAssets: media.length,
  };
}
