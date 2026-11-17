export type ContentStatus = "draft" | "review" | "published" | "archived";
export type ProjectStatus = "ongoing" | "completed" | "development" | "proposed";
export type AreaStatus = "documented" | "developing" | "positioning";
export type Role = "super_admin" | "admin" | "editor" | "contributor";
export type MessageStatus = "new" | "in_progress" | "closed";
export type SubscriberStatus = "pending" | "confirmed" | "unsubscribed";
export type InquiryType =
  | "partenariat"
  | "benevolat"
  | "collaboration"
  | "information"
  | "presse"
  | "autre";

export type ArticleCategory =
  | "actualite"
  | "annonce"
  | "projet"
  | "evenement"
  | "terrain"
  | "reussite"
  | "communique"
  | "publication"
  | "recherche";

export type PublicationCategory =
  | "rapport-annuel"
  | "rapport-activite"
  | "document-projet"
  | "note-politique"
  | "guide-educatif"
  | "formation"
  | "recherche"
  | "multimedia";

export type PartnerType =
  | "institutionnel"
  | "technique"
  | "financier"
  | "communautaire"
  | "local";

export type IndicatorCategory =
  | "beneficiaires"
  | "projets"
  | "couverture"
  | "partenaires"
  | "education"
  | "engagement"
  | "inclusion"
  | "institutionnel";

export type AreaIcon =
  | "book-open"
  | "youth"
  | "digital"
  | "inclusion"
  | "gender"
  | "wellbeing"
  | "cohesion"
  | "justice"
  | "resilience";

export interface AuditFields {
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface SiteSettings {
  siteName: string;
  fullName: string;
  tagline: string;
  positioning: string;
  foundedYear: number;
  city: string;
  region: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  contactHours: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    whatsapp: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    image: string;
    imageAlt: string;
    caption: string;
  };
  newsletter: {
    title: string;
    description: string;
    consentLabel: string;
  };
  footerNote: string;
  updatedAt: string;
}

export interface InterventionArea extends AuditFields {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  summary: string;
  description: string;
  icon: AreaIcon;
  status: AreaStatus;
  statusNote: string;
  challenges: string[];
  objectives: string[];
  audiences: string[];
  methodology: string;
  image: string;
  imageAlt: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
}

export interface GalleryItem {
  url: string;
  alt: string;
  caption: string;
}

export interface ProjectDocument {
  title: string;
  url: string;
}

export interface Project extends AuditFields {
  id: string;
  slug: string;
  title: string;
  acronym: string;
  summary: string;
  context: string;
  objectives: string[];
  coverage: string[];
  beneficiaries: string[];
  activities: string[];
  results: string[];
  periodLabel: string;
  partners: string[];
  funders: string[];
  status: ProjectStatus;
  statusNote: string;
  areaSlugs: string[];
  featured: boolean;
  image: string;
  imageAlt: string;
  gallery: GalleryItem[];
  documents: ProjectDocument[];
  contentStatus: ContentStatus;
  publishedAt: string;
  sortOrder: number;
}

export interface Article extends AuditFields {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: ArticleCategory;
  authorName: string;
  publishedAt: string;
  tags: string[];
  projectSlugs: string[];
  coverImage: string;
  coverAlt: string;
  featured: boolean;
  status: ContentStatus;
}

export interface Publication extends AuditFields {
  id: string;
  title: string;
  description: string;
  category: PublicationCategory;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  language: string;
  publishedAt: string;
  status: ContentStatus;
}

export interface Partner extends AuditFields {
  id: string;
  name: string;
  type: PartnerType;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  country: string;
  authorizationNote: string;
  published: boolean;
  sortOrder: number;
}

export interface ImpactIndicator extends AuditFields {
  id: string;
  label: string;
  value: number | null;
  unit: string;
  category: IndicatorCategory;
  description: string;
  source: string;
  periodLabel: string;
  verified: boolean;
  published: boolean;
  sortOrder: number;
}

export interface ReportingPeriod extends AuditFields {
  id: string;
  label: string;
  startsOn: string;
  endsOn: string;
  description: string;
  sourceDocument: string;
  published: boolean;
}

export interface Milestone extends AuditFields {
  id: string;
  year: string;
  title: string;
  description: string;
  source: string;
  verified: boolean;
  published: boolean;
  sortOrder: number;
}

export interface Testimonial extends AuditFields {
  id: string;
  quote: string;
  authorLabel: string;
  context: string;
  projectSlug: string;
  image: string;
  consentOnFile: boolean;
  published: boolean;
  sortOrder: number;
}

export interface Event extends AuditFields {
  id: string;
  slug: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  location: string;
  registrationUrl: string;
  status: ContentStatus;
}

export interface PageSection {
  id: string;
  title: string;
  body: string;
}

export interface InstitutionalPage extends AuditFields {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  sections: PageSection[];
  status: ContentStatus;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  organization: string;
  inquiryType: InquiryType;
  message: string;
  status: MessageStatus;
  consent: boolean;
  createdAt: string;
  ipHash: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string;
  status: SubscriberStatus;
  source: string;
  consentedAt: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  lastSeenAt: string;
}

export interface ActivityLog {
  id: string;
  actorEmail: string;
  action: string;
  collection: string;
  entityId: string;
  summary: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
  alt: string;
  createdAt: string;
}

export interface CollectionMap {
  projects: Project;
  articles: Article;
  areas: InterventionArea;
  publications: Publication;
  partners: Partner;
  indicators: ImpactIndicator;
  reportingPeriods: ReportingPeriod;
  milestones: Milestone;
  testimonials: Testimonial;
  events: Event;
  pages: InstitutionalPage;
  media: MediaAsset;
}

export type CollectionKey = keyof CollectionMap;

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  ongoing: "En cours",
  completed: "Achevé",
  development: "En développement",
  proposed: "Proposé",
};

export const AREA_STATUS_LABELS: Record<AreaStatus, string> = {
  documented: "Interventions documentées",
  developing: "En développement",
  positioning: "Positionnement institutionnel",
};

export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Brouillon",
  review: "En relecture",
  published: "Publié",
  archived: "Archivé",
};

export const ARTICLE_CATEGORY_LABELS: Record<ArticleCategory, string> = {
  actualite: "Actualité",
  annonce: "Annonce",
  projet: "Projet",
  evenement: "Événement",
  terrain: "Récit de terrain",
  reussite: "Réussite",
  communique: "Communiqué",
  publication: "Publication",
  recherche: "Recherche",
};

export const PUBLICATION_CATEGORY_LABELS: Record<PublicationCategory, string> = {
  "rapport-annuel": "Rapport annuel",
  "rapport-activite": "Rapport d'activité",
  "document-projet": "Document de projet",
  "note-politique": "Note de politique",
  "guide-educatif": "Guide éducatif",
  formation: "Support de formation",
  recherche: "Recherche et études",
  multimedia: "Ressource multimédia",
};

export const PARTNER_TYPE_LABELS: Record<PartnerType, string> = {
  institutionnel: "Partenaires institutionnels",
  technique: "Partenaires techniques",
  financier: "Organisations finançant",
  communautaire: "Organisations communautaires",
  local: "Acteurs locaux",
};

export const INDICATOR_CATEGORY_LABELS: Record<IndicatorCategory, string> = {
  beneficiaires: "Bénéficiaires",
  projets: "Projets",
  couverture: "Couverture géographique",
  partenaires: "Partenariats",
  education: "Éducation",
  engagement: "Engagement communautaire",
  inclusion: "Inclusion",
  institutionnel: "Institutionnel",
};

export const INQUIRY_TYPE_LABELS: Record<InquiryType, string> = {
  partenariat: "Demande de partenariat",
  benevolat: "Bénévolat",
  collaboration: "Proposition de collaboration",
  information: "Demande d'information",
  presse: "Presse et médias",
  autre: "Autre",
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super administrateur",
  admin: "Administrateur",
  editor: "Éditeur",
  contributor: "Contributeur",
};

export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  new: "Nouveau",
  in_progress: "En traitement",
  closed: "Clôturé",
};

export const SUBSCRIBER_STATUS_LABELS: Record<SubscriberStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  unsubscribed: "Désinscrit",
};

export interface DashboardStats {
  publishedProjects: number;
  draftProjects: number;
  publishedArticles: number;
  draftArticles: number;
  newMessages: number;
  subscribers: number;
  indicators: number;
  mediaAssets: number;
}
