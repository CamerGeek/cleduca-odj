import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  tone = "dark",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p
            className={cn(
              "eyebrow mb-3 flex items-center gap-2",
              align === "center" && "justify-center",
              tone === "light" ? "text-gold-300" : "text-forest-600",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "h-px w-8",
                tone === "light" ? "bg-gold-400/70" : "bg-gold-400",
              )}
            />
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "text-3xl font-bold leading-[1.08] tracking-[-0.035em] sm:text-4xl lg:text-[2.8rem]",
            tone === "light" ? "text-white" : "text-forest-950",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-5 text-base leading-relaxed sm:text-[1.05rem]",
              tone === "light" ? "text-white/75" : "text-ink-soft",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
