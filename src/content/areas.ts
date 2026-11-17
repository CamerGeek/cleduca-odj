import type { InterventionArea } from "@/lib/content/types";

const T = "2026-11-17T00:00:00.000Z";

const sourceNote =
  "Ce domaine est documenté par au moins une initiative présentée dans le portefeuille institutionnel.";

export const seedAreas: InterventionArea[] = [
  {
    id: "area-education",
    slug: "education-alphabetisation",
    title: "Éducation et alphabétisation",
    shortTitle: "Éducation",
    tagline: "Garantir des parcours éducatifs continus, inclusifs et de qualité.",
    summary:
      "CLEDUCA-ODJ agit pour que les enfants et les jeunes dont la scolarité est fragilisée puissent apprendre, rester à l’école et construire un avenir.",
    description: `L’éducation est le socle historique de l’engagement de CLEDUCA-ODJ. L’association accompagne les parcours scolaires des enfants et des jeunes exposés à des ruptures : déplacements forcés, précarité des familles, éloignement des services éducatifs ou besoins spécifiques liés au handicap.

Notre approche part des écoles et des communautés. Elle vise à maintenir la continuité des apprentissages, à renforcer l’accueil des élèves dans les établissements et à impliquer les familles dans la réussite éducative. L’alphabétisation des jeunes et des adultes constitue également un levier d’autonomisation et de participation citoyenne.

Le dispositif PASEDI illustre cet engagement : il soutient des enfants et jeunes déplacés internes ainsi que des élèves des communautés d’accueil, dans plusieurs écoles des régions des Cascades et de la Boucle du Mouhoun, en veillant à l’inclusion des enfants en situation de handicap.`,
    icon: "book-open",
    status: "documented",
    statusNote: sourceNote,
    challenges: [
      "Ruptures de scolarité liées aux déplacements forcés et à l’insécurité",
      "Difficultés d’accueil et d’intégration des élèves déplacés dans les écoles",
      "Obstacles spécifiques à la scolarisation des enfants en situation de handicap",
      "Faible accompagnement des familles dans le suivi des apprentissages",
    ],
    objectives: [
      "Favoriser la continuité éducative des enfants et des jeunes vulnérables",
      "Promouvoir une école inclusive qui accueille la diversité des élèves",
      "Renforcer les capacités des communautés éducatives et des familles",
      "Valoriser l’alphabétisation comme levier d’autonomisation",
    ],
    audiences: [
      "Enfants et jeunes déplacés internes",
      "Élèves des communautés d’accueil",
      "Enfants en situation de handicap",
      "Enseignants, parents et communautés éducatives",
    ],
    methodology: `Le travail s’appuie sur les écoles et les communautés locales. Les interventions combinent appui à la scolarisation, mobilisation communautaire, prise en compte des besoins spécifiques et suivi de proximité. La démarche privilégie la participation des enseignants, des familles et des responsables communautaires afin que les solutions soient appropriées localement.`,
    image: "/images/literacy-class.jpg",
    imageAlt:
      "Bâtiment d’un centre d’alphabétisation en briques, avec toiture et portes vertes, au Burkina Faso.",
    featured: true,
    published: true,
    sortOrder: 1,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "area-youth",
    slug: "developpement-autonomisation-jeunes",
    title: "Développement et autonomisation des jeunes",
    shortTitle: "Jeunesse",
    tagline: "Donner aux jeunes les moyens d’agir, de décider et de contribuer.",
    summary:
      "CLEDUCA-ODJ soutient l’autonomie des jeunes, leur participation à la vie communautaire et leur capacité à porter des initiatives utiles à leur territoire.",
    description: `La jeunesse burkinabè représente une force majeure pour le développement du pays. Pour que cette énergie se transforme en capacités et en opportunités, les jeunes ont besoin d’espaces d’écoute, de formation, de reconnaissance et de participation réelle aux décisions qui les concernent.

CLEDUCA-ODJ inscrit son action dans une démarche d’autonomisation : renforcer les compétences, encourager la prise d’initiative, faciliter l’engagement citoyen et soutenir les jeunes dans leurs projets personnels et collectifs. L’association veille à inclure les jeunes en situation de vulnérabilité et à promouvoir l’égalité entre les filles et les garçons.

Les initiatives éducatives, numériques et de cohésion sociale de l’association constituent des points d’entrée pour toucher les jeunes là où ils se trouvent : à l’école, dans les quartiers, dans les espaces communautaires et sur les plateformes numériques.`,
    icon: "youth",
    status: "documented",
    statusNote: sourceNote,
    challenges: [
      "Accès limité à des opportunités de formation et d’accompagnement",
      "Faible participation des jeunes aux espaces de décision communautaire",
      "Risques d’exclusion des jeunes les plus vulnérables",
      "Besoin de reconnaissance et de valorisation des initiatives portées par les jeunes",
    ],
    objectives: [
      "Renforcer les compétences et la confiance des jeunes",
      "Encourager la participation citoyenne et l’engagement communautaire",
      "Soutenir l’émergence et la structuration d’initiatives portées par les jeunes",
      "Promouvoir l’égalité et l’inclusion entre tous les jeunes",
    ],
    audiences: [
      "Jeunes des communautés urbaines et rurales",
      "Filles et jeunes femmes",
      "Jeunes déplacés internes",
      "Associations et collectifs de jeunes",
    ],
    methodology: `CLEDUCA-ODJ privilégie des démarches participatives : ateliers de renforcement des capacités, espaces de dialogue, accompagnement de projets et mobilisation communautaire. Les jeunes sont associés à la conception et au suivi des activités afin de garantir leur appropriation et de renforcer leur pouvoir d’agir.`,
    image: "/images/youth.jpg",
    imageAlt:
      "Jeunes footballeurs en tenue verte rassemblés sur un terrain au Burkina Faso.",
    featured: true,
    published: true,
    sortOrder: 2,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "area-digital",
    slug: "education-numerique",
    title: "Éducation numérique et citoyenneté responsable",
    shortTitle: "Numérique",
    tagline: "Faire du numérique un espace d’apprentissage, de sécurité et de citoyenneté.",
    summary:
      "CLEDUCA-ODJ accompagne l’appropriation des outils numériques et promeut des usages responsables, critiques et protecteurs.",
    description: `Le numérique transforme l’accès à l’information, les modes d’apprentissage et les formes d’engagement communautaire. Il offre des opportunités considérables, mais expose aussi les jeunes et les communautés à la désinformation, aux risques en ligne et à la mauvaise utilisation des données personnelles.

À travers PALVEN, CLEDUCA-ODJ travaille sur l’alphabétisation numérique, la citoyenneté responsable, la sécurité en ligne, la protection des données personnelles, la lutte contre la désinformation et l’engagement des jeunes et des communautés. L’ambition est de permettre à chacun d’utiliser le numérique de manière éclairée, utile et responsable.

L’association aborde la technologie comme un moyen au service du lien social et de l’éducation, et non comme une fin en soi. Une attention particulière est portée à la protection des personnes vulnérables et à la non-divulgation d’informations sensibles.`,
    icon: "digital",
    status: "documented",
    statusNote: sourceNote,
    challenges: [
      "Accès inégal aux outils et aux compétences numériques",
      "Circulation de fausses informations et de contenus trompeurs",
      "Risques liés à la sécurité en ligne et à la protection des données",
      "Usage du numérique sans accompagnement critique, notamment chez les jeunes",
    ],
    objectives: [
      "Renforcer les compétences numériques de base des jeunes et des communautés",
      "Promouvoir la citoyenneté numérique responsable",
      "Prévenir les risques en ligne et protéger les données personnelles",
      "Développer l’esprit critique face à la désinformation",
    ],
    audiences: [
      "Jeunes et adolescents",
      "Communautés locales",
      "Acteurs de la société civile",
      "Parents et encadrants",
    ],
    methodology: `Les interventions combinent sensibilisation, formation pratique, échanges communautaires et production de supports éducatifs. La pédagogie participative permet aux participants d’expérimenter, de questionner leurs usages et de construire des repères concrets pour un numérique responsable et protecteur.`,
    image: "/images/digital-training.jpg",
    imageAlt:
      "Trois femmes en tenue traditionnelle devant un ordinateur lors d’une session de formation numérique.",
    featured: true,
    published: true,
    sortOrder: 3,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "area-inclusion",
    slug: "inclusion-sociale-handicap",
    title: "Inclusion sociale et handicap",
    shortTitle: "Inclusion",
    tagline: "Construire des communautés qui accueillent et valorisent chacun.",
    summary:
      "L’inclusion sociale est au cœur de l’identité de CLEDUCA-ODJ : chaque personne doit pouvoir participer pleinement à la vie de sa communauté.",
    description: `L’inclusion sociale consiste à garantir à chaque personne, quelles que soient ses capacités, son origine ou sa situation, la possibilité de participer à l’éducation, à la vie communautaire et aux décisions qui la concernent. Les enfants et les personnes en situation de handicap restent trop souvent confrontés à des obstacles d’accès et à des représentations discriminantes.

CLEDUCA-ODJ promeut une inclusion concrète, intégrée aux initiatives éducatives et communautaires. Le dispositif PASEDI prend explicitement en compte les enfants en situation de handicap parmi les enfants et jeunes accompagnés. Cette attention se traduit par une approche de proximité, le dialogue avec les familles et la mobilisation des communautés.

L’association inscrit l’inclusion dans une perspective plus large : égalité des chances, respect de la dignité, lutte contre les stigmatisations et reconnaissance de la contribution de chacun au développement local.`,
    icon: "inclusion",
    status: "documented",
    statusNote: sourceNote,
    challenges: [
      "Obstacles d’accès à l’éducation pour les enfants en situation de handicap",
      "Stigmatisation et représentations sociales discriminantes",
      "Manque d’adaptation des dispositifs éducatifs et communautaires",
      "Faible participation des personnes vulnérables aux espaces de décision",
    ],
    objectives: [
      "Favoriser l’accès des enfants en situation de handicap à l’éducation",
      "Lutter contre les stigmatisations et promouvoir la dignité",
      "Renforcer la participation des personnes vulnérables à la vie communautaire",
      "Sensibiliser les familles et les communautés à l’inclusion",
    ],
    audiences: [
      "Enfants et jeunes en situation de handicap",
      "Familles et proches aidants",
      "Communautés éducatives",
      "Acteurs locaux et organisations de la société civile",
    ],
    methodology: `L’inclusion est intégrée aux initiatives de CLEDUCA-ODJ plutôt que traitée isolément. Les actions reposent sur le dialogue avec les familles, la mobilisation communautaire, l’adaptation des approches éducatives et la prise en compte des besoins spécifiques dans la conception des activités.`,
    image: "/images/school-garden.jpg",
    imageAlt:
      "Élève arrosant un jardin scolaire dans une communauté rurale du Burkina Faso.",
    featured: true,
    published: true,
    sortOrder: 4,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "area-gender",
    slug: "egalite-genre-femmes",
    title: "Égalité de genre et autonomisation des femmes",
    shortTitle: "Genre",
    tagline: "Promouvoir les droits, la voix et l’autonomie des femmes et des filles.",
    summary:
      "CLEDUCA-ODJ agit pour l’égalité entre les femmes et les hommes et contre les violences fondées sur le genre.",
    description: `L’égalité de genre est une condition du développement durable et de la cohésion sociale. Les femmes et les filles continuent de faire face à des inégalités d’accès aux ressources, à l’information, aux instances de décision et à la justice, ainsi qu’à des formes de violence qui limitent leur autonomie.

CLEDUCA-ODJ aborde ces enjeux à travers l’éducation, la sensibilisation juridique et la mobilisation communautaire. L’initiative Justice de proximité – Guiriko accorde une attention particulière aux droits des femmes et des filles, à la prévention des violences basées sur le genre et à la médiation communautaire.

L’association cherche à renforcer la capacité des femmes à connaître leurs droits, à s’exprimer et à participer aux décisions, tout en travaillant avec les communautés et les acteurs locaux pour faire évoluer les normes qui favorisent les inégalités.`,
    icon: "gender",
    status: "documented",
    statusNote: sourceNote,
    challenges: [
      "Inégalités d’accès à l’information juridique et aux services de protection",
      "Persistance des violences basées sur le genre",
      "Faible représentation des femmes dans les espaces de décision",
      "Normes sociales limitant l’autonomie des femmes et des filles",
    ],
    objectives: [
      "Renforcer la connaissance et l’exercice des droits des femmes et des filles",
      "Contribuer à la prévention des violences basées sur le genre",
      "Favoriser la participation des femmes à la vie communautaire et aux décisions",
      "Sensibiliser les communautés à l’égalité de genre",
    ],
    audiences: [
      "Femmes et filles",
      "Communautés locales",
      "Leaders communautaires et religieux",
      "Acteurs de la justice et du secteur social",
    ],
    methodology: `Les actions reposent sur la sensibilisation communautaire, l’information juridique de proximité, la médiation et la production de supports éducatifs. CLEDUCA-ODJ travaille avec les femmes, les familles et les acteurs locaux pour créer des espaces de dialogue et renforcer les mécanismes communautaires de protection.`,
    image: "/images/women-cooperative.jpg",
    imageAlt:
      "Femmes transformant des noix de karité dans un cadre coopératif au Burkina Faso.",
    featured: true,
    published: true,
    sortOrder: 5,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "area-psychosocial",
    slug: "soutien-psychosocial-sante",
    title: "Soutien psychosocial et santé communautaire",
    shortTitle: "Bien-être",
    tagline: "Prendre soin du lien, de la dignité et du bien-être des communautés.",
    summary:
      "Domaine de positionnement institutionnel : CLEDUCA-ODJ reconnaît la dimension psychosociale du développement et du bien-être communautaire.",
    description: `Les crises et les vulnérabilités affectent profondément le bien-être psychologique et social des personnes et des communautés. Le soutien psychosocial et la santé communautaire constituent des dimensions essentielles de toute démarche de développement durable.

CLEDUCA-ODJ identifie ce domaine comme un axe de positionnement institutionnel, en cohérence avec son approche communautaire et inclusive. Aucune intervention active n’est revendiquée à ce stade sur le site. Les activités éventuellement menées dans ce domaine seront publiées après vérification et documentation.

L’association veille déjà à intégrer une attention à la dignité, à l’écoute et au bien-être dans ses initiatives éducatives, numériques et de cohésion sociale, sans se substituer aux services spécialisés.`,
    icon: "wellbeing",
    status: "positioning",
    statusNote:
      "Domaine de positionnement institutionnel : aucune intervention active n’est revendiquée à ce stade. Les activités seront publiées après vérification.",
    challenges: [
      "Impact des crises et des déplacements sur le bien-être des personnes",
      "Faible accès aux services de soutien psychosocial dans certaines zones",
      "Stigmatisation des personnes en difficulté psychologique",
      "Besoin de renforcement des mécanismes communautaires d’écoute et d’entraide",
    ],
    objectives: [
      "Reconnaître la dimension psychosociale du développement communautaire",
      "Promouvoir l’écoute, la dignité et le soutien mutuel dans les interventions",
      "Documenter les besoins et les réponses possibles avec les acteurs spécialisés",
      "Éviter toute substitution aux services de santé spécialisés",
    ],
    audiences: [
      "Personnes affectées par les crises",
      "Jeunes et familles vulnérables",
      "Communautés d’accueil",
      "Acteurs de la santé et du secteur social",
    ],
    methodology: `Ce domaine reste en phase de positionnement. Toute intervention future serait développée en partenariat avec des acteurs compétents, dans le respect des principes de consentement, de confidentialité et de non-stigmatisation.`,
    image: "/images/community-gathering.jpg",
    imageAlt:
      "Séance communautaire en plein air au Burkina Faso, avec une intervenante face aux participants.",
    featured: false,
    published: true,
    sortOrder: 6,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "area-cohesion",
    slug: "cohesion-sociale-prevention-conflits",
    title: "Cohésion sociale et prévention des conflits",
    shortTitle: "Cohésion sociale",
    tagline: "Renforcer le dialogue, la confiance et la résolution pacifique des différends.",
    summary:
      "CLEDUCA-ODJ favorise le dialogue entre les communautés et les mécanismes pacifiques de prévention et de gestion des conflits.",
    description: `La cohésion sociale est indispensable à la stabilité et au développement des communautés. Les tensions liées aux déplacements, à l’accès aux ressources, aux inégalités ou à la désinformation peuvent fragiliser la confiance et les mécanismes traditionnels de régulation.

CLEDUCA-ODJ aborde la cohésion sociale à travers l’éducation, l’information et la médiation communautaire. L’initiative Justice de proximité – Guiriko soutient la prévention des conflits et la médiation, tandis que PALVEN traite des enjeux de désinformation et de citoyenneté numérique qui peuvent affecter le lien social.

L’association privilégie une approche de proximité, fondée sur l’écoute des communautés, la reconnaissance des mécanismes locaux et la construction de ponts entre les différents acteurs du territoire.`,
    icon: "cohesion",
    status: "documented",
    statusNote: sourceNote,
    challenges: [
      "Tensions sociales liées aux déplacements et à la pression sur les ressources",
      "Fragilisation des mécanismes traditionnels de dialogue",
      "Effets de la désinformation sur la confiance entre communautés",
      "Besoin d’espaces inclusifs de dialogue et de médiation",
    ],
    objectives: [
      "Renforcer le dialogue et la confiance entre les communautés",
      "Prévenir les conflits par l’information et la médiation",
      "Soutenir les mécanismes communautaires de résolution pacifique",
      "Promouvoir une information fiable et responsable",
    ],
    audiences: [
      "Communautés hôtes et communautés déplacées",
      "Leaders communautaires et religieux",
      "Jeunes et femmes",
      "Acteurs locaux de la médiation et de la justice",
    ],
    methodology: `Les actions s’appuient sur la médiation, la sensibilisation, les espaces de dialogue communautaire et la production de contenus informatifs. CLEDUCA-ODJ associe les leaders locaux et les communautés à l’identification des tensions et à la construction de réponses durables.`,
    image: "/images/local-market.jpg",
    imageAlt:
      "Marché alimentaire traditionnel animé, lieu de vie et d’échanges communautaires au Burkina Faso.",
    featured: true,
    published: true,
    sortOrder: 7,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "area-justice",
    slug: "acces-justice-droits-humains",
    title: "Accès à la justice et droits humains",
    shortTitle: "Justice",
    tagline: "Rapprocher le droit des communautés et défendre les droits fondamentaux.",
    summary:
      "CLEDUCA-ODJ œuvre pour une information juridique accessible et une meilleure connaissance des droits par les communautés.",
    description: `L’accès à la justice ne se limite pas à la présence d’un tribunal. Il suppose que chacun puisse connaître ses droits, comprendre les procédures, être écouté et trouver une réponse adaptée à sa situation. Pour de nombreuses personnes, l’éloignement des services, le coût, la complexité ou la méconnaissance du droit constituent des obstacles majeurs.

L’initiative Justice de proximité – Guiriko traduit l’engagement de CLEDUCA-ODJ en faveur d’un droit plus accessible. Elle combine information juridique, sensibilisation, prévention des violences basées sur le genre, médiation communautaire, activités mobiles d’information juridique et capsules vidéo éducatives.

L’association agit dans une logique de proximité et de complémentarité avec les institutions et les acteurs compétents, en veillant au respect de la confidentialité et de la dignité des personnes.`,
    icon: "justice",
    status: "documented",
    statusNote: sourceNote,
    challenges: [
      "Éloignement géographique et complexité des services juridictionnels",
      "Méconnaissance des droits et des procédures",
      "Coût et lenteur des démarches pour les personnes vulnérables",
      "Besoin d’information juridique en langues accessibles",
    ],
    objectives: [
      "Rapprocher l’information juridique des communautés",
      "Renforcer la connaissance des droits, en particulier des femmes et des filles",
      "Prévenir les violences basées sur le genre",
      "Soutenir la médiation et la résolution pacifique des différends",
    ],
    audiences: [
      "Femmes et filles",
      "Communautés rurales et périurbaines",
      "Personnes en situation de vulnérabilité",
      "Leaders communautaires et acteurs de la justice",
    ],
    methodology: `L’approche combine activités mobiles d’information juridique, sensibilisation communautaire, médiation et capsules vidéo éducatives. Les contenus sont conçus pour être accessibles et adaptés aux réalités locales, avec une attention particulière à la protection des personnes et à la confidentialité des situations individuelles.`,
    image: "/images/community-radio.jpg",
    imageAlt:
      "Journaliste dans un studio de radio communautaire au Burkina Faso.",
    featured: true,
    published: true,
    sortOrder: 8,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "area-resilience",
    slug: "resilience-communautaire-developpement-durable",
    title: "Résilience communautaire et développement durable",
    shortTitle: "Résilience",
    tagline: "Renforcer la capacité des communautés à anticiper, s’adapter et agir.",
    summary:
      "Domaine de positionnement institutionnel : CLEDUCA-ODJ inscrit son action dans une perspective de durabilité et de résilience des communautés.",
    description: `La résilience communautaire désigne la capacité des communautés à faire face aux chocs, à s’adapter et à construire des réponses durables à partir de leurs propres ressources et de leurs réseaux de solidarité. Elle rejoint les valeurs de solidarité, de participation et de développement durable portées par CLEDUCA-ODJ.

Ce domaine constitue un axe de positionnement institutionnel. Aucune intervention active spécifiquement identifiée sous cette thématique n’est revendiquée à ce stade sur le site. Les initiatives qui y contribuent, notamment en éducation, en inclusion et en cohésion sociale, sont présentées dans leurs domaines respectifs.

L’association souhaite renforcer progressivement la documentation de ses contributions à la résilience locale et développer des partenariats avec les acteurs du développement durable.`,
    icon: "resilience",
    status: "positioning",
    statusNote:
      "Domaine de positionnement institutionnel : aucune intervention active spécifiquement identifiée n’est revendiquée à ce stade.",
    challenges: [
      "Exposition des communautés aux chocs climatiques et sécuritaires",
      "Pression sur les ressources naturelles et les services de base",
      "Fragilité des moyens d’existence de nombreux ménages",
      "Besoin de renforcement des capacités locales d’anticipation et d’adaptation",
    ],
    objectives: [
      "Intégrer la durabilité dans la conception des initiatives communautaires",
      "Renforcer les capacités locales d’organisation et de solidarité",
      "Documenter les contributions à la résilience des communautés",
      "Développer des partenariats avec les acteurs du développement durable",
    ],
    audiences: [
      "Communautés rurales et périurbaines",
      "Organisations communautaires de base",
      "Jeunes et femmes porteurs d’initiatives",
      "Collectivités et acteurs du développement local",
    ],
    methodology: `Ce domaine reste en phase de positionnement. Les futurs projets privilégieront la participation communautaire, la valorisation des savoirs locaux, la durabilité des actions et la complémentarité avec les autres domaines d’intervention de CLEDUCA-ODJ.`,
    image: "/images/community-resilience.jpg",
    imageAlt:
      "Femmes construisant collectivement des diguettes anti-érosives dans un champ au Burkina Faso.",
    featured: false,
    published: true,
    sortOrder: 9,
    createdAt: T,
    updatedAt: T,
  },
];
