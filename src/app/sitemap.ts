import type { MetadataRoute } from "next";

import {
  getAreas,
  getArticles,
  getEvents,
  getPages,
  getProjects,
} from "@/lib/content/queries";
import { getSiteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const [areas, projects, articles, pages, events] = await Promise.all([
    getAreas(),
    getProjects(),
    getArticles(),
    getPages(),
    getEvents(),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/a-propos`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/domaines`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/projets`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/actualites`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/impact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/ressources`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/partenaires`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/evenements`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  const areaRoutes: MetadataRoute.Sitemap = areas.map((area) => ({
    url: `${siteUrl}/domaines/${area.slug}`,
    lastModified: new Date(area.updatedAt || now),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projets/${project.slug}`,
    lastModified: new Date(project.updatedAt || now),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/actualites/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt || now),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${siteUrl}/evenements`,
    lastModified: new Date(event.updatedAt || now),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const pageRoutes: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${siteUrl}/${page.slug}`,
    lastModified: new Date(page.updatedAt || now),
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  const routes = [
    ...staticRoutes,
    ...areaRoutes,
    ...projectRoutes,
    ...articleRoutes,
    ...pageRoutes,
    ...eventRoutes,
  ];

  return Array.from(new Map(routes.map((route) => [route.url, route])).values());
}
