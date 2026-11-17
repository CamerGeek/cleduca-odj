import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";
import type { SiteSettings } from "@/lib/content/types";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "./social-icons";

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
  whatsapp: WhatsappIcon,
} as const;

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-1 text-sm text-white/70 transition hover:text-white"
      >
        {label}
        <ArrowUpRight
          aria-hidden
          className="size-3 opacity-0 transition group-hover:opacity-60"
        />
      </Link>
    </li>
  );
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const socials = Object.entries(settings.socialLinks).filter(
    ([, url]) => Boolean(url),
  ) as Array<[keyof typeof socialIcons, string]>;

  return (
    <footer className="relative overflow-hidden bg-forest-950 text-white">
      <div
        aria-hidden
        className="pattern-weave pointer-events-none absolute inset-0 opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 size-[26rem] rounded-full bg-forest-700/30 blur-3xl"
      />
      <div className="container-site relative">
        <div className="grid gap-12 border-b border-white/10 py-14 md:grid-cols-2 lg:grid-cols-[1.25fr_0.65fr_0.65fr_1fr] lg:gap-10">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 ring-1 ring-white/20">
                <Image
                  src={siteConfig.logoPath}
                  alt="Logo de CLEDUCA-ODJ"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </span>
              <span>
                <span className="block font-display text-lg font-extrabold tracking-[-0.02em]">
                  CLEDUCA-ODJ
                </span>
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-leaf-300">
                  Depuis 1997 · Burkina Faso
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              {settings.footerNote}
            </p>
            <p className="mt-4 font-display text-sm font-semibold leading-relaxed text-gold-300">
              {settings.tagline}
            </p>
            {socials.length > 0 ? (
              <ul className="mt-6 flex items-center gap-2">
                {socials.map(([key, url]) => {
                  const Icon = socialIcons[key];
                  return (
                    <li key={key}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`CLEDUCA-ODJ sur ${key}`}
                        className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-white/75 transition hover:border-gold-400/60 hover:text-white"
                      >
                        <Icon aria-hidden className="size-4" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Liens institutionnels">
            <h2 className="font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold-300">
              Institution
            </h2>
            <ul className="mt-4 space-y-3">
              {siteConfig.footerNavigation.institution.map((item) => (
                <FooterLink key={item.href} {...item} />
              ))}
            </ul>
          </nav>

          <nav aria-label="Liens d’action">
            <h2 className="font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold-300">
              Explorer
            </h2>
            <ul className="mt-4 space-y-3">
              {siteConfig.footerNavigation.action.map((item) => (
                <FooterLink key={item.href} {...item} />
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold-300">
              Contact
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2.5">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-leaf-300" />
                <span>
                  {settings.contactAddress ||
                    "Bobo-Dioulasso, Hauts-Bassins, Burkina Faso"}
                </span>
              </li>
              {settings.contactPhone ? (
                <li className="flex items-start gap-2.5">
                  <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-leaf-300" />
                  <a href={`tel:${settings.contactPhone}`} className="hover:text-white">
                    {settings.contactPhone}
                  </a>
                </li>
              ) : null}
              {settings.contactEmail ? (
                <li className="flex items-start gap-2.5">
                  <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-leaf-300" />
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="break-all hover:text-white"
                  >
                    {settings.contactEmail}
                  </a>
                </li>
              ) : null}
              {settings.contactHours ? (
                <li className="pl-[1.6rem] text-white/55">{settings.contactHours}</li>
              ) : null}
            </ul>
            {!settings.contactEmail || !settings.contactPhone ? (
              <p className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[0.7rem] leading-relaxed text-white/50">
                Les coordonnées téléphoniques et électroniques officielles seront
                publiées après validation par l’association. Utilisez le formulaire
                de contact en attendant.
              </p>
            ) : null}
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 font-display text-[0.8rem] font-semibold text-white transition hover:bg-white/20"
            >
              Écrire à l’organisation
              <ArrowUpRight aria-hidden className="size-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-5 py-7">
          <div className="flex flex-col gap-3 text-[0.72rem] text-white/45 md:flex-row md:items-center md:justify-between">
            <p>
              © {year} CLEDUCA-ODJ — {settings.fullName}. Tous droits réservés.
            </p>
            <p className="text-white/35">
              Organisation de la société civile à but non lucratif · Burkina Faso
            </p>
          </div>
          <nav aria-label="Informations légales">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.72rem]">
              {siteConfig.legalNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/50 underline decoration-white/20 underline-offset-4 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
