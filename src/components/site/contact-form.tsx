"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { contactAction, type ContactState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import {
  Checkbox,
  FieldError,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/ui/field";
import {
  INQUIRY_TYPE_LABELS,
  type InquiryType,
} from "@/lib/content/types";

const initialState: ContactState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 aria-hidden className="size-4 animate-spin" />
          Envoi en cours…
        </>
      ) : (
        <>
          Envoyer le message
          <ArrowRight aria-hidden className="size-4" />
        </>
      )}
    </Button>
  );
}

export function ContactForm({
  defaultInquiryType = "information",
}: {
  defaultInquiryType?: InquiryType;
}) {
  const [state, formAction] = useActionState(contactAction, initialState);
  const id = useId();
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${id}-name`} required>
            Nom complet
          </Label>
          <Input
            id={`${id}-name`}
            name="fullName"
            autoComplete="name"
            placeholder="Prénom et nom"
            required
            aria-invalid={errors.fullName ? true : undefined}
          />
          <FieldError>{errors.fullName}</FieldError>
        </div>
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
            aria-invalid={errors.email ? true : undefined}
          />
          <FieldError>{errors.email}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${id}-org`}>Organisation (facultatif)</Label>
          <Input
            id={`${id}-org`}
            name="organization"
            autoComplete="organization"
            placeholder="Institution, ONG, média…"
          />
          <FieldError>{errors.organization}</FieldError>
        </div>
        <div>
          <Label htmlFor={`${id}-type`} required>
            Motif du contact
          </Label>
          <Select
            id={`${id}-type`}
            name="inquiryType"
            defaultValue={defaultInquiryType}
            required
            aria-invalid={errors.inquiryType ? true : undefined}
          >
            {Object.entries(INQUIRY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <FieldError>{errors.inquiryType}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor={`${id}-message`} required>
          Votre message
        </Label>
        <Textarea
          id={`${id}-message`}
          name="message"
          rows={7}
          placeholder="Présentez votre demande, votre organisation et le contexte de votre message."
          required
          aria-invalid={errors.message ? true : undefined}
        />
        <p className="field-help">
          Merci de ne pas transmettre de données personnelles sensibles
          concernant des bénéficiaires, des personnes déplacées ou des situations
          individuelles.
        </p>
        <FieldError>{errors.message}</FieldError>
      </div>

      <Checkbox
        name="consent"
        value="on"
        label="J’accepte que les informations transmises soient utilisées pour traiter ma demande."
        description="Consultez la politique de confidentialité pour connaître les finalités, les durées de conservation et vos droits."
        aria-invalid={errors.consent ? true : undefined}
      />
      <FieldError>{errors.consent}</FieldError>

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

      <div className="flex flex-col gap-4 border-t border-sand-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />
        <p className="text-xs leading-relaxed text-ink-muted">
          Les champs marqués d’un astérisque sont obligatoires.
        </p>
      </div>

      <div aria-live="polite">
        {state.status === "success" ? (
          <div className="flex items-start gap-3 rounded-xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm leading-relaxed text-forest-800">
            <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0" />
            <p>{state.message}</p>
          </div>
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
