import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarketingPageView from "@/components/MarketingPageView";
import JsonLd from "@/components/JsonLd";
import { allMarketingPageSlugs, getPageBySlug } from "@/lib/content";
import { getProjects } from "@/lib/projects/getProjects";
import {
  getPublicContactSettings,
  getPublicMarketingPage,
  getPublicSeoEntry,
} from "@/lib/cms/public";
import { breadcrumbSchema, faqSchema, imageGallerySchema, serviceSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return allMarketingPageSlugs.map((slug) => ({ slug: slug.split("/") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const joinedSlug = slug.join("/");
  const fallbackPage = getPageBySlug(joinedSlug);

  if (!fallbackPage) {
    return {};
  }
  const [page, seo] = await Promise.all([
    getPublicMarketingPage(joinedSlug, fallbackPage),
    getPublicSeoEntry(joinedSlug),
  ]);
  const title = seo?.title || page.metaTitle;
  const description = seo?.description || page.metaDescription;
  const canonical = seo?.canonical || `/${page.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: seo?.index === false ? { index: false, follow: true } : undefined,
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url: `/${page.slug}`,
      type: "website",
      images: seo?.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const joinedSlug = slug.join("/");
  const fallbackPage = getPageBySlug(joinedSlug);

  if (!fallbackPage) {
    notFound();
  }

  const [pageData, contact] = await Promise.all([
    getPublicMarketingPage(joinedSlug, fallbackPage),
    getPublicContactSettings(),
  ]);
  const page =
    pageData.slug === "kontakt"
      ? {
          ...pageData,
          intro: contact.contactText || pageData.intro,
          lead: [
            `Telefon: ${contact.phone}`,
            `E-mail: ${contact.email}`,
            `Adres: ${contact.address}`,
            `NIP: ${contact.nip}`,
            contact.openingHours ? `Godziny pracy: ${contact.openingHours}` : "",
          ].filter(Boolean),
        }
      : pageData;
  const projects = page.kind === "gallery" ? await getProjects() : undefined;

  const jsonLd = [
    breadcrumbSchema([
      { label: "Start", href: "/" },
      { label: page.title, href: `/${page.slug}` },
    ]),
    ...(page.kind === "service" ? [serviceSchema(page, contact)] : []),
    ...(page.kind === "gallery" ? [imageGallerySchema(projects || [])] : []),
    ...(page.faq.length > 0 ? [faqSchema(page)] : []),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <MarketingPageView page={page} projects={projects} />
    </>
  );
}
