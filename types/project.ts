export type ProjectCategory =
  | "Kuchnie"
  | "Łazienki"
  | "Garderoby"
  | "Szafy"
  | "Lamele"
  | "Zabudowy nietypowe"
  | "Biura"
  | "Detale"
  | "Inne"
  | "Szafy i garderoby";

export type FocalPoint = "center" | "left" | "right" | "top" | "bottom";

export type ProjectImage = {
  id: string;
  src: string;
  mediumUrl?: string;
  thumbnailUrl?: string;
  storagePathLarge?: string;
  storagePathMedium?: string;
  storagePathThumb?: string;
  alt: string;
  caption?: string;
  focalPoint?: FocalPoint;
  width?: number;
  height?: number;
  order: number;
  showOnHomepage?: boolean;
  showInGallery?: boolean;
  homepageOrder?: number;
  galleryOrder?: number;
  status?: "published" | "hidden" | "draft";
  path?: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  location?: string;
  description: string;
  coverImage: string;
  coverFocalPoint?: FocalPoint;
  coverImagePath?: string;
  images: ProjectImage[];
  tags: string[];
  featured: boolean;
  order: number;
  showOnHomepage?: boolean;
  showInGallery?: boolean;
  homepageOrder?: number;
  galleryOrder?: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
