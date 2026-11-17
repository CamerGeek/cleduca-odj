import type {
  ImpactIndicator,
  Milestone,
  ReportingPeriod,
} from "@/lib/content/types";

const T = "2026-11-17T00:00:00.000Z";

export const seedIndicators: ImpactIndicator[] = [
  {
    id: "indicator-pasedi-idp",
    label: "Enfants et jeunes déplacés internes accompagnés",
    value: 200,
    unit: "personnes",
    category: "beneficiaires",
    description:
      "Bénéficiaires documentés du dispositif PASEDI de continuité éducative.",
    source: "Fiche de présentation PASEDI — informations institutionnelles fournies",
    periodLabel: "PASEDI — période à confirmer",
    verified: true,
    published: true,
    sortOrder: 1,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "indicator-pasedi-host",
    label: "Élèves des communautés d’accueil accompagnés",
    value: 100,
    unit: "élèves",
    category: "beneficiaires",
    description:
      "Élèves des communautés d’accueil concernés par le dispositif PASEDI.",
    source: "Fiche de présentation PASEDI — informations institutionnelles fournies",
    periodLabel: "PASEDI — période à confirmer",
    verified: true,
    published: true,
    sortOrder: 2,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "indicator-pasedi-schools",
    label: "Écoles mobilisées",
    value: 5,
    unit: "écoles",
    category: "education",
    description:
      "Deux écoles dans la région des Cascades et trois dans la Boucle du Mouhoun.",
    source: "Fiche de présentation PASEDI — informations institutionnelles fournies",
    periodLabel: "PASEDI — période à confirmer",
    verified: true,
    published: true,
    sortOrder: 3,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "indicator-coverage-regions",
    label: "Régions d’intervention documentées",
    value: 2,
    unit: "régions",
    category: "couverture",
    description:
      "Les Cascades et la Boucle du Mouhoun, dans le cadre du dispositif PASEDI.",
    source: "Fiche de présentation PASEDI — informations institutionnelles fournies",
    periodLabel: "PASEDI — période à confirmer",
    verified: true,
    published: true,
    sortOrder: 4,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "indicator-portfolio",
    label: "Initiatives documentées sur le site",
    value: 4,
    unit: "initiatives",
    category: "projets",
    description:
      "PASEDI, PALVEN, Justice de proximité – Guiriko et CIVI-LINK (proposée).",
    source: "Portefeuille institutionnel présenté sur le site",
    periodLabel: "État au 17 novembre 2026",
    verified: true,
    published: true,
    sortOrder: 5,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "indicator-years",
    label: "Années d’engagement communautaire",
    value: 29,
    unit: "années",
    category: "institutionnel",
    description:
      "Calculées depuis la création de l’association en 1997 jusqu’en 2026.",
    source: "Année de création communiquée par l’association",
    periodLabel: "1997 — 2026",
    verified: true,
    published: true,
    sortOrder: 6,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "indicator-partners",
    label: "Organisations partenaires publiées",
    value: null,
    unit: "organisations",
    category: "partenaires",
    description:
      "Aucun partenariat n’est publié tant que son autorisation et sa vérification ne sont pas établies. Cette rubrique sera actualisée par l’association.",
    source: "Documentation des partenariats en cours",
    periodLabel: "Donnée non disponible",
    verified: false,
    published: true,
    sortOrder: 7,
    createdAt: T,
    updatedAt: T,
  },
];

export const seedReportingPeriods: ReportingPeriod[] = [
  {
    id: "period-pasedi",
    label: "PASEDI — période à confirmer",
    startsOn: "",
    endsOn: "",
    description:
      "Les données PASEDI présentées sur le site proviennent des informations institutionnelles fournies. La période exacte de mise en œuvre reste à confirmer par l’association.",
    sourceDocument: "Fiche de présentation du dispositif PASEDI",
    published: true,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "period-portfolio-2026",
    label: "Portefeuille institutionnel — état au 17 novembre 2026",
    startsOn: "2026-11-17",
    endsOn: "2026-11-17",
    description:
      "Recensement des initiatives présentées sur le site à la date de sa mise en ligne.",
    sourceDocument: "Contenu institutionnel du site CLEDUCA-ODJ",
    published: true,
    createdAt: T,
    updatedAt: T,
  },
];

export const seedMilestones: Milestone[] = [
  {
    id: "milestone-1997",
    year: "1997",
    title: "Création de CLEDUCA-ODJ",
    description:
      "Le Club d’Éducation Actuelle – Organisation pour le Développement de la Jeunesse est créé au Burkina Faso en tant qu’organisation de la société civile à but non lucratif.",
    source: "Information institutionnelle fournie par l’association",
    verified: true,
    published: true,
    sortOrder: 1,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "milestone-today",
    year: "Aujourd’hui",
    title: "Un portefeuille d’initiatives au service des communautés",
    description:
      "L’association documente plusieurs initiatives en éducation, inclusion, éducation numérique, justice de proximité et coordination communautaire, tout en poursuivant la consolidation de ses données et de ses partenariats.",
    source: "Portefeuille institutionnel présenté sur le site",
    verified: true,
    published: true,
    sortOrder: 2,
    createdAt: T,
    updatedAt: T,
  },
];
