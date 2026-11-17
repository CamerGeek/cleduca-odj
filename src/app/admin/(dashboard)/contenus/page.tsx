import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { AdminBadge, AdminPageHeader, AdminPanel } from "@/components/admin/ui";
import { ButtonLink } from "@/components/ui/button";
import { requireSession } from "@/lib/auth/session";
import { adminCollectionList } from "@/lib/admin/collections";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import { collectionHasAudit, isPublicItem } from "@/lib/content/registry";
import type { CollectionKey } from "@/lib/content/types";

export const metadata = { title: "Contenus" };

export default async function ContentHubPage() {
  const session = await requireSession();
  const repository = await getRepository();

  const collections = adminCollectionList.filter((config) =>
    can(session.role, config.permission),
  );

  const entries = await Promise.all(
    collections.map(async (config) => {
      const items = await repository.list(config.key as CollectionKey, {
        includeUnpublished: true,
      });
      const published = items.filter((item) =>
        isPublicItem(config.key as CollectionKey, item),
      ).length;
      return {
        config,
        total: items.length,
        published,
      };
    }),
  );

  return (
    <div>
      <AdminPageHeader
        eyebrow="Gestion de contenu"
        title="Tous les contenus"
        description="Chaque collection est modifiable sans intervention technique. Un contenu n’apparaît sur le site public qu’après publication explicite."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {entries.map(({ config, total, published }) => (
          <Link
            key={config.key}
            href={`/admin/contenus/${config.key}`}
            className="group flex flex-col rounded-2xl border border-sand-300/80 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-forest-200 hover:shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-base font-bold text-forest-900">
                {config.title}
              </h2>
              <ArrowRight
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-ink-muted transition group-hover:translate-x-0.5 group-hover:text-forest-700"
              />
            </div>
            <p className="mt-1.5 flex-1 text-xs leading-relaxed text-ink-muted">
              {config.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <AdminBadge tone={published > 0 ? "green" : "neutral"}>
                {published} publié{published > 1 ? "s" : ""}
              </AdminBadge>
              <AdminBadge>{total} au total</AdminBadge>
              {collectionHasAudit(config.key as CollectionKey) ? null : (
                <AdminBadge tone="gold">Sans corbeille</AdminBadge>
              )}
            </div>
          </Link>
        ))}
      </div>

      {entries.length === 0 ? (
        <AdminPanel title="Accès restreint">
          <p className="text-sm text-ink-muted">
            Votre rôle ne permet pas de gérer les collections de contenu.
          </p>
        </AdminPanel>
      ) : null}

      <div className="mt-6 rounded-2xl border border-dashed border-sand-400/80 bg-sand-50 p-5 text-sm leading-relaxed text-ink-muted">
        <p className="font-display font-semibold text-forest-900">
          Règles appliquées automatiquement
        </p>
        <ul className="mt-2 space-y-1.5">
          <li>
            · Les partenaires ne peuvent être publiés sans référence
            d’autorisation documentée.
          </li>
          <li>
            · Les témoignages exigent un consentement documenté avant
            publication.
          </li>
          <li>
            · Les images doivent disposer d’un texte alternatif et d’un crédit
            lorsque nécessaire.
          </li>
          <li>
            · Les contenus supprimés sont conservés en corbeille (sauf médias)
            afin de préserver la traçabilité.
          </li>
        </ul>
      </div>

      {can(session.role, "media:write") ? (
        <div className="mt-6 flex flex-wrap gap-2">
          <ButtonLink href="/admin/mediatheque" variant="secondary" size="sm">
            <Plus aria-hidden className="size-4" />
            Ajouter un média
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
