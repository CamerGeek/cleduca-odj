import type { Metadata } from "next";

const BRAND = "CLEDUCA-ODJ";
const DEFAULT_IMAGE = {
  url: "/images/community-gathering.jpg",
  width: 1200,
  height: 800,
  alt: "Séance de dialogue communautaire au Burkina Faso.",
};

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: { url: string; alt: string };
}

/**
 * Métadonnées complètes d’une page : sans Open Graph explicite, Next réutilise
 * celui de la racine et tous les partages WhatsApp/Facebook afficheraient
 * l’accueil.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: PageMetadataOptions): Metadata {
  const socialTitle = `${title} | ${BRAND}`;
  const ogImage = image ?? DEFAULT_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: BRAND,
      title: socialTitle,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage.url],
    },
  };
}
