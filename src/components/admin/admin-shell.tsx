"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import {
  Activity,
  BookOpenText,
  CalendarDays,
  ChartNoAxesCombined,
  ExternalLink,
  FileText,
  FolderKanban,
  Images,
  LayoutDashboard,
  LayoutList,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  ScrollText,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";

import { logoutAction } from "@/app/admin/actions/auth";
import { siteConfig } from "@/config/site";
import { ROLE_LABELS, type Role } from "@/lib/content/types";
import { cn, initials } from "@/lib/utils";

type NavIcon = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

interface NavItem {
  href: string;
  label: string;
  icon: NavIcon;
  permission?: string;
  exact?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    label: "Pilotage",
    items: [
      {
        href: "/admin",
        label: "Tableau de bord",
        icon: LayoutDashboard,
        exact: true,
        permission: "content:read",
      },
    ],
  },
  {
    label: "Contenus",
    items: [
      {
        href: "/admin/contenus",
        label: "Tous les contenus",
        icon: LayoutList,
        exact: true,
        permission: "content:read",
      },
      {
        href: "/admin/contenus/projects",
        label: "Projets",
        icon: FolderKanban,
        permission: "content:read",
      },
      {
        href: "/admin/contenus/articles",
        label: "Actualités",
        icon: Newspaper,
        permission: "content:read",
      },
      {
        href: "/admin/contenus/pages",
        label: "Pages institutionnelles",
        icon: BookOpenText,
        permission: "content:read",
      },
      {
        href: "/admin/contenus/publications",
        label: "Publications",
        icon: FileText,
        permission: "content:read",
      },
      {
        href: "/admin/contenus/events",
        label: "Événements",
        icon: CalendarDays,
        permission: "content:read",
      },
      {
        href: "/admin/contenus/indicators",
        label: "Indicateurs d’impact",
        icon: ChartNoAxesCombined,
        permission: "impact:write",
        exact: false,
      },
      {
        href: "/admin/contenus/milestones",
        label: "Jalons historiques",
        icon: Activity,
        permission: "impact:write",
      },
    ],
  },
  {
    label: "Communication",
    items: [
      {
        href: "/admin/messages",
        label: "Messages reçus",
        icon: Mail,
        permission: "communication:manage",
      },
      {
        href: "/admin/abonnes",
        label: "Abonnés",
        icon: Users,
        permission: "communication:manage",
      },
      {
        href: "/admin/mediatheque",
        label: "Médiathèque",
        icon: Images,
        permission: "media:write",
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        href: "/admin/utilisateurs",
        label: "Utilisateurs et rôles",
        icon: UserCog,
        permission: "users:manage",
      },
      {
        href: "/admin/parametres",
        label: "Paramètres du site",
        icon: Settings,
        permission: "settings:manage",
      },
      {
        href: "/admin/journal",
        label: "Journal d’activité",
        icon: ScrollText,
        permission: "logs:read",
      },
    ],
  },
];

function isActive(pathname: string, item: NavItem) {
  if (item.href === "/admin/contenus") {
    return pathname === "/admin/contenus";
  }
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function pageTitle(pathname: string) {
  if (pathname.startsWith("/admin/contenus/")) return "Gestion des contenus";
  if (pathname === "/admin/contenus") return "Tous les contenus";
  const match = navigation
    .flatMap((group) => group.items)
    .filter((item) => isActive(pathname, item))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? "Administration";
}

export function AdminShell({
  children,
  user,
  permissions,
  mode,
  writable,
}: {
  children: ReactNode;
  user: { fullName: string; email: string; role: Role };
  permissions: readonly string[];
  mode: "local" | "supabase";
  writable: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const title = pageTitle(pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const allowed = (permission?: string) =>
    !permission || permissions.includes(permission);

  const groups = navigation
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => allowed(item.permission)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="min-h-screen lg:pl-72">
      {open ? (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-forest-950/40 backdrop-blur-[2px] lg:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-forest-950/20 bg-forest-900 text-white transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-5">
          <Link href="/admin" className="flex items-center gap-6">
            <span className="flex size-10 items-center justify-center rounded-full bg-white p-1">
              <Image
                src={siteConfig.logoPath}
                alt={`Logo ${siteConfig.name}`}
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
            </span>
            <span>
              <span className="block font-display text-sm font-bold tracking-tight">
                {siteConfig.name}
              </span>
              <span className="block text-[0.65rem] uppercase tracking-[0.16em] text-white/50">
                Administration
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>

        <nav
          aria-label="Navigation de l’administration"
          className="flex-1 space-y-6 overflow-y-auto px-3 pb-6"
        >
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 font-display text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/40">
                {group.label}
              </p>
              <ul className="mt-2 space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(pathname, item);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                          active
                            ? "bg-white/12 font-semibold text-white shadow-[inset_3px_0_0_var(--color-gold-400)]"
                            : "text-white/70 hover:bg-white/8 hover:text-white",
                        )}
                      >
                        <Icon aria-hidden className="size-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-400 font-display text-xs font-bold text-forest-950">
              {initials(user.fullName) || "AD"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user.fullName}
              </p>
              <p className="truncate text-[0.68rem] text-white/50">
                {ROLE_LABELS[user.role]}
              </p>
            </div>
          </div>
          <form action={logoutAction} className="mt-3">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-white/75 transition hover:border-white/35 hover:text-white"
            >
              <LogOut aria-hidden className="size-3.5" />
              Se déconnecter
            </button>
          </form>
          <p className="mt-3 flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.14em] text-white/35">
            <ShieldCheck aria-hidden className="size-3" />
            {mode === "supabase" ? "Supabase" : "Stockage local"}
          </p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-sand-300/70 bg-sand-100/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-10">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={open}
              className="rounded-xl border border-sand-300 bg-white p-2 text-forest-900 lg:hidden"
            >
              <Menu aria-hidden className="size-5" />
            </button>
            <div className="min-w-0">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Administration
              </p>
              <p className="truncate font-display text-sm font-bold text-forest-900">
                {title}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 bg-white px-3 py-2 text-xs font-semibold text-forest-800 transition hover:border-forest-300 hover:bg-forest-50"
              >
                <ExternalLink aria-hidden className="size-3.5" />
                <span className="hidden sm:inline">Voir le site</span>
              </Link>
              <span className="hidden size-9 items-center justify-center rounded-full bg-forest-800 font-display text-xs font-bold text-white sm:flex">
                {initials(user.fullName) || "AD"}
              </span>
            </div>
          </div>
        </header>

        <main id="contenu" className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
          {mode === "local" || !writable ? (
            <div className="mb-6 space-y-2">
              {mode === "local" ? (
                <p className="rounded-xl border border-gold-200 bg-gold-100 px-4 py-2.5 text-xs leading-relaxed text-gold-600">
                  <strong className="font-semibold">Mode local.</strong> Les
                  modifications sont enregistrées dans{" "}
                  <code className="font-mono">.data/content.json</code>. Pour un
                  déploiement en production, configurez Supabase et les variables
                  d’environnement correspondantes.
                </p>
              ) : null}
              {!writable ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs leading-relaxed text-red-800">
                  Le stockage local est en lecture seule sur cet environnement.
                  Toute modification sera refusée.
                </p>
              ) : null}
            </div>
          ) : null}
          {children}
        </main>

        <footer className="border-t border-sand-300/70 px-4 py-4 text-[0.68rem] text-ink-muted sm:px-6 lg:px-10">
          {siteConfig.name} · Espace d’administration réservé aux personnes
          habilitées. Toutes les actions sont journalisées.
        </footer>
      </div>
    </div>
  );
}
