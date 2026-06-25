import type { BlogPost, MarketingPage } from "./content";
import type { Project } from "@/types/project";
import { siteConfig } from "./site";
import type { ContactSettings } from "@/types/admin";

const absoluteUrl = (path: string) => new URL(path, siteConfig.baseUrl).toString();

export function breadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function serviceSchema(page: MarketingPage, contact?: ContactSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    description: page.metaDescription,
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.name,
      address: contact?.address || siteConfig.address,
      telephone: contact?.phone || siteConfig.phone,
      email: contact?.email || siteConfig.email,
    },
    areaServed: contact?.city || siteConfig.city,
    url: absoluteUrl(`/${page.slug}`),
    serviceType: page.title,
  };
}

export function faqSchema(page: Pick<MarketingPage | BlogPost, "faq">) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function articleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}

export function imageGallerySchema(projects: Project[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Realizacje Kower Pracownia Meblarska",
    description: "Galeria wybranych realizacji mebli i zabudów wykonanych na wymiar.",
    url: absoluteUrl("/realizacje"),
    hasPart: projects.map((project) => ({
      "@type": "ImageGallery",
      name: project.title,
      description: project.description,
      image: project.images.map((image) => ({
        "@type": "ImageObject",
        url: absoluteUrl(image.src),
        name: image.alt,
        caption: image.caption || project.description,
        description: image.caption || image.alt,
      })),
    })),
  };
}

export function localBusinessSchema(contact?: ContactSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": siteConfig.name,
    "image": absoluteUrl("/logo/kower-logo.png"),
    "@id": absoluteUrl("/#organization"),
    "url": siteConfig.baseUrl,
    "telephone": contact?.phone || siteConfig.phone,
    "email": contact?.email || siteConfig.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": contact?.address || "Kosin 20",
      "addressLocality": contact?.city || "Kosin",
      "postalCode": "23-235",
      "addressRegion": "lubelskie",
      "addressCountry": "PL"
    },
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "Kosin" },
      { "@type": "AdministrativeArea", "name": "Kraśnik" },
      { "@type": "AdministrativeArea", "name": "Janów Lubelski" },
      { "@type": "AdministrativeArea", "name": "lubelskie" }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  };
}
