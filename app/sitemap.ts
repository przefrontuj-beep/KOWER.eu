import type { MetadataRoute } from "next";
import { allBlogSlugs, allMarketingPageSlugs } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "",
    "blog",
    ...allMarketingPageSlugs,
    ...allBlogSlugs.map((slug) => `blog/${slug}`),
  ];

  return routes.map((route) => ({
    url: new URL(`/${route}`, siteConfig.baseUrl).toString(),
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("blog/") ? 0.65 : 0.8,
  }));
}
