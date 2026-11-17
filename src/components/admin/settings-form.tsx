"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Save } from "lucide-react";

import {
  saveSettingsAction,
  type SettingsActionState,
} from "@/app/admin/actions/settings";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/content/types";

const initialState: SettingsActionState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle aria-hidden className="size-4 animate-spin" />
          Enregistrement…
        </>
      ) : (
        <>
          <Save aria-hidden className="size-4" />
          Enregistrer les paramètres
        </>
      )}
    </Button>
  );
}

function Field({
  name,
  label,
  defaultValue,
  error,
  help,
  type = "text",
  placeholder,
  required,
  inputMode,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  error?: string;
  help?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
}) {
  const id = `settings-${name}`;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {required ? <span className="ml-1 text-gold-500">*</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field"
      />
      {help ? <p className="field-help">{help}</p> : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextArea({
  name,
  label,
  defaultValue,
  error,
  help,
  rows = 3,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  error?: string;
  help?: string;
  rows?: number;
}) {
  const id = `settings-${name}`;
  return (
    <div className="sm:col-span-2">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field resize-y"
      />
      {help ? <p className="field-help">{help}</p> : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState(saveSettingsAction, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-900"
        >
          {state.message}
        </div>
      ) : null}

      <section className="rounded-2xl border border-sand-300/80 bg-white shadow-soft">
        <div className="border-b border-sand-200 px-5 py-4 sm:px-6">
          <h2 className="font-display text-base font-bold text-forest-900">
            Identité institutionnelle
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Ces informations apparaissent dans les métadonnées, le pied de page et
            les contenus institutionnels. Utilisez uniquement les libellés
            officiels.
          </p>
        </div>
        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <Field
            name="siteName"
            label="Nom court"
            defaultValue={settings.siteName}
            error={errors.siteName}
            required
          />
          <Field
            name="fullName"
            label="Nom complet officiel"
            defaultValue={settings.fullName}
            error={errors.fullName}
            required
          />
          <TextArea
            name="tagline"
            label="Accroche institutionnelle"
            defaultValue={settings.tagline}
            error={errors.tagline}
            rows={2}
          />
          <TextArea
            name="positioning"
            label="Positionnement"
            defaultValue={settings.positioning}
            error={errors.positioning}
            rows={3}
          />
          <Field
            name="foundedYear"
            label="Année de création"
            type="number"
            inputMode="numeric"
            defaultValue={settings.foundedYear}
            error={errors.foundedYear}
            help="Année de reconnaissance officielle uniquement."
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              name="city"
              label="Ville"
              defaultValue={settings.city}
              error={errors.city}
            />
            <Field
              name="region"
              label="Région"
              defaultValue={settings.region}
              error={errors.region}
            />
          </div>
          <Field
            name="country"
            label="Pays"
            defaultValue={settings.country}
            error={errors.country}
          />
          <TextArea
            name="footerNote"
            label="Note de pied de page"
            defaultValue={settings.footerNote}
            error={errors.footerNote}
            rows={2}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-sand-300/80 bg-white shadow-soft">
        <div className="border-b border-sand-200 px-5 py-4 sm:px-6">
          <h2 className="font-display text-base font-bold text-forest-900">
            Coordonnées publiques
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Laissez vide si l’information n’est pas confirmée. Aucune coordonnée
            ne doit être inventée : les champs vides sont remplacés par une
            mention explicite sur le site.
          </p>
        </div>
        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <Field
            name="contactEmail"
            label="Adresse e-mail institutionnelle"
            type="email"
            inputMode="email"
            defaultValue={settings.contactEmail}
            error={errors.contactEmail}
            placeholder="contact@…"
          />
          <Field
            name="contactPhone"
            label="Téléphone"
            type="tel"
            inputMode="tel"
            defaultValue={settings.contactPhone}
            error={errors.contactPhone}
            placeholder="+226 …"
          />
          <TextArea
            name="contactAddress"
            label="Adresse postale"
            defaultValue={settings.contactAddress}
            error={errors.contactAddress}
            rows={2}
          />
          <TextArea
            name="contactHours"
            label="Horaires d’ouverture"
            defaultValue={settings.contactHours}
            error={errors.contactHours}
            rows={2}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-sand-300/80 bg-white shadow-soft">
        <div className="border-b border-sand-200 px-5 py-4 sm:px-6">
          <h2 className="font-display text-base font-bold text-forest-900">
            Réseaux sociaux
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Ne renseignez que des comptes officiels vérifiés. Les liens vides ne
            sont pas affichés.
          </p>
        </div>
        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <Field
            name="facebook"
            label="Facebook"
            type="url"
            inputMode="url"
            defaultValue={settings.socialLinks.facebook}
            error={errors.facebook}
            placeholder="https://facebook.com/…"
          />
          <Field
            name="instagram"
            label="Instagram"
            type="url"
            inputMode="url"
            defaultValue={settings.socialLinks.instagram}
            error={errors.instagram}
            placeholder="https://instagram.com/…"
          />
          <Field
            name="linkedin"
            label="LinkedIn"
            type="url"
            inputMode="url"
            defaultValue={settings.socialLinks.linkedin}
            error={errors.linkedin}
            placeholder="https://linkedin.com/…"
          />
          <Field
            name="youtube"
            label="YouTube"
            type="url"
            inputMode="url"
            defaultValue={settings.socialLinks.youtube}
            error={errors.youtube}
            placeholder="https://youtube.com/…"
          />
          <Field
            name="whatsapp"
            label="WhatsApp (lien wa.me)"
            type="url"
            inputMode="url"
            defaultValue={settings.socialLinks.whatsapp}
            error={errors.whatsapp}
            placeholder="https://wa.me/…"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-sand-300/80 bg-white shadow-soft">
        <div className="border-b border-sand-200 px-5 py-4 sm:px-6">
          <h2 className="font-display text-base font-bold text-forest-900">
            Page d’accueil
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Le message d’accueil présente l’organisation. Il doit rester factuel et
            conforme à son positionnement officiel.
          </p>
        </div>
        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <Field
            name="heroEyebrow"
            label="Sur-titre"
            defaultValue={settings.hero.eyebrow}
            error={errors.heroEyebrow}
          />
          <Field
            name="heroTitle"
            label="Titre principal"
            defaultValue={settings.hero.title}
            error={errors.heroTitle}
            required
          />
          <TextArea
            name="heroSubtitle"
            label="Sous-titre"
            defaultValue={settings.hero.subtitle}
            error={errors.heroSubtitle}
          />
          <Field
            name="heroPrimaryLabel"
            label="Libellé du bouton principal"
            defaultValue={settings.hero.primaryLabel}
            error={errors.heroPrimaryLabel}
          />
          <Field
            name="heroPrimaryHref"
            label="Lien du bouton principal"
            defaultValue={settings.hero.primaryHref}
            error={errors.heroPrimaryHref}
            placeholder="/a-propos"
          />
          <Field
            name="heroSecondaryLabel"
            label="Libellé du bouton secondaire"
            defaultValue={settings.hero.secondaryLabel}
            error={errors.heroSecondaryLabel}
          />
          <Field
            name="heroSecondaryHref"
            label="Lien du bouton secondaire"
            defaultValue={settings.hero.secondaryHref}
            error={errors.heroSecondaryHref}
            placeholder="/projets"
          />
          <Field
            name="heroImage"
            label="Image d’accueil"
            defaultValue={settings.hero.image}
            error={errors.heroImage}
            required
            help="Chemin interne ou URL. Vérifiez les droits et le crédit."
          />
          <Field
            name="heroImageAlt"
            label="Texte alternatif de l’image"
            defaultValue={settings.hero.imageAlt}
            error={errors.heroImageAlt}
            required
          />
          <TextArea
            name="heroCaption"
            label="Légende et crédit"
            defaultValue={settings.hero.caption}
            error={errors.heroCaption}
            rows={2}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-sand-300/80 bg-white shadow-soft">
        <div className="border-b border-sand-200 px-5 py-4 sm:px-6">
          <h2 className="font-display text-base font-bold text-forest-900">
            Lettre d’information
          </h2>
        </div>
        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <Field
            name="newsletterTitle"
            label="Titre du bloc"
            defaultValue={settings.newsletter.title}
            error={errors.newsletterTitle}
          />
          <TextArea
            name="newsletterDescription"
            label="Description"
            defaultValue={settings.newsletter.description}
            error={errors.newsletterDescription}
          />
          <TextArea
            name="newsletterConsentLabel"
            label="Libellé du consentement"
            defaultValue={settings.newsletter.consentLabel}
            error={errors.newsletterConsentLabel}
            help="Doit mentionner la possibilité de se désinscrire à tout moment."
          />
        </div>
      </section>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
