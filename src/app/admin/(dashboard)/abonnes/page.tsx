import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, Trash2 } from "lucide-react";

import {
  AdminBadge,
  AdminEmpty,
  AdminNotice,
  AdminPageHeader,
  AdminPanel,
  AdminStat,
} from "@/components/admin/ui";
import { ConfirmSubmitButton } from "@/components/admin/delete-item";
import {
  deleteSubscriberAction,
  updateSubscriberStatusAction,
} from "@/app/admin/actions/subscribers";
import { requireSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import {
  SUBSCRIBER_STATUS_LABELS,
  type SubscriberStatus,
} from "@/lib/content/types";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Abonnés" };

const statusTones: Record<SubscriberStatus, "green" | "gold" | "neutral"> = {
  confirmed: "green",
  pending: "gold",
  unsubscribed: "neutral",
};

export default async function SubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; statut?: string; erreur?: string }>;
}) {
  const session = await requireSession();
  if (!can(session.role, "communication:manage")) {
    redirect("/admin/acces-refuse");
  }

  const query = await searchParams;
  const repository = await getRepository();
  const subscribers = await repository.listSubscribers();
  const search = (query.q ?? "").trim().toLowerCase();

  const filtered = search
    ? subscribers.filter((subscriber) =>
        `${subscriber.email} ${subscriber.name}`.toLowerCase().includes(search),
      )
    : subscribers;

  const confirmed = subscribers.filter(
    (subscriber) => subscriber.status === "confirmed",
  ).length;
  const pending = subscribers.filter(
    (subscriber) => subscriber.status === "pending",
  ).length;
  const unsubscribed = subscribers.filter(
    (subscriber) => subscriber.status === "unsubscribed",
  ).length;

  const canDelete = can(session.role, "content:delete");

  return (
    <div>
      <AdminPageHeader
        eyebrow="Communication"
        title="Abonnés à la lettre d’information"
        description="Les inscriptions recueillent un consentement explicite. Toute personne peut demander sa désinscription ou la suppression de ses données."
        actions={
          <a
            href="/admin/api/abonnes"
            className="inline-flex items-center gap-2 rounded-full border border-forest-700/25 bg-white px-4 py-2 font-display text-sm font-semibold text-forest-900 transition hover:border-forest-700/50"
          >
            <Download aria-hidden className="size-4" />
            Exporter en CSV
          </a>
        }
      />

      {query.statut ? (
        <AdminNotice tone="success" className="mb-4">
          La liste des abonnés a été mise à jour.
        </AdminNotice>
      ) : null}
      {query.erreur ? (
        <AdminNotice tone="danger" className="mb-4">
          L’opération n’a pas pu aboutir. Vérifiez les paramètres ou vos
          permissions.
        </AdminNotice>
      ) : null}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <AdminStat
          label="Confirmés"
          value={confirmed}
          hint="Ont accepté de recevoir des informations"
          tone="green"
        />
        <AdminStat label="En attente" value={pending} hint="Consentement à vérifier" />
        <AdminStat
          label="Désinscrits"
          value={unsubscribed}
          hint="Ne plus solliciter"
        />
      </div>

      <form
        action="/admin/abonnes"
        method="get"
        role="search"
        className="mb-4 flex flex-wrap items-center gap-2"
      >
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="Rechercher par e-mail ou nom"
          aria-label="Rechercher un abonné"
          className="field h-10 w-full py-2 text-sm sm:w-80"
        />
        <button
          type="submit"
          className="rounded-xl border border-sand-300 bg-white px-3 py-2 text-xs font-semibold text-forest-800 hover:border-forest-300"
        >
          Rechercher
        </button>
        {search ? (
          <Link
            href="/admin/abonnes"
            className="text-xs font-semibold text-forest-700 hover:underline"
          >
            Réinitialiser
          </Link>
        ) : null}
      </form>

      <AdminPanel bodyClassName="p-0 sm:p-0">
        {filtered.length === 0 ? (
          <div className="p-5 sm:p-6">
            <AdminEmpty
              title={subscribers.length === 0 ? "Aucun abonné" : "Aucun résultat"}
              description={
                subscribers.length === 0
                  ? "Les inscriptions depuis le pied de page du site apparaîtront ici."
                  : "Essayez une autre recherche."
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-sand-200 bg-sand-50 text-[0.64rem] uppercase tracking-[0.12em] text-ink-muted">
                  <th scope="col" className="px-5 py-3 font-semibold sm:px-6">
                    Abonné
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold">
                    Statut
                  </th>
                  <th scope="col" className="hidden px-3 py-3 font-semibold lg:table-cell">
                    Source
                  </th>
                  <th scope="col" className="hidden px-3 py-3 font-semibold xl:table-cell">
                    Consentement
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {filtered.map((subscriber) => (
                  <tr key={subscriber.id} className="align-top hover:bg-sand-50/60">
                    <td className="px-5 py-3.5 sm:px-6">
                      <p className="font-semibold text-forest-900">
                        {subscriber.name || "Sans nom"}
                      </p>
                      <a
                        href={`mailto:${subscriber.email}`}
                        className="text-xs text-forest-700 hover:underline"
                      >
                        {subscriber.email}
                      </a>
                    </td>
                    <td className="px-3 py-3.5">
                      <AdminBadge tone={statusTones[subscriber.status]}>
                        {SUBSCRIBER_STATUS_LABELS[subscriber.status]}
                      </AdminBadge>
                    </td>
                    <td className="hidden px-3 py-3.5 text-xs text-ink-soft lg:table-cell">
                      {subscriber.source || "—"}
                    </td>
                    <td className="hidden px-3 py-3.5 text-xs text-ink-muted xl:table-cell">
                      {formatDate(subscriber.consentedAt)}
                    </td>
                    <td className="px-5 py-3 sm:px-6">
                      <div className="flex items-center justify-end gap-1.5">
                        {subscriber.status !== "confirmed" ? (
                          <form action={updateSubscriberStatusAction}>
                            <input type="hidden" name="id" value={subscriber.id} />
                            <input type="hidden" name="status" value="confirmed" />
                            <button
                              type="submit"
                              className="rounded-full border border-forest-200 bg-forest-50 px-2.5 py-1.5 text-[0.7rem] font-semibold text-forest-800 hover:border-forest-300"
                            >
                              Confirmer
                            </button>
                          </form>
                        ) : null}
                        {subscriber.status !== "unsubscribed" ? (
                          <form action={updateSubscriberStatusAction}>
                            <input type="hidden" name="id" value={subscriber.id} />
                            <input type="hidden" name="status" value="unsubscribed" />
                            <button
                              type="submit"
                              className="rounded-full border border-sand-300 bg-white px-2.5 py-1.5 text-[0.7rem] font-semibold text-ink-soft hover:border-forest-300"
                            >
                              Désinscrire
                            </button>
                          </form>
                        ) : null}
                        {canDelete ? (
                          <form action={deleteSubscriberAction}>
                            <input type="hidden" name="id" value={subscriber.id} />
                            <ConfirmSubmitButton
                              message="Supprimer définitivement cet abonné et ses données ?"
                              title="Supprimer l’abonné"
                              label="Supprimer l’abonné"
                              className="rounded-lg border border-sand-300 bg-white p-2 text-red-700 transition hover:border-red-200 hover:bg-red-50"
                            >
                              <Trash2 aria-hidden className="size-3.5" />
                            </ConfirmSubmitButton>
                          </form>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminPanel>

      <p className="mt-4 text-xs leading-relaxed text-ink-muted">
        L’export CSV contient uniquement les données nécessaires à l’envoi de la
        lettre d’information. Conservez le fichier de manière sécurisée et
        supprimez-le après usage.
      </p>
    </div>
  );
}
