import "server-only";

import type { CollectionKey } from "@/lib/content/types";
import {
  ARTICLE_CATEGORY_LABELS,
  AREA_STATUS_LABELS,
  CONTENT_STATUS_LABELS,
  INDICATOR_CATEGORY_LABELS,
  PARTNER_TYPE_LABELS,
  PROJECT_STATUS_LABELS,
  PUBLICATION_CATEGORY_LABELS,
} from "@/lib/content/types";
import type { Permission } from "@/lib/content/repository";

export type AdminFieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "boolean"
  | "select"
  | "tags"
  | "lines"
  | "date"
  | "datetime"
  | "url"
  | "image"
  | "slug"
  | "gallery"
  | "documents"
  | "sections"
  | "checkboxes";

export interface AdminFieldOption {
  value: string;
  label: string;
}

export interface AdminField {
  name: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: AdminFieldOption[];
  reference?: "areas" | "projects";
  full?: boolean;
  rows?: number;
}

export type AdminStatusMode = "content" | "publication" | "boolean";

export interface AdminCollectionConfig {
  key: CollectionKey;
  title: string;
  singular: string;
  description: string;
  permission: Permission;
  statusMode: AdminStatusMode;
  statusField?: string;
  titleField: string;
  subtitleField?: string;
  publicBase: string | null;
  fields: AdminField[];
  defaults: Record<string, unknown>;
  listColumns: Array<{ name: string; label: string }>;
}

function optionsFrom(labels: Record<string, string>): AdminFieldOption[] {
  return Object.entries(labels).map(([value, label]) => ({ value, label }));
}

const contentStatusOptions = optionsFrom(CONTENT_STATUS_LABELS);
const projectStatusOptions = optionsFrom(PROJECT_STATUS_LABELS);
const areaStatusOptions = optionsFrom(AREA_STATUS_LABELS);
const articleCategoryOptions = optionsFrom(ARTICLE_CATEGORY_LABELS);
const publicationCategoryOptions = optionsFrom(PUBLICATION_CATEGORY_LABELS);
const partnerTypeOptions = optionsFrom(PARTNER_TYPE_LABELS);
const indicatorCategoryOptions = optionsFrom(INDICATOR_CATEGORY_LABELS);

const areaIconOptions: AdminFieldOption[] = [
  { value: "book-open", label: "Éducation et alphabétisation" },
  { value: "youth", label: "Jeunesse et autonomisation" },
  { value: "digital", label: "Numérique et citoyenneté" },
  { value: "inclusion", label: "Inclusion sociale" },
  { value: "gender", label: "Genre et droits des femmes" },
  { value: "wellbeing", label: "Bien-être et santé communautaire" },
  { value: "cohesion", label: "Cohésion sociale" },
  { value: "justice", label: "Justice de proximité" },
  { value: "resilience", label: "Résilience communautaire" },
];

export const adminCollections: Record<string, AdminCollectionConfig> = {
  projects: {
    key: "projects",
    title: "Projets",
    singular: "Projet",
    description:
      "Portefeuille de projets : contexte, objectifs, couverture, résultats et niveau de documentation.",
    permission: "content:write",
    statusMode: "content",
    titleField: "title",
    subtitleField: "acronym",
    publicBase: "/projets",
    listColumns: [
      { name: "title", label: "Projet" },
      { name: "status", label: "Statut" },
      { name: "featured", label: "À la une" },
    ],
    defaults: {
      contentStatus: "draft",
      status: "development",
      featured: false,
      sortOrder: 0,
      image: "/images/community-gathering.jpg",
      gallery: [],
      documents: [],
      objectives: [],
      coverage: [],
      beneficiaries: [],
      activities: [],
      results: [],
      partners: [],
      funders: [],
      areaSlugs: [],
      publishedAt: "",
    },
    fields: [
      { name: "title", label: "Titre du projet", type: "text", required: true, full: true },
      { name: "acronym", label: "Acronyme", type: "text", required: true },
      { name: "slug", label: "Adresse (slug)", type: "slug", help: "Laissez vide pour générer automatiquement à partir du titre." },
      { name: "summary", label: "Résumé", type: "textarea", required: true, full: true, rows: 3 },
      { name: "context", label: "Contexte", type: "markdown", full: true, rows: 6 },
      {
        name: "status",
        label: "Statut opérationnel",
        type: "select",
        options: projectStatusOptions,
        help: "Statut réel du projet, distinct de son statut de publication.",
      },
      { name: "statusNote", label: "Précision sur le statut", type: "textarea", full: true, rows: 2 },
      { name: "objectives", label: "Objectifs", type: "lines", full: true, help: "Un objectif par ligne." },
      { name: "coverage", label: "Couverture géographique", type: "lines", help: "Une zone par ligne." },
      { name: "beneficiaries", label: "Bénéficiaires visés", type: "lines", full: true, help: "Une catégorie par ligne, sans donnée individuelle." },
      { name: "activities", label: "Activités", type: "lines", full: true, help: "Une activité par ligne." },
      { name: "results", label: "Résultats documentés", type: "lines", full: true, help: "Un résultat vérifié par ligne. Ne pas inventer de chiffres." },
      { name: "periodLabel", label: "Période", type: "text", help: "Ex. : 2024–2026 ou « à confirmer »." },
      { name: "partners", label: "Partenaires du projet", type: "lines", help: "Uniquement des partenariats autorisés." },
      { name: "funders", label: "Financements", type: "lines", help: "Uniquement des financements confirmés." },
      { name: "areaSlugs", label: "Domaines liés", type: "checkboxes", reference: "areas", full: true },
      { name: "featured", label: "Mettre en avant sur l’accueil", type: "boolean" },
      { name: "image", label: "Image de couverture", type: "image" },
      { name: "imageAlt", label: "Texte alternatif de l’image", type: "text", full: true },
      { name: "gallery", label: "Galerie", type: "gallery", full: true },
      { name: "documents", label: "Documents", type: "documents", full: true },
      { name: "publishedAt", label: "Date de publication", type: "datetime" },
      { name: "sortOrder", label: "Ordre d’affichage", type: "number" },
    ],
  },

  articles: {
    key: "articles",
    title: "Actualités",
    singular: "Article",
    description:
      "Actualités, annonces, récits de terrain et communiqués publiés sur le site.",
    permission: "content:write",
    statusMode: "publication",
    titleField: "title",
    subtitleField: "authorName",
    publicBase: "/actualites",
    listColumns: [
      { name: "title", label: "Article" },
      { name: "category", label: "Catégorie" },
      { name: "publishedAt", label: "Date" },
    ],
    defaults: {
      status: "draft",
      category: "actualite",
      authorName: "Équipe CLEDUCA-ODJ",
      featured: false,
      tags: [],
      projectSlugs: [],
      coverImage: "/images/community-gathering.jpg",
      publishedAt: "",
    },
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, full: true },
      { name: "slug", label: "Adresse (slug)", type: "slug", help: "Laissez vide pour générer automatiquement." },
      {
        name: "category",
        label: "Catégorie",
        type: "select",
        options: articleCategoryOptions,
      },
      { name: "excerpt", label: "Chapeau", type: "textarea", required: true, full: true, rows: 3 },
      { name: "body", label: "Corps de l’article", type: "markdown", full: true, rows: 16, help: "Markdown pris en charge (titres, listes, liens, citations)." },
      { name: "authorName", label: "Signature", type: "text" },
      { name: "publishedAt", label: "Date de publication", type: "datetime" },
      { name: "tags", label: "Mots-clés", type: "tags", full: true, help: "Séparés par des virgules." },
      { name: "projectSlugs", label: "Projets liés", type: "checkboxes", reference: "projects", full: true },
      { name: "coverImage", label: "Image de couverture", type: "image" },
      { name: "coverAlt", label: "Texte alternatif", type: "text", full: true },
      { name: "featured", label: "Mettre en avant", type: "boolean" },
    ],
  },

  pages: {
    key: "pages",
    title: "Pages institutionnelles",
    singular: "Page",
    description:
      "Pages de gouvernance, informations légales, confidentialité, cookies et accessibilité.",
    permission: "content:write",
    statusMode: "publication",
    titleField: "title",
    publicBase: null,
    listColumns: [{ name: "title", label: "Page" }],
    defaults: { status: "draft", eyebrow: "Institution", sections: [] },
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, full: true },
      { name: "slug", label: "Adresse (slug)", type: "slug", required: true, help: "Adresse finale : /votre-slug." },
      { name: "eyebrow", label: "Sur-titre", type: "text" },
      { name: "intro", label: "Introduction", type: "textarea", full: true, rows: 3 },
      { name: "sections", label: "Sections", type: "sections", full: true, help: "Chaque section possède un identifiant d’ancre, un titre et un contenu Markdown." },
    ],
  },

  publications: {
    key: "publications",
    title: "Publications",
    singular: "Publication",
    description:
      "Rapports, notes, guides et supports disponibles dans le centre de ressources.",
    permission: "content:write",
    statusMode: "publication",
    titleField: "title",
    publicBase: "/ressources",
    listColumns: [
      { name: "title", label: "Publication" },
      { name: "category", label: "Catégorie" },
      { name: "publishedAt", label: "Date" },
    ],
    defaults: { status: "draft", language: "Français", publishedAt: "" },
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, full: true },
      {
        name: "category",
        label: "Catégorie",
        type: "select",
        options: publicationCategoryOptions,
      },
      { name: "description", label: "Description", type: "textarea", required: true, full: true, rows: 3 },
      { name: "fileUrl", label: "Lien du fichier", type: "url", help: "URL Supabase Storage, lien externe ou chemin interne." },
      { name: "fileName", label: "Nom du fichier", type: "text" },
      { name: "fileSize", label: "Format et taille", type: "text", placeholder: "PDF · 1,2 Mo" },
      { name: "language", label: "Langue", type: "text" },
      { name: "publishedAt", label: "Date de publication", type: "date" },
    ],
  },

  events: {
    key: "events",
    title: "Événements",
    singular: "Événement",
    description:
      "Rencontres, ateliers, formations et temps communautaires publiés dans l’agenda.",
    permission: "content:write",
    statusMode: "publication",
    titleField: "title",
    publicBase: "/evenements",
    listColumns: [
      { name: "title", label: "Événement" },
      { name: "startsAt", label: "Début" },
      { name: "location", label: "Lieu" },
    ],
    defaults: { status: "draft", startsAt: "", endsAt: "", location: "", registrationUrl: "" },
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, full: true },
      { name: "slug", label: "Adresse (slug)", type: "slug", help: "Laissez vide pour générer automatiquement." },
      { name: "description", label: "Description", type: "textarea", required: true, full: true, rows: 4 },
      { name: "startsAt", label: "Début", type: "datetime", required: true },
      { name: "endsAt", label: "Fin", type: "datetime" },
      { name: "location", label: "Lieu", type: "text", full: true },
      { name: "registrationUrl", label: "Lien d’inscription", type: "url", full: true },
    ],
  },

  partners: {
    key: "partners",
    title: "Partenaires",
    singular: "Partenaire",
    description:
      "Partenaires vérifiés et autorisés. Aucun logo ou nom ne doit être publié sans autorisation.",
    permission: "content:write",
    statusMode: "boolean",
    titleField: "name",
    publicBase: "/partenaires",
    listColumns: [
      { name: "name", label: "Partenaire" },
      { name: "type", label: "Type" },
      { name: "country", label: "Pays" },
    ],
    defaults: { published: false, sortOrder: 0, type: "communautaire", country: "Burkina Faso" },
    fields: [
      { name: "name", label: "Nom", type: "text", required: true, full: true },
      {
        name: "type",
        label: "Catégorie",
        type: "select",
        options: partnerTypeOptions,
      },
      { name: "description", label: "Description", type: "textarea", full: true, rows: 3 },
      { name: "logoUrl", label: "Logo", type: "image" },
      { name: "websiteUrl", label: "Site web", type: "url" },
      { name: "country", label: "Pays", type: "text" },
      {
        name: "authorizationNote",
        label: "Référence de l’autorisation",
        type: "textarea",
        full: true,
        rows: 2,
        help: "Date, support et portée de l’accord obtenu. Non publié sur le site.",
      },
      { name: "sortOrder", label: "Ordre d’affichage", type: "number" },
    ],
  },

  areas: {
    key: "areas",
    title: "Domaines d’intervention",
    singular: "Domaine",
    description:
      "Les neuf domaines d’intervention et leur niveau de documentation.",
    permission: "content:write",
    statusMode: "boolean",
    titleField: "title",
    publicBase: "/domaines",
    listColumns: [
      { name: "title", label: "Domaine" },
      { name: "status", label: "Niveau" },
    ],
    defaults: {
      published: false,
      status: "positioning",
      icon: "book-open",
      featured: false,
      sortOrder: 0,
      challenges: [],
      objectives: [],
      audiences: [],
    },
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, full: true },
      { name: "shortTitle", label: "Titre court", type: "text", required: true },
      { name: "slug", label: "Adresse (slug)", type: "slug", required: true },
      { name: "tagline", label: "Accroche", type: "text", full: true },
      { name: "summary", label: "Résumé", type: "textarea", required: true, full: true, rows: 3 },
      { name: "description", label: "Description", type: "markdown", full: true, rows: 6 },
      { name: "icon", label: "Icône", type: "select", options: areaIconOptions },
      { name: "status", label: "Niveau de documentation", type: "select", options: areaStatusOptions },
      { name: "statusNote", label: "Précision sur le niveau", type: "textarea", full: true, rows: 2 },
      { name: "challenges", label: "Enjeux", type: "lines", full: true },
      { name: "objectives", label: "Objectifs", type: "lines", full: true },
      { name: "audiences", label: "Publics", type: "lines", full: true },
      { name: "methodology", label: "Méthodologie", type: "markdown", full: true, rows: 4 },
      { name: "image", label: "Image", type: "image" },
      { name: "imageAlt", label: "Texte alternatif", type: "text", full: true },
      { name: "featured", label: "Mettre en avant", type: "boolean" },
      { name: "sortOrder", label: "Ordre d’affichage", type: "number" },
    ],
  },

  indicators: {
    key: "indicators",
    title: "Indicateurs d’impact",
    singular: "Indicateur",
    description:
      "Valeurs, unités, sources et périodes. Un indicateur sans source vérifiable ne doit pas être marqué comme vérifié.",
    permission: "impact:write",
    statusMode: "boolean",
    titleField: "label",
    publicBase: "/impact",
    listColumns: [
      { name: "label", label: "Indicateur" },
      { name: "value", label: "Valeur" },
      { name: "verified", label: "Vérifié" },
    ],
    defaults: {
      published: false,
      verified: false,
      value: null,
      unit: "",
      category: "institutionnel",
      periodLabel: "",
      source: "",
      sortOrder: 0,
    },
    fields: [
      { name: "label", label: "Libellé", type: "text", required: true, full: true },
      { name: "value", label: "Valeur", type: "number", help: "Laisser vide si la donnée n’est pas disponible." },
      { name: "unit", label: "Unité", type: "text" },
      { name: "category", label: "Catégorie", type: "select", options: indicatorCategoryOptions },
      { name: "description", label: "Description", type: "textarea", full: true, rows: 3 },
      { name: "source", label: "Source", type: "text", required: true, full: true, help: "Document ou information institutionnelle identifiée." },
      { name: "periodLabel", label: "Période", type: "text", required: true },
      { name: "verified", label: "Donnée vérifiée", type: "boolean" },
      { name: "sortOrder", label: "Ordre d’affichage", type: "number" },
    ],
  },

  milestones: {
    key: "milestones",
    title: "Jalons historiques",
    singular: "Jalon",
    description:
      "Étapes documentées de l’histoire de l’organisation. Ne publiez aucun jalon non vérifié.",
    permission: "impact:write",
    statusMode: "boolean",
    titleField: "title",
    publicBase: "/a-propos",
    listColumns: [
      { name: "year", label: "Année" },
      { name: "title", label: "Jalon" },
      { name: "verified", label: "Vérifié" },
    ],
    defaults: { published: false, verified: false, sortOrder: 0 },
    fields: [
      { name: "year", label: "Année", type: "text", required: true },
      { name: "title", label: "Titre", type: "text", required: true, full: true },
      { name: "description", label: "Description", type: "textarea", full: true, rows: 3 },
      { name: "source", label: "Source", type: "text", required: true, full: true },
      { name: "verified", label: "Jalon vérifié", type: "boolean" },
      { name: "sortOrder", label: "Ordre d’affichage", type: "number" },
    ],
  },

  reportingPeriods: {
    key: "reportingPeriods",
    title: "Périodes de référence",
    singular: "Période",
    description:
      "Périodes auxquelles se rattachent les indicateurs et documents de suivi.",
    permission: "impact:write",
    statusMode: "boolean",
    titleField: "label",
    publicBase: "/impact",
    listColumns: [
      { name: "label", label: "Période" },
      { name: "startsOn", label: "Début" },
      { name: "endsOn", label: "Fin" },
    ],
    defaults: { published: false, startsOn: "", endsOn: "" },
    fields: [
      { name: "label", label: "Libellé", type: "text", required: true, full: true },
      { name: "startsOn", label: "Début", type: "date", required: true },
      { name: "endsOn", label: "Fin", type: "date", required: true },
      { name: "description", label: "Description", type: "textarea", full: true, rows: 3 },
      { name: "sourceDocument", label: "Document de référence", type: "text", required: true, full: true },
    ],
  },

  testimonials: {
    key: "testimonials",
    title: "Témoignages",
    singular: "Témoignage",
    description:
      "Témoignages publiés uniquement après obtention d’un consentement documenté.",
    permission: "content:write",
    statusMode: "boolean",
    titleField: "quote",
    publicBase: null,
    listColumns: [
      { name: "quote", label: "Témoignage" },
      { name: "authorLabel", label: "Auteur" },
      { name: "consentOnFile", label: "Consentement" },
    ],
    defaults: { published: false, consentOnFile: false, sortOrder: 0 },
    fields: [
      { name: "quote", label: "Citation", type: "textarea", required: true, full: true, rows: 4 },
      { name: "authorLabel", label: "Auteur (libellé public)", type: "text", required: true, help: "Ne publiez pas de nom complet sans consentement." },
      { name: "context", label: "Contexte", type: "text" },
      { name: "projectSlug", label: "Projet lié (slug)", type: "text" },
      { name: "image", label: "Portrait", type: "image" },
      { name: "consentOnFile", label: "Consentement documenté", type: "boolean" },
      { name: "sortOrder", label: "Ordre d’affichage", type: "number" },
    ],
  },
};

export function getAdminCollection(key: string) {
  if (!Object.prototype.hasOwnProperty.call(adminCollections, key)) return null;
  return adminCollections[key];
}

export const adminCollectionList = Object.values(adminCollections);
