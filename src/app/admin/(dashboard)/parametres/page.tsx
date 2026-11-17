import { redirect } from "next/navigation";

import {
  AdminBadge,
  AdminNotice,
  AdminPageHeader,
  AdminPanel,
} from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/settings-form";
import { requireSession, isSessionConfigured } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import { getSettings } from "@/lib/content/queries";
import { hasServiceRole, hasSupabaseConfig } from "@/lib/supabase/server";

export const metadata = { title: "Paramètres" };

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const session = await requireSession();
  if (!can(session.role, "settings:manage")) {
    redirect("/admin/acces-refuse");
  }

  const { statut } = await searchParams;
  const settings = await getSettings();
  const repository = await getRepository();

  const diagnostics = [
    {
      label: "Stockage des contenus",
      value: repository.mode === "supabase" ? "Supabase" : "Fichier local",
      ok: repository.mode === "supabase",
      hint:
        repository.mode === "supabase"
          ? "PostgreSQL et Storage via Supabase."
          : "Adapté au développement local uniquement.",
    },
    {
      label: "Supabase",
      value: hasSupabaseConfig() ? "Configuré" : "Non configuré",
      ok: hasSupabaseConfig(),
      hint: "Variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    },
    {
      label: "Clé de service",
      value: hasServiceRole() ? "Présente" : "Absente",
      ok: hasServiceRole(),
      hint: "Nécessaire pour les invitations et le stockage en production.",
    },
    {
      label: "Secret de session",
      value: isSessionConfigured() ? "Configuré" : "Manquant",
      ok: isSessionConfigured(),
      hint: "AUTH_SECRET, 16 caractères minimum.",
    },
  ];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Administration"
        title="Paramètres du site"
        description="Informations institutionnelles, coordonnées et textes de la page d’accueil. Ces valeurs alimentent le site public et ses métadonnées."
      />

      {statut === "enregistre" ? (
        <AdminNotice tone="success" className="mb-5">
          Paramètres enregistrés. Les pages publiques utilisent désormais ces
          valeurs après revalidation.
        </AdminNotice>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <div className="min-w-0">
          <SettingsForm settings={settings} />
        </div>

        <div className="space-y-4">
          <AdminPanel
            title="État de la configuration"
            description="Diagnostic en lecture seule. Aucune valeur secrète n’est affichée."
          >
            <ul className="space-y-3">
              {diagnostics.map((item) => (
                <li key={item.label}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-forest-900">
                      {item.label}
                    </span>
                    <AdminBadge tone={item.ok ? "green" : "gold"}>
                      {item.value}
                    </AdminBadge>
                  </div>
                  <p className="mt-1 text-[0.68rem] leading-relaxed text-ink-muted">
                    {item.hint}
                  </p>
                </li>
              ))}
            </ul>
          </AdminPanel>

          <AdminPanel title="Coordonnées manquantes">
            <p className="text-xs leading-relaxed text-ink-muted">
              {settings.contactEmail || settings.contactPhone
                ? "Les coordonnées renseignées sont publiques. Vérifiez qu’elles sont exactes et autorisées à la diffusion."
                : "Aucune adresse e-mail ni aucun téléphone n’est configuré. Le site affiche une mention explicite à la place. Ne renseignez que des coordonnées officielles."}
            </p>
          </AdminPanel>

          <AdminPanel title="Bonnes pratiques">
            <ul className="space-y-2 text-xs leading-relaxed text-ink-muted">
              <li>· Vérifier chaque information avant publication.</li>
              <li>· Ne pas publier de logo ou de nom de partenaire sans accord.</li>
              <li>· Maintenir l’année de création et le nom officiel exacts.</li>
              <li>
                · Préférer des coordonnées confirmées plutôt que des informations
                approximatives.
              </li>
            </ul>
          </AdminPanel>

          <AdminNotice tone="warning" title="Sécurité">
            Les identifiants, clés de service et secrets ne doivent jamais être
            saisis dans ce formulaire ni affichés sur le site public. Ils sont
            gérés exclusivement par les variables d’environnement.
          </AdminNotice>
        </div>
      </div>
    </div>
  );
}
