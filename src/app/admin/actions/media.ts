"use server";

import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { logAdminActivity } from "@/lib/admin/activity";
import { getSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import type { MediaAsset } from "@/lib/content/types";
import {
  createSupabaseAdminClient,
  hasServiceRole,
} from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export interface MediaActionState {
  status: "idle" | "error" | "success";
  message: string;
}

const MAX_BYTES = 5 * 1024 * 1024;

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

const uploadDir = path.join(process.cwd(), ".data", "uploads");

export async function uploadMediaAction(
  _previous: MediaActionState,
  formData: FormData,
): Promise<MediaActionState> {
  const session = await getSession();
  if (!session) {
    return { status: "error", message: "Votre session a expiré. Reconnectez-vous." };
  }
  if (!can(session.role, "media:write")) {
    return {
      status: "error",
      message: "Votre rôle ne permet pas d’ajouter des médias.",
    };
  }

  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "").trim();

  if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
    return { status: "error", message: "Sélectionnez un fichier image." };
  }

  const upload = file as File;
  const extension = allowedTypes[upload.type];
  if (!extension) {
    return {
      status: "error",
      message: "Format non pris en charge. Utilisez JPEG, PNG, WebP, AVIF ou GIF.",
    };
  }
  if (upload.size > MAX_BYTES) {
    return {
      status: "error",
      message: "Le fichier dépasse la taille maximale de 5 Mo.",
    };
  }
  if (alt.length < 5) {
    return {
      status: "error",
      message:
        "Renseignez un texte alternatif descriptif (au moins 5 caractères) pour l’accessibilité.",
    };
  }

  const baseName =
    slugify(upload.name.replace(/\.[^.]+$/, "")) || "image";
  const fileName = `${baseName}.${extension}`;
  const buffer = Buffer.from(await upload.arrayBuffer());
  const repository = await getRepository();

  let url = "";
  let storagePath = "";

  try {
    if (repository.mode === "supabase") {
      if (!hasServiceRole()) {
        return {
          status: "error",
          message:
            "La clé de service Supabase est requise pour téléverser un fichier dans le stockage.",
        };
      }
      storagePath = `${randomUUID()}.${extension}`;
      const client = createSupabaseAdminClient();
      const { error } = await client.storage
        .from("media")
        .upload(storagePath, buffer, {
          contentType: upload.type,
          cacheControl: "31536000",
          upsert: false,
        });
      if (error) {
        return {
          status: "error",
          message: `Téléversement impossible : ${error.message}`,
        };
      }
      const { data } = client.storage.from("media").getPublicUrl(storagePath);
      url = data.publicUrl;
    } else {
      await fs.mkdir(uploadDir, { recursive: true });
      storagePath = `${randomUUID()}-${fileName}`;
      await fs.writeFile(path.join(uploadDir, storagePath), buffer);
      url = `/api/uploads/${storagePath}`;
    }
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? `Téléversement impossible : ${error.message}`
          : "Téléversement impossible.",
    };
  }

  const asset: MediaAsset = {
    id: "",
    fileName,
    url,
    mimeType: upload.type,
    size: upload.size,
    alt,
    createdAt: new Date().toISOString(),
  };

  try {
    await repository.upsert("media", asset);
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
    "Ajout",
    "media",
    storagePath,
    `Média « ${fileName} » ajouté à la médiathèque.`,
  );

  revalidatePath("/admin/mediatheque");
  redirect("/admin/mediatheque?statut=ajoute");
}

function isSeedAsset(asset: MediaAsset) {
  return asset.url.startsWith("/images/");
}

function localFileName(url: string) {
  if (!url.startsWith("/api/uploads/")) return null;
  const name = url.slice("/api/uploads/".length);
  if (!name || name.includes("/") || name.includes("\\") || name.includes("..")) {
    return null;
  }
  return name;
}

export async function deleteMediaAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/admin/connexion");
  if (!can(session.role, "media:write")) {
    redirect("/admin/acces-refuse");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/mediatheque?erreur=introuvable");

  const repository = await getRepository();
  const asset = await repository.getById("media", id, {
    includeUnpublished: true,
  });
  if (!asset) redirect("/admin/mediatheque?erreur=introuvable");

  if (isSeedAsset(asset)) {
    redirect("/admin/mediatheque?erreur=protege");
  }

  try {
    if (repository.mode === "supabase") {
      const marker = "/storage/v1/object/public/media/";
      const index = asset.url.indexOf(marker);
      if (index >= 0 && hasServiceRole()) {
        const storagePath = decodeURIComponent(
          asset.url.slice(index + marker.length),
        );
        await createSupabaseAdminClient()
          .storage.from("media")
          .remove([storagePath]);
      }
    } else {
      const name = localFileName(asset.url);
      if (name) {
        await fs
          .unlink(path.join(uploadDir, name))
          .catch(() => undefined);
      }
    }
    await repository.remove("media", id);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Suppression impossible.";
    console.error("Media deletion failed:", message);
    redirect("/admin/mediatheque?erreur=suppression");
  }

  await logAdminActivity(
    session,
    "Suppression",
    "media",
    id,
    `Média « ${asset.fileName} » supprimé de la médiathèque.`,
  );

  revalidatePath("/admin/mediatheque");
  redirect("/admin/mediatheque?statut=supprime");
}
