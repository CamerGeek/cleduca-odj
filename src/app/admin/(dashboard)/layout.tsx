import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireSession } from "@/lib/auth/session";
import { getRepository } from "@/lib/content";
import { ROLE_PERMISSIONS } from "@/lib/content/repository";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireSession();
  const repository = await getRepository();

  return (
    <AdminShell
      user={{
        fullName: session.fullName,
        email: session.email,
        role: session.role,
      }}
      permissions={ROLE_PERMISSIONS[session.role]}
      mode={repository.mode}
      writable={repository.writable}
    >
      {children}
    </AdminShell>
  );
}
