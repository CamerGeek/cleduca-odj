import type { MediaAsset } from "@/lib/content/types";

const T = "2026-11-17T00:00:00.000Z";

const source = (fileName: string, alt: string): MediaAsset => ({
  id: `media-${fileName.replace(/\.[a-z]+$/, "")}`,
  fileName,
  url: `/images/${fileName}`,
  mimeType: "image/jpeg",
  size: 0,
  alt,
  createdAt: T,
});

export const seedMedia: MediaAsset[] = [
  source(
    "community-gathering.jpg",
    "Séance de sensibilisation communautaire en plein air au Burkina Faso, animée par une femme devant un groupe de participants.",
  ),
  source(
    "hero-classroom.jpg",
    "Élèves dans une salle de classe au Burkina Faso, devant un tableau noir couvert d’inscriptions.",
  ),
  source(
    "literacy-class.jpg",
    "Bâtiment d’un centre d’alphabétisation en briques avec une toiture et des portes vertes, au Burkina Faso.",
  ),
  source(
    "digital-training.jpg",
    "Trois femmes devant un ordinateur lors d’une session de formation numérique au Burkina Faso.",
  ),
  source(
    "youth.jpg",
    "Jeunes footballeurs en tenue verte rassemblés sur un terrain au Burkina Faso.",
  ),
  source(
    "school-garden.jpg",
    "Élève arrosant un jardin scolaire dans une communauté rurale du Burkina Faso.",
  ),
  source(
    "women-cooperative.jpg",
    "Femmes transformant des noix de karité dans un cadre coopératif au Burkina Faso.",
  ),
  source(
    "community-resilience.jpg",
    "Femmes construisant collectivement des diguettes anti-érosives dans un champ au Burkina Faso.",
  ),
  source(
    "about-bobo.jpg",
    "Vue d’une artère commerçante de Bobo-Dioulasso, Burkina Faso.",
  ),
  source(
    "community-radio.jpg",
    "Journaliste dans un studio de radio communautaire au Burkina Faso.",
  ),
  source(
    "water-community.jpg",
    "Femmes et enfants puisant de l’eau à un point d’eau communautaire au Burkina Faso.",
  ),
  source(
    "women-livelihoods.jpg",
    "Vendeuse d’arachides sur un marché au Burkina Faso.",
  ),
  source(
    "local-market.jpg",
    "Marché alimentaire traditionnel animé au Burkina Faso.",
  ),
];
