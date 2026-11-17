"use server";

import { z } from "zod";

import { getRepository } from "@/lib/content";
import type { InquiryType } from "@/lib/content/types";
import { getClientIp, hashIp, rateLimit } from "@/lib/security";

export interface ContactState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
}

const inquiryTypes = [
  "partenariat",
  "benevolat",
  "collaboration",
  "information",
  "presse",
  "autre",
] as const satisfies readonly InquiryType[];

const schema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Veuillez indiquer votre nom.")
    .max(120, "Le nom est trop long."),
  email: z
    .string()
    .trim()
    .min(5, "Veuillez saisir une adresse e-mail valide.")
    .max(254, "L’adresse e-mail est trop longue.")
    .email("Veuillez saisir une adresse e-mail valide."),
  organization: z
    .string()
    .trim()
    .max(160, "Le nom de l’organisation est trop long.")
    .optional()
    .default(""),
  inquiryType: z.enum(inquiryTypes, {
    message: "Veuillez choisir un motif de contact.",
  }),
  message: z
    .string()
    .trim()
    .min(20, "Votre message doit contenir au moins 20 caractères.")
    .max(4000, "Votre message ne doit pas dépasser 4 000 caractères."),
  consent: z
    .union([z.literal("on"), z.literal("true"), z.literal("1")])
    .refine(Boolean, "Votre consentement est nécessaire pour envoyer ce message."),
  website: z.string().max(0, "").optional().default(""),
});

export async function contactAction(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    fullName: formData.get("fullName")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    organization: formData.get("organization")?.toString() ?? "",
    inquiryType: formData.get("inquiryType")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    consent: formData.get("consent")?.toString() ?? "",
    website: formData.get("website")?.toString() ?? "",
  };

  if (raw.website) {
    return {
      status: "success",
      message:
        "Merci. Votre message a bien été transmis à l’équipe de CLEDUCA-ODJ.",
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
  const limited = rateLimit(`contact:${ip}`, 4, 10 * 60 * 1000);
  if (!limited.allowed) {
    return {
      status: "error",
      message:
        "Trop de messages envoyés récemment. Veuillez réessayer dans quelques minutes.",
    };
  }

  try {
    const repository = await getRepository();
    await repository.addMessage({
      fullName: parsed.data.fullName,
      email: parsed.data.email.toLowerCase(),
      organization: parsed.data.organization,
      inquiryType: parsed.data.inquiryType,
      message: parsed.data.message,
      status: "new",
      consent: true,
      ipHash: hashIp(ip),
    });
    return {
      status: "success",
      message:
        "Merci. Votre message a bien été transmis à l’équipe de CLEDUCA-ODJ. Les coordonnées officielles de contact seront publiées après validation par l’association ; le formulaire reste le canal recommandé.",
    };
  } catch (error) {
    console.error("Contact message failed", error);
    return {
      status: "error",
      message:
        "Votre message n’a pas pu être enregistré pour le moment. Veuillez réessayer ultérieurement.",
    };
  }
}
