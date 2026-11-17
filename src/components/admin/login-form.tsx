"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";

import { loginAction, type LoginState } from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";

const initialState: LoginState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle aria-hidden className="size-4 animate-spin" />
          Connexion…
        </>
      ) : (
        "Se connecter"
      )}
    </Button>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-900"
        >
          {state.message}
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="field-label">
          Adresse e-mail
        </label>
        <div className="relative">
          <Mail
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
          />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            inputMode="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="field pl-10"
            placeholder="vous@organisation.org"
          />
        </div>
        {errors.email ? (
          <p id="email-error" className="mt-1.5 text-xs font-medium text-red-700">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="field-label">
          Mot de passe
        </label>
        <div className="relative">
          <LockKeyhole
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="field px-10"
            placeholder="Votre mot de passe"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink-muted transition hover:bg-sand-100 hover:text-forest-800"
          >
            {showPassword ? (
              <EyeOff aria-hidden className="size-4" />
            ) : (
              <Eye aria-hidden className="size-4" />
            )}
          </button>
        </div>
        {errors.password ? (
          <p id="password-error" className="mt-1.5 text-xs font-medium text-red-700">
            {errors.password}
          </p>
        ) : null}
      </div>

      <SubmitButton />

      <p className="text-center text-xs leading-relaxed text-ink-muted">
        L’accès est réservé aux personnes habilitées. Les tentatives de connexion
        sont limitées et journalisées.
      </p>
    </form>
  );
}
