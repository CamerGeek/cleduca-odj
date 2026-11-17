"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { logAdminActivity } from "@/lib/admin/activity";
import { getSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import type { SiteSettings } from "@/lib/content/types";
import { isValidHttpUrl } from "@/lib/security";

export interface SettingsActionState {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Record<string, string>;
}

const optionalEmail = z
  .string()
  .trim()
  .max(254, "Adresse trop longue.")
  .refine(
    (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Adresse e-mail invalide.",
  );

const optionalUrl = z
  .string()
  .trim()
  .max(500, "URL trop longue.")
  .refine(
    (value) => !value || isValidHttpUrl(value),
    "Indiquez une URL complète commençant par https://.",
  );

const optionalPath = z
  .string()
  .trim()
  .max(300, "Chemin trop long.")
  .refine(
    (value) => !value || value.startsWith("/") || isValidHttpUrl(value),
    "Indiquez un chemin interne (/…) ou une URL complète.",
  );

const settingsSchema = z.object({
  siteName: z.string().trim().min(2, "Nom requis.").max(80),
  fullName: z.string().trim().min(2, "Nom complet requis.").max(200),
  tagline: z.string().trim().min(2, "Accroche requise.").max(200),
  positioning: z.string().trim().max(600),
  foundedYear: z.coerce
    .number()
    .int()
    .min(1900, "Année invalide.")
    .max(2100, "Année invalide."),
  city: z.string().trim().max(80),
  region: z.string().trim().max(80),
  country: z.string().trim().max(80),
  contactEmail: optionalEmail,
  contactPhone: z.string().trim().max(40),
  contactAddress: z.string().trim().max(300),
  contactHours: z.string().trim().max(160),
  facebook: optionalUrl,
  instagram: optionalUrl,
  linkedin: optionalUrl,
  youtube: optionalUrl,
  whatsapp: optionalUrl,
  heroEyebrow: z.string().trim().max(160),
  heroTitle: z.string().trim().min(2, "Titre requis.").max(200),
  heroSubtitle: z.string().trim().max(600),
  heroPrimaryLabel: z.string().trim().max(80),
  heroPrimaryHref: optionalPath,
  heroSecondaryLabel: z.string().trim().max(80),
  heroSecondaryHref: optionalPath,
  heroImage: z
    .string()
    .trim()
    .min(1, "Image d’accueil requise.")
    .max(300, "Chemin trop long.")
    .refine(
      (value) => value.startsWith("/") || isValidHttpUrl(value),
      "Indiquez un chemin interne (/…) ou une URL complète.",
    ),
  heroImageAlt: z
    .string()
    .trim()
    .min(10, "Texte alternatif requis (10 caractères minimum).")
    .max(300),
  heroCaption: z.string().trim().max(300),
  newsletterTitle: z.string().trim().max(160),
  newsletterDescription: z.string().trim().max(400),
  newsletterConsentLabel: z.string().trim().max(400),
  footerNote: z.string().trim().max(400),
});

export async function saveSettingsAction(
  _previous: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const session = await getSession();
  if (!session) {
    return {
      status: "error",
      message: "Votre session a expiré. Reconnectez-vous.",
    };
  }
  if (!can(session.role, "settings:manage")) {
    return {
      status: "error",
      message: "Votre rôle ne permet pas de modifier les paramètres.",
    };
  }

  const raw = Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [
      key,
      typeof value === "string" ? value : "",
    ]),
  );

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Corrigez les champs signalés.",
      fieldErrors,
    };
  }

  const data = parsed.data;
  const repository = await getRepository();
  const current = await repository.getSettings();

  const settings: SiteSettings = {
    ...current,
    siteName: data.siteName,
    fullName: data.fullName,
    tagline: data.tagline,
    positioning: data.positioning,
    foundedYear: data.foundedYear,
    city: data.city,
    region: data.region,
    country: data.country,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    contactAddress: data.contactAddress,
    contactHours: data.contactHours,
    socialLinks: {
      facebook: data.facebook,
      instagram: data.instagram,
      linkedin: data.linkedin,
      youtube: data.youtube,
      whatsapp: data.whatsapp,
    },
    hero: {
      eyebrow: data.heroEyebrow,
      title: data.heroTitle,
      subtitle: data.heroSubtitle,
      primaryLabel: data.heroPrimaryLabel,
      primaryHref: data.heroPrimaryHref || "/a-propos",
      secondaryLabel: data.heroSecondaryLabel,
      secondaryHref: data.heroSecondaryHref || "/projets",
      image: data.heroImage,
      imageAlt: data.heroImageAlt,
      caption: data.heroCaption,
    },
    newsletter: {
      title: data.newsletterTitle,
      description: data.newsletterDescription,
      consentLabel: data.newsletterConsentLabel,
    },
    footerNote: data.footerNote,
  };

  try {
    await repository.updateSettings(settings);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? `Enregistrement impossible : ${error.message}`
          : "Enregistrement impossible.",
    };
  }

  await logAdminActivity(
    session,
    "Modification",
    "site_settings",
    "1",
    "Paramètres institutionnels du site mis à jour.",
  );

  revalidatePath("/", "layout");
  redirect("/admin/parametres?statut=enregistre");
}
