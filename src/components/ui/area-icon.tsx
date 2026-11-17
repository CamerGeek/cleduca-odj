import {
  Accessibility,
  BookOpen,
  Handshake,
  HeartHandshake,
  HeartPulse,
  MonitorSmartphone,
  Scale,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { AreaIcon as AreaIconName } from "@/lib/content/types";

export const areaIcons: Record<AreaIconName, LucideIcon> = {
  "book-open": BookOpen,
  youth: Users,
  digital: MonitorSmartphone,
  inclusion: Accessibility,
  gender: HeartHandshake,
  wellbeing: HeartPulse,
  cohesion: Handshake,
  justice: Scale,
  resilience: Sprout,
};

export function AreaIcon({
  name,
  className,
}: {
  name: AreaIconName;
  className?: string;
}) {
  const Icon = areaIcons[name] ?? BookOpen;
  return <Icon aria-hidden className={className} strokeWidth={1.7} />;
}
