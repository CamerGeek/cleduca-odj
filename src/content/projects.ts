import type { Project } from "@/lib/content/types";

const T = "2026-11-17T00:00:00.000Z";

export const seedProjects: Project[] = [
  {
    id: "project-pasedi",
    slug: "pasedi",
    title: "Continuité éducative pour les enfants déplacés internes",
    acronym: "PASEDI",
    summary:
      "Une initiative de continuité éducative au bénéfice d’enfants et de jeunes déplacés internes et d’élèves des communautés d’accueil, incluant les enfants en situation de handicap.",
    context: `Les déplacements forcés interrompent les parcours scolaires et fragilisent les écoles qui accueillent de nouveaux élèves. Les enfants et les jeunes déplacés internes risquent de perdre le lien avec l’apprentissage, tandis que les communautés d’accueil doivent absorber une pression supplémentaire sur leurs services éducatifs.

PASEDI a été conçu pour soutenir la continuité éducative dans ce contexte. L’initiative accompagne des enfants et des jeunes déplacés internes ainsi que des élèves des communautés d’accueil, dans cinq écoles réparties entre les Cascades et la Boucle du Mouhoun. Elle prend explicitement en compte les enfants en situation de handicap.

Le dispositif s’appuie sur les établissements scolaires et les communautés afin de maintenir les apprentissages, de favoriser l’intégration des élèves et de renforcer la capacité des écoles à accueillir la diversité des situations.`,
    objectives: [
      "Assurer la continuité éducative des enfants et des jeunes déplacés internes",
      "Favoriser l’intégration des élèves dans les écoles d’accueil",
      "Garantir la prise en compte des enfants en situation de handicap",
      "Renforcer l’accompagnement des communautés éducatives",
    ],
    coverage: ["Cascades — 2 écoles", "Boucle du Mouhoun — 3 écoles"],
    beneficiaries: [
      "200 enfants et jeunes déplacés internes",
      "100 élèves des communautés d’accueil",
      "Enfants en situation de handicap",
    ],
    activities: [
      "Appui à la scolarisation et à la continuité des apprentissages",
      "Accompagnement des élèves des communautés d’accueil",
      "Prise en compte des besoins des enfants en situation de handicap",
      "Mobilisation des écoles, des familles et des communautés",
    ],
    results: [
      "200 enfants et jeunes déplacés internes concernés",
      "100 élèves des communautés d’accueil concernés",
      "5 écoles mobilisées : 2 dans les Cascades et 3 dans la Boucle du Mouhoun",
      "Inclusion explicite des enfants en situation de handicap dans le dispositif",
    ],
    periodLabel: "Période à confirmer",
    partners: [],
    funders: [],
    status: "ongoing",
    statusNote:
      "Le statut opérationnel et la période de mise en œuvre sont à confirmer avec l’équipe de CLEDUCA-ODJ.",
    areaSlugs: [
      "education-alphabetisation",
      "inclusion-sociale-handicap",
      "developpement-autonomisation-jeunes",
    ],
    featured: true,
    image: "/images/hero-classroom.jpg",
    imageAlt:
      "Élèves dans une salle de classe au Burkina Faso, devant un tableau noir couvert d’inscriptions.",
    gallery: [
      {
        url: "/images/literacy-class.jpg",
        alt: "Centre d’alphabétisation en briques au Burkina Faso.",
        caption: "Photo d’illustration : centre d’alphabétisation au Burkina Faso.",
      },
      {
        url: "/images/school-garden.jpg",
        alt: "Élève arrosant un jardin scolaire au Burkina Faso.",
        caption: "Photo d’illustration : activités scolaires au Burkina Faso.",
      },
    ],
    documents: [],
    contentStatus: "published",
    publishedAt: "2026-11-17",
    sortOrder: 1,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "project-palven",
    slug: "palven",
    title: "Alphabétisation et veille numérique pour la cohésion sociale",
    acronym: "PALVEN",
    summary:
      "Un projet consacré à l’alphabétisation numérique, à la citoyenneté responsable, à la sécurité en ligne et à la lutte contre la désinformation.",
    context: `Le numérique occupe une place croissante dans la vie quotidienne, l’accès à l’information et les relations sociales. Pour les jeunes et les communautés, il représente une opportunité d’apprentissage et d’expression, mais aussi un espace exposé à la désinformation, aux arnaques, aux discours de division et aux atteintes à la vie privée.

PALVEN — Projet d’alphabétisation et de veille numérique pour la cohésion sociale — répond à ce double enjeu. Il vise à renforcer les compétences numériques, à promouvoir une citoyenneté numérique responsable et à outiller les jeunes et les communautés face aux risques en ligne.

Le projet articule éducation, vigilance et engagement communautaire. Il accorde une attention particulière à la protection des données personnelles, à la sécurité en ligne et à la lutte contre la désinformation, dans une perspective de cohésion sociale.`,
    objectives: [
      "Renforcer l’alphabétisation numérique des jeunes et des communautés",
      "Promouvoir une citoyenneté numérique responsable",
      "Améliorer la sécurité en ligne et la protection des données personnelles",
      "Lutter contre la désinformation et ses effets sur la cohésion sociale",
      "Encourager l’engagement des jeunes et des communautés",
    ],
    coverage: ["Hauts-Bassins (zone à confirmer)"],
    beneficiaries: [
      "Jeunes et adolescents",
      "Communautés locales",
      "Acteurs de la société civile",
      "Parents et encadrants",
    ],
    activities: [
      "Ateliers d’alphabétisation numérique",
      "Sensibilisation à la sécurité en ligne et à la protection des données",
      "Échanges sur la désinformation et l’esprit critique",
      "Mobilisation des jeunes et des communautés autour d’usages responsables",
    ],
    results: [],
    periodLabel: "Période à confirmer",
    partners: [],
    funders: [],
    status: "ongoing",
    statusNote:
      "Les résultats, la zone d’intervention précise et la période de mise en œuvre sont à documenter avec l’équipe du projet.",
    areaSlugs: [
      "education-numerique",
      "education-alphabetisation",
      "cohesion-sociale-prevention-conflits",
      "developpement-autonomisation-jeunes",
    ],
    featured: true,
    image: "/images/digital-training.jpg",
    imageAlt:
      "Trois femmes devant un ordinateur lors d’une session de formation numérique au Burkina Faso.",
    gallery: [
      {
        url: "/images/digital-training.jpg",
        alt: "Session de formation numérique avec des participantes au Burkina Faso.",
        caption: "Photo d’illustration : apprentissage numérique au Burkina Faso.",
      },
    ],
    documents: [],
    contentStatus: "published",
    publishedAt: "2026-11-17",
    sortOrder: 2,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "project-guiriko",
    slug: "justice-de-proximite-guiriko",
    title: "Justice de proximité – Guiriko",
    acronym: "Guiriko",
    summary:
      "Une initiative qui rapproche l’information juridique des communautés et soutient la prévention des violences et la médiation sociale.",
    context: `L’accès à la justice reste difficile pour de nombreuses personnes, en raison de l’éloignement des services, des coûts, de la complexité des procédures ou de la méconnaissance des droits. Ces obstacles sont particulièrement importants pour les femmes, les filles et les personnes en situation de vulnérabilité.

Justice de proximité – Guiriko propose une réponse de proximité fondée sur l’information juridique, la sensibilisation et la médiation communautaire. L’initiative met l’accent sur les droits des femmes et des filles, la prévention des violences basées sur le genre, la prévention des conflits et la cohésion sociale.

Elle combine activités mobiles d’information juridique, séances de sensibilisation et capsules vidéo éducatives, afin de rendre le droit plus compréhensible et plus accessible aux communautés.`,
    objectives: [
      "Rapprocher l’information juridique des communautés",
      "Renforcer la connaissance et l’exercice des droits des femmes et des filles",
      "Contribuer à la prévention des violences basées sur le genre",
      "Prévenir les conflits et soutenir la médiation communautaire",
      "Renforcer la cohésion sociale",
    ],
    coverage: ["Bobo-Dioulasso et environs (zone à confirmer)"],
    beneficiaries: [
      "Femmes et filles",
      "Communautés locales",
      "Personnes en recherche d’information juridique",
      "Leaders communautaires et acteurs de la médiation",
    ],
    activities: [
      "Activités mobiles d’information juridique",
      "Séances de sensibilisation aux droits",
      "Prévention des violences basées sur le genre",
      "Médiation communautaire et prévention des conflits",
      "Production et diffusion de capsules vidéo éducatives",
    ],
    results: [],
    periodLabel: "Période à confirmer",
    partners: [],
    funders: [],
    status: "ongoing",
    statusNote:
      "Le statut opérationnel, la zone d’intervention précise et les résultats sont à confirmer avec l’équipe de CLEDUCA-ODJ.",
    areaSlugs: [
      "acces-justice-droits-humains",
      "egalite-genre-femmes",
      "cohesion-sociale-prevention-conflits",
    ],
    featured: true,
    image: "/images/community-radio.jpg",
    imageAlt:
      "Journaliste dans un studio de radio communautaire au Burkina Faso.",
    gallery: [
      {
        url: "/images/community-gathering.jpg",
        alt: "Séance de sensibilisation communautaire en plein air au Burkina Faso.",
        caption: "Photo d’illustration : dialogue et sensibilisation communautaire.",
      },
    ],
    documents: [],
    contentStatus: "published",
    publishedAt: "2026-11-17",
    sortOrder: 3,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "project-civlink",
    slug: "civi-link",
    title: "Coordination numérique et intelligence communautaire",
    acronym: "CIVI-LINK",
    summary:
      "Une initiative régionale proposée par CLEDUCA-ODJ pour renforcer la coordination entre organisations de la société civile et faciliter l’accès à une information communautaire agrégée et fiable.",
    context: `Les acteurs de la société civile et les services de proximité disposent souvent d’informations et de dispositifs dispersés. Cette fragmentation limite la coordination, la visibilité des services disponibles et la capacité à répondre de manière cohérente aux besoins des communautés.

CIVI-LINK est une initiative régionale en phase de conception, portée par CLEDUCA-ODJ. Elle vise à créer un cadre de coordination numérique et d’intelligence communautaire dans les Hauts-Bassins, en rapprochant les organisations de la société civile, les acteurs locaux et les communautés autour d’une information agrégée et utile.

Le projet est conçu selon des principes stricts de gouvernance des données : aucune donnée nominative sensible concernant les personnes déplacées ne doit être collectée ou exposée ; les informations doivent rester agrégées ; la gouvernance est partagée entre les parties prenantes ; la participation communautaire est centrale. L’initiative doit rester utile même sans participation directe des autorités publiques.`,
    objectives: [
      "Renforcer la coordination entre les organisations de la société civile",
      "Cartographier les services communautaires disponibles",
      "Agréger une information communautaire fiable et utile",
      "Faciliter la participation et le retour d’information des communautés",
      "Favoriser la collaboration entre parties prenantes",
      "Encourager un usage responsable des données et une analyse assistée par l’IA de manière sélective",
    ],
    coverage: ["Hauts-Bassins — phase initiale envisagée"],
    beneficiaries: [
      "Organisations de la société civile",
      "Communautés locales",
      "Acteurs du développement local",
      "Partenaires techniques et institutionnels",
    ],
    activities: [
      "Conception d’un cadre de coordination entre organisations",
      "Cartographie des services communautaires",
      "Agrégation d’informations communautaires non sensibles",
      "Mécanismes de participation et de retour d’information",
      "Définition d’une gouvernance partagée des données",
      "Exploration d’une analyse assistée par l’IA dans le respect des principes éthiques",
    ],
    results: [],
    periodLabel: "Phase de conception — calendrier à définir",
    partners: [],
    funders: [],
    status: "proposed",
    statusNote:
      "CIVI-LINK est une initiative proposée, en phase de conception. Son statut opérationnel n’est pas confirmé.",
    areaSlugs: [
      "education-numerique",
      "cohesion-sociale-prevention-conflits",
      "resilience-communautaire-developpement-durable",
    ],
    featured: true,
    image: "/images/about-bobo.jpg",
    imageAlt:
      "Vue d’une artère commerçante de Bobo-Dioulasso, Burkina Faso.",
    gallery: [
      {
        url: "/images/community-radio.jpg",
        alt: "Journaliste dans un studio de radio communautaire.",
        caption: "Photo d’illustration : information et communication communautaires.",
      },
    ],
    documents: [],
    contentStatus: "published",
    publishedAt: "2026-11-17",
    sortOrder: 4,
    createdAt: T,
    updatedAt: T,
  },
];
