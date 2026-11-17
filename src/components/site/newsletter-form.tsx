"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import {
  subscribeAction,
  type NewsletterState,
} from "@/app/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Checkbox, FieldError, Input, Label } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const initialState: NewsletterState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 aria-hidden className="size-4 animate-spin" />
          Inscription…
        </>
      ) : (
        <>
          S’inscrire
          <ArrowRight aria-hidden className="size-4" />
        </>
      )}
    </Button>
  );
}

export function NewsletterForm({
  consentLabel,
  source = "site",
  className,
}: {
  consentLabel: string;
  source?: string;
  className?: string;
}) {
  const [state, formAction] = useActionState(subscribeAction, initialState);
  const id = useId();

  const emailError = state.fieldErrors?.email;
  const nameError = state.fieldErrors?.name;
  const consentError = state.fieldErrors?.consent;

  return (
    <form
      action={formAction}
      className={cn("space-y-4", className)}
      aria-describedby={`${id}-status`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${id}-email`} required>
            Adresse e-mail
          </Label>
          <Input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="vous@organisation.org"
            required
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? `${id}-email-error` : undefined}
          />
          <span id={`${id}-email-error`}>
            <FieldError>{emailError}</FieldError>
          </span>
        </div>
        <div>
          <Label htmlFor={`${id}-name`}>Nom (facultatif)</Label>
          <Input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            placeholder="Prénom et nom"
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? `${id}-name-error` : undefined}
          />
          <span id={`${id}-name-error`}>
            <FieldError>{nameError}</FieldError>
          </span>
        </div>
      </div>

      <Checkbox
        name="consent"
        value="on"
        label={consentLabel}
        description="Vous pourrez vous désinscrire à tout moment. Consultez notre politique de confidentialité."
        aria-invalid={consentError ? true : undefined}
      />
      <FieldError>{consentError}</FieldError>

      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Site web</label>
        <input
          id={`${id}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <input type="hidden" name="source" value={source} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />
        <p className="text-xs leading-relaxed text-ink-muted">
          Aucune donnée n’est cédée à des tiers.
        </p>
      </div>

      <div id={`${id}-status`} aria-live="polite">
        {state.status === "success" ? (
          <p className="flex items-start gap-2 rounded-xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-800">
            <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0" />
            {state.message}
          </p>
        ) : null}
        {state.status === "error" && state.message ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
