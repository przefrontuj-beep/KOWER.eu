import type { FieldValue } from "firebase/firestore";

export type ContentStatus = "draft" | "published" | "hidden";

export type ActivityAction =
  | "create"
  | "update"
  | "delete"
  | "upload"
  | "publish"
  | "hide"
  | "login"
  | "export";

export type FirestoreDateValue =
  | string
  | Date
  | {
      toDate?: () => Date;
      seconds?: number;
    }
  | FieldValue
  | null;

export type AdminRecord = {
  id: string;
  title?: string;
  name?: string;
  slug?: string;
  status?: ContentStatus;
  order?: number;
  createdAt?: FirestoreDateValue;
  updatedAt?: FirestoreDateValue;
  createdBy?: string;
  updatedBy?: string;
  [key: string]: unknown;
};

export type GalleryImageRecord = {
  id: string;
  title: string;
  caption: string;
  alt: string;
  category: string;
  tags: string[];
  imageUrl: string;
  mediumUrl?: string;
  thumbnailUrl: string;
  storagePath: string;
  mediumStoragePath?: string;
  thumbnailStoragePath: string;
  urlLarge?: string;
  urlMedium?: string;
  urlThumb?: string;
  storagePathLarge?: string;
  storagePathMedium?: string;
  storagePathThumb?: string;
  originalFileName: string;
  width: number;
  height: number;
  mediumWidth?: number;
  mediumHeight?: number;
  thumbWidth?: number;
  thumbHeight?: number;
  sizeBytes: number;
  compressedSizeBytes: number;
  mediumSizeBytes?: number;
  thumbnailSizeBytes: number;
  format: string;
  order: number;
  isPublished: boolean;
  featured: boolean;
  showOnHomepage?: boolean;
  showInGallery?: boolean;
  homepageOrder?: number;
  galleryOrder?: number;
  status?: Exclude<ContentStatus, "draft">;
  realizationId?: string;
  createdAt?: FirestoreDateValue;
  updatedAt?: FirestoreDateValue;
  createdBy?: string;
  updatedBy?: string;
};

export type RealizationImage = {
  id: string;
  src: string;
  mediumUrl?: string;
  thumbnailUrl: string;
  alt: string;
  caption: string;
  storagePath: string;
  mediumStoragePath?: string;
  thumbnailStoragePath: string;
  urlLarge?: string;
  urlMedium?: string;
  urlThumb?: string;
  storagePathLarge?: string;
  storagePathMedium?: string;
  storagePathThumb?: string;
  width: number;
  height: number;
  mediumWidth?: number;
  mediumHeight?: number;
  thumbWidth?: number;
  thumbHeight?: number;
  order: number;
  showOnHomepage?: boolean;
  showInGallery?: boolean;
  homepageOrder?: number;
  galleryOrder?: number;
  status?: Exclude<ContentStatus, "draft">;
};

export type RealizationRecord = {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  location?: string;
  date: string;
  coverImage: string;
  coverImagePath: string;
  coverImageId: string;
  images: RealizationImage[];
  featured: boolean;
  showOnHomepage: boolean;
  showInGallery: boolean;
  homepageOrder: number;
  galleryOrder: number;
  status: ContentStatus;
  order: number;
  createdAt?: FirestoreDateValue;
  updatedAt?: FirestoreDateValue;
  createdBy?: string;
  updatedBy?: string;
};

export type LeadAttachment = {
  name: string;
  type: string;
  size: number;
  storagePath?: string;
};

export type LeadRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  scope: string;
  topic: string;
  source: string;
  status: "new" | "in_progress" | "completed" | "spam";
  adminNote: string;
  attachments: LeadAttachment[];
  createdAt?: FirestoreDateValue;
  updatedAt?: FirestoreDateValue;
};

export type ContactSettings = {
  phone: string;
  email: string;
  address: string;
  city: string;
  nip: string;
  openingHours: string;
  facebookUrl: string;
  instagramUrl: string;
  googleMapsUrl: string;
  ctaText: string;
  contactText: string;
  updatedAt?: FirestoreDateValue;
};

export type HomepageSettings = {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  heroImagePath: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  updatedAt?: FirestoreDateValue;
};

export type SeoEntry = {
  id: string;
  slug: string;
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  index: boolean;
  status: ContentStatus;
  updatedAt?: FirestoreDateValue;
};

export type ActivityLogRecord = {
  id: string;
  userId: string;
  userEmail: string;
  action: ActivityAction;
  entityType: string;
  entityId: string;
  entityLabel: string;
  createdAt?: FirestoreDateValue;
};
