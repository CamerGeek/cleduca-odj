"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  clearSessionCookie,
  createSessionToken,
  findAccountByEmail,
  getSession,
  isSessionConfigured,
  setSessionCookie,
} from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import {
  hasSupabaseConfig,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { getClientIp, rateLimit, safeCompare } from "@/lib/security";

export interface LoginState {
  status: "idle" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
}

const loginSchema = z.object({
  email: z.string().trim().min(5, "Adresse e-mail invalide.").max(254),
  password: z.string().min(1, "Mot de passe requis.").max(200),
  next: z.string().optional().default(""),
});

function safeNext(value: string) {
  if (value.startsWith("/admin") && !value.startsWith("//")) return value;
  return "/admin";
}

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Vérifiez les champs du formulaire.",
      fieldErrors,
    };
  }

  if (!isSessionConfigured()) {
    return {
      status: "error",
      message:
        "AUTH_SECRET n’est pas configuré sur le serveur. Contactez l’administrateur technique.",
    };
  }

  const ip = await getClientIp();
  const limit = rateLimit(`admin-login:${ip}`, 6, 10 * 60 * 1000);
  if (!limit.allowed) {
    return {
      status: "error",
      message:
        "Trop de tentatives de connexion. Réessayez dans quelques minutes.",
    };
  }

  const email = parsed.data.email.toLowerCase();
  const repository = await getRepository();

  let userId = "";
  let fullName = "";
  let role: "super_admin" | "admin" | "editor" | "contributor" | null = null;
  let mode: "local" | "supabase" = "local";

  if (hasSupabaseConfig()) {
    mode = "supabase";
    const client = await createSupabaseServerClient();
    const { error } = await client.auth.signInWithPassword({
      email,
      password: parsed.data.password,
    });
    if (error) {
      return {
        status: "error",
        message: "Identifiants invalides ou compte désactivé.",
      };
    }
    const account = await findAccountByEmail(email);
    if (!account || !account.isActive) {
      await client.auth.signOut();
      return {
        status: "error",
        message:
          "Ce compte n’est pas habilité à accéder à l’administration. Contactez un super administrateur.",
      };
    }
    userId = account.id;
    fullName = account.fullName || account.email;
    role = account.role;
  } else {
    const expectedEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD || "";

    if (!expectedEmail || !expectedPassword) {
      return {
        status: "error",
        message:
          "L’accès local n’est pas configuré. Renseignez ADMIN_EMAIL et ADMIN_PASSWORD dans les variables d’environnement.",
      };
    }

    const emailMatches = safeCompare(email, expectedEmail);
    const passwordMatches = safeCompare(
      parsed.data.password,
      expectedPassword,
    );

    if (!emailMatches || !passwordMatches) {
      return {
        status: "error",
        message: "Identifiants invalides.",
      };
    }

    const account = await findAccountByEmail(email);
    userId = account?.id || "local-admin";
    fullName = account?.fullName || "Administrateur local";
    role = account?.role || "super_admin";
  }

  if (!role) {
    return { status: "error", message: "Rôle introuvable pour ce compte." };
  }

  const token = createSessionToken({
    userId,
    email,
    fullName,
    role,
    mode,
  });

  await setSessionCookie(token);

  try {
    await repository.logActivity({
      actorEmail: email,
      action: "Connexion",
      collection: "auth",
      entityId: userId,
      summary: `Connexion à l’administration (${mode}).`,
    });
  } catch {
    // Une erreur de journalisation ne doit pas bloquer l’accès.
  }

  redirect(safeNext(parsed.data.next || ""));
}

export async function logoutAction() {
  const session = await getSession();
  await clearSessionCookie();

  if (session) {
    try {
      const repository = await getRepository();
      await repository.logActivity({
        actorEmail: session.email,
        action: "Déconnexion",
        collection: "auth",
        entityId: session.userId,
        summary: "Déconnexion de l’administration.",
      });
    } catch {
      // Ignorer les erreurs de journalisation à la déconnexion.
    }
  }

  redirect("/admin/connexion");
}
