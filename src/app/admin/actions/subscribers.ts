"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import { logAdminActivity } from "@/lib/admin/activity";
import {
  SUBSCRIBER_STATUS_LABELS,
  type SubscriberStatus,
} from "@/lib/content/types";

const subscriberStatuses: SubscriberStatus[] = [
  "pending",
  "confirmed",
  "unsubscribed",
];

export async function updateSubscriberStatusAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin/connexion");
  if (!can(session.role, "communication:manage")) {
    redirect("/admin/acces-refuse");
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !subscriberStatuses.includes(status as SubscriberStatus)) {
    redirect("/admin/abonnes?erreur=parametres");
  }

  const repository = await getRepository();
  try {
    await repository.updateSubscriber(id, {
      status: status as SubscriberStatus,
    });
  } catch {
    redirect("/admin/abonnes?erreur=mise-a-jour");
  }

  await logAdminActivity(
    session,
    "Mise à jour",
    "newsletter_subscribers",
    id,
    `Abonné passé au statut « ${
      SUBSCRIBER_STATUS_LABELS[status as SubscriberStatus]
    } ».`,
  );

  revalidatePath("/admin/abonnes");
  redirect("/admin/abonnes?statut=maj");
}

export async function deleteSubscriberAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin/connexion");
  if (!can(session.role, "content:delete")) {
    redirect("/admin/acces-refuse");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/abonnes?erreur=introuvable");

  const repository = await getRepository();
  try {
    await repository.deleteSubscriber(id);
  } catch {
    redirect("/admin/abonnes?erreur=suppression");
  }

  await logAdminActivity(
    session,
    "Suppression",
    "newsletter_subscribers",
    id,
    "Abonné supprimé de la lettre d’information.",
  );

  revalidatePath("/admin/abonnes");
  redirect("/admin/abonnes?statut=supprime");
}
