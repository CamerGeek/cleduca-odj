import type { ReactNode } from "react";

import {
  AREA_STATUS_LABELS,
  CONTENT_STATUS_LABELS,
  PROJECT_STATUS_LABELS,
  type AreaStatus,
  type ContentStatus,
  type ProjectStatus,
} from "@/lib/content/types";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "green" | "gold" | "outline" | "dark" | "danger";
}) {
  const tones = {
    neutral: "bg-sand-200 text-ink-soft border-transparent",
    green: "bg-forest-50 text-forest-800 border-forest-200",
    gold: "bg-gold-100 text-gold-600 border-gold-200",
    outline: "bg-transparent text-ink-soft border-sand-400/80",
    dark: "bg-forest-900 text-white border-forest-900",
    danger: "bg-red-50 text-red-800 border-red-200",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-display text-[0.68rem] font-bold uppercase tracking-[0.1em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProjectStatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  const tones: Record<ProjectStatus, "green" | "gold" | "outline" | "neutral"> = {
    ongoing: "gold",
    completed: "green",
    development: "outline",
    proposed: "neutral",
  };
  return (
    <Badge tone={tones[status]} className={className}>
      {PROJECT_STATUS_LABELS[status]}
    </Badge>
  );
}

export function AreaStatusBadge({
  status,
  className,
}: {
  status: AreaStatus;
  className?: string;
}) {
  const tones: Record<AreaStatus, "green" | "gold" | "outline"> = {
    documented: "green",
    developing: "gold",
    positioning: "outline",
  };
  return (
    <Badge tone={tones[status]} className={className}>
      {AREA_STATUS_LABELS[status]}
    </Badge>
  );
}

export function ContentStatusBadge({
  status,
  className,
}: {
  status: ContentStatus;
  className?: string;
}) {
  const tones: Record<ContentStatus, "green" | "gold" | "neutral" | "danger"> = {
    published: "green",
    review: "gold",
    draft: "neutral",
    archived: "danger",
  };
  return (
    <Badge tone={tones[status]} className={className}>
      {CONTENT_STATUS_LABELS[status]}
    </Badge>
  );
}
