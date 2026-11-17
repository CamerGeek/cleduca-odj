import type { SiteSettings } from "@/lib/content/types";

export const siteConfig = {
  name: "CLEDUCA-ODJ",
  fullName:
    "Club d'Éducation Actuelle – Organisation pour le Développement de la Jeunesse",
  tagline: "Éduquer, autonomiser et bâtir des communautés résilientes.",
  foundedYear: 1997,
  city: "Bobo-Dioulasso",
  region: "Hauts-Bassins",
  country: "Burkina Faso",
  locale: "fr-FR",
  primaryLocale: "fr" as const,
  supportedLocales: ["fr"] as const,
  logoPath: "/brand/cleduca-odj-logo.png",
  navigation: [
    { label: "À propos", href: "/a-propos" },
    { label: "Domaines", href: "/domaines" },
    { label: "Projets", href: "/projets" },
    { label: "Impact", href: "/impact" },
    { label: "Actualités", href: "/actualites" },
    { label: "Ressources", href: "/ressources" },
    { label: "Partenaires", href: "/partenaires" },
  ],
  footerNavigation: {
    institution: [
      { label: "Notre histoire", href: "/a-propos#histoire" },
      { label: "Mission et vision", href: "/a-propos#mission" },
      { label: "Gouvernance", href: "/gouvernance" },
      { label: "Notre impact", href: "/impact" },
      { label: "Partenaires", href: "/partenaires" },
    ],
    action: [
      { label: "Nos projets", href: "/projets" },
      { label: "Domaines d'intervention", href: "/domaines" },
      { label: "Actualités", href: "/actualites" },
      { label: "Événements", href: "/evenements" },
      { label: "Centre de ressources", href: "/ressources" },
      { label: "Nous contacter", href: "/contact" },
    ],
  },
  legalNavigation: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/confidentialite" },
    { label: "Politique de cookies", href: "/cookies" },
    { label: "Accessibilité", href: "/accessibilite" },
    { label: "Crédits photographiques", href: "/credits-photographiques" },
  ],
} as const;

export const seedSettings: SiteSettings = {
  siteName: "CLEDUCA-ODJ",
  fullName:
    "Club d'Éducation Actuelle – Organisation pour le Développement de la Jeunesse",
  tagline: "Éduquer, autonomiser et bâtir des communautés résilientes.",
  positioning:
    "Organisation de la société civile burkinabè, reconnue et à but non lucratif, engagée depuis 1997 pour l'éducation, l'autonomisation des jeunes, l'inclusion sociale et le développement communautaire.",
  foundedYear: 1997,
  city: "Bobo-Dioulasso",
  region: "Hauts-Bassins",
  country: "Burkina Faso",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "Bobo-Dioulasso, Hauts-Bassins, Burkina Faso",
  contactHours: "",
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    whatsapp: "",
  },
  hero: {
    eyebrow: "Société civile · Burkina Faso · depuis 1997",
    title: "Ensemble, construisons des communautés plus fortes et résilientes.",
    subtitle:
      "Depuis 1997, CLEDUCA-ODJ accompagne les dynamiques d'éducation, d'autonomisation, d'inclusion et de développement communautaire au Burkina Faso.",
    primaryLabel: "Découvrir notre organisation",
    primaryHref: "/a-propos",
    secondaryLabel: "Explorer nos projets",
    secondaryHref: "/projets",
    image: "/images/community-gathering.jpg",
    imageAlt:
      "Séance de sensibilisation communautaire en plein air au Burkina Faso, animée par une femme devant un groupe de participants.",
    caption:
      "Photo d'illustration : dialogue communautaire au Burkina Faso. Crédit : DFID (CC BY 2.0).",
  },
  newsletter: {
    title: "Suivre nos initiatives",
    description:
      "Recevez les publications institutionnelles, les avancées de nos projets et les informations communautaires de CLEDUCA-ODJ.",
    consentLabel:
      "J'accepte de recevoir des informations de CLEDUCA-ODJ et de pouvoir me désinscrire à tout moment.",
  },
  footerNote:
    "Organisation de la société civile à but non lucratif, reconnue, basée à Bobo-Dioulasso, Burkina Faso.",
  updatedAt: "2026-11-17T00:00:00.000Z",
};
