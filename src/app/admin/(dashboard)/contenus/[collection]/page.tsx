import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ExternalLink,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  AdminBadge,
  AdminEmpty,
  AdminLink,
  AdminNotice,
  AdminPageHeader,
} from "@/components/admin/ui";
import { DeleteItemButton } from "@/components/admin/delete-item";
import { ButtonLink } from "@/components/ui/button";
import { getAdminCollection } from "@/lib/admin/collections";
import { publicItemHref } from "@/lib/admin/activity";
import { requireSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import { isPublicItem, sortForAdmin } from "@/lib/content/registry";
import {
  CONTENT_STATUS_LABELS,
  PROJECT_STATUS_LABELS,
  type CollectionKey,
  type ContentStatus,
} from "@/lib/content/types";
import { formatDate } from "@/lib/utils";

const statusTones: Record<ContentStatus, "green" | "gold" | "neutral" | "danger"> = {
  published: "green",
  review: "gold",
  draft: "neutral",
  archived: "danger",
};

type FilterKey = "all" | ContentStatus;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function itemStatus(config: NonNullable<ReturnType<typeof getAdminCollection>>, item: Record<string, unknown>) {
  if (config.statusMode === "content") {
    const value = String(item.contentStatus ?? "draft") as ContentStatus;
    return value in CONTENT_STATUS_LABELS ? value : "draft";
  }
  if (config.statusMode === "publication") {
    const value = String(item.status ?? "draft") as ContentStatus;
    return value in CONTENT_STATUS_LABELS ? value : "draft";
  }
  return item.published === true ? "published" : "draft";
}

function statusLabel(config: NonNullable<ReturnType<typeof getAdminCollection>>, status: ContentStatus) {
  if (config.statusMode === "boolean") {
    return status === "published" ? "Publié" : "Non publié";
  }
  return CONTENT_STATUS_LABELS[status];
}

function cellText(
  collection: string,
  item: Record<string, unknown>,
  name: string,
) {
  const value = item[name];
  if (collection === "projects" && name === "status") {
    return PROJECT_STATUS_LABELS[value as keyof typeof PROJECT_STATUS_LABELS] ?? "—";
  }
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (Array.isArray(value)) return `${value.length} élément(s)`;
  if (value === null || value === undefined || value === "") return "—";
  if (/At$|On$/.test(name)) return formatDate(String(value));
  return String(value);
}

export default async function CollectionListPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ q?: string; etat?: string; statut?: string; erreur?: string }>;
}) {
  const session = await requireSession();
  const { collection } = await params;
  const query = await searchParams;
  const config = getAdminCollection(collection);

  if (!config) notFound();
  if (!can(session.role, config.permission)) {
    redirect("/admin/acces-refuse");
  }

  const repository = await getRepository();
  const items = sortForAdmin(
    config.key,
    await repository.list(config.key as CollectionKey, {
      includeUnpublished: true,
    }),
  );

  const filter = (
    ["all", "published", "review", "draft", "archived"].includes(query.etat ?? "")
      ? query.etat
      : "all"
  ) as FilterKey;
  const search = (query.q ?? "").trim();

  const filtered = items.filter((item) => {
    const record = item as unknown as Record<string, unknown>;
    const status = itemStatus(config, record);
    if (filter !== "all" && status !== filter) return false;
    if (search) {
      const haystack = normalize(
        [config.titleField, config.subtitleField, "slug"]
          .map((name) => (name ? record[name] : ""))
          .filter((value) => typeof value === "string")
          .join(" "),
      );
      if (!haystack.includes(normalize(search))) return false;
    }
    return true;
  });

  const counts = {
    all: items.length,
    published: items.filter(
      (item) => itemStatus(config, item as unknown as Record<string, unknown>) === "published",
    ).length,
    review: items.filter(
      (item) => itemStatus(config, item as unknown as Record<string, unknown>) === "review",
    ).length,
    draft: items.filter(
      (item) => itemStatus(config, item as unknown as Record<string, unknown>) === "draft",
    ).length,
    archived: items.filter(
      (item) => itemStatus(config, item as unknown as Record<string, unknown>) === "archived",
    ).length,
  };

  const baseQuery = (next: Record<string, string | undefined>) => {
    const parts = new URLSearchParams();
    Object.entries({ ...next }).forEach(([key, value]) => {
      if (value) parts.set(key, value);
    });
    const serialized = parts.toString();
    return `/admin/contenus/${config.key}${serialized ? `?${serialized}` : ""}`;
  };

  const canDelete = can(session.role, "content:delete");
  const canWrite = can(session.role, config.permission);

  const filterOptions: Array<{ key: FilterKey; label: string; count: number }> = [
    { key: "all", label: "Tous", count: counts.all },
    ...(config.statusMode === "boolean"
      ? (["published", "draft"] as ContentStatus[]).map((status) => ({
          key: status,
          label: statusLabel(config, status),
          count: counts[status],
        }))
      : (["published", "review", "draft", "archived"] as ContentStatus[]).map(
          (status) => ({
            key: status,
            label: statusLabel(config, status),
            count: counts[status],
          }),
        )),
  ];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Contenus"
        title={config.title}
        description={config.description}
        actions={
          canWrite ? (
            <ButtonLink
              href={`/admin/contenus/${config.key}/nouveau`}
              size="sm"
            >
              <Plus aria-hidden className="size-4" />
              Ajouter
            </ButtonLink>
          ) : null
        }
      />

      {query.statut === "enregistre" ? (
        <AdminNotice tone="success" className="mb-4">
          {config.singular} enregistré. Vérifiez le statut de publication avant de
          quitter la page.
        </AdminNotice>
      ) : null}
      {query.statut === "supprime" ? (
        <AdminNotice tone="info" className="mb-4">
          {config.singular} supprimé et retiré du site public.
        </AdminNotice>
      ) : null}
      {query.erreur ? (
        <AdminNotice tone="danger" className="mb-4">
          L’opération n’a pas pu aboutir. Rechargez la page ou contactez
          l’administrateur technique.
        </AdminNotice>
      ) : null}

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.map((option) => {
            const active = filter === option.key;
            return (
              <Link
                key={option.key}
                href={baseQuery({
                  q: search || undefined,
                  etat: option.key === "all" ? undefined : option.key,
                })}
                className={
                  active
                    ? "rounded-full border border-forest-800 bg-forest-800 px-3 py-1.5 text-xs font-semibold text-white"
                    : "rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-forest-300 hover:text-forest-800"
                }
              >
                {option.label}
                <span className={active ? "ml-1.5 text-white/60" : "ml-1.5 text-ink-muted"}>
                  {option.count}
                </span>
              </Link>
            );
          })}
        </div>

        <form
          action={`/admin/contenus/${config.key}`}
          method="get"
          className="flex items-center gap-2"
          role="search"
        >
          {filter !== "all" ? (
            <input type="hidden" name="etat" value={filter} />
          ) : null}
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Rechercher…"
              aria-label={`Rechercher dans ${config.title}`}
              className="field h-10 w-full py-2 pl-9 pr-8 text-sm sm:w-64"
            />
            {search ? (
              <Link
                href={baseQuery({ etat: filter === "all" ? undefined : filter })}
                aria-label="Effacer la recherche"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-muted hover:bg-sand-100"
              >
                <X aria-hidden className="size-3.5" />
              </Link>
            ) : null}
          </div>
          <button
            type="submit"
            className="rounded-xl border border-sand-300 bg-white px-3 py-2 text-xs font-semibold text-forest-800 hover:border-forest-300"
          >
            Filtrer
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-sand-300/80 bg-white shadow-soft">
        {filtered.length === 0 ? (
          <div className="p-5 sm:p-6">
            <AdminEmpty
              title={
                search || filter !== "all"
                  ? "Aucun résultat pour ce filtre"
                  : `Aucun contenu dans « ${config.title} »`
              }
              description={
                search || filter !== "all"
                  ? "Modifiez la recherche ou revenez à la liste complète."
                  : "Créez un premier élément. Il restera invisible sur le site public jusqu’à sa publication."
              }
              action={
                canWrite && !search && filter === "all" ? (
                  <ButtonLink
                    href={`/admin/contenus/${config.key}/nouveau`}
                    size="sm"
                  >
                    <Plus aria-hidden className="size-4" />
                    Créer un {config.singular.toLowerCase()}
                  </ButtonLink>
                ) : null
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-sand-200 bg-sand-50 text-[0.64rem] uppercase tracking-[0.12em] text-ink-muted">
                  <th scope="col" className="px-5 py-3 font-semibold sm:px-6">
                    {config.listColumns[0]?.label ?? "Élément"}
                  </th>
                  {config.listColumns.slice(1).map((column) => (
                    <th
                      key={column.name}
                      scope="col"
                      className="hidden px-3 py-3 font-semibold lg:table-cell"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th scope="col" className="px-3 py-3 font-semibold">
                    Statut
                  </th>
                  <th scope="col" className="hidden px-3 py-3 font-semibold xl:table-cell">
                    Modifié
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {filtered.map((item) => {
                  const record = item as unknown as Record<string, unknown>;
                  const status = itemStatus(config, record);
                  const primary = cellText(
                    config.key,
                    record,
                    config.listColumns[0]?.name ?? config.titleField,
                  );
                  const subtitle = config.subtitleField
                    ? cellText(config.key, record, config.subtitleField)
                    : "";
                  const publicHref = publicItemHref(
                    config.key,
                    config.publicBase,
                    record,
                  );
                  const published = isPublicItem(
                    config.key as CollectionKey,
                    item,
                  );
                  return (
                    <tr key={String(record.id)} className="align-top hover:bg-sand-50/60">
                      <td className="px-5 py-3.5 sm:px-6">
                        <Link
                          href={`/admin/contenus/${config.key}/${record.id}`}
                          className="font-semibold text-forest-900 hover:underline"
                        >
                          {primary}
                        </Link>
                        {subtitle && subtitle !== "—" ? (
                          <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>
                        ) : null}
                      </td>
                      {config.listColumns.slice(1).map((column) => (
                        <td
                          key={column.name}
                          className="hidden px-3 py-3.5 text-xs text-ink-soft lg:table-cell"
                        >
                          {cellText(config.key, record, column.name)}
                        </td>
                      ))}
                      <td className="px-3 py-3.5">
                        <AdminBadge tone={statusTones[status]}>
                          {statusLabel(config, status)}
                        </AdminBadge>
                      </td>
                      <td className="hidden px-3 py-3.5 text-xs text-ink-muted xl:table-cell">
                        {formatDate(
                          (record.updatedAt as string) ||
                            (record.createdAt as string) ||
                            "",
                        )}
                      </td>
                      <td className="px-5 py-3 sm:px-6">
                        <div className="flex items-center justify-end gap-1.5">
                          {published && publicHref ? (
                            <a
                              href={publicHref}
                              target="_blank"
                              rel="noreferrer"
                              title="Voir sur le site"
                              aria-label={`Voir ${primary} sur le site`}
                              className="rounded-lg border border-sand-300 bg-white p-2 text-forest-700 transition hover:border-forest-300 hover:bg-forest-50"
                            >
                              <ExternalLink aria-hidden className="size-3.5" />
                            </a>
                          ) : null}
                          <Link
                            href={`/admin/contenus/${config.key}/${record.id}`}
                            title="Modifier"
                            aria-label={`Modifier ${primary}`}
                            className="rounded-lg border border-sand-300 bg-white p-2 text-forest-800 transition hover:border-forest-300 hover:bg-forest-50"
                          >
                            <Pencil aria-hidden className="size-3.5" />
                          </Link>
                          {canDelete ? (
                            <DeleteItemButton
                              collection={config.key}
                              id={String(record.id)}
                              label={primary}
                            />
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted">
        <p>
          {filtered.length} élément(s) affiché(s) sur {items.length}. Les contenus
          non publiés ne sont pas visibles par le public.
        </p>
        <AdminLink href="/admin/contenus">Toutes les collections</AdminLink>
      </div>

      {config.key === "partners" ? (
        <div className="mt-5 flex gap-3 rounded-2xl border border-gold-200 bg-gold-100/60 p-4 text-xs leading-relaxed text-gold-600">
          <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
          <p>
            Ne publiez un partenaire qu’après accord explicite. La référence de
            l’autorisation reste interne et n’apparaît pas sur le site public.
          </p>
        </div>
      ) : null}
      {config.key === "testimonials" ? (
        <div className="mt-5 flex gap-3 rounded-2xl border border-gold-200 bg-gold-100/60 p-4 text-xs leading-relaxed text-gold-600">
          <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
          <p>
            Un témoignage ne peut être publié que si le consentement est
            documenté. Utilisez un libellé d’auteur non identifiant lorsque
            nécessaire.
          </p>
        </div>
      ) : null}
    </div>
  );
}
