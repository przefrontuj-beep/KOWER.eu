import { cache } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { MarketingPage } from "@/lib/content";
import { db } from "@/lib/firebase/client";
import { slugToDocumentId } from "@/lib/admin/utils";
import { siteConfig } from "@/lib/site";
import type {
  ContactSettings,
  HomepageSettings,
  SeoEntry,
} from "@/types/admin";

const defaultContact: ContactSettings = {
  phone: siteConfig.phone,
  email: siteConfig.email,
  address: siteConfig.address,
  city: siteConfig.city,
  nip: siteConfig.nip,
  openingHours: "Poniedziałek-piątek, 8:00-17:00",
  facebookUrl: "",
  instagramUrl: "",
  googleMapsUrl: "",
  ctaText: "Umów bezpłatną konsultację",
  contactText:
    "Skontaktuj się z pracownią KOWER w sprawie mebli na wymiar, lameli lub usług płytowych.",
};

const defaultHomepage: HomepageSettings = {
  eyebrow: "Kuchnie · Szafy · Meble na wymiar · Lamele · Cięcie płyt",
  title: "Meble na wymiar z rzemieślniczą precyzją.",
  description:
    "Projektujemy i tworzymy kuchnie, szafy oraz autorskie zabudowy meblowe. Łączymy precyzję nowoczesnego parku maszynowego z rzemieślniczą dbałością o każdy milimetr.",
  heroImage: "/client-assets/hero-kitchen-whatsapp.webp",
  heroImagePath: "",
  primaryCtaLabel: "Umów bezpłatną konsultację",
  primaryCtaHref: "/umow-konsultacje",
  secondaryCtaLabel: "Zobacz realizacje",
  secondaryCtaHref: "/realizacje",
};

export const getPublicContactSettings = cache(async () => {
  if (!db) return defaultContact;

  try {
    const snapshot = await getDoc(doc(db, "siteSettings", "contact"));
    return snapshot.exists()
      ? ({ ...defaultContact, ...snapshot.data() } as ContactSettings)
      : defaultContact;
  } catch {
    return defaultContact;
  }
});

export const getPublicHomepageSettings = cache(async () => {
  if (!db) return defaultHomepage;

  try {
    const snapshot = await getDoc(doc(db, "siteSettings", "homepage"));
    return snapshot.exists()
      ? ({ ...defaultHomepage, ...snapshot.data() } as HomepageSettings)
      : defaultHomepage;
  } catch {
    return defaultHomepage;
  }
});

export const getPublicSeoEntry = cache(async (slug: string) => {
  if (!db) return null;

  try {
    const snapshot = await getDoc(doc(db, "seoEntries", slugToDocumentId(slug)));
    if (!snapshot.exists() || snapshot.data().status !== "published") {
      return null;
    }
    return { id: snapshot.id, ...snapshot.data() } as SeoEntry;
  } catch {
    return null;
  }
});

export const getPublicMarketingPage = cache(
  async (slug: string, fallback: MarketingPage) => {
    if (!db) return fallback;

    try {
      const snapshot = await getDoc(doc(db, "offers", slugToDocumentId(slug)));
      if (!snapshot.exists() || snapshot.data().status !== "published") {
        return fallback;
      }

      const data = snapshot.data();
      const content =
        typeof data.content === "string"
          ? data.content
              .split(/\n{2,}/)
              .map((paragraph: string) => paragraph.trim())
              .filter(Boolean)
          : fallback.lead;

      return {
        ...fallback,
        title: typeof data.title === "string" ? data.title : fallback.title,
        h1: typeof data.title === "string" ? data.title : fallback.h1,
        intro:
          typeof data.shortDescription === "string"
            ? data.shortDescription
            : fallback.intro,
        lead: content.length > 0 ? content : fallback.lead,
        image:
          typeof data.coverImage === "string" && data.coverImage
            ? data.coverImage
            : fallback.image,
        metaTitle:
          typeof data.seoTitle === "string" && data.seoTitle
            ? data.seoTitle
            : fallback.metaTitle,
        metaDescription:
          typeof data.seoDescription === "string" && data.seoDescription
            ? data.seoDescription
            : fallback.metaDescription,
      } satisfies MarketingPage;
    } catch {
      return fallback;
    }
  },
);

export const getPublicProducers = cache(async () => {
  if (!db) return [];

  try {
    const snapshot = await getDocs(
      query(
        collection(db, "producers"),
        where("status", "==", "published"),
        orderBy("order", "asc"),
        limit(30),
      ),
    );
    return snapshot.docs.map((producer) => ({
      id: producer.id,
      name: String(producer.data().name || "Partner"),
      logo: String(producer.data().logo || ""),
      website: String(producer.data().website || ""),
    }));
  } catch {
    return [];
  }
});
