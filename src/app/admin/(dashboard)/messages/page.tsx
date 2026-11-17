import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail, ShieldAlert, Trash2 } from "lucide-react";

import {
  AdminBadge,
  AdminEmpty,
  AdminNotice,
  AdminPageHeader,
  AdminPanel,
} from "@/components/admin/ui";
import { ConfirmSubmitButton } from "@/components/admin/delete-item";
import { ButtonLink } from "@/components/ui/button";
import {
  deleteMessageAction,
  updateMessageStatusAction,
} from "@/app/admin/actions/messages";
import { requireSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import {
  INQUIRY_TYPE_LABELS,
  MESSAGE_STATUS_LABELS,
  type MessageStatus,
} from "@/lib/content/types";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Messages" };

const statusTones: Record<MessageStatus, "green" | "gold" | "neutral"> = {
  new: "gold",
  in_progress: "green",
  closed: "neutral",
};

function formatDateTime(value: string) {
  return formatDate(value, { hour: "2-digit", minute: "2-digit" });
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ etat?: string; q?: string; statut?: string; erreur?: string }>;
}) {
  const session = await requireSession();
  if (!can(session.role, "communication:manage")) {
    redirect("/admin/acces-refuse");
  }

  const query = await searchParams;
  const repository = await getRepository();
  const messages = await repository.listMessages();

  const filter = (
    ["all", "new", "in_progress", "closed"].includes(query.etat ?? "")
      ? query.etat
      : "all"
  ) as "all" | MessageStatus;
  const search = (query.q ?? "").trim().toLowerCase();

  const filtered = messages.filter((message) => {
    if (filter !== "all" && message.status !== filter) return false;
    if (search) {
      const haystack = `${message.fullName} ${message.email} ${message.organization}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });

  const counts = {
    all: messages.length,
    new: messages.filter((message) => message.status === "new").length,
    in_progress: messages.filter((message) => message.status === "in_progress").length,
    closed: messages.filter((message) => message.status === "closed").length,
  };

  const canDelete = can(session.role, "content:delete");

  return (
    <div>
      <AdminPageHeader
        eyebrow="Communication"
        title="Messages reçus"
        description="Demandes envoyées depuis le formulaire public. Répondez directement à l’adresse indiquée par la personne, sans demander de pièce d’identité ni de donnée sensible."
      />

      {query.statut ? (
        <AdminNotice tone="success" className="mb-4">
          Statut du message mis à jour.
        </AdminNotice>
      ) : null}
      {query.erreur ? (
        <AdminNotice tone="danger" className="mb-4">
          L’opération n’a pas pu être effectuée. Réessayez ou vérifiez vos
          permissions.
        </AdminNotice>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["all", "Tous"],
              ["new", MESSAGE_STATUS_LABELS.new],
              ["in_progress", MESSAGE_STATUS_LABELS.in_progress],
              ["closed", MESSAGE_STATUS_LABELS.closed],
            ] as const
          ).map(([key, label]) => {
            const active = filter === key;
            const href = `/admin/messages${
              key === "all" && !search
                ? ""
                : `?${new URLSearchParams({
                    ...(key !== "all" ? { etat: key } : {}),
                    ...(search ? { q: search } : {}),
                  }).toString()}`
            }`;
            return (
              <Link
                key={key}
                href={href}
                className={
                  active
                    ? "rounded-full border border-forest-800 bg-forest-800 px-3 py-1.5 text-xs font-semibold text-white"
                    : "rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-forest-300 hover:text-forest-800"
                }
              >
                {label}
                <span className={active ? "ml-1.5 text-white/60" : "ml-1.5 text-ink-muted"}>
                  {counts[key]}
                </span>
              </Link>
            );
          })}
        </div>

        <form action="/admin/messages" method="get" role="search" className="flex items-center gap-2">
          {filter !== "all" ? <input type="hidden" name="etat" value={filter} /> : null}
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Nom, e-mail, organisation"
            aria-label="Rechercher un message"
            className="field h-10 w-full py-2 text-sm sm:w-64"
          />
          <button
            type="submit"
            className="rounded-xl border border-sand-300 bg-white px-3 py-2 text-xs font-semibold text-forest-800 hover:border-forest-300"
          >
            Rechercher
          </button>
        </form>
      </div>

      {filtered.length === 0 ? (
        <AdminPanel>
          <AdminEmpty
            title={messages.length === 0 ? "Aucun message reçu" : "Aucun message pour ce filtre"}
            description={
              messages.length === 0
                ? "Les demandes envoyées depuis la page Contact apparaîtront ici."
                : "Modifiez le filtre ou la recherche pour retrouver un message."
            }
          />
        </AdminPanel>
      ) : (
        <ul className="space-y-3">
          {filtered.map((message) => (
            <li key={message.id}>
              <article className="rounded-2xl border border-sand-300/80 bg-white p-5 shadow-soft">
                <div className="flex flex-wrap items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-base font-bold text-forest-900">
                        {message.fullName}
                      </h2>
                      <AdminBadge tone={statusTones[message.status]}>
                        {MESSAGE_STATUS_LABELS[message.status]}
                      </AdminBadge>
                      <AdminBadge>{INQUIRY_TYPE_LABELS[message.inquiryType]}</AdminBadge>
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">
                      {message.organization || "Sans organisation"} ·{" "}
                      <a
                        href={`mailto:${message.email}`}
                        className="text-forest-700 hover:underline"
                      >
                        {message.email}
                      </a>{" "}
                      · reçu le {formatDateTime(message.createdAt)}
                    </p>
                  </div>
                  {canDelete ? (
                    <form action={deleteMessageAction}>
                      <input type="hidden" name="id" value={message.id} />
                      <ConfirmSubmitButton
                        message="Supprimer définitivement ce message ? Cette action est irréversible."
                        title="Supprimer le message"
                        label="Supprimer le message"
                        className="rounded-lg border border-sand-300 bg-white p-2 text-red-700 transition hover:border-red-200 hover:bg-red-50"
                      >
                        <Trash2 aria-hidden className="size-3.5" />
                      </ConfirmSubmitButton>
                    </form>
                  ) : null}
                </div>

                <p className="mt-3 whitespace-pre-line break-words rounded-xl bg-sand-50 px-4 py-3 text-sm leading-relaxed text-ink-soft">
                  {message.message}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent(
                      "Réponse à votre message — CLEDUCA-ODJ",
                    )}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 hover:underline"
                  >
                    <Mail aria-hidden className="size-3.5" />
                    Répondre par e-mail
                  </a>
                  <div className="flex flex-wrap gap-1.5">
                    {message.status !== "in_progress" ? (
                      <form action={updateMessageStatusAction}>
                        <input type="hidden" name="id" value={message.id} />
                        <input type="hidden" name="status" value="in_progress" />
                        <button
                          type="submit"
                          className="rounded-full border border-forest-200 bg-forest-50 px-3 py-1.5 text-xs font-semibold text-forest-800 hover:border-forest-300"
                        >
                          Prendre en charge
                        </button>
                      </form>
                    ) : null}
                    {message.status !== "closed" ? (
                      <form action={updateMessageStatusAction}>
                        <input type="hidden" name="id" value={message.id} />
                        <input type="hidden" name="status" value="closed" />
                        <button
                          type="submit"
                          className="rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-forest-300"
                        >
                          Clôturer
                        </button>
                      </form>
                    ) : (
                      <form action={updateMessageStatusAction}>
                        <input type="hidden" name="id" value={message.id} />
                        <input type="hidden" name="status" value="new" />
                        <button
                          type="submit"
                          className="rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-forest-300"
                        >
                          Rouvrir
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex gap-3 rounded-2xl border border-gold-200 bg-gold-100/60 p-4 text-xs leading-relaxed text-gold-600">
        <ShieldAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
        <p>
          Ne demandez jamais de copie de pièce d’identité, de dossier médical ou
          d’information sur le statut de déplacement d’une personne. En cas de
          message contenant de telles données, supprimez-le après traitement et
          n’en conservez pas de copie.
        </p>
      </div>

      <div className="mt-4">
        <ButtonLink href="/admin/abonnes" variant="secondary" size="sm">
          Gérer les abonnés à la lettre d’information
        </ButtonLink>
      </div>
    </div>
  );
}
