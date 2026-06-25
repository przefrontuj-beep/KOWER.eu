import { pages } from "@/lib/content";
import { offerItems } from "@/lib/offerItems";
import { projects } from "@/lib/projects/project-data";
import type {
  ContentStatus,
  GalleryImageRecord,
  RealizationImage,
  RealizationRecord,
} from "@/types/admin";
import type { ProjectCategory } from "@/types/project";

const uniquePages = new Map(pages.map((page) => [page.slug, page]));

type GallerySeedItem = Omit<
  GalleryImageRecord,
  "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
>;

type RealizationSeedItem = Omit<
  RealizationRecord,
  "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
>;

function normalizeCategory(category: string) {
  return category
    .toLowerCase()
    .replace(/\u0142/g, "l")
    .replace(/\u0141/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function mapProjectCategoryToGalleryCategory(category: ProjectCategory) {
  const normalized = normalizeCategory(category);

  if (normalized.includes("kuchnie")) return "kuchnie";
  if (normalized.includes("lazienki")) return "\u0142azienki";
  if (normalized.includes("szafy") || normalized.includes("garderoby")) return "szafy";
  if (normalized.includes("biura") || normalized.includes("biuro")) return "biuro";
  if (normalized.includes("lamele")) return "lamele";
  if (normalized.includes("detale")) return "detale";
  if (normalized.includes("zabudowy")) return "realizacje";

  return "inne";
}

function getFileName(src: string) {
  return src.split("/").pop() || src;
}

function mapProjectImageToRealizationImage(
  image: (typeof projects)[number]["images"][number],
  project: (typeof projects)[number],
): RealizationImage {
  return {
    id: image.id,
    src: image.src,
    thumbnailUrl: image.src,
    alt: image.alt,
    caption: image.caption || "",
    storagePath: image.path || "",
    thumbnailStoragePath: "",
    width: image.width || 0,
    height: image.height || 0,
    order: image.order,
    showOnHomepage: project.featured && project.coverImage === image.src,
    showInGallery: true,
    homepageOrder: project.order * 100 + image.order,
    galleryOrder: project.order * 100 + image.order,
    status: "published",
  };
}

const gallerySeedMap = new Map<string, GallerySeedItem>();

for (const project of projects) {
  for (const image of project.images) {
    if (gallerySeedMap.has(image.id)) {
      continue;
    }

    gallerySeedMap.set(image.id, {
      id: image.id,
      title: image.caption || project.title,
      caption: image.caption || project.description,
      alt: image.alt,
      category: mapProjectCategoryToGalleryCategory(project.category),
      tags: project.tags,
      imageUrl: image.src,
      thumbnailUrl: image.src,
      storagePath: image.path || "",
      thumbnailStoragePath: "",
      originalFileName: getFileName(image.src),
      width: image.width || 0,
      height: image.height || 0,
      sizeBytes: 0,
      compressedSizeBytes: 0,
      thumbnailSizeBytes: 0,
      format: getFileName(image.src).split(".").pop() || "jpeg",
      order: project.order * 100 + image.order,
      isPublished: true,
      featured: project.featured && project.coverImage === image.src,
      showOnHomepage: project.featured && project.coverImage === image.src,
      showInGallery: true,
      homepageOrder: project.order * 100 + image.order,
      galleryOrder: project.order * 100 + image.order,
      status: "published",
      realizationId: project.slug,
    });
  }
}

export const gallerySeedItems = Array.from(gallerySeedMap.values()).sort(
  (left, right) => left.order - right.order,
);

export const realizationSeedItems: RealizationSeedItem[] = projects.map((project) => {
  const images = project.images
    .map((image) => mapProjectImageToRealizationImage(image, project))
    .sort((left, right) => left.order - right.order);
  const selectedCover =
    images.find((image) => image.src === project.coverImage) || images[0];

  return {
    id: project.slug,
    title: project.title,
    slug: project.slug,
    description: project.description,
    longDescription: "",
    category: project.category,
    date: project.createdAt || "",
    coverImage: selectedCover?.src || project.coverImage,
    coverImagePath: selectedCover?.storagePath || "",
    coverImageId: selectedCover?.id || "",
    images,
    featured: project.featured,
    showOnHomepage: project.featured,
    showInGallery: true,
    homepageOrder: project.order,
    galleryOrder: project.order,
    status: "published" as ContentStatus,
    order: project.order,
  };
});

export const offerSeedItems = offerItems.map((item, index) => {
  const slug = item.href.replace(/^\//, "");
  const page = uniquePages.get(slug);
  return {
    title: page?.title || item.label,
    slug,
    group: item.group,
    shortDescription: page?.intro || item.description,
    content: page?.lead.join("\n\n") || item.description,
    coverImage: page?.image || item.image,
    icon: item.iconName,
    order: index + 1,
    status: "published",
    seoTitle: page?.metaTitle || item.label,
    seoDescription: page?.metaDescription || item.description,
  };
});

export const producerSeedItems = [
  ["Kronospan", "kronospan.svg", "plyty"],
  ["Swiss Krono", "swiss-krono.svg", "plyty"],
  ["EGGER", "egger.svg", "plyty"],
  ["Niemann", "niemann.svg", "fronty"],
  ["Wiech", "wiech.svg", "fronty"],
  ["Fundermax", "fundermax.png", "plyty"],
  ["Nomet", "nomet.svg", "akcesoria"],
  ["Gamet", "gamet.png", "akcesoria"],
  ["GTV", "gtv.svg", "akcesoria"],
  ["Rejs", "rejs.svg", "akcesoria"],
  ["Blum", "blum-official.svg", "akcesoria"],
  ["Hettich", "hettich-official.svg", "akcesoria"],
  ["Forner", "forner.svg", "fronty"],
  ["SIRO", "siro.svg", "akcesoria"],
  ["Abet Laminati", "abet-laminati.png", "plyty"],
  ["Design Light", "design-light.jpg", "akcesoria"],
  ["PEKA", "peka.svg", "akcesoria"],
].map(([name, logo, group], index) => ({
  name,
  logo: `/producer-logos/${logo}`,
  description: "",
  website: "",
  group,
  order: index + 1,
  status: "published",
}));

export const seoSeedItems = Array.from(uniquePages.values()).map((page) => ({
  slug: page.slug,
  title: page.metaTitle,
  description: page.metaDescription,
  canonical: `/${page.slug}`,
  ogTitle: page.metaTitle,
  ogDescription: page.metaDescription,
  ogImage: page.image || "",
  index: true,
  status: "published",
  order: 0,
}));
