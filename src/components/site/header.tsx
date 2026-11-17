"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const navigation = siteConfig.navigation;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden border-b border-white/10 bg-forest-950 text-white sm:block">
        <div className="container-site flex h-9 items-center justify-between gap-4 text-[0.68rem] font-medium tracking-wide">
          <p className="flex items-center gap-2 text-white/80">
            <span aria-hidden className="size-1.5 rounded-full bg-gold-400" />
            Organisation reconnue de la société civile · Bobo-Dioulasso
          </p>
          <p className="hidden text-white/60 md:block">
            Depuis 1997 · Hauts-Bassins, Burkina Faso
          </p>
        </div>
      </div>

      <div
        className={cn(
          "border-b bg-white/95 backdrop-blur-md transition-shadow duration-300",
          scrolled
            ? "border-sand-300/90 shadow-[0_12px_30px_-24px_rgba(16,74,53,0.45)]"
            : "border-sand-300/50",
        )}
      >
        <div className="container-site flex h-[4.4rem] items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3 rounded-xl"
            aria-label="CLEDUCA-ODJ — retour à l’accueil"
          >
            <span className="relative flex size-11 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-forest-900/10 transition group-hover:ring-forest-600/30">
              <Image
                src={siteConfig.logoPath}
                alt="Logo de CLEDUCA-ODJ"
                width={44}
                height={44}
                className="size-11 object-contain"
                priority
              />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[1.02rem] font-extrabold tracking-[-0.02em] text-forest-950">
                CLEDUCA-ODJ
              </span>
              <span className="hidden text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ink-muted sm:block">
                Éducation · Jeunesse · Communautés
              </span>
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {navigation.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative rounded-full px-2.5 py-2 text-[0.83rem] font-semibold transition xl:px-3",
                        active
                          ? "text-forest-800"
                          : "text-ink-soft hover:bg-forest-50 hover:text-forest-800",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gold-400 transition-opacity",
                          active ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="hidden items-center gap-2 rounded-full border border-forest-800/15 px-4 py-2 font-display text-[0.82rem] font-semibold text-forest-900 transition hover:border-forest-800/40 hover:bg-forest-50 sm:inline-flex"
            >
              Nous contacter
            </Link>
            <Link
              href="/contact#s-engager"
              className="hidden items-center gap-1.5 rounded-full bg-forest-700 px-4 py-2.5 font-display text-[0.82rem] font-semibold text-white shadow-[0_12px_24px_-16px_rgba(16,74,53,0.9)] transition hover:bg-forest-800 md:inline-flex"
            >
              S’engager
              <ArrowUpRight aria-hidden className="size-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className="inline-flex size-10 items-center justify-center rounded-full border border-sand-400/70 text-forest-900 transition hover:bg-forest-50 lg:hidden"
            >
              {open ? (
                <X aria-hidden className="size-5" />
              ) : (
                <Menu aria-hidden className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div
          id="menu-mobile"
          className="max-h-[calc(100dvh-4.4rem)] overflow-y-auto border-b border-sand-300 bg-white shadow-lift lg:hidden"
        >
          <nav aria-label="Navigation mobile" className="container-site py-5">
            <ul className="divide-y divide-sand-200">
              {navigation.map((item, index) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between gap-4 py-3.5 font-display text-[1.02rem] font-semibold",
                      isActive(pathname, item.href)
                        ? "text-forest-700"
                        : "text-forest-950",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-[0.68rem] font-bold tabular-nums text-gold-500">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </span>
                    <ArrowUpRight aria-hidden className="size-4 text-ink-muted" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-2.5">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-700 px-5 py-3 font-display text-sm font-semibold text-white transition hover:bg-forest-800"
              >
                Nous contacter
                <ArrowUpRight aria-hidden className="size-4" />
              </Link>
              <p className="pt-1 text-center text-[0.72rem] text-ink-muted">
                Bobo-Dioulasso · Hauts-Bassins · Burkina Faso
              </p>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
