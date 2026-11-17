import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { AdminBadge } from "@/components/admin/ui";
import { ButtonLink } from "@/components/ui/button";
import { requireSession } from "@/lib/auth/session";
import { ROLE_LABELS } from "@/lib/content/types";

export const metadata = { title: "Accès refusé" };

export default async function AccessDeniedPage() {
  const session = await requireSession();

  return (
    <div className="mx-auto max-w-xl py-10 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold-100 text-gold-600">
        <ShieldAlert aria-hidden className="size-7" />
      </span>
      <p className="eyebrow mt-6 text-forest-600">Autorisation insuffisante</p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-forest-900">
        Votre rôle ne donne pas accès à cette page.
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
        Vous êtes connecté avec le rôle{" "}
        <AdminBadge tone="neutral">{ROLE_LABELS[session.role]}</AdminBadge>. Si
        vous pensez avoir besoin de cette fonction, demandez à un super
        administrateur d’ajuster vos droits.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <ButtonLink href="/admin" size="sm">
          Retour au tableau de bord
        </ButtonLink>
        <ButtonLink href="/" size="sm" variant="secondary">
          Voir le site public
        </ButtonLink>
      </div>
      <p className="mt-6 text-xs text-ink-muted">
        Cette tentative n’a pas modifié les contenus.{" "}
        <Link href="/admin/connexion" className="link-underline">
          Changer de compte
        </Link>
      </p>
    </div>
  );
}
