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
  facebookUrl: "",
  instagramUrl: "",
  googleMapsUrl: "",
  ctaText: "Umów bezpłatną konsultację",
  contactText: "",
};

export function usePublicContactSettings() {
  const [settings, setSettings] = useState(fallback);

  useEffect(() => {
    if (!db) return;

    const activeDb = db;
    let cancelled = false;
    void getDoc(doc(activeDb, "siteSettings", "contact"))
      .then((snapshot) => {
        if (!cancelled && snapshot.exists()) {
          setSettings({ ...fallback, ...snapshot.data() } as ContactSettings);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}
