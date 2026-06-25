import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/kower-admin-2026/",
    },
    sitemap: new URL("/sitemap.xml", siteConfig.baseUrl).toString(),
  };
}
