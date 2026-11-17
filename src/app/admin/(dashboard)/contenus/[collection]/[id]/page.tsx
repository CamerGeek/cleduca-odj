import { notFound, redirect } from "next/navigation";

import { CollectionEditor } from "@/components/admin/collection-editor";
import { getAdminCollection } from "@/lib/admin/collections";
import { requireSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { can } from "@/lib/content/repository";
import type { CollectionKey } from "@/lib/content/types";

export const metadata = { title: "Modifier un contenu" };

export default async function EditCollectionItemPage({
  params,
}: {
  params: Promise<{ collection: string; id: string }>;
}) {
  const session = await requireSession();
  const { collection, id } = await params;
  const config = getAdminCollection(collection);

  if (!config) notFound();
  if (!can(session.role, config.permission)) {
    redirect("/admin/acces-refuse");
  }

  const repository = await getRepository();
  const item = await repository.getById(config.key as CollectionKey, id, {
    includeUnpublished: true,
  });

  if (!item) notFound();

  return (
    <CollectionEditor
      config={config}
      item={item}
      canPublish={can(session.role, "content:publish")}
    />
  );
}
