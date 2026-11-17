import { redirect } from "next/navigation";
import { Trash2 } from "lucide-react";

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
  CopyUrlButton,
  MediaUploadForm,
} from "@/components/admin/media-upload";
import { deleteMediaAction } from "@/app/admin/actions/media";
import { requireSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Médiathèque" };

function formatSize(size: number) {
  if (!size) return "—";
  if (size < 1024) return `${size} o`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} Ko`;
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; erreur?: string }>;
}) {
  const session = await requireSession();
  if (!can(session.role, "media:write")) {
    redirect("/admin/acces-refuse");
  }

  const query = await searchParams;
  const repository = await getRepository();
  const assets = await repository.list("media", { includeUnpublished: true });
  const uploaded = assets.filter((asset) => !asset.url.startsWith("/images/"));

  return (
    <div>
      <AdminPageHeader
        eyebrow="Ressources"
        title="Médiathèque"
        description="Centralisez les visuels du site, leurs textes alternatifs et leurs crédits. Chaque image publiée doit être autorisée et correctement décrite."
      />

      {query.statut === "ajoute" ? (
        <AdminNotice tone="success" className="mb-4">
          Image ajoutée à la médiathèque. Copiez son URL pour l’utiliser dans un
          contenu.
        </AdminNotice>
      ) : null}
      {query.statut === "supprime" ? (
        <AdminNotice tone="info" className="mb-4">
          Image supprimée de la médiathèque.
        </AdminNotice>
      ) : null}
      {query.erreur === "protege" ? (
        <AdminNotice tone="warning" className="mb-4">
          Cette image est fournie avec le site et ne peut pas être supprimée
          depuis la médiathèque.
        </AdminNotice>
      ) : null}
      {query.erreur ? (
        query.erreur !== "protege" ? (
          <AdminNotice tone="danger" className="mb-4">
            L’opération n’a pas pu aboutir. Réessayez ou vérifiez la configuration
            du stockage.
          </AdminNotice>
        ) : null
      ) : null}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <AdminStat label="Images au total" value={assets.length} tone="green" />
        <AdminStat
          label="Téléversées"
          value={uploaded.length}
          hint="Ajoutées depuis l’administration"
        />
        <AdminStat
          label="Fournies avec le site"
          value={assets.length - uploaded.length}
          hint="Visuels de référence"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-4">
          {assets.length === 0 ? (
            <AdminPanel>
              <AdminEmpty
                title="Médiathèque vide"
                description="Téléversez une première image pour l’utiliser dans vos contenus."
              />
            </AdminPanel>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {assets.map((asset) => {
                const seed = asset.url.startsWith("/images/");
                return (
                  <article
                    key={asset.id}
                    className="overflow-hidden rounded-2xl border border-sand-300/80 bg-white shadow-soft"
                  >
                    <div className="bg-sand-100">
                      {/* Vignette de médiathèque, source contrôlée. */}
                      <img
                        src={asset.url}
                        alt={asset.alt}
                        loading="lazy"
                        className="h-40 w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="break-all font-mono text-[0.72rem] font-semibold text-forest-900">
                          {asset.fileName}
                        </p>
                        {seed ? <AdminBadge>Fournie</AdminBadge> : null}
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                        {asset.alt}
                      </p>
                      <p className="mt-1.5 text-[0.68rem] text-ink-muted">
                        {formatSize(asset.size)} · {formatDate(asset.createdAt)}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <CopyUrlButton url={asset.url} />
                        {!seed ? (
                          <form action={deleteMediaAction}>
                            <input type="hidden" name="id" value={asset.id} />
                            <ConfirmSubmitButton
                              message="Supprimer cette image du stockage ? Vérifiez qu’elle n’est plus utilisée dans un contenu publié."
                              title="Supprimer l’image"
                              label="Supprimer l’image"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-sand-300 bg-white px-2.5 py-1.5 text-[0.7rem] font-semibold text-red-700 transition hover:border-red-200 hover:bg-red-50"
                            >
                              <Trash2 aria-hidden className="size-3.5" />
                              Supprimer
                            </ConfirmSubmitButton>
                          </form>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <AdminPanel
            title="Téléverser une image"
            description="Le fichier est stocké dans le stockage configuré du projet."
          >
            <MediaUploadForm />
          </AdminPanel>

          <AdminPanel title="Bonnes pratiques">
            <ul className="space-y-2 text-xs leading-relaxed text-ink-muted">
              <li>· Vérifier les droits d’utilisation et conserver le crédit.</li>
              <li>
                · Décrire factuellement la scène, sans supposer l’identité ou la
                situation des personnes.
              </li>
              <li>
                · Obtenir un consentement avant toute photo identifiable d’une
                personne.
              </li>
              <li>
                · Ne jamais publier de document contenant des données
                personnelles de bénéficiaires.
              </li>
              <li>
                · Privilégier des images respectueuses, qui ne réduisent pas les
                communautés à la pauvreté.
              </li>
            </ul>
          </AdminPanel>

          {repository.mode === "local" ? (
            <AdminNotice tone="warning" title="Stockage local">
              Les fichiers téléversés sont conservés dans{" "}
              <code className="font-mono text-xs">.data/uploads</code> sur cette
              machine. En production, configurez Supabase Storage pour une
              conservation durable.
            </AdminNotice>
          ) : null}
        </div>
      </div>
    </div>
  );
}
