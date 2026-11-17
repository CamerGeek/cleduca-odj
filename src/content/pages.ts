import type { InstitutionalPage } from "@/lib/content/types";

const T = "2026-11-17T00:00:00.000Z";

export const seedPages: InstitutionalPage[] = [
  {
    id: "page-confidentialite",
    slug: "confidentialite",
    title: "Politique de confidentialité",
    eyebrow: "Protection des données",
    intro:
      "Cette politique décrit les données personnelles collectées par le site institutionnel de CLEDUCA-ODJ, les raisons de leur collecte et les droits dont disposent les personnes concernées.",
    sections: [
      {
        id: "responsable",
        title: "Responsable du traitement",
        body: `Le responsable du traitement est CLEDUCA-ODJ, organisation de la société civile à but non lucratif basée à Bobo-Dioulasso, Burkina Faso.

Les coordonnées complètes du responsable du traitement, les références de reconnaissance légale et les coordonnées du délégué à la protection des données (le cas échéant) seront publiées après validation par l’association. En attendant, toute question relative à la protection des données peut être adressée via le formulaire de contact du site.`,
      },
      {
        id: "donnees",
        title: "Données collectées",
        body: `Le site collecte uniquement les données nécessaires à son fonctionnement et aux échanges avec le public :

- **Formulaire de contact** : nom, adresse e-mail, organisation (facultative), type de demande, contenu du message et consentement.
- **Inscription à la lettre d’information** : adresse e-mail, nom (facultatif), source de l’inscription et date de consentement.
- **Protection contre les abus** : adresse IP hachée, date et heure de soumission, afin de limiter les envois automatisés et malveillants.
- **Espace d’administration** : adresse e-mail, rôle, journaux de connexion et d’activité des personnes autorisées.

Le site ne collecte pas de dossiers individuels de bénéficiaires. Il n’expose aucune information sensible concernant des personnes déplacées, des femmes, des enfants ou des personnes en situation de handicap.`,
      },
      {
        id: "finalites",
        title: "Finalités et bases légales",
        body: `Les données sont traitées pour les finalités suivantes :

- répondre aux demandes d’information, de partenariat, de bénévolat et de collaboration ;
- gérer les inscriptions à la lettre d’information, sur la base du consentement ;
- assurer la sécurité du site et prévenir les abus ;
- administrer les contenus et produire des statistiques internes agrégées.

Les bases légales invoquées sont le consentement de la personne, l’intérêt légitime de l’association à répondre à ses interlocuteurs et à sécuriser ses services, ainsi que le respect d’obligations légales lorsqu’elles s’appliquent.`,
      },
      {
        id: "destinataires",
        title: "Destinataires et sous-traitants",
        body: `Les données sont accessibles uniquement aux personnes habilitées de CLEDUCA-ODJ et aux prestataires techniques nécessaires au fonctionnement du site, notamment l’hébergement (Vercel) et la base de données, le stockage et l’authentification (Supabase). Un service d’envoi d’e-mails peut être utilisé pour les notifications de contact lorsqu’il est configuré.

Ces prestataires agissent sur instruction de l’association et dans le cadre de leurs engagements contractuels. Les données ne sont ni vendues ni cédées à des fins commerciales. Les données peuvent être hébergées en dehors du Burkina Faso ; l’association veille à ce que des garanties appropriées encadrent ces transferts.`,
      },
      {
        id: "conservation",
        title: "Durées de conservation",
        body: `Les durées de conservation retenues sont les suivantes :

- **Messages de contact** : 12 mois après la clôture de la demande, puis suppression ou anonymisation, sauf obligation légale contraire ;
- **Abonnés à la lettre d’information** : jusqu’au retrait du consentement ou à la désinscription ;
- **Journaux anti-abus** : 90 jours ;
- **Journaux d’administration** : 12 mois ;
- **Comptes administrateurs** : pendant la durée d’exercice des fonctions, puis suppression ou anonymisation.

Ces durées pourront être ajustées par l’association dans le cadre de sa politique interne de conservation.`,
      },
      {
        id: "droits",
        title: "Vos droits",
        body: `Vous disposez notamment des droits suivants :

- accéder aux données vous concernant ;
- demander la rectification ou l’effacement de vos données ;
- demander la limitation du traitement ;
- vous opposer au traitement ;
- retirer votre consentement à tout moment, sans remettre en cause la licéité des traitements antérieurs ;
- introduire une réclamation auprès de l’autorité compétente de protection des données.

Pour exercer ces droits, utilisez le formulaire de contact en précisant l’objet de votre demande. Une vérification d’identité peut être demandée. L’association s’engage à répondre dans un délai raisonnable et, lorsque la réglementation le prévoit, dans un délai maximal de 30 jours.`,
      },
      {
        id: "securite",
        title: "Sécurité et confidentialité",
        body: `CLEDUCA-ODJ met en œuvre des mesures techniques et organisationnelles adaptées : accès administratif authentifié et limité par rôle, politiques de sécurité au niveau des données, validation des entrées, protection contre les abus, chiffrement des communications et journalisation des opérations sensibles.

Aucun système ne peut garantir une sécurité absolue. En cas d’incident susceptible d’affecter les droits des personnes, l’association prendra les mesures nécessaires et informera les personnes concernées lorsque la réglementation l’exige.`,
      },
      {
        id: "vulnerables",
        title: "Personnes vulnérables et images",
        body: `Le site ne publie pas de dossiers individuels ni d’informations permettant d’identifier des bénéficiaires vulnérables. Les photographies de bénéficiaires et les témoignages ne sont publiés qu’après obtention d’un consentement approprié et dans le respect des principes de dignité et de protection de l’enfance.

Les photographies actuellement utilisées sur le site sont des photographies d’illustration sous licence libre, créditées sur la page des crédits photographiques. Elles ne représentent pas nécessairement des activités de CLEDUCA-ODJ.`,
      },
      {
        id: "modifications",
        title: "Modifications",
        body: `Cette politique peut être mise à jour pour tenir compte de l’évolution des services, des obligations légales ou des pratiques de l’association. La date de dernière mise à jour est affichée sur la page.`,
      },
    ],
    status: "published",
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "page-cookies",
    slug: "cookies",
    title: "Politique de cookies",
    eyebrow: "Cookies et traceurs",
    intro:
      "Le site CLEDUCA-ODJ utilise uniquement les cookies strictement nécessaires à son fonctionnement et à la sécurité de son espace d’administration.",
    sections: [
      {
        id: "principe",
        title: "Notre approche",
        body: `Le site ne dépose à ce jour aucun cookie publicitaire, aucun cookie de réseaux sociaux et aucun traceur de mesure d’audience. Aucun consentement préalable n’est donc requis pour les cookies strictement nécessaires.

Si des outils de mesure d’audience ou des services tiers étaient ajoutés ultérieurement, cette politique serait mise à jour et, le cas échéant, un mécanisme de consentement serait mis en place.`,
      },
      {
        id: "cookies-utilises",
        title: "Cookies utilisés",
        body: `Les cookies suivants peuvent être déposés :

- **Cookies d’authentification de l’administration** : ils permettent aux personnes autorisées de rester connectées à l’espace d’administration et de sécuriser leur session. Ils ne concernent pas le public.
- **Cookies techniques** : le cas échéant, ils assurent le bon fonctionnement du site et la protection des formulaires.

Ces cookies ne sont pas utilisés pour profiler les visiteurs ni pour diffuser de la publicité.`,
      },
      {
        id: "gestion",
        title: "Gérer les cookies",
        body: `Vous pouvez configurer votre navigateur pour bloquer ou supprimer les cookies. Le blocage des cookies techniques peut affecter le fonctionnement de certaines fonctionnalités, notamment l’accès à l’administration.

Les paramètres de gestion des cookies varient selon les navigateurs. Consultez la rubrique d’aide de votre navigateur pour plus d’informations.`,
      },
    ],
    status: "published",
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "page-mentions",
    slug: "mentions-legales",
    title: "Mentions légales",
    eyebrow: "Informations institutionnelles",
    intro:
      "Informations relatives à l’éditeur du site, à son hébergement et aux conditions d’utilisation.",
    sections: [
      {
        id: "editeur",
        title: "Éditeur du site",
        body: `Le présent site est édité par **CLEDUCA-ODJ** — Club d’Éducation Actuelle – Organisation pour le Développement de la Jeunesse.

Organisation de la société civile à but non lucratif, légalement reconnue, créée en 1997.
Siège : Bobo-Dioulasso, Hauts-Bassins, Burkina Faso.

**Numéro de reconnaissance légale** : à compléter par l’association.
**Adresse postale complète** : à compléter par l’association.
**Téléphone** : à compléter par l’association.
**Adresse e-mail de contact** : à compléter par l’association.
**Directeur de la publication** : à compléter par l’association.`,
      },
      {
        id: "hebergement",
        title: "Hébergement",
        body: `Le site est hébergé par Vercel Inc. La base de données, le stockage de fichiers et l’authentification des administrateurs sont assurés par Supabase.

Les coordonnées complètes des prestataires et les informations relatives aux transferts de données sont précisées dans la politique de confidentialité.`,
      },
      {
        id: "propriete",
        title: "Propriété intellectuelle",
        body: `Le logo, les textes institutionnels, l’identité visuelle et les contenus produits par CLEDUCA-ODJ sont protégés par le droit de la propriété intellectuelle. Toute reproduction ou adaptation nécessite l’autorisation préalable de l’association, sauf mention contraire.

Les photographies utilisées sous licence libre sont créditées et soumises aux conditions de leur licence respective, précisées sur la page des crédits photographiques.`,
      },
      {
        id: "responsabilite",
        title: "Responsabilité et liens",
        body: `CLEDUCA-ODJ s’efforce de fournir des informations exactes et à jour. Les contenus sont fournis à titre informatif et peuvent être modifiés. L’association ne saurait être tenue responsable des dommages résultant d’une utilisation du site ou de l’indisponibilité temporaire du service.

Le site peut contenir des liens vers des sites tiers. CLEDUCA-ODJ n’exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.`,
      },
      {
        id: "droit",
        title: "Droit applicable",
        body: `Le présent site est soumis au droit burkinabè. Toute difficulté relative à son utilisation sera soumise aux juridictions compétentes, sous réserve des règles impératives applicables.`,
      },
    ],
    status: "published",
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "page-accessibilite",
    slug: "accessibilite",
    title: "Déclaration d’accessibilité",
    eyebrow: "Accessibilité numérique",
    intro:
      "CLEDUCA-ODJ souhaite rendre son site accessible au plus grand nombre, y compris aux personnes en situation de handicap et aux utilisateurs disposant de connexions limitées.",
    sections: [
      {
        id: "engagement",
        title: "Notre engagement",
        body: `L’accessibilité numérique est cohérente avec les valeurs d’inclusion de CLEDUCA-ODJ. Le site est conçu pour être lisible, navigable au clavier, compatible avec les lecteurs d’écran et utilisable sur téléphone, tablette et ordinateur.

Les efforts portent notamment sur la structure sémantique des pages, les contrastes de couleurs, les textes alternatifs des images, la clarté des formulaires et le respect des préférences de réduction des animations.`,
      },
      {
        id: "limites",
        title: "Limites connues",
        body: `Le site n’a pas encore fait l’objet d’un audit d’accessibilité externe. Certains contenus tiers, documents PDF ou images provenant de sources externes peuvent ne pas respecter l’ensemble des critères d’accessibilité.

Les documents publiés dans le centre de ressources sont fournis dans leur format d’origine. Une version accessible peut être demandée à l’association lorsque cela est possible.`,
      },
      {
        id: "retour",
        title: "Signaler un problème",
        body: `Si vous rencontrez une difficulté d’accès à une page, un contenu ou un service, utilisez le formulaire de contact en précisant la page concernée et la nature du problème. CLEDUCA-ODJ s’efforcera de proposer une alternative dans les meilleurs délais.`,
      },
    ],
    status: "published",
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "page-gouvernance",
    slug: "gouvernance",
    title: "Gouvernance et redevabilité",
    eyebrow: "Institution",
    intro:
      "CLEDUCA-ODJ est une organisation à but non lucratif dotée d’une gouvernance associative. Cette page présente les principes de redevabilité de l’association et sera complétée avec ses documents statutaires validés.",
    sections: [
      {
        id: "principes",
        title: "Principes de gouvernance",
        body: `La gouvernance de CLEDUCA-ODJ s’inscrit dans le cadre d’une organisation associative à but non lucratif. Elle repose sur des principes de collégialité, de séparation des fonctions, de transparence et de redevabilité envers les membres, les communautés et les partenaires.

Les décisions institutionnelles doivent pouvoir être documentées, expliquées et suivies. Les responsabilités sont réparties entre les instances de l’association et la coordination opérationnelle, dans le respect des statuts et du règlement intérieur.`,
      },
      {
        id: "instances",
        title: "Instances et composition",
        body: `La composition des instances, la durée des mandats, les responsabilités de chacun et les modalités de renouvellement seront publiées après validation par l’association.

Aucune information nominative relative aux membres des instances n’est publiée sans leur accord.`,
      },
      {
        id: "redevabilite",
        title: "Redevabilité et transparence",
        body: `L’association s’engage à documenter ses projets, à publier ses résultats vérifiés et à indiquer clairement la source et la période de ses indicateurs. Les rapports institutionnels et financiers seront rendus publics lorsque leur publication sera autorisée.

Le site distingue explicitement les initiatives documentées, les initiatives en développement et les initiatives proposées. Les informations dont la vérification est incomplète sont signalées comme telles.`,
      },
      {
        id: "documents",
        title: "Documents institutionnels",
        body: `Les statuts, le règlement intérieur, les rapports d’activité, les rapports financiers et les politiques internes seront publiés dans le centre de ressources après validation et, le cas échéant, autorisation des organes compétents.

Les documents manquants ne sont pas remplacés par des contenus fictifs. Ils restent identifiés comme « à publier » jusqu’à leur mise à disposition.`,
      },
    ],
    status: "published",
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "page-credits",
    slug: "credits-photographiques",
    title: "Crédits photographiques",
    eyebrow: "Transparence éditoriale",
    intro:
      "Les photographies utilisées sur le site sont des photographies d’illustration sous licence libre. Elles ne représentent pas nécessairement des activités de CLEDUCA-ODJ et ne constituent pas des portraits de bénéficiaires de l’association.",
    sections: [
      {
        id: "photographies",
        title: "Photographies",
        body: `Les images sont issues de Wikimedia Commons et utilisées conformément à leurs licences respectives. Chaque titre renvoie à la page source, qui précise l’auteur, la licence et les conditions d’attribution :

- **[Dourtenga school](https://commons.wikimedia.org/wiki/File:Dourtenga_school.JPG)** — KKB, CC BY-SA 4.0. École primaire à Dourtenga, Burkina Faso.
- **[Speaking out: Peer educators advocate for an end to FGM/C](https://commons.wikimedia.org/wiki/File:Speaking_out-_Peer_educators_advocate_for_an_end_to_FGM-C_(12324137973).jpg)** — DFID, CC BY 2.0.
- **[Bobo-Dioulasso (12568251584)](https://commons.wikimedia.org/wiki/File:Bobo-Dioulasso_(12568251584).jpg)** — Maarten van der Bent, CC BY-SA 2.0.
- **[Centre d’alphabétisation de Sam](https://commons.wikimedia.org/wiki/File:Centre_d%27alphab%C3%A9tisation_de_Sam.jpg)** — Le Soleil dans la Main, CC BY-SA 4.0.
- **[Focus Groups National Network meetings IMG 4584](https://commons.wikimedia.org/wiki/File:Focus_Groups_National_Network_meetings_IMG_4584_(5348190395).jpg)** — IICD, CC BY 2.0.
- **[Shea nut processing in Burkina Faso](https://commons.wikimedia.org/wiki/File:Shea_nut_processing_in_Burkina_Faso.jpg)** — TREEAID, CC BY 2.0.
- **[Construction de diguettes par des femmes au Burkina Faso](https://commons.wikimedia.org/wiki/File:Construction_de_diguettes_par_des_femmes_au_Burkina_Faso.jpg)** — Hadepté, CC BY-SA 4.0.
- **[Teenage Footballers somewhere in Burkina Faso](https://commons.wikimedia.org/wiki/File:Teenage_Footballers_somewhere_in_Burkina_Faso.jpg)** — Elodie Ouelo, CC BY-SA 4.0.
- **[Gando school garden](https://commons.wikimedia.org/wiki/File:Gando_school_garden.jpg)** — Kéré Architecture, CC BY-SA 3.0.
- **[Un puits au Burkina Faso](https://commons.wikimedia.org/wiki/File:Un_puits_au_Burkina_Faso.jpg)** — Moorelangue, CC0.
- **[Journaliste radio](https://commons.wikimedia.org/wiki/File:Journaliste_radio.jpg)** — BuduMC, CC BY-SA 4.0.
- **[Vendeuse d’arachides](https://commons.wikimedia.org/wiki/File:Vendeuse_d%27arachides.jpg)** — Roman Bonnefoy (Romanceor), CC BY-SA 3.0.
- **[Traditional food market in Logobou, Burkina Faso](https://commons.wikimedia.org/wiki/File:Traditional_food_market_in_Logobou,_Burkina_Faso.jpg)** — Ye Shan, CC BY-SA 4.0.

Les images ont uniquement été redimensionnées et recompressées pour le web ; leur cadrage d’origine est conservé. Les textes complets des licences sont consultables sur le site de [Creative Commons](https://creativecommons.org/licenses/), et le fichier CREDITS.md du dépôt du site récapitule ces attributions ainsi que les usages correspondants.`,
      },
      {
        id: "logo",
        title: "Logo et identité visuelle",
        body: `Le logo de CLEDUCA-ODJ est utilisé tel qu’il a été fourni par l’association, sans redessin ni déformation. Toute adaptation ou déclinaison doit faire l’objet d’une autorisation préalable.`,
      },
      {
        id: "consentement",
        title: "Consentement et dignité",
        body: `Les photographies de bénéficiaires, de témoignages et de situations identifiantes ne doivent être publiées qu’après obtention d’un consentement éclairé et dans le respect des règles de protection des personnes vulnérables.

Les images actuellement utilisées sont des photographies documentaires publiées sous licence libre par des tiers. Si une personne représentée souhaite le retrait d’une image, l’association examinera la demande avec attention.`,
      },
    ],
    status: "published",
    createdAt: T,
    updatedAt: T,
  },
];
