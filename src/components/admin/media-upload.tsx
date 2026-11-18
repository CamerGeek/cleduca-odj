"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Copy, ImagePlus, LoaderCircle } from "lucide-react";

import {
  uploadMediaAction,
  type MediaActionState,
} from "@/app/admin/actions/media";
import { Button } from "@/components/ui/button";

const initialState: MediaActionState = { status: "idle", message: "" };

// Même plafond que la Server Action : au-delà, la requête est rejetée par la
// plateforme avant d’atteindre l’application.
const MAX_BYTES = 4 * 1024 * 1024;

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled} size="md">
      {pending ? (
        <>
          <LoaderCircle aria-hidden className="size-4 animate-spin" />
          Téléversement…
        </>
      ) : (
        <>
          <ImagePlus aria-hidden className="size-4" />
          Téléverser l’image
        </>
      )}
    </Button>
  );
}

export function MediaUploadForm() {
  const [state, formAction] = useActionState(uploadMediaAction, initialState);
  const [fileInfo, setFileInfo] = useState("");
  const [sizeError, setSizeError] = useState("");

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (sizeError) event.preventDefault();
      }}
      className="space-y-4"
    >
      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-900"
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="media-file" className="field-label">
            Fichier image <span className="text-gold-500">*</span>
          </label>
          <input
            id="media-file"
            name="file"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setFileInfo(
                file
                  ? `${file.name} — ${(file.size / 1024).toFixed(0)} Ko`
                  : "",
              );
              setSizeError(
                file && file.size > MAX_BYTES
                  ? "Cette image dépasse 4 Mo. Réduisez-la avant de la téléverser."
                  : "",
              );
            }}
            className="block w-full rounded-xl border border-sand-400/80 bg-white px-3 py-2.5 text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-forest-800 file:px-3 file:py-1.5 file:font-display file:text-xs file:font-semibold file:text-white"
          />
          <p className="field-help">
            JPEG, PNG, WebP, AVIF ou GIF. 4 Mo maximum. Les fichiers SVG ne sont
            pas acceptés pour des raisons de sécurité.
          </p>
          {sizeError ? (
            <p role="alert" className="mt-1 text-xs font-medium text-red-700">
              {sizeError}
            </p>
          ) : fileInfo ? (
            <p className="mt-1 text-xs font-medium text-forest-700">{fileInfo}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="media-alt" className="field-label">
            Texte alternatif <span className="text-gold-500">*</span>
          </label>
          <input
            id="media-alt"
            name="alt"
            type="text"
            required
            minLength={5}
            maxLength={300}
            placeholder="Décrivez précisément ce que montre l’image"
            className="field"
          />
          <p className="field-help">
            Nécessaire pour l’accessibilité. Évitez « photo » ou « image » seul.
            Mentionnez le contexte si utile.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 pt-4">
        <p className="text-xs leading-relaxed text-ink-muted">
          Publiez uniquement des images dont vous détenez les droits ou qui
          disposent d’une licence compatible. Indiquez le crédit dans la légende
          lors de l’utilisation.
        </p>
        <SubmitButton disabled={Boolean(sizeError)} />
      </div>
    </form>
  );
}

export function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-sand-300 bg-white px-2.5 py-1.5 text-[0.7rem] font-semibold text-forest-800 transition hover:border-forest-300 hover:bg-forest-50"
      aria-label="Copier l’adresse de l’image"
    >
      {copied ? (
        <>
          <Check aria-hidden className="size-3.5 text-forest-600" />
          Copié
        </>
      ) : (
        <>
          <Copy aria-hidden className="size-3.5" />
          Copier l’URL
        </>
      )}
    </button>
  );
}
