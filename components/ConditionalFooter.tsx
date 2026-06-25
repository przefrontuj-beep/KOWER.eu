"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "./SiteFooter";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Ukrywamy stopkę na wszystkich podstronach administratora
  if (pathname?.startsWith("/kower-admin-2026")) {
    return null;
  }

  return <SiteFooter />;
}
