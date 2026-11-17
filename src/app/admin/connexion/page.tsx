import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { siteConfig } from "@/config/site";
import { getSession, isSessionConfigured } from "@/lib/auth/session";
import { hasSupabaseConfig } from "@/lib/supabase/server";
import { LoginForm } from "@/components/admin/login-form";
import { AdminNotice } from "@/components/admin/ui";

export const metadata = { title: "Connexion" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/admin");

  const { next } = await searchParams;
  const requestedNext =
    typeof next === "string" && next.startsWith("/admin") && !next.startsWith("//")
      ? next
      : "";

  const secretConfigured = isSessionConfigured();
  const supabaseMode = hasSupabaseConfig();

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-forest-900 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pattern-weave pointer-events-none absolute inset-0 opacity-40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/3 size-80 rounded-full bg-leaf-500/20 blur-3xl"
        />
        <div className="relative">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-full text-white"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-white p-1">
              <Image
                src={siteConfig.logoPath}
                alt={`Logo ${siteConfig.name}`}
                width={48}
                height={48}
                className="h-full w-full object-contain"
                priority
              />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              {siteConfig.name}
            </span>
          </Link>

          <p className="eyebrow mt-16 text-leaf-300">Espace d’administration</p>
          <h1 className="mt-4 max-w-md font-display text-4xl font-bold leading-[1.1] tracking-tight">
            Gérer les contenus institutionnels avec rigueur.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
            Cet espace permet à l’équipe habilitée de préparer, relire et publier
            les informations vérifiées de {siteConfig.fullName}. Aucune donnée
            personnelle de bénéficiaire n’y est collectée.
          </p>
        </div>

        <div className="relative rounded-2xl border border-white/15 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-leaf-200">
            <ShieldCheck aria-hidden className="size-4" />
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em]">
              Règles éditoriales
            </p>
          </div>
          <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-white/70">
            <li>· Publier uniquement des informations vérifiées.</li>
            <li>· Ne jamais inventer de chiffres, de partenaires ou de jalons.</li>
            <li>· Obtenir un consentement avant toute photo ou citation identifiable.</li>
          </ul>
        </div>
      </aside>

      <main className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-display text-sm font-semibold text-forest-800"
            >
              <ArrowLeft aria-hidden className="size-4" />
              Retour au site
            </Link>
            <Image
              src={siteConfig.logoPath}
              alt={`Logo ${siteConfig.name}`}
              width={40}
              height={40}
              className="size-10 object-contain"
            />
          </div>

          <p className="eyebrow text-forest-600">Administration</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-forest-900">
            Connexion sécurisée
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Utilisez le compte qui vous a été attribué par un super administrateur.
          </p>

          <div className="mt-6 space-y-4">
            {!secretConfigured ? (
              <AdminNotice tone="danger" title="Configuration incomplète">
                La variable <code className="font-mono text-xs">AUTH_SECRET</code>{" "}
                n’est pas définie sur le serveur. La connexion est impossible tant
                que cette valeur n’est pas configurée (16 caractères minimum).
              </AdminNotice>
            ) : null}

            {!supabaseMode ? (
              <AdminNotice tone="warning" title="Mode local actif">
                Les contenus sont stockés dans{" "}
                <code className="font-mono text-xs">.data/content.json</code>. La
                connexion utilise les identifiants{" "}
                <code className="font-mono text-xs">ADMIN_EMAIL</code> et{" "}
                <code className="font-mono text-xs">ADMIN_PASSWORD</code>. Ce mode
                convient au développement local, pas à la production.
              </AdminNotice>
            ) : null}

            <div className="rounded-2xl border border-sand-300/80 bg-white p-6 shadow-card sm:p-7">
              <LoginForm next={requestedNext} />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-ink-muted">
            <Link href="/" className="link-underline font-medium text-forest-800">
              Retour au site public
            </Link>
            <span>
              {supabaseMode ? "Authentification Supabase" : "Authentification locale"}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
