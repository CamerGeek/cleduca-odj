import { AdminPageHeader } from "./ui";
import { CollectionForm } from "./collection-form";
import { publicItemHref } from "@/lib/admin/activity";
import type { AdminCollectionConfig } from "@/lib/admin/collections";
import { getRepository } from "@/lib/content";
import { isPublicItem } from "@/lib/content/registry";
import type { CollectionKey, CollectionMap } from "@/lib/content/types";

export async function CollectionEditor({
  config,
  item,
  canPublish,
}: {
  config: AdminCollectionConfig;
  item: CollectionMap[CollectionKey] | null;
  canPublish: boolean;
}) {
  const repository = await getRepository();
  const needsAreas = config.fields.some((field) => field.reference === "areas");
  const needsProjects = config.fields.some(
    (field) => field.reference === "projects",
  );

  const [areas, projects] = await Promise.all([
    needsAreas
      ? repository.list("areas", { includeUnpublished: true })
      : Promise.resolve([]),
    needsProjects
      ? repository.list("projects", { includeUnpublished: true })
      : Promise.resolve([]),
  ]);

  const record = item as unknown as Record<string, unknown> | null;
  const publicHref =
    item && isPublicItem(config.key, item)
      ? publicItemHref(config.key, config.publicBase, record ?? {})
      : null;

  return (
    <div>
      <AdminPageHeader
        eyebrow={item ? "Modification" : "Création"}
        title={
          item
            ? String(record?.[config.titleField] || config.singular)
            : `Nouveau ${config.singular.toLowerCase()}`
        }
        description={config.description}
      />
      <CollectionForm
        collection={config.key}
        singular={config.singular}
        fields={config.fields}
        statusMode={config.statusMode}
        titleField={config.titleField}
        initial={record}
        defaults={config.defaults}
        references={{
          areas: areas.map((area) => ({
            value: area.slug,
            label: area.shortTitle || area.title,
          })),
          projects: projects.map((project) => ({
            value: project.slug,
            label: `${project.acronym} — ${project.title}`,
          })),
        }}
        canPublish={canPublish}
        publicHref={publicHref}
        cancelHref={`/admin/contenus/${config.key}`}
      />
    </div>
  );
}
