import { redirect } from "next/navigation";

import {
  AdminBadge,
  AdminEmpty,
  AdminPageHeader,
  AdminPanel,
} from "@/components/admin/ui";
import { requireSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Journal d’activité" };

const actionTones: Record<string, "green" | "gold" | "neutral" | "danger"> = {
  Création: "green",
  Ajout: "green",
  Modification: "gold",
  "Mise à jour": "gold",
  Invitation: "gold",
  Suppression: "danger",
  Connexion: "neutral",
  Déconnexion: "neutral",
  Export: "neutral",
};

const collectionLabels: Record<string, string> = {
  projects: "Projets",
  articles: "Actualités",
  pages: "Pages",
  publications: "Publications",
  events: "Événements",
  partners: "Partenaires",
  areas: "Domaines",
  indicators: "Indicateurs",
  milestones: "Jalons",
  reportingPeriods: "Périodes",
  testimonials: "Témoignages",
  media: "Médias",
  messages: "Messages",
  newsletter_subscribers: "Abonnés",
  users: "Utilisateurs",
  site_settings: "Paramètres",
  auth: "Authentification",
};

export default async function ActivityLogPage({
  searchParams,
}: {
  searchParams: Promise<{ limite?: string }>;
}) {
  const session = await requireSession();
  if (!can(session.role, "logs:read")) {
    redirect("/admin/acces-refuse");
  }

  const query = await searchParams;
  const limit = Math.min(
    Math.max(Number(query.limite ?? 100) || 100, 25),
    500,
  );

  const repository = await getRepository();
  const entries = await repository.listActivity(limit);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Administration"
        title="Journal d’activité"
        description="Traçabilité des connexions et des opérations réalisées dans l’administration. Le journal ne contient pas le contenu des messages reçus au-delà de leur résumé d’action."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
        <span>Afficher</span>
        {[50, 100, 250, 500].map((value) => (
          <a
            key={value}
            href={`/admin/journal?limite=${value}`}
            className={
              limit === value
                ? "rounded-full bg-forest-800 px-3 py-1 font-semibold text-white"
                : "rounded-full border border-sand-300 bg-white px-3 py-1 font-semibold text-ink-soft hover:border-forest-300"
            }
          >
            {value}
          </a>
        ))}
        <span className="ml-auto">
          {entries.length} entrée(s) · stockage {repository.mode === "supabase" ? "Supabase" : "local"}
        </span>
      </div>

      <AdminPanel bodyClassName="p-0 sm:p-0">
        {entries.length === 0 ? (
          <div className="p-5 sm:p-6">
            <AdminEmpty
              title="Aucune activité enregistrée"
              description="Les connexions et modifications apparaîtront ici."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-sand-200 bg-sand-50 text-[0.64rem] uppercase tracking-[0.12em] text-ink-muted">
                  <th scope="col" className="px-5 py-3 font-semibold sm:px-6">
                    Action
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold">
                    Détail
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold">
                    Auteur
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold">
                    Collection
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold sm:px-6">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {entries.map((entry) => (
                  <tr key={entry.id} className="align-top hover:bg-sand-50/60">
                    <td className="px-5 py-3 sm:px-6">
                      <AdminBadge tone={actionTones[entry.action] ?? "neutral"}>
                        {entry.action}
                      </AdminBadge>
                    </td>
                    <td className="max-w-md px-3 py-3 text-xs leading-relaxed text-ink-soft">
                      {entry.summary}
                    </td>
                    <td className="px-3 py-3 text-xs text-ink-muted">
                      {entry.actorEmail}
                    </td>
                    <td className="px-3 py-3 text-xs text-ink-muted">
                      {collectionLabels[entry.collection] ?? entry.collection}
                    </td>
                    <td className="px-5 py-3 text-xs text-ink-muted sm:px-6">
                      {formatDate(entry.createdAt, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminPanel>

      <p className="mt-4 text-xs leading-relaxed text-ink-muted">
        {repository.mode === "local"
          ? "En mode local, le journal conserve les 500 entrées les plus récentes. En production Supabase, définissez une politique de conservation et exportez le journal si nécessaire."
          : "Le journal est conservé dans Supabase. Définissez une durée de conservation adaptée et restreignez l’accès aux personnes habilitées."}
      </p>
    </div>
  );
}
