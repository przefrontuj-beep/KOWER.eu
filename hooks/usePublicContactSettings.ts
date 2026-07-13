"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { siteConfig } from "@/lib/site";
import type { ContactSettings } from "@/types/admin";

const fallback: ContactSettings = {
  phone: siteConfig.phone,
  email: siteConfig.email,
  address: siteConfig.address,
  city: siteConfig.city,
  nip: siteConfig.nip,
  openingHours: "",
  facebookUrl: siteConfig.facebookUrl,
  instagramUrl: "",
  googleMapsUrl: "",
  ctaText: "Umów bezpłatną konsultację",
  contactText:
    "Skontaktuj się z pracownią KOWER w sprawie mebli na wymiar, lameli lub usług płytowych. Obsługujemy województwa lubelskie, świętokrzyskie, podkarpackie, małopolskie i mazowieckie.",
};

function withContactFallbacks(settings: ContactSettings): ContactSettings {
  return {
    ...settings,
    facebookUrl: settings.facebookUrl || fallback.facebookUrl,
  };
}

export function usePublicContactSettings() {
  const [settings, setSettings] = useState(fallback);

  useEffect(() => {
    if (!db) return;

    const activeDb = db;
    let cancelled = false;
    void getDoc(doc(activeDb, "siteSettings", "contact"))
      .then((snapshot) => {
        if (!cancelled && snapshot.exists()) {
          setSettings(withContactFallbacks({ ...fallback, ...snapshot.data() } as ContactSettings));
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}
