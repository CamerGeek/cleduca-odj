import type {
  CollectionKey,
  CollectionMap,
  ContentStatus,
} from "@/lib/content/types";

interface CollectionMeta {
  table: string;
  label: string;
  singular: string;
  adminOnly: boolean;
  statusColumn: "status" | "content_status" | "published" | null;
  slugField: "slug" | null;
}

export const collectionMeta: Record<CollectionKey, CollectionMeta> = {
  projects: {
    table: "projects",
    label: "Projets",
    singular: "Projet",
    adminOnly: false,
    statusColumn: "content_status",
    slugField: "slug",
  },
  articles: {
    table: "news_articles",
    label: "Actualités",
    singular: "Article",
    adminOnly: false,
    statusColumn: "status",
    slugField: "slug",
  },
  areas: {
    table: "intervention_areas",
    label: "Domaines d’intervention",
    singular: "Domaine",
    adminOnly: false,
    statusColumn: "published",
    slugField: "slug",
  },
  publications: {
    table: "publications",
    label: "Publications",
    singular: "Publication",
    adminOnly: false,
    statusColumn: "status",
    slugField: null,
  },
  partners: {
    table: "partners",
    label: "Partenaires",
    singular: "Partenaire",
    adminOnly: false,
    statusColumn: "published",
    slugField: null,
  },
  indicators: {
    table: "impact_indicators",
    label: "Indicateurs d’impact",
    singular: "Indicateur",
    adminOnly: false,
    statusColumn: "published",
    slugField: null,
  },
  reportingPeriods: {
    table: "reporting_periods",
    label: "Périodes de référence",
    singular: "Période",
    adminOnly: false,
    statusColumn: "published",
    slugField: null,
  },
  milestones: {
    table: "milestones",
    label: "Jalons historiques",
    singular: "Jalon",
    adminOnly: false,
    statusColumn: "published",
    slugField: null,
  },
  testimonials: {
    table: "testimonials",
    label: "Témoignages",
    singular: "Témoignage",
    adminOnly: false,
    statusColumn: "published",
    slugField: null,
  },
  events: {
    table: "events",
    label: "Événements",
    singular: "Événement",
    adminOnly: false,
    statusColumn: "status",
    slugField: "slug",
  },
  pages: {
    table: "pages",
    label: "Pages institutionnelles",
    singular: "Page",
    adminOnly: false,
    statusColumn: "status",
    slugField: "slug",
  },
  media: {
    table: "media_assets",
    label: "Médiathèque",
    singular: "Média",
    adminOnly: true,
    statusColumn: null,
    slugField: null,
  },
};

export const collectionKeys = Object.keys(collectionMeta) as CollectionKey[];

export function isCollectionKey(value: string): value is CollectionKey {
  return Object.prototype.hasOwnProperty.call(collectionMeta, value);
}

export function collectionHasAudit(key: CollectionKey) {
  return key !== "media";
}

export function getContentStatus(
  key: CollectionKey,
  item: CollectionMap[CollectionKey],
): ContentStatus | null {
  const record = item as unknown as Record<string, unknown>;
  if (typeof record.contentStatus === "string") {
    return record.contentStatus as ContentStatus;
  }
  if (typeof record.status === "string") {
    return record.status as ContentStatus;
  }
  return null;
}

export function isPublicItem(
  key: CollectionKey,
  item: CollectionMap[CollectionKey],
) {
  if (collectionMeta[key].adminOnly) return false;
  const record = item as unknown as Record<string, unknown>;
  if (typeof record.contentStatus === "string" && "contentStatus" in record) {
    return record.contentStatus === "published";
  }
  if (typeof record.status === "string" && ["draft", "review", "published", "archived"].includes(record.status)) {
    return record.status === "published";
  }
  if (typeof record.published === "boolean") return record.published;
  return true;
}

const statusSortOrder: Record<string, number> = {
  published: 0,
  review: 1,
  draft: 2,
  archived: 3,
};

export function sortItems<K extends CollectionKey>(
  key: K,
  items: CollectionMap[K][],
): CollectionMap[K][] {
  const list = [...items];
  if (key === "articles" || key === "publications") {
    return list.sort((a, b) => {
      const left = new Date((a as unknown as { publishedAt?: string }).publishedAt || 0).getTime();
      const right = new Date((b as unknown as { publishedAt?: string }).publishedAt || 0).getTime();
      return right - left;
    });
  }
  if (key === "events") {
    return list.sort(
      (a, b) =>
        new Date((a as unknown as { startsAt: string }).startsAt || 0).getTime() -
        new Date((b as unknown as { startsAt: string }).startsAt || 0).getTime(),
    );
  }
  if (key === "pages") {
    return list.sort((a, b) =>
      (a as unknown as { title: string }).title.localeCompare(
        (b as unknown as { title: string }).title,
        "fr",
      ),
    );
  }
  return list.sort((a, b) => {
    const left = a as unknown as { sortOrder?: number; createdAt?: string };
    const right = b as unknown as { sortOrder?: number; createdAt?: string };
    if (typeof left.sortOrder === "number" && typeof right.sortOrder === "number") {
      return left.sortOrder - right.sortOrder;
    }
    return new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
  });
}

export function sortForAdmin<K extends CollectionKey>(
  key: K,
  items: CollectionMap[K][],
): CollectionMap[K][] {
  return [...items].sort((a, b) => {
    const left = a as unknown as { contentStatus?: string; status?: string; updatedAt?: string };
    const right = b as unknown as { contentStatus?: string; status?: string; updatedAt?: string };
    const leftStatus = left.contentStatus || left.status || "published";
    const rightStatus = right.contentStatus || right.status || "published";
    const statusDiff =
      (statusSortOrder[leftStatus] ?? 9) - (statusSortOrder[rightStatus] ?? 9);
    if (statusDiff !== 0) return statusDiff;
    return (
      new Date(right.updatedAt || 0).getTime() -
      new Date(left.updatedAt || 0).getTime()
    );
  });
}
