"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { logAdminActivity } from "@/lib/admin/activity";
import { getSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import { ROLE_LABELS, type Role } from "@/lib/content/types";
import {
  createSupabaseAdminClient,
  hasServiceRole,
  hasSupabaseConfig,
} from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/utils";

const roleKeys = Object.keys(ROLE_LABELS) as Role[];

function isRole(value: string): value is Role {
  return roleKeys.includes(value as Role);
}

export async function updateUserAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/admin/connexion");
  if (!can(session.role, "users:manage")) redirect("/admin/acces-refuse");

  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const isActive = formData.get("isActive") === "on";

  if (!id || !isRole(role)) {
    redirect("/admin/utilisateurs?erreur=parametres");
  }

  if (id === session.userId && (role !== session.role || !isActive)) {
    redirect("/admin/utilisateurs?erreur=propre-compte");
  }

  const repository = await getRepository();
  const users = await repository.listUsers();
  const target = users.find((user) => user.id === id);
  if (!target) redirect("/admin/utilisateurs?erreur=introuvable");

  const removesSuperAdmin =
    target.role === "super_admin" && (role !== "super_admin" || !isActive);
  const remainingSuperAdmins = users.filter(
    (user) =>
      user.id !== id && user.role === "super_admin" && user.isActive,
  ).length;

  if (removesSuperAdmin && remainingSuperAdmins === 0) {
    redirect("/admin/utilisateurs?erreur=dernier-super-admin");
  }

  try {
    await repository.updateUser(id, {
      role,
      isActive,
      fullName: fullName || target.fullName,
    });
  } catch {
    redirect("/admin/utilisateurs?erreur=mise-a-jour");
  }

  await logAdminActivity(
    session,
    "Modification",
    "users",
    id,
    `Compte « ${target.email} » mis à jour (rôle : ${ROLE_LABELS[role]}, ${
      isActive ? "actif" : "désactivé"
    }).`,
  );

  revalidatePath("/admin/utilisateurs");
  redirect("/admin/utilisateurs?statut=maj");
}

const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide."),
  fullName: z.string().trim().min(2, "Nom requis.").max(120),
  role: z.enum(roleKeys as [Role, ...Role[]]),
});

export async function inviteUserAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/admin/connexion");
  if (!can(session.role, "users:manage")) redirect("/admin/acces-refuse");

  if (!hasSupabaseConfig() || !hasServiceRole()) {
    redirect("/admin/utilisateurs?erreur=mode-local");
  }

  const parsed = inviteSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    redirect("/admin/utilisateurs?erreur=invitation-invalide");
  }

  const { email, fullName, role } = parsed.data;
  const client = createSupabaseAdminClient();

  const { data, error } = await client.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName, role },
    redirectTo: `${getSiteUrl()}/admin/connexion`,
  });

  if (error) {
    redirect("/admin/utilisateurs?erreur=invitation");
  }

  if (data?.user?.id) {
    await client.from("users").upsert(
      {
        id: data.user.id,
        email,
        full_name: fullName,
        role,
        is_active: true,
      },
      { onConflict: "id" },
    );
  }

  await logAdminActivity(
    session,
    "Invitation",
    "users",
    data?.user?.id ?? email,
    `Invitation envoyée à « ${email} » avec le rôle ${ROLE_LABELS[role]}.`,
  );

  revalidatePath("/admin/utilisateurs");
  redirect("/admin/utilisateurs?statut=invitation");
}
