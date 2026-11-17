"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import {
  saveCollectionItem,
  type CollectionActionState,
} from "@/app/admin/actions/content";
import type { AdminField, AdminStatusMode } from "@/lib/admin/collections";
import { CONTENT_STATUS_LABELS, type ContentStatus } from "@/lib/content/types";
import { Button, buttonClasses } from "@/components/ui/button";
import { cn, slugify } from "@/lib/utils";

interface ReferenceOption {
  value: string;
  label: string;
}

interface GalleryRow {
  url: string;
  alt: string;
  caption: string;
}

interface DocumentRow {
  title: string;
  url: string;
}

interface SectionRow {
  id: string;
  title: string;
  body: string;
}

const initialState: CollectionActionState = { status: "idle", message: "" };

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function arrayValue(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function toDateTimeInput(value: unknown) {
  const raw = stringValue(value);
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (input: number) => String(input).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toDateInput(value: unknown) {
  const raw = stringValue(value);
  if (!raw) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  return toDateTimeInput(raw).slice(0, 10);
}

function toGallery(value: unknown): GalleryRow[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    const record = asRecord(entry);
    return {
      url: stringValue(record.url),
      alt: stringValue(record.alt),
      caption: stringValue(record.caption),
    };
  });
}

function toDocuments(value: unknown): DocumentRow[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    const record = asRecord(entry);
    return {
      title: stringValue(record.title),
      url: stringValue(record.url),
    };
  });
}

function toSections(value: unknown): SectionRow[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    const record = asRecord(entry);
    return {
      id: stringValue(record.id),
      title: stringValue(record.title),
      body: stringValue(record.body),
    };
  });
}

function SubmitButton({ label }: { label: string }) {
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
          {label}
        </>
      )}
    </Button>
  );
}

export function CollectionForm({
  collection,
  singular,
  fields,
  statusMode,
  titleField,
  initial,
  defaults,
  references,
  canPublish,
  publicHref,
  cancelHref,
}: {
  collection: string;
  singular: string;
  fields: AdminField[];
  statusMode: AdminStatusMode;
  titleField: string;
  initial: Record<string, unknown> | null;
  defaults: Record<string, unknown>;
  references: { areas: ReferenceOption[]; projects: ReferenceOption[] };
  canPublish: boolean;
  publicHref: string | null;
  cancelHref: string;
}) {
  const [state, formAction] = useActionState(saveCollectionItem, initialState);
  const errors = state.fieldErrors ?? {};

  const read = (name: string) =>
    initial ? (initial[name] ?? defaults[name]) : defaults[name];
  const [slug, setSlug] = useState(() => stringValue(read("slug")));
  const [slugTouched, setSlugTouched] = useState(() =>
    Boolean(stringValue(read("slug"))),
  );
  const [images, setImages] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields
        .filter((field) => field.type === "image")
        .map((field) => [field.name, stringValue(read(field.name))]),
    ),
  );
  const [gallery, setGallery] = useState<GalleryRow[]>(() =>
    toGallery(read("gallery")),
  );
  const [documents, setDocuments] = useState<DocumentRow[]>(() =>
    toDocuments(read("documents")),
  );
  const [sections, setSections] = useState<SectionRow[]>(() =>
    toSections(read("sections")),
  );
  const [checked, setChecked] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      fields
        .filter((field) => field.type === "checkboxes")
        .map((field) => [field.name, arrayValue(read(field.name))]),
    ),
  );

  const statusValue = (() => {
    if (statusMode === "content") {
      const value = stringValue(read("contentStatus"), "draft");
      return value in CONTENT_STATUS_LABELS ? value : "draft";
    }
    if (statusMode === "publication") {
      const value = stringValue(read("status"), "draft");
      return value in CONTENT_STATUS_LABELS ? value : "draft";
    }
    return read("published") === true ? "published" : "draft";
  })();

  const titleValue = stringValue(read(titleField));

  const toggleChecked = (name: string, value: string) => {
    setChecked((current) => {
      const list = current[name] ?? [];
      return {
        ...current,
        [name]: list.includes(value)
          ? list.filter((entry) => entry !== value)
          : [...list, value],
      };
    });
  };

  const move = <T,>(
    list: T[],
    setList: (next: T[]) => void,
    index: number,
    direction: -1 | 1,
  ) => {
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    const [entry] = next.splice(index, 1);
    next.splice(target, 0, entry);
    setList(next);
  };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="__collection" value={collection} />
      <input type="hidden" name="__id" value={stringValue(initial?.id)} />
      <input type="hidden" name="gallery" value={JSON.stringify(gallery)} />
      <input type="hidden" name="documents" value={JSON.stringify(documents)} />
      <input type="hidden" name="sections" value={JSON.stringify(sections)} />

      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-900"
        >
          {state.message}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={cancelHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:underline"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Retour à la liste
        </Link>
        {publicHref ? (
          <a
            href={publicHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-forest-800"
          >
            <ExternalLink aria-hidden className="size-3.5" />
            Voir sur le site
          </a>
        ) : null}
      </div>

      <section className="rounded-2xl border border-sand-300/80 bg-white shadow-soft">
        <div className="border-b border-sand-200 px-5 py-4 sm:px-6">
          <h2 className="font-display text-base font-bold text-forest-900">
            Informations
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Renseignez uniquement des informations vérifiées. Les champs marqués
            d’un astérisque sont requis.
          </p>
        </div>
        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6">
          {fields.map((field) => {
            const value = read(field.name);
            const error = errors[field.name];

            return (
              <div
                key={field.name}
                className={cn(field.full && "sm:col-span-2")}
              >
                {renderField({
                  field,
                  value,
                  error,
                  slug,
                  slugTouched,
                  titleValue,
                  images,
                  gallery,
                  documents,
                  sections,
                  checked,
                  references,
                  onSlugChange: (next) => {
                    setSlug(next);
                    setSlugTouched(true);
                  },
                  onTitleMaybe: (next) => {
                    if (!slugTouched) setSlug(slugify(next));
                  },
                  onImageChange: (next) =>
                    setImages((current) => ({ ...current, [field.name]: next })),
                  setGallery,
                  setDocuments,
                  setSections,
                  toggleChecked,
                  move,
                })}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-sand-300/80 bg-white shadow-soft">
        <div className="border-b border-sand-200 px-5 py-4 sm:px-6">
          <h2 className="font-display text-base font-bold text-forest-900">
            Publication
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Le statut détermine la visibilité sur le site public. Un contenu
            enregistré en brouillon reste invisible.
          </p>
        </div>
        <div className="px-5 py-5 sm:px-6">
          {statusMode === "boolean" ? (
            <div className="space-y-3">
              <label className="flex items-start gap-3 rounded-xl border border-sand-300 bg-sand-50 px-4 py-3">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={statusValue === "published"}
                  disabled={!canPublish}
                  className="mt-0.5 size-4 accent-forest-700"
                />
                <span>
                  <span className="block text-sm font-semibold text-forest-900">
                    Publier sur le site
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                    {collection === "partners"
                      ? "La publication exige une référence d’autorisation documentée ci-dessus."
                      : collection === "testimonials"
                        ? "La publication exige un consentement documenté et coché ci-dessus."
                        : "L’élément n’apparaît sur le site public que si cette case est cochée."}
                  </span>
                </span>
              </label>
              {!canPublish ? (
                <p className="text-xs leading-relaxed text-ink-muted">
                  Votre rôle permet de préparer le contenu, mais pas de le
                  publier. Un éditeur ou un administrateur validera la mise en
                  ligne.
                </p>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-3 sm:max-w-sm">
              <label
                htmlFor="publication-status"
                className="field-label"
              >
                Statut de publication
              </label>
              <select
                id="publication-status"
                name={statusMode === "content" ? "contentStatus" : "status"}
                defaultValue={statusValue}
                disabled={!canPublish}
                className="field"
              >
                {Object.entries(CONTENT_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key as ContentStatus}>
                    {label}
                  </option>
                ))}
              </select>
              <p className="field-help">
                {canPublish
                  ? "Publiez après relecture. Les statuts « En relecture » et « Archivé » restent invisibles sur le site public."
                  : "Votre rôle permet d’enregistrer des brouillons ; un éditeur ou un administrateur validera la publication."}
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Link href={cancelHref} className={buttonClasses({ variant: "ghost" })}>
          Annuler
        </Link>
        <SubmitButton label={`Enregistrer ${singular.toLowerCase()}`} />
      </div>
    </form>
  );
}

function FieldShell({
  field,
  error,
  children,
}: {
  field: AdminField;
  error?: string;
  children: ReactNode;
}) {
  return (
    <>
      <label htmlFor={`champ-${field.name}`} className="field-label">
        {field.label}
        {field.required ? (
          <span aria-hidden className="ml-1 text-gold-500">
            *
          </span>
        ) : null}
      </label>
      {children}
      {field.help ? <p className="field-help">{field.help}</p> : null}
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </>
  );
}

function renderField({
  field,
  value,
  error,
  slug,
  slugTouched,
  titleValue,
  images,
  gallery,
  documents,
  sections,
  checked,
  references,
  onSlugChange,
  onTitleMaybe,
  onImageChange,
  setGallery,
  setDocuments,
  setSections,
  toggleChecked,
  move,
}: {
  field: AdminField;
  value: unknown;
  error?: string;
  slug: string;
  slugTouched: boolean;
  titleValue: string;
  images: Record<string, string>;
  gallery: GalleryRow[];
  documents: DocumentRow[];
  sections: SectionRow[];
  checked: Record<string, string[]>;
  references: { areas: ReferenceOption[]; projects: ReferenceOption[] };
  onSlugChange: (value: string) => void;
  onTitleMaybe: (value: string) => void;
  onImageChange: (value: string) => void;
  setGallery: (value: GalleryRow[]) => void;
  setDocuments: (value: DocumentRow[]) => void;
  setSections: (value: SectionRow[]) => void;
  toggleChecked: (name: string, value: string) => void;
  move: <T>(
    list: T[],
    setList: (next: T[]) => void,
    index: number,
    direction: -1 | 1,
  ) => void;
}) {
  const id = `champ-${field.name}`;
  const describedBy = error ? `${id}-erreur` : undefined;
  const invalid = Boolean(error);

  switch (field.type) {
    case "textarea":
    case "markdown":
    case "lines":
    case "tags": {
      const text = Array.isArray(value)
        ? value.join(field.type === "tags" ? ", " : "\n")
        : stringValue(value);
      return (
        <FieldShell field={field} error={error}>
          <textarea
            id={id}
            name={field.name}
            rows={field.rows ?? (field.type === "markdown" ? 10 : 3)}
            required={field.required}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={cn(
              "field resize-y",
              field.type === "markdown" && "font-mono text-[0.85rem] leading-relaxed",
            )}
            placeholder={field.placeholder}
            defaultValue={text}
          />
        </FieldShell>
      );
    }

    case "boolean":
      return (
        <label className="flex items-start gap-3 rounded-xl border border-sand-300 bg-sand-50 px-4 py-3">
          <input
            type="checkbox"
            name={field.name}
            defaultChecked={value === true}
            className="mt-0.5 size-4 accent-forest-700"
          />
          <span>
            <span className="block text-sm font-semibold text-forest-900">
              {field.label}
            </span>
            {field.help ? (
              <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                {field.help}
              </span>
            ) : null}
            {error ? (
              <span className="mt-1 block text-xs font-medium text-red-700">
                {error}
              </span>
            ) : null}
          </span>
        </label>
      );

    case "select":
      return (
        <FieldShell field={field} error={error}>
          <select
            id={id}
            name={field.name}
            defaultValue={stringValue(value)}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className="field"
          >
            {(field.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FieldShell>
      );

    case "checkboxes": {
      const options = field.reference ? references[field.reference] : [];
      const selected = checked[field.name] ?? [];
      return (
        <fieldset>
          <legend className="field-label">{field.label}</legend>
          {options.length === 0 ? (
            <p className="text-xs text-ink-muted">
              Aucune option disponible pour le moment.
            </p>
          ) : (
            <div className="grid gap-2 rounded-xl border border-sand-300 bg-sand-50 p-3 sm:grid-cols-2">
              {options.map((option) => {
                const isChecked = selected.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex items-start gap-2 text-xs leading-relaxed text-ink-soft"
                  >
                    <input
                      type="checkbox"
                      name={field.name}
                      value={option.value}
                      checked={isChecked}
                      onChange={() => toggleChecked(field.name, option.value)}
                      className="mt-0.5 size-4 shrink-0 accent-forest-700"
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          )}
          {field.help ? <p className="field-help">{field.help}</p> : null}
          {error ? (
            <p className="mt-1.5 text-xs font-medium text-red-700">{error}</p>
          ) : null}
        </fieldset>
      );
    }

    case "slug":
      return (
        <FieldShell field={field} error={error}>
          <div className="flex items-center gap-2">
            <input
              id={id}
              name={field.name}
              value={slug}
              onChange={(event) => onSlugChange(event.target.value)}
              required={field.required}
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className="field font-mono text-[0.85rem]"
              placeholder="adresse-du-contenu"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
            />
            {!slugTouched ? (
              <span className="shrink-0 rounded-full bg-sand-200 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                Auto
              </span>
            ) : null}
          </div>
          {!slugTouched && titleValue ? (
            <p className="field-help">
              Généré à partir du titre. Modifiez-le manuellement si nécessaire.
            </p>
          ) : null}
        </FieldShell>
      );

    case "date":
    case "datetime": {
      const dateValue =
        field.type === "date" ? toDateInput(value) : toDateTimeInput(value);
      return (
        <FieldShell field={field} error={error}>
          <input
            id={id}
            name={field.name}
            type={field.type === "date" ? "date" : "datetime-local"}
            defaultValue={dateValue}
            required={field.required}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className="field"
          />
        </FieldShell>
      );
    }

    case "number":
      return (
        <FieldShell field={field} error={error}>
          <input
            id={id}
            name={field.name}
            type="number"
            step="any"
            inputMode="decimal"
            defaultValue={
              typeof value === "number" && Number.isFinite(value)
                ? String(value)
                : ""
            }
            required={field.required}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className="field"
            placeholder={field.placeholder}
          />
        </FieldShell>
      );

    case "image": {
      const url = images[field.name] ?? "";
      return (
        <FieldShell field={field} error={error}>
          <input
            id={id}
            name={field.name}
            value={url}
            onChange={(event) => onImageChange(event.target.value)}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className="field font-mono text-[0.82rem]"
            placeholder="/images/… ou https://…"
          />
          {url ? (
            <div className="mt-2 overflow-hidden rounded-xl border border-sand-300 bg-sand-100">
              {/* Aperçu d’une URL administrative, non optimisé par Next Image. */}
              <img
                src={url}
                alt=""
                loading="lazy"
                className="h-32 w-full object-cover"
              />
            </div>
          ) : null}
        </FieldShell>
      );
    }

    case "gallery":
      return (
        <fieldset>
          <legend className="field-label">{field.label}</legend>
          <div className="space-y-3">
            {gallery.map((item, index) => (
              <div
                key={`gallery-${index}`}
                className="rounded-xl border border-sand-300 bg-sand-50 p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                    Image {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setGallery(gallery.filter((_, position) => position !== index))
                    }
                    className="rounded-lg p-1 text-red-700 hover:bg-red-50"
                    aria-label={`Supprimer l’image ${index + 1}`}
                  >
                    <Trash2 aria-hidden className="size-3.5" />
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    value={item.url}
                    onChange={(event) => {
                      const next = [...gallery];
                      next[index] = { ...item, url: event.target.value };
                      setGallery(next);
                    }}
                    className="field font-mono text-[0.8rem] sm:col-span-2"
                    placeholder="URL de l’image (/images/… ou https://…)"
                    aria-label={`URL de l’image ${index + 1}`}
                  />
                  <input
                    value={item.alt}
                    onChange={(event) => {
                      const next = [...gallery];
                      next[index] = { ...item, alt: event.target.value };
                      setGallery(next);
                    }}
                    className="field text-sm"
                    placeholder="Texte alternatif (description)"
                    aria-label={`Texte alternatif de l’image ${index + 1}`}
                  />
                  <input
                    value={item.caption}
                    onChange={(event) => {
                      const next = [...gallery];
                      next[index] = { ...item, caption: event.target.value };
                      setGallery(next);
                    }}
                    className="field text-sm"
                    placeholder="Légende et crédit"
                    aria-label={`Légende de l’image ${index + 1}`}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setGallery([...gallery, { url: "", alt: "", caption: "" }])
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-sand-400 bg-white px-3 py-1.5 text-xs font-semibold text-forest-800 hover:border-forest-300"
            >
              <Plus aria-hidden className="size-3.5" />
              Ajouter une image
            </button>
          </div>
          {error ? (
            <p className="mt-1.5 text-xs font-medium text-red-700">{error}</p>
          ) : null}
        </fieldset>
      );

    case "documents":
      return (
        <fieldset>
          <legend className="field-label">{field.label}</legend>
          <div className="space-y-2">
            {documents.map((item, index) => (
              <div key={`document-${index}`} className="flex flex-wrap gap-2">
                <input
                  value={item.title}
                  onChange={(event) => {
                    const next = [...documents];
                    next[index] = { ...item, title: event.target.value };
                    setDocuments(next);
                  }}
                  className="field min-w-0 flex-1 text-sm"
                  placeholder="Titre du document"
                  aria-label={`Titre du document ${index + 1}`}
                />
                <input
                  value={item.url}
                  onChange={(event) => {
                    const next = [...documents];
                    next[index] = { ...item, url: event.target.value };
                    setDocuments(next);
                  }}
                  className="field min-w-0 flex-[2] font-mono text-[0.8rem]"
                  placeholder="URL du document"
                  aria-label={`URL du document ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setDocuments(
                      documents.filter((_, position) => position !== index),
                    )
                  }
                  className="rounded-xl border border-sand-300 bg-white p-2.5 text-red-700 hover:border-red-200 hover:bg-red-50"
                  aria-label={`Supprimer le document ${index + 1}`}
                >
                  <Trash2 aria-hidden className="size-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setDocuments([...documents, { title: "", url: "" }])
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-sand-400 bg-white px-3 py-1.5 text-xs font-semibold text-forest-800 hover:border-forest-300"
            >
              <Plus aria-hidden className="size-3.5" />
              Ajouter un document
            </button>
          </div>
          {error ? (
            <p className="mt-1.5 text-xs font-medium text-red-700">{error}</p>
          ) : null}
        </fieldset>
      );

    case "sections":
      return (
        <fieldset>
          <legend className="field-label">{field.label}</legend>
          <div className="space-y-3">
            {sections.map((section, index) => (
              <div
                key={`section-${index}`}
                className="rounded-xl border border-sand-300 bg-sand-50 p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                    Section {index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(sections, setSections, index, -1)}
                      disabled={index === 0}
                      className="rounded-lg p-1 text-ink-muted hover:bg-white disabled:opacity-30"
                      aria-label="Monter la section"
                    >
                      <ChevronUp aria-hidden className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(sections, setSections, index, 1)}
                      disabled={index === sections.length - 1}
                      className="rounded-lg p-1 text-ink-muted hover:bg-white disabled:opacity-30"
                      aria-label="Descendre la section"
                    >
                      <ChevronDown aria-hidden className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSections(
                          sections.filter((_, position) => position !== index),
                        )
                      }
                      className="rounded-lg p-1 text-red-700 hover:bg-red-50"
                      aria-label="Supprimer la section"
                    >
                      <Trash2 aria-hidden className="size-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex flex-wrap gap-2">
                    <input
                      value={section.title}
                      onChange={(event) => {
                        const next = [...sections];
                        next[index] = { ...section, title: event.target.value };
                        setSections(next);
                      }}
                      className="field min-w-0 flex-1 text-sm font-semibold"
                      placeholder="Titre de la section"
                      aria-label={`Titre de la section ${index + 1}`}
                    />
                    <input
                      value={section.id}
                      onChange={(event) => {
                        const next = [...sections];
                        next[index] = { ...section, id: event.target.value };
                        setSections(next);
                      }}
                      className="field w-44 font-mono text-[0.8rem]"
                      placeholder="ancre-auto"
                      aria-label={`Ancre de la section ${index + 1}`}
                    />
                  </div>
                  <textarea
                    value={section.body}
                    onChange={(event) => {
                      const next = [...sections];
                      next[index] = { ...section, body: event.target.value };
                      setSections(next);
                    }}
                    rows={6}
                    className="field resize-y font-mono text-[0.82rem] leading-relaxed"
                    placeholder="Contenu Markdown de la section…"
                    aria-label={`Contenu de la section ${index + 1}`}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setSections([...sections, { id: "", title: "", body: "" }])
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-sand-400 bg-white px-3 py-1.5 text-xs font-semibold text-forest-800 hover:border-forest-300"
            >
              <Plus aria-hidden className="size-3.5" />
              Ajouter une section
            </button>
          </div>
          {error ? (
            <p className="mt-1.5 text-xs font-medium text-red-700">{error}</p>
          ) : null}
        </fieldset>
      );

    default:
      return (
        <FieldShell field={field} error={error}>
          <input
            id={id}
            name={field.name}
            type={field.type === "url" ? "url" : "text"}
            defaultValue={stringValue(value)}
            required={field.required}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className="field"
            placeholder={field.placeholder}
            onChange={
              field.name === "title" || field.name === "label"
                ? (event) => onTitleMaybe(event.target.value)
                : undefined
            }
          />
        </FieldShell>
      );
  }
}
