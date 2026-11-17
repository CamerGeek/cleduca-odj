"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import type {
  CollectionKey,
  CollectionMap,
  ContentStatus,
  GalleryItem,
  PageSection,
  ProjectDocument,
} from "@/lib/content/types";
import { CONTENT_STATUS_LABELS } from "@/lib/content/types";
import { isValidHttpUrl } from "@/lib/security";
import { slugify } from "@/lib/utils";
import {
  getAdminCollection,
  type AdminField,
} from "@/lib/admin/collections";
import { logAdminActivity } from "@/lib/admin/activity";

export interface CollectionActionState {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Record<string, string>;
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const statusKeys = Object.keys(CONTENT_STATUS_LABELS);

function asString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function parseStringArray(raw: string, separator: "comma" | "lines") {
  return raw
    .split(separator === "comma" ? "," : /\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry, index, list) => list.indexOf(entry) === index);
}

function parseJsonArray(raw: string) {
  if (!raw.trim()) return [];
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("Format invalide");
  return parsed;
}

function parseGallery(raw: string): GalleryItem[] {
  return parseJsonArray(raw)
    .map((entry) => {
      const record = (entry ?? {}) as Record<string, unknown>;
      return {
        url: String(record.url ?? "").trim(),
        alt: String(record.alt ?? "").trim(),
        caption: String(record.caption ?? "").trim(),
      };
    })
    .filter((item) => item.url);
}

function parseDocuments(raw: string): ProjectDocument[] {
  return parseJsonArray(raw)
    .map((entry) => {
      const record = (entry ?? {}) as Record<string, unknown>;
      return {
        title: String(record.title ?? "").trim(),
        url: String(record.url ?? "").trim(),
      };
    })
    .filter((item) => item.title || item.url);
}

function parseSections(raw: string): PageSection[] {
  const seen = new Set<string>();
  return parseJsonArray(raw)
    .map((entry, index) => {
      const record = (entry ?? {}) as Record<string, unknown>;
      const title = String(record.title ?? "").trim();
      const body = String(record.body ?? "").trim();
      let id =
        slugify(String(record.id ?? "")) ||
        slugify(title) ||
        `section-${index + 1}`;
      while (seen.has(id)) id = `${id}-${index + 1}`;
      seen.add(id);
      return { id, title, body };
    })
    .filter((section) => section.title || section.body);
}

function isEmpty(value: unknown) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function readField(field: AdminField, formData: FormData) {
  const raw = asString(formData, field.name);

  switch (field.type) {
    case "number": {
      if (!raw) return { value: null };
      const numeric = Number(raw.replace(",", "."));
      if (!Number.isFinite(numeric)) {
        return { value: null, error: "Saisissez un nombre valide." };
      }
      return { value: numeric };
    }
    case "boolean":
      return { value: formData.get(field.name) === "on" };
    case "tags":
      return { value: parseStringArray(raw, "comma") };
    case "lines":
      return { value: parseStringArray(raw, "lines") };
    case "checkboxes":
      return {
        value: formData.getAll(field.name).map((entry) => String(entry)),
      };
    case "date": {
      if (!raw) return { value: "" };
      if (!datePattern.test(raw)) {
        return { value: raw, error: "Utilisez une date au format AAAA-MM-JJ." };
      }
      return { value: raw };
    }
    case "datetime": {
      if (!raw) return { value: "" };
      const date = new Date(raw);
      if (Number.isNaN(date.getTime())) {
        return { value: "", error: "Date et heure invalides." };
      }
      return { value: date.toISOString() };
    }
    case "gallery": {
      try {
        return { value: parseGallery(raw) };
      } catch {
        return { value: [], error: "La galerie contient des données invalides." };
      }
    }
    case "documents": {
      try {
        return { value: parseDocuments(raw) };
      } catch {
        return {
          value: [],
          error: "La liste des documents contient des données invalides.",
        };
      }
    }
    case "sections": {
      try {
        return { value: parseSections(raw) };
      } catch {
        return {
          value: [],
          error: "Les sections contiennent des données invalides.",
        };
      }
    }
    case "select": {
      if (field.options && raw && !field.options.some((o) => o.value === raw)) {
        return { value: field.options[0]?.value ?? "", error: "Valeur invalide." };
      }
      return { value: raw || field.options?.[0]?.value || "" };
    }
    default:
      return { value: raw };
  }
}

export async function saveCollectionItem(
  _previous: CollectionActionState,
  formData: FormData,
): Promise<CollectionActionState> {
  const session = await getSession();
  if (!session) {
    return {
      status: "error",
      message: "Votre session a expiré. Reconnectez-vous pour continuer.",
    };
  }

  const collection = String(formData.get("__collection") ?? "");
  const id = String(formData.get("__id") ?? "");
  const config = getAdminCollection(collection);

  if (!config) {
    return { status: "error", message: "Collection inconnue." };
  }

  if (!can(session.role, config.permission)) {
    return {
      status: "error",
      message: "Votre rôle ne permet pas de modifier cette collection.",
    };
  }

  const values: Record<string, unknown> = {};
  const fieldErrors: Record<string, string> = {};

  for (const field of config.fields) {
    const result = readField(field, formData);

    if (field.type === "slug") {
      let value = String(result.value ?? "").toLowerCase();
      if (!value) {
        value = slugify(asString(formData, config.titleField));
      }
      values[field.name] = value;
      if (!value) {
        fieldErrors[field.name] = "Une adresse est requise.";
      } else if (!slugPattern.test(value)) {
        fieldErrors[field.name] =
          "Utilisez uniquement des minuscules, chiffres et tirets.";
      }
      continue;
    }

    if (result.error) {
      fieldErrors[field.name] = result.error;
      values[field.name] = result.value;
      continue;
    }

    if (field.required && isEmpty(result.value)) {
      fieldErrors[field.name] = "Ce champ est requis.";
    }

    if (
      (field.type === "url" || field.type === "image") &&
      typeof result.value === "string" &&
      result.value
    ) {
      const value = result.value;
      const allowed =
        value.startsWith("/") ||
        value.startsWith("mailto:") ||
        isValidHttpUrl(value);
      if (!allowed) {
        fieldErrors[field.name] =
          "Indiquez une URL complète (https://…) ou un chemin interne (/…).";
      }
    }

    values[field.name] = result.value;
  }

  const now = new Date().toISOString();
  const repository = await getRepository();
  let existing: CollectionMap[CollectionKey] | null = null;

  if (id) {
    existing = await repository.getById(config.key, id, {
      includeUnpublished: true,
      includeDeleted: true,
    });
    if (!existing) {
      return { status: "error", message: "Cet élément est introuvable." };
    }
  }

  const canPublish = can(session.role, "content:publish");
  const previous = existing as unknown as Record<string, unknown> | null;
  let contentStatus: ContentStatus = "draft";

  if (!canPublish) {
    if (config.statusMode === "content") {
      const previousStatus = previous?.contentStatus;
      contentStatus =
        typeof previousStatus === "string" && previousStatus !== "archived"
          ? (previousStatus as ContentStatus)
          : "draft";
      values.contentStatus = contentStatus;
    } else if (config.statusMode === "publication") {
      const previousStatus = previous?.status;
      contentStatus =
        typeof previousStatus === "string"
          ? (previousStatus as ContentStatus)
          : "draft";
      values.status = contentStatus;
    } else {
      const published = previous?.published === true;
      contentStatus = published ? "published" : "draft";
      values.published = published;
    }
  } else if (config.statusMode === "content") {
    const requested = String(formData.get("contentStatus") ?? "draft");
    contentStatus = statusKeys.includes(requested)
      ? (requested as ContentStatus)
      : "draft";
    values.contentStatus = contentStatus;
  } else if (config.statusMode === "publication") {
    const requested = String(formData.get("status") ?? "draft");
    contentStatus = statusKeys.includes(requested)
      ? (requested as ContentStatus)
      : "draft";
    values.status = contentStatus;
  } else {
    const published = formData.get("published") === "on";
    contentStatus = published ? "published" : "draft";
    values.published = published;
  }

  const isPublished = contentStatus === "published";

  if (
    isPublished &&
    config.key === "partners" &&
    !String(values.authorizationNote ?? "").trim()
  ) {
    fieldErrors.authorizationNote =
      "Renseignez la référence de l’autorisation avant de publier ce partenaire.";
  }

  if (
    isPublished &&
    config.key === "testimonials" &&
    values.consentOnFile !== true
  ) {
    fieldErrors.consentOnFile =
      "Le consentement documenté est obligatoire avant toute publication.";
  }

  if (
    (config.key === "articles" || config.key === "publications") &&
    isPublished &&
    !String(values.publishedAt ?? "").trim()
  ) {
    values.publishedAt = now;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Corrigez les champs signalés avant d’enregistrer.",
      fieldErrors,
    };
  }

  const item = {
    ...(existing ?? config.defaults),
    ...values,
    ...(existing
      ? {}
      : { id: "", createdAt: now }),
    updatedAt: now,
  } as unknown as CollectionMap[CollectionKey];

  try {
    await repository.upsert(config.key, item);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Enregistrement impossible.";
    if (/slug|adresse/i.test(message)) {
      return {
        status: "error",
        message,
        fieldErrors: { slug: message },
      };
    }
    return { status: "error", message };
  }

  const label =
    String(values[config.titleField] ?? "").slice(0, 120) || config.singular;

  await logAdminActivity(
    session,
    id ? "Modification" : "Création",
    config.key,
    String((item as { id?: string }).id ?? ""),
    `${config.singular} « ${label} » ${id ? "modifié" : "créé"}.`,
  );

  revalidatePath("/", "layout");
  redirect(`/admin/contenus/${config.key}?statut=enregistre`);
}

export async function deleteCollectionItem(
  _previous: CollectionActionState,
  formData: FormData,
): Promise<CollectionActionState> {
  const session = await getSession();
  if (!session) {
    return {
      status: "error",
      message: "Votre session a expiré. Reconnectez-vous.",
    };
  }

  const collection = String(formData.get("__collection") ?? "");
  const id = String(formData.get("__id") ?? "");
  const config = getAdminCollection(collection);

  if (!config || !id) {
    return { status: "error", message: "Élément introuvable." };
  }

  if (!can(session.role, "content:delete")) {
    return {
      status: "error",
      message: "Votre rôle ne permet pas de supprimer du contenu.",
    };
  }

  const repository = await getRepository();
  const existing = await repository.getById(config.key, id, {
    includeUnpublished: true,
  });

  try {
    await repository.remove(config.key, id);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Suppression impossible.",
    };
  }

  await logAdminActivity(
    session,
    "Suppression",
    config.key,
    id,
    `${config.singular} « ${
      existing
        ? String(
            (existing as unknown as Record<string, unknown>)[config.titleField] ??
              id,
          )
        : id
    } » supprimé.`,
  );

  revalidatePath("/", "layout");
  redirect(`/admin/contenus/${config.key}?statut=supprime`);
}
