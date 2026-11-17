import type {
  ActivityLog,
  CollectionMap,
  ContactMessage,
  NewsletterSubscriber,
  UserAccount,
} from "@/lib/content/types";
import type { SiteSettings } from "@/lib/content/types";
import { seedSettings } from "@/config/site";
import { seedAreas } from "./areas";
import { seedProjects } from "./projects";
import { seedArticles } from "./articles";
import { seedPages } from "./pages";
import { seedIndicators, seedMilestones, seedReportingPeriods } from "./impact";
import { seedMedia } from "./media";

export const SEED_DATE = "2026-11-17T00:00:00.000Z";

export interface SeedCollections {
  projects: CollectionMap["projects"][];
  articles: CollectionMap["articles"][];
  areas: CollectionMap["areas"][];
  publications: CollectionMap["publications"][];
  partners: CollectionMap["partners"][];
  indicators: CollectionMap["indicators"][];
  reportingPeriods: CollectionMap["reportingPeriods"][];
  milestones: CollectionMap["milestones"][];
  testimonials: CollectionMap["testimonials"][];
  events: CollectionMap["events"][];
  pages: CollectionMap["pages"][];
  media: CollectionMap["media"][];
}

export interface SeedDatabase {
  settings: SiteSettings;
  collections: SeedCollections;
  messages: ContactMessage[];
  subscribers: NewsletterSubscriber[];
  users: UserAccount[];
  activity: ActivityLog[];
}

export function createSeedDatabase(): SeedDatabase {
  return {
    settings: { ...seedSettings, socialLinks: { ...seedSettings.socialLinks }, hero: { ...seedSettings.hero }, newsletter: { ...seedSettings.newsletter } },
    collections: {
      projects: structuredClone(seedProjects),
      articles: structuredClone(seedArticles),
      areas: structuredClone(seedAreas),
      publications: [],
      partners: [],
      indicators: structuredClone(seedIndicators),
      reportingPeriods: structuredClone(seedReportingPeriods),
      milestones: structuredClone(seedMilestones),
      testimonials: [],
      events: [],
      pages: structuredClone(seedPages),
      media: structuredClone(seedMedia),
    },
    messages: [],
    subscribers: [],
    users: [],
    activity: [],
  };
}
