import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChartNoAxesCombined,
  CircleAlert,
  FolderKanban,
  Images,
  Mail,
  Newspaper,
  Plus,
  Users,
} from "lucide-react";

import {
  AdminBadge,
  AdminEmpty,
  AdminLink,
  AdminPageHeader,
  AdminPanel,
  AdminStat,
} from "@/components/admin/ui";
import { ButtonLink } from "@/components/ui/button";
import { requireSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can, type Permission } from "@/lib/content/repository";
import {
  CONTENT_STATUS_LABELS,
  PROJECT_STATUS_LABELS,
  type ContentStatus,
} from "@/lib/content/types";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Tableau de bord" };

const statusTones: Record<ContentStatus, "green" | "gold" | "neutral" | "danger"> = {
  published: "green",
  review: "gold",
  draft: "neutral",
  archived: "danger",
};

export default async function DashboardPage() {
  const session = await requireSession();
  const repository = await getRepository();

  const [
    projects,
    articles,
    pages,
    publications,
    events,
    indicators,
    messages,
    subscribers,
    media,
    activity,
  ] = await Promise.all([
    repository.list("projects", { includeUnpublished: true }),
    repository.list("articles", { includeUnpublished: true }),
    repository.list("pages", { includeUnpublished: true }),
    repository.list("publications", { includeUnpublished: true }),
    repository.list("events", { includeUnpublished: true }),
    repository.list("indicators", { includeUnpublished: true }),
    repository.listMessages(),
    repository.listSubscribers(),
    repository.list("media", { includeUnpublished: true }),
    repository.listActivity(8),
  ]);

  const publishedProjects = projects.filter(
    (project) => project.contentStatus === "published",
  ).length;
  const publishedArticles = articles.filter(
    (article) => article.status === "published",
  ).length;
  const newMessages = messages.filter((message) => message.status === "new");
  const confirmedSubscribers = subscribers.filter(
    (subscriber) => subscriber.status === "confirmed",
  ).length;

  const now = Date.now();
  const upcomingEvents = events.filter((event) => {
    const time = new Date(event.endsAt || event.startsAt).getTime();
    return event.status === "published" && Number.isFinite(time) && time >= now;
  }).length;

  const drafts = [
    ...projects
      .filter((item) => item.contentStatus !== "published")
      .map((item) => ({
        key: "projects",
        id: item.id,
        title: item.title,
        status: item.contentStatus,
        updatedAt: item.updatedAt,
        label: "Projet",
      })),
    ...articles
      .filter((item) => item.status !== "published")
      .map((item) => ({
        key: "articles",
        id: item.id,
        title: item.title,
        status: item.status,
        updatedAt: item.updatedAt,
        label: "Article",
      })),
    ...pages
      .filter((item) => item.status !== "published")
      .map((item) => ({
        key: "pages",
        id: item.id,
        title: item.title,
        status: item.status,
        updatedAt: item.updatedAt,
        label: "Page",
      })),
    ...publications
      .filter((item) => item.status !== "published")
      .map((item) => ({
        key: "publications",
        id: item.id,
        title: item.title,
        status: item.status,
        updatedAt: item.updatedAt,
        label: "Publication",
      })),
  ]
    .sort(
      (left, right) =>
        new Date(right.updatedAt || 0).getTime() -
        new Date(left.updatedAt || 0).getTime(),
    )
    .slice(0, 6);

  const canWrite = can(session.role, "content:write");

  return (
    <div>
      <AdminPageHeader
        eyebrow="Vue d’ensemble"
        title={`Bonjour, ${session.fullName.split(/\s+/)[0] || "équipe"}.`}
        description="Suivez l’état de publication du site, les messages reçus et les contenus à finaliser. Chaque élément publié doit reposer sur une information vérifiée."
        actions={
          canWrite ? (
            <>
              <ButtonLink href="/admin/contenus/articles/nouveau" size="sm">
                <Plus aria-hidden className="size-4" />
                Nouvel article
              </ButtonLink>
              <ButtonLink
                href="/admin/contenus/projects/nouveau"
                size="sm"
                variant="secondary"
              >
                <Plus aria-hidden className="size-4" />
                Nouveau projet
              </ButtonLink>
            </>
          ) : null
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStat
          label="Messages nouveaux"
          value={newMessages.length}
          hint={
            newMessages.length > 0
              ? "À traiter dans la boîte de réception"
              : "Aucun message en attente"
          }
          href="/admin/messages"
          tone={newMessages.length > 0 ? "gold" : "neutral"}
        />
        <AdminStat
          label="Projets publiés"
          value={publishedProjects}
          hint={`${projects.length} projet(s) au total`}
          href="/admin/contenus/projects"
        />
        <AdminStat
          label="Actualités publiées"
          value={publishedArticles}
          hint={`${articles.length} article(s) au total`}
          href="/admin/contenus/articles"
        />
        <AdminStat
          label="Abonnés confirmés"
          value={confirmedSubscribers}
          hint={`${subscribers.length} inscription(s) enregistrée(s)`}
          href="/admin/abonnes"
        />
        <AdminStat
          label="Indicateurs"
          value={indicators.length}
          hint={`${indicators.filter((item) => item.published).length} publié(s)`}
          href="/admin/contenus/indicators"
        />
        <AdminStat
          label="Médias"
          value={media.length}
          hint="Images de la médiathèque"
          href="/admin/mediatheque"
        />
        <AdminStat
          label="Événements à venir"
          value={upcomingEvents}
          hint={`${events.length} événement(s) enregistré(s)`}
          href="/admin/contenus/events"
        />
        <AdminStat
          label="Rôle actif"
          value={
            session.role === "super_admin"
              ? "Super admin"
              : session.role === "admin"
                ? "Admin"
                : session.role === "editor"
                  ? "Éditeur"
                  : "Contributeur"
          }
          hint={session.email}
          tone="green"
        />      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <AdminPanel
            title="Contenus à finaliser"
            description="Brouillons, relectures et éléments non publiés, classés par dernière modification."
            actions={
              canWrite ? (
                <AdminLink href="/admin/contenus">Tout voir</AdminLink>
              ) : null
            }
            bodyClassName="p-0 sm:p-0"
          >
            {drafts.length === 0 ? (
              <div className="p-5 sm:p-6">
                <AdminEmpty
                  title="Aucun contenu en attente"
                  description="Tous les contenus enregistrés sont publiés ou archivés."
                />
              </div>
            ) : (
              <ul className="divide-y divide-sand-200">
                {drafts.map((item) => (
                  <li key={`${item.key}-${item.id}`}>
                    <Link
                      href={`/admin/contenus/${item.key}/${item.id}`}
                      className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition hover:bg-sand-50 sm:px-6"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-forest-900">
                          {item.title || "Sans titre"}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {item.label} · modifié le{" "}
                          {formatDate(item.updatedAt)}
                        </p>
                      </div>
                      <AdminBadge tone={statusTones[item.status]}>
                        {CONTENT_STATUS_LABELS[item.status]}
                      </AdminBadge>
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 text-ink-muted"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </AdminPanel>

          <AdminPanel
            title="Derniers messages"
            description="Les informations transmises via le formulaire de contact. Aucune donnée sensible ne doit être demandée aux personnes concernées."
            actions={<AdminLink href="/admin/messages">Boîte de réception</AdminLink>}
            bodyClassName="p-0 sm:p-0"
          >
            {messages.length === 0 ? (
              <div className="p-5 sm:p-6">
                <AdminEmpty
                  title="Aucun message reçu"
                  description="Les messages envoyés depuis le site public apparaîtront ici."
                />
              </div>
            ) : (
              <ul className="divide-y divide-sand-200">
                {messages.slice(0, 4).map((message) => (
                  <li key={message.id} className="px-5 py-4 sm:px-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-forest-900">
                        {message.fullName}
                      </p>
                      {message.status === "new" ? (
                        <AdminBadge tone="gold">Nouveau</AdminBadge>
                      ) : null}
                      <span className="ml-auto text-xs text-ink-muted">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">
                      {message.organization || "Sans organisation"} ·{" "}
                      {message.email}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                      {message.message}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </AdminPanel>
        </div>

        <div className="space-y-6">
          <AdminPanel title="Chaîne éditoriale">
            <ol className="space-y-4">
              {[
                {
                  title: "Brouillon",
                  text: "Préparer le contenu avec des informations vérifiées et les autorisations nécessaires.",
                },
                {
                  title: "Relecture",
                  text: "Vérifier les faits, les sources, les noms propres et les visuels.",
                },
                {
                  title: "Publication",
                  text: "Publier uniquement après validation. Les partenaires et témoignages exigent un accord documenté.",
                },
              ].map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-forest-800 font-display text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-forest-900">
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </AdminPanel>

          <AdminPanel title="Raccourcis">
            <div className="grid gap-2">
              {[
                {
                  href: "/admin/contenus/projects",
                  label: "Gérer les projets",
                  icon: FolderKanban,
                  permission: "content:read",
                },
                {
                  href: "/admin/contenus/articles",
                  label: "Gérer les actualités",
                  icon: Newspaper,
                  permission: "content:read",
                },
                {
                  href: "/admin/contenus/indicators",
                  label: "Mettre à jour l’impact",
                  icon: ChartNoAxesCombined,
                  permission: "impact:write",
                },
                {
                  href: "/admin/mediatheque",
                  label: "Ouvrir la médiathèque",
                  icon: Images,
                  permission: "media:write",
                },
                {
                  href: "/admin/utilisateurs",
                  label: "Gérer les utilisateurs",
                  icon: Users,
                  permission: "users:manage",
                },
                {
                  href: "/admin/messages",
                  label: "Traiter les messages",
                  icon: Mail,
                  permission: "communication:manage",
                },
              ]
                .filter((item) => can(session.role, item.permission as Permission))
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 rounded-xl border border-sand-200 px-3 py-2.5 text-sm font-medium text-forest-900 transition hover:border-forest-200 hover:bg-forest-50"
                    >
                      <Icon aria-hidden className="size-4 text-forest-600" />
                      {item.label}
                    </Link>
                  );
                })}
            </div>
          </AdminPanel>

          <AdminPanel title="Dernière activité">
            {activity.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Aucune action enregistrée pour le moment.
              </p>
            ) : (
              <ul className="space-y-3">
                {activity.map((entry) => (
                  <li key={entry.id} className="flex gap-2.5">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-400" />
                    <div className="min-w-0">
                      <p className="text-xs leading-relaxed text-ink-soft">
                        {entry.summary}
                      </p>
                      <p className="mt-0.5 text-[0.68rem] text-ink-muted">
                        {entry.actorEmail} · {formatDate(entry.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {can(session.role, "logs:read") ? (
              <div className="mt-3 border-t border-sand-200 pt-3">
                <AdminLink href="/admin/journal">Ouvrir le journal complet</AdminLink>
              </div>
            ) : null}
          </AdminPanel>

          <div className="rounded-2xl border border-sand-300/80 bg-sand-50 p-5">
            <p className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-gold-600">
              <CircleAlert aria-hidden className="size-4" />
              Rappel déontologique
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              Ne publiez ni statistique non vérifiée, ni partenaire sans
              autorisation, ni information personnelle sur des bénéficiaires ou
              des personnes déplacées. En cas de doute, conservez le contenu au
              stade brouillon.
            </p>
          </div>
        </div>
      </div>

      {projects.some((project) => project.status === "proposed") ? (
        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-sand-300/80 bg-white px-5 py-4 text-xs text-ink-muted shadow-soft">
          <CalendarDays aria-hidden className="size-4 text-forest-600" />
          Certains projets sont au statut « {PROJECT_STATUS_LABELS.proposed} ».
          Leur description doit rester présentée comme une initiative proposée,
          distincte des interventions documentées.
        </div>
      ) : null}
    </div>
  );
}
