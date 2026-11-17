import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import { SUBSCRIBER_STATUS_LABELS } from "@/lib/content/types";

export const dynamic = "force-dynamic";

function escapeCell(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Authentification requise.", { status: 401 });
  }
  if (!can(session.role, "communication:manage")) {
    return new NextResponse("Accès refusé.", { status: 403 });
  }

  const repository = await getRepository();
  const subscribers = await repository.listSubscribers();

  const rows = [
    ["E-mail", "Nom", "Statut", "Source", "Consentement", "Inscription"],
    ...subscribers.map((subscriber) => [
      subscriber.email,
      subscriber.name,
      SUBSCRIBER_STATUS_LABELS[subscriber.status],
      subscriber.source,
      subscriber.consentedAt,
      subscriber.createdAt,
    ]),
  ];

  const csv = `\uFEFF${rows.map((row) => row.map(escapeCell).join(";")).join("\r\n")}`;
  const date = new Date().toISOString().slice(0, 10);

  await repository
    .logActivity({
      actorEmail: session.email,
      action: "Export",
      collection: "newsletter_subscribers",
      entityId: "csv",
      summary: `Export CSV de ${subscribers.length} abonné(s).`,
    })
    .catch(() => undefined);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cleduca-abonnes-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
