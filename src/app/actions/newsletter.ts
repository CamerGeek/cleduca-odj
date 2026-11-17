"use server";

import { z } from "zod";

import { getRepository } from "@/lib/content";
import { getClientIp, rateLimit } from "@/lib/security";

export interface NewsletterState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
}

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(5, "Veuillez saisir une adresse e-mail valide.")
    .max(254, "L’adresse e-mail est trop longue.")
    .email("Veuillez saisir une adresse e-mail valide."),
  name: z.string().trim().max(120, "Le nom est trop long.").optional().default(""),
  consent: z
    .union([z.literal("on"), z.literal("true"), z.literal("1")])
    .refine(Boolean, "Votre consentement est nécessaire pour l’inscription."),
  website: z.string().max(0, "").optional().default(""),
  source: z.string().trim().max(60).optional().default("site"),
});

export async function subscribeAction(
  _previous: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const raw = {
    email: formData.get("email")?.toString() ?? "",
    name: formData.get("name")?.toString() ?? "",
    consent: formData.get("consent")?.toString() ?? "",
    website: formData.get("website")?.toString() ?? "",
    source: formData.get("source")?.toString() ?? "site",
  };

  if (raw.website) {
    return {
      status: "success",
      message: "Merci, votre inscription a bien été prise en compte.",
    };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() || "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Veuillez vérifier les informations saisies.",
      fieldErrors,
    };
  }

  const ip = await getClientIp();
  const limited = rateLimit(`newsletter:${ip}`, 5, 10 * 60 * 1000);
  if (!limited.allowed) {
    return {
      status: "error",
      message:
        "Trop de tentatives d’inscription. Veuillez réessayer dans quelques minutes.",
    };
  }

  try {
    const repository = await getRepository();
    const result = await repository.addSubscriber({
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name,
      source: parsed.data.source || "site",
      consentedAt: new Date().toISOString(),
    });
    return {
      status: "success",
      message: result.created
        ? "Merci. Votre inscription à la lettre d’information est enregistrée."
        : "Cette adresse est déjà inscrite à la lettre d’information.",
    };
  } catch (error) {
    console.error("Newsletter subscription failed", error);
    return {
      status: "error",
      message:
        "L’inscription n’a pas pu être enregistrée pour le moment. Veuillez réessayer ultérieurement.",
    };
  }
}
