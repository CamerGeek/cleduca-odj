import "server-only";

import type { AdminSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";

export async function logAdminActivity(
  session: Pick<AdminSession, "email">,
  action: string,
  collection: string,
  entityId: string,
  summary: string,
) {
  try {
    const repository = await getRepository();
    await repository.logActivity({
      actorEmail: session.email,
      action,
      collection,
      entityId,
      summary,
    });
  } catch {
    // La journalisation ne doit jamais faire échouer une opération métier.
  }
}

export function publicItemHref(
  collection: string,
  base: string | null,
  item: Record<string, unknown>,
) {
  const slug = typeof item.slug === "string" ? item.slug : "";
  if (collection === "pages") return slug ? `/${slug}` : null;
  if (!base) return null;
  if (collection === "publications" || collection === "indicators") return base;
  return slug ? `${base}/${slug}` : base;
}
