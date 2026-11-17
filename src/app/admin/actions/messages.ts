"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import { logAdminActivity } from "@/lib/admin/activity";
import { MESSAGE_STATUS_LABELS, type MessageStatus } from "@/lib/content/types";

const statusKeys = Object.keys(MESSAGE_STATUS_LABELS);

export async function updateMessageStatusAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin/connexion");
  if (!can(session.role, "communication:manage")) {
    redirect("/admin/acces-refuse");
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !statusKeys.includes(status)) {
    redirect("/admin/messages?erreur=parametres");
  }

  const repository = await getRepository();
  try {
    await repository.updateMessage(id, { status: status as MessageStatus });
  } catch {
    redirect("/admin/messages?erreur=mise-a-jour");
  }

  await logAdminActivity(
    session,
    "Mise à jour",
    "messages",
    id,
    `Statut du message passé à « ${MESSAGE_STATUS_LABELS[status as MessageStatus]} ».`,
  );

  revalidatePath("/admin/messages");
  redirect(`/admin/messages?statut=${status}`);
}

export async function deleteMessageAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin/connexion");
  if (!can(session.role, "content:delete")) {
    redirect("/admin/acces-refuse");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/messages?erreur=introuvable");

  const repository = await getRepository();
  try {
    await repository.deleteMessage(id);
  } catch {
    redirect("/admin/messages?erreur=suppression");
  }

  await logAdminActivity(
    session,
    "Suppression",
    "messages",
    id,
    "Message de contact supprimé.",
  );

  revalidatePath("/admin/messages");
  redirect("/admin/messages?statut=supprime");
}
