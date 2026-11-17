import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "light"
  | "outline-light"
  | "ghost"
  | "gold";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-forest-500";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-forest-700 text-white shadow-[0_14px_30px_-18px_rgba(16,74,53,0.9)] hover:bg-forest-800",
  secondary:
    "border border-forest-700/25 bg-white/60 text-forest-900 hover:border-forest-700/50 hover:bg-white",
  light: "bg-white text-forest-900 hover:bg-sand-100",
  "outline-light":
    "border border-white/35 text-white hover:border-white/70 hover:bg-white/10",
  ghost: "text-forest-800 hover:bg-forest-50",
  gold: "bg-gold-400 text-forest-950 hover:bg-gold-300",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[0.82rem]",
  md: "px-5 py-2.5 text-[0.9rem]",
  lg: "px-6 py-3.5 text-[0.95rem]",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  withArrow?: boolean;
  children: ReactNode;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  withArrow = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const external = typeof props.href === "string" && /^(https?:|mailto:|tel:)/.test(props.href);
  const classes = buttonClasses({ variant, size, className });

  if (external) {
    return (
      <a
        href={props.href as string}
        className={classes}
        target={props.href.toString().startsWith("http") ? "_blank" : undefined}
        rel={props.href.toString().startsWith("http") ? "noreferrer" : undefined}
      >
        {children}
        {withArrow ? <ArrowRight aria-hidden className="size-4" /> : null}
      </a>
    );
  }

  return (
    <Link {...props} className={classes}>
      {children}
      {withArrow ? <ArrowRight aria-hidden className="size-4" /> : null}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button {...props} className={buttonClasses({ variant, size, className })}>
      {children}
    </button>
  );
}
