import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/manrope";
import "@fontsource-variable/inter";
import "./globals.css";

import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/lib/utils";

const siteUrl = getSiteUrl();
const description =
  "CLEDUCA-ODJ est une organisation de la société civile burkinabè, créée en 1997 à Bobo-Dioulasso. Éducation, autonomisation des jeunes, inclusion, justice de proximité et développement communautaire.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteConfig.name,
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description,
  keywords: [
    "CLEDUCA-ODJ",
    "Burkina Faso",
    "Bobo-Dioulasso",
    "ONG",
    "société civile",
    "éducation",
    "jeunesse",
    "inclusion",
    "justice de proximité",
    "développement communautaire",
  ],
  authors: [{ name: siteConfig.fullName }],
  creator: siteConfig.fullName,
  publisher: siteConfig.fullName,
  category: "Nonprofit",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description,
    images: [
      {
        url: "/images/community-gathering.jpg",
        width: 1200,
        height: 800,
        alt: "Séance de dialogue communautaire au Burkina Faso.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description,
    images: ["/images/community-gathering.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: siteConfig.logoPath, type: "image/png" }],
    apple: [{ url: siteConfig.logoPath }],
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#176B45",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-paper antialiased">{children}</body>
    </html>
  );
}
