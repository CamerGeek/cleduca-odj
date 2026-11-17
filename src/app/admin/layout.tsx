import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Administration",
    template: "%s · Administration CLEDUCA-ODJ",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="min-h-screen bg-sand-100">{children}</div>;
}
