import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { getRepository } from "@/lib/content";
import { can, type Permission } from "@/lib/content/repository";
import {
  ROLE_LABELS,
  type Role,
  type UserAccount,
} from "@/lib/content/types";

export const SESSION_COOKIE = "cleduca_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

export interface AdminSession {
  userId: string;
  email: string;
  fullName: string;
  role: Role;
  mode: "local" | "supabase";
  expiresAt: number;
}

interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
  mode: "local" | "supabase";
  exp: number;
}

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) return null;
  return secret;
}

export function isSessionConfigured() {
  return Boolean(getSecret());
}

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function isRole(value: unknown): value is Role {
  return typeof value === "string" && value in ROLE_LABELS;
}

export function createSessionToken(
  user: Pick<AdminSession, "userId" | "email" | "fullName" | "role" | "mode">,
) {
  const secret = getSecret();
  if (!secret) {
    throw new Error(
      "AUTH_SECRET n’est pas configuré. Définissez une valeur d’au moins 16 caractères.",
    );
  }
  const payload: SessionPayload = {
    sub: user.userId,
    email: user.email,
    name: user.fullName,
    role: user.role,
    mode: user.mode,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = base64url(JSON.stringify(payload));
  return `${encoded}.${signPayload(encoded, secret)}`;
}

export function verifySessionToken(token: string): AdminSession | null {
  const secret = getSecret();
  if (!secret) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = signPayload(encoded, secret);
  const provided = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    provided.length !== expectedBuffer.length ||
    !timingSafeEqual(provided, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (
      !payload ||
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.exp !== "number" ||
      !isRole(payload.role)
    ) {
      return null;
    }
    if (payload.exp * 1000 <= Date.now()) return null;
    return {
      userId: payload.sub,
      email: payload.email,
      fullName: payload.name || payload.email,
      role: payload.role,
      mode: payload.mode === "supabase" ? "supabase" : "local",
      expiresAt: payload.exp * 1000,
    };
  } catch {
    return null;
  }
}

export const getSession = cache(async (): Promise<AdminSession | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
});

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function requireSession(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) redirect("/admin/connexion");
  if (!session.role) redirect("/admin/connexion");
  return session;
}

export async function requirePermission(
  permission: Permission,
): Promise<AdminSession> {
  const session = await requireSession();
  if (!can(session.role, permission)) redirect("/admin/acces-refuse");
  return session;
}

export async function findAccountByEmail(
  email: string,
): Promise<UserAccount | null> {
  const repository = await getRepository();
  const users = await repository.listUsers();
  const normalized = email.trim().toLowerCase();
  return (
    users.find((user) => user.email.trim().toLowerCase() === normalized) ?? null
  );
}
