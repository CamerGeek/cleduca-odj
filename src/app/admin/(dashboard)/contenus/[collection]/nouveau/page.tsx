import { notFound, redirect } from "next/navigation";

import { CollectionEditor } from "@/components/admin/collection-editor";
import { getAdminCollection } from "@/lib/admin/collections";
import { requireSession } from "@/lib/auth/session";
import { can } from "@/lib/content/repository";

export const metadata = { title: "Nouveau contenu" };

export default async function NewCollectionItemPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const session = await requireSession();
  const { collection } = await params;
  const config = getAdminCollection(collection);

  if (!config) notFound();
  if (!can(session.role, config.permission)) {
    redirect("/admin/acces-refuse");
  }

  return (
    <CollectionEditor
      config={config}
      item={null}
      canPublish={can(session.role, "content:publish")}
    />
  );
}
