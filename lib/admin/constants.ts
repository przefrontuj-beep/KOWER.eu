import { Home } from "lucide-react";

export const ADMIN_BASE_PATH = "/kower-admin-2026";

export const REALIZATION_CATEGORIES = [
  "Kuchnie",
  "Łazienki",
  "Garderoby",
  "Meble biurowe",
  "Meble do salonu",
  "Meble do sypialni",
  "Meble dziecięce",
  "Zabudowy nietypowe",
  "Lamele",
  "Lite drewno / fornir",
  "Inne",
] as const;

export const CONTENT_STATUS_OPTIONS = [
  { value: "draft", label: "Szkic" },
  { value: "published", label: "Opublikowane" },
  { value: "hidden", label: "Ukryte" },
] as const;

export const PRODUCER_CATEGORIES = [
  { value: "plyty", label: "Płyty" },
  { value: "agd", label: "AGD" },
  { value: "akcesoria", label: "Akcesoria" },
  { value: "blaty", label: "Blaty" },
  { value: "fronty", label: "Fronty" },
  { value: "inne", label: "Inne" },
] as const;

export const OFFER_GROUPS = [
  { value: "meble", label: "Meble" },
  { value: "lamele", label: "Lamele" },
  { value: "agd", label: "AGD" },
  { value: "plyty", label: "Usługi płytowe" },
  { value: "materialy", label: "Materiały" },
] as const;

export const ADMIN_NAVIGATION = [
  { href: `${ADMIN_BASE_PATH}/strona-glowna`, label: "Strona główna", icon: Home },
] as const;

export const ADMIN_QUICK_ACTIONS = [
  {
    href: `${ADMIN_BASE_PATH}/strona-glowna`,
    label: "Zarządzaj zdjęciami strony głównej",
    icon: Home,
  },
] as const;
