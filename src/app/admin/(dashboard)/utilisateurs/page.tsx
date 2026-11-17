import { redirect } from "next/navigation";
import { ShieldCheck, UserPlus } from "lucide-react";

import {
  AdminBadge,
  AdminEmpty,
  AdminNotice,
  AdminPageHeader,
  AdminPanel,
} from "@/components/admin/ui";
import { inviteUserAction, updateUserAction } from "@/app/admin/actions/users";
import { requireSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import { ROLE_LABELS, type Role } from "@/lib/content/types";
import { hasServiceRole, hasSupabaseConfig } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Utilisateurs" };

const roleDescriptions: Record<Role, string> = {
  super_admin:
    "Accès complet : contenus, impact, médias, communication, paramètres, utilisateurs et journal.",
  admin:
    "Gestion complète des contenus et paramètres, sans gestion des comptes utilisateurs.",
  editor:
    "Création, modification et publication des contenus, impact, médias et messages.",
  contributor:
    "Préparation de brouillons uniquement. La publication reste réservée aux éditeurs et administrateurs.",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; erreur?: string }>;
}) {
  const session = await requireSession();
  if (!can(session.role, "users:manage")) {
    redirect("/admin/acces-refuse");
  }

  const query = await searchParams;
  const repository = await getRepository();
  const users = await repository.listUsers();
  const supabaseMode = repository.mode === "supabase";
  const canInvite = supabaseMode && hasSupabaseConfig() && hasServiceRole();

  const errorMessages: Record<string, string> = {
    "propre-compte":
      "Vous ne pouvez pas retirer votre propre rôle ni désactiver votre propre compte.",
    "dernier-super-admin":
      "Impossible de retirer le dernier super administrateur actif. Nommez d’abord un autre super administrateur.",
    parametres: "Paramètres invalides.",
    introuvable: "Compte introuvable.",
    "mise-a-jour": "La mise à jour du compte a échoué.",
    "mode-local":
      "L’invitation nécessite Supabase Auth et la clé de service.",
    invitation: "L’invitation n’a pas pu être envoyée. Vérifiez la configuration e-mail de Supabase.",
    "invitation-invalide": "Vérifiez l’adresse e-mail, le nom et le rôle.",
    "invitation-profil":
      "L’invitation a été créée mais le profil n’a pas pu être activé. Activez le compte manuellement dans la liste ci-dessous.",
  };

  const roleKeys = Object.keys(ROLE_LABELS) as Role[];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Administration"
        title="Utilisateurs et rôles"
        description="Gérez les personnes habilitées à accéder à l’administration. Le principe du moindre privilège s’applique : attribuez uniquement les droits nécessaires."
      />

      {query.statut === "maj" ? (
        <AdminNotice tone="success" className="mb-4">
          Le compte a été mis à jour.
        </AdminNotice>
      ) : null}
      {query.statut === "invitation" ? (
        <AdminNotice tone="success" className="mb-4">
          L’invitation a été envoyée. La personne devra définir son mot de passe
          avant de se connecter.
        </AdminNotice>
      ) : null}
      {query.erreur ? (
        <AdminNotice tone="danger" className="mb-4">
          {errorMessages[query.erreur] ?? "L’opération n’a pas pu aboutir."}
        </AdminNotice>
      ) : null}

      {!supabaseMode ? (
        <AdminNotice tone="warning" className="mb-5" title="Mode local actif">
          La gestion des comptes nécessite Supabase Auth. En mode local, seul le
          compte défini par <code className="font-mono text-xs">ADMIN_EMAIL</code>{" "}
          est disponible et les modifications de compte sont désactivées.
        </AdminNotice>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-4">
          <AdminPanel
            title={`Comptes (${users.length})`}
            description="Seuls les comptes actifs peuvent se connecter. Un compte désactivé perd immédiatement l’accès après expiration de sa session en cours."
            bodyClassName="p-0 sm:p-0"
          >
            {users.length === 0 ? (
              <div className="p-5 sm:p-6">
                <AdminEmpty
                  title="Aucun compte enregistré"
                  description="Les comptes sont créés dans Supabase Auth puis associés à un rôle."
                />
              </div>
            ) : (
              <ul className="divide-y divide-sand-200">
                {users.map((user) => {
                  const isSelf = user.id === session.userId;
                  return (
                    <li key={user.id} className="px-5 py-4 sm:px-6">
                      <form action={updateUserAction} className="space-y-3">
                        <input type="hidden" name="id" value={user.id} />
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-forest-900">
                              {user.fullName || "Sans nom"}
                              {isSelf ? (
                                <span className="ml-2 text-[0.68rem] font-medium uppercase tracking-[0.1em] text-gold-600">
                                  Vous
                                </span>
                              ) : null}
                            </p>
                            <p className="text-xs text-ink-muted">{user.email}</p>
                            <p className="mt-0.5 text-[0.68rem] text-ink-muted">
                              Depuis le {formatDate(user.createdAt)}
                              {user.lastSeenAt
                                ? ` · dernière activité le ${formatDate(user.lastSeenAt)}`
                                : ""}
                            </p>
                          </div>
                          <AdminBadge
                            tone={
                              user.isActive
                                ? user.role === "super_admin"
                                  ? "forest"
                                  : "green"
                                : "danger"
                            }
                          >
                            {user.isActive ? "Actif" : "Désactivé"}
                          </AdminBadge>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr_auto] sm:items-end">
                          <div>
                            <label
                              htmlFor={`name-${user.id}`}
                              className="field-label text-xs"
                            >
                              Nom affiché
                            </label>
                            <input
                              id={`name-${user.id}`}
                              name="fullName"
                              defaultValue={user.fullName}
                              maxLength={120}
                              disabled={!supabaseMode}
                              className="field py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`role-${user.id}`}
                              className="field-label text-xs"
                            >
                              Rôle
                            </label>
                            <select
                              id={`role-${user.id}`}
                              name="role"
                              defaultValue={user.role}
                              disabled={isSelf || !supabaseMode}
                              className="field py-2 text-sm"
                            >
                              {roleKeys.map((role) => (
                                <option key={role} value={role}>
                                  {ROLE_LABELS[role]}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 pb-1">
                            <label className="flex items-center gap-2 text-xs font-medium text-ink-soft">
                              <input
                                type="checkbox"
                                name="isActive"
                                defaultChecked={user.isActive}
                                disabled={isSelf || !supabaseMode}
                                className="size-4 accent-forest-700"
                              />
                              Actif
                            </label>
                            <button
                              type="submit"
                              disabled={!supabaseMode}
                              className="rounded-full border border-forest-200 bg-forest-50 px-3 py-1.5 text-xs font-semibold text-forest-800 transition hover:border-forest-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Enregistrer
                            </button>
                          </div>
                        </div>
                        {isSelf ? (
                          <p className="text-[0.68rem] text-ink-muted">
                            Pour des raisons de sécurité, vous ne pouvez pas
                            modifier votre propre rôle ni désactiver votre compte.
                          </p>
                        ) : null}
                      </form>
                    </li>
                  );
                })}
              </ul>
            )}
          </AdminPanel>

          <AdminPanel title="Attribution des rôles">
            <ul className="space-y-3">
              {roleKeys.map((role) => (
                <li key={role} className="flex gap-3">
                  <ShieldCheck
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-forest-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-forest-900">
                      {ROLE_LABELS[role]}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                      {roleDescriptions[role]}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </AdminPanel>
        </div>

        <div className="space-y-4">
          <AdminPanel
            title="Inviter un utilisateur"
            description="Un e-mail d’invitation est envoyé par Supabase. Le compte est activé immédiatement avec le rôle choisi ; la personne définit son mot de passe avant sa première connexion."
          >
            {canInvite ? (
              <form action={inviteUserAction} className="space-y-3">
                <div>
                  <label htmlFor="invite-email" className="field-label text-xs">
                    Adresse e-mail
                  </label>
                  <input
                    id="invite-email"
                    name="email"
                    type="email"
                    required
                    inputMode="email"
                    className="field py-2 text-sm"
                    placeholder="prenom.nom@organisation.org"
                  />
                </div>
                <div>
                  <label htmlFor="invite-name" className="field-label text-xs">
                    Nom complet
                  </label>
                  <input
                    id="invite-name"
                    name="fullName"
                    required
                    minLength={2}
                    maxLength={120}
                    className="field py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="invite-role" className="field-label text-xs">
                    Rôle
                  </label>
                  <select
                    id="invite-role"
                    name="role"
                    defaultValue="contributor"
                    className="field py-2 text-sm"
                  >
                    {roleKeys.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                  <p className="field-help">
                    Attribuez par défaut le rôle le moins permissif nécessaire.
                  </p>
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-700 px-4 py-2.5 font-display text-sm font-semibold text-white transition hover:bg-forest-800"
                >
                  <UserPlus aria-hidden className="size-4" />
                  Envoyer l’invitation
                </button>
              </form>
            ) : (
              <p className="text-xs leading-relaxed text-ink-muted">
                {supabaseMode
                  ? "Ajoutez la clé de service Supabase (SUPABASE_SERVICE_ROLE_KEY) pour permettre l’envoi d’invitations depuis cette interface. Vous pouvez aussi créer les comptes directement dans Supabase Auth."
                  : "Les invitations sont disponibles uniquement en mode Supabase."}
              </p>
            )}
          </AdminPanel>

          <AdminPanel title="Sécurité des accès">
            <ul className="space-y-2 text-xs leading-relaxed text-ink-muted">
              <li>· Une session expire automatiquement après 8 heures.</li>
              <li>· Les tentatives de connexion sont limitées.</li>
              <li>· Chaque action est enregistrée dans le journal.</li>
              <li>
                · Retirez immédiatement l’accès d’une personne qui quitte
                l’organisation.
              </li>
              <li>· Activez l’authentification à deux facteurs si disponible.</li>
            </ul>
          </AdminPanel>

          <AdminNotice tone="info" title="Provisionnement">
            Si l’invitation échoue, créez l’utilisateur dans Supabase Auth puis
            vérifiez que la table <code className="font-mono text-xs">users</code>{" "}
            contient une ligne avec le même identifiant et le rôle souhaité.
          </AdminNotice>
        </div>
      </div>
    </div>
  );
}
