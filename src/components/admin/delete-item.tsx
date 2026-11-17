"use client";

import { useActionState, type ReactNode } from "react";
import { Trash2 } from "lucide-react";

import {
  deleteCollectionItem,
  type CollectionActionState,
} from "@/app/admin/actions/content";

const initialState: CollectionActionState = { status: "idle", message: "" };

export function DeleteItemButton({
  collection,
  id,
  label,
}: {
  collection: string;
  id: string;
  label: string;
}) {
  const [state, formAction] = useActionState(deleteCollectionItem, initialState);

  return (
    <form
      action={formAction}
      className="inline-flex flex-col items-end"
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Supprimer « ${label} » ? L’élément sera retiré du site public et conservé en corbeille lorsque la collection le permet.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="__collection" value={collection} />
      <input type="hidden" name="__id" value={id} />
      <button
        type="submit"
        title="Supprimer"
        aria-label={`Supprimer ${label}`}
        className="rounded-lg border border-sand-300 bg-white p-2 text-red-700 transition hover:border-red-200 hover:bg-red-50"
      >
        <Trash2 aria-hidden className="size-3.5" />
      </button>
      {state.status === "error" && state.message ? (
        <span role="alert" className="mt-1 max-w-[14rem] text-right text-[0.68rem] text-red-700">
          {state.message}
        </span>
      ) : null}
    </form>
  );
}

export function ConfirmSubmitButton({
  message,
  className,
  children,
  title,
  label,
}: {
  message: string;
  className?: string;
  children: ReactNode;
  title?: string;
  label?: string;
}) {
  return (
    <button
      type="submit"
      title={title}
      aria-label={label}
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
