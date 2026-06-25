import type { Metadata } from "next";
import BlogIndexView from "@/components/BlogIndexView";
import JsonLd from "@/components/JsonLd";
import { blogPosts } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Blog | Kower Pracownia Meblarska",
  description:
    "Artykuły Kower o lamelach, AGD, płytach meblowych, cięciu, oklejaniu i opłaszczowywaniu elementów.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Start", href: "/" },
          { label: "Blog", href: "/blog" },
        ])}
      />
      <BlogIndexView posts={blogPosts} />
    </>
  );
}
