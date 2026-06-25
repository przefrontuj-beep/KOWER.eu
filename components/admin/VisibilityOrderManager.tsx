"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Eye,
  EyeOff,
  FileImage,
  GalleryHorizontalEnd,
  GripVertical,
  Home,
  ImagePlus,
  Info,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Replace,
  Save,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "sonner";
import { db, storage } from "@/lib/firebase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { logAdminActivity } from "@/lib/admin/activity";
import { slugify } from "@/lib/admin/utils";
import { compressAndCreateThumbnail } from "@/lib/projects/compression";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ContentStatus, RealizationImage } from "@/types/admin";

type Mode = "homepage" | "gallery";
const carouselOffsets = [-2, -1, 0, 1, 2] as const;
const MAX_HOMEPAGE_TITLE_LENGTH = 100;
const MAX_HOMEPAGE_ALT_LENGTH = 180;

const carouselCardClasses: Record<(typeof carouselOffsets)[number], string> = {
  [-2]: "hidden xl:block xl:h-64 xl:w-40 xl:opacity-55",
  [-1]: "h-72 w-[36vw] max-w-48 opacity-75 lg:h-80 lg:w-56 lg:max-w-none",
  0: "z-20 h-80 w-[58vw] max-w-72 opacity-100 shadow-2xl lg:h-[25rem] lg:w-72 lg:max-w-none",
  1: "h-72 w-[36vw] max-w-48 opacity-75 lg:h-80 lg:w-56 lg:max-w-none",
  2: "hidden xl:block xl:h-64 xl:w-40 xl:opacity-55",
};

type ManagedVisibilityItem = {
  id: string;
  title: string;
  caption: string;
  alt: string;
  category: string;
  status: ContentStatus;
  coverImage: string;
  imageUrl: string;
  mediumUrl: string;
  thumbnailUrl: string;
  storagePath: string;
  mediumStoragePath: string;
  thumbnailStoragePath: string;
  imageCount: number;
  showOnHomepage: boolean;
  showInGallery: boolean;
  homepageOrder: number;
  galleryOrder: number;
  order: number;
  source: "kowerGallery" | "realizations";
};

type HomepageImageEditForm = {
  title: string;
  caption: string;
  alt: string;
  category: string;
  showOnHomepage: boolean;
};

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function truncateText(value: string, maxLength: number) {
  const normalizedValue = value.trim().replace(/\s+/g, " ");
  if (normalizedValue.length <= maxLength) {
    return normalizedValue;
  }
  return normalizedValue.slice(0, maxLength).trim();
}

function getUploadErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    if (error.code === "permission-denied" || error.code === "storage/unauthorized") {
      return "Firebase odrzucił zapis. Sprawdź uprawnienia administratora i reguły Storage.";
    }
    if (error.code === "storage/quota-exceeded") {
      return "Przekroczono limit Storage w Firebase.";
    }
    return error.code;
  }

  return "Nieznany błąd uploadu.";
}

function normalizeRealization(
  documentId: string,
  data: Record<string, unknown>,
  index: number,
): ManagedVisibilityItem {
  const images = Array.isArray(data.images)
    ? data.images.filter((item): item is RealizationImage => Boolean(item && typeof item === "object"))
    : [];
  const order = asNumber(data.order, index + 1);
  const showOnHomepage = asBoolean(data.showOnHomepage, data.featured === true);
  const showInGallery = asBoolean(data.showInGallery, true);

  return {
    id: documentId,
    title: typeof data.title === "string" ? data.title : "Realizacja",
    caption: typeof data.description === "string" ? data.description : "",
    alt: typeof data.title === "string" ? `${data.title} - KOWER` : "Realizacja KOWER",
    category: typeof data.category === "string" ? data.category : "Inne",
    status:
      data.status === "published" || data.status === "hidden"
        ? data.status
        : "draft",
    coverImage:
      typeof data.coverImage === "string" && data.coverImage
        ? data.coverImage
        : images[0]?.thumbnailUrl || images[0]?.src || "",
    imageUrl: typeof data.coverImage === "string" ? data.coverImage : images[0]?.src || "",
    mediumUrl: typeof data.coverImage === "string" ? data.coverImage : images[0]?.mediumUrl || "",
    thumbnailUrl: images[0]?.thumbnailUrl || "",
    storagePath: typeof data.coverImagePath === "string" ? data.coverImagePath : images[0]?.storagePath || "",
    mediumStoragePath: images[0]?.mediumStoragePath || "",
    thumbnailStoragePath: images[0]?.thumbnailStoragePath || "",
    imageCount: images.length,
    showOnHomepage,
    showInGallery,
    homepageOrder: asNumber(data.homepageOrder, order),
    galleryOrder: asNumber(data.galleryOrder, order),
    order,
    source: "realizations",
  };
}

function normalizeHomepageImage(
  documentId: string,
  data: Record<string, unknown>,
  index: number,
): ManagedVisibilityItem {
  const order = asNumber(data.order, index + 1);
  const isPublished = asBoolean(data.isPublished, data.status === "published");
  const status: ContentStatus =
    data.status === "published" || data.status === "hidden"
      ? data.status
      : isPublished
        ? "published"
        : "hidden";
  const coverImage =
    typeof data.urlMedium === "string" && data.urlMedium
      ? data.urlMedium
      : typeof data.mediumUrl === "string" && data.mediumUrl
        ? data.mediumUrl
        : typeof data.thumbnailUrl === "string" && data.thumbnailUrl
          ? data.thumbnailUrl
          : typeof data.urlLarge === "string" && data.urlLarge
            ? data.urlLarge
            : typeof data.imageUrl === "string"
              ? data.imageUrl
              : "";
  const imageUrl =
    typeof data.urlLarge === "string" && data.urlLarge
      ? data.urlLarge
      : typeof data.imageUrl === "string" && data.imageUrl
        ? data.imageUrl
        : coverImage;
  const mediumUrl =
    typeof data.urlMedium === "string" && data.urlMedium
      ? data.urlMedium
      : typeof data.mediumUrl === "string" && data.mediumUrl
        ? data.mediumUrl
        : coverImage;
  const thumbnailUrl =
    typeof data.urlThumb === "string" && data.urlThumb
      ? data.urlThumb
      : typeof data.thumbnailUrl === "string" && data.thumbnailUrl
        ? data.thumbnailUrl
        : coverImage;
  const showOnHomepage = asBoolean(data.showOnHomepage, data.featured === true);
  const showInGallery = asBoolean(data.showInGallery, isPublished);

  return {
    id: documentId,
    title: typeof data.title === "string" ? data.title : "Zdjęcie realizacji",
    caption: typeof data.caption === "string" ? data.caption : "",
    alt: typeof data.alt === "string" ? data.alt : "",
    category: typeof data.category === "string" ? data.category : "Inne",
    status,
    coverImage,
    imageUrl,
    mediumUrl,
    thumbnailUrl,
    storagePath:
      typeof data.storagePathLarge === "string" && data.storagePathLarge
        ? data.storagePathLarge
        : typeof data.storagePath === "string"
          ? data.storagePath
          : "",
    mediumStoragePath:
      typeof data.storagePathMedium === "string" && data.storagePathMedium
        ? data.storagePathMedium
        : typeof data.mediumStoragePath === "string"
          ? data.mediumStoragePath
          : "",
    thumbnailStoragePath:
      typeof data.storagePathThumb === "string" && data.storagePathThumb
        ? data.storagePathThumb
        : typeof data.thumbnailStoragePath === "string"
          ? data.thumbnailStoragePath
          : "",
    imageCount: 1,
    showOnHomepage,
    showInGallery,
    homepageOrder: asNumber(data.homepageOrder, order),
    galleryOrder: asNumber(data.galleryOrder, order),
    order,
    source: "kowerGallery",
  };
}

function moveItem(
  items: ManagedVisibilityItem[],
  itemId: string,
  direction: -1 | 1,
) {
  const index = items.findIndex((item) => item.id === itemId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= items.length) {
    return items;
  }

  const nextItems = [...items];
  [nextItems[index], nextItems[target]] = [nextItems[target], nextItems[index]];
  return nextItems;
}

function getCarouselSlides(items: ManagedVisibilityItem[], activeIndex: number) {
  if (items.length === 0) {
    return [];
  }

  if (items.length < carouselOffsets.length) {
    return items.map((item, index) => {
      const rawOffset = index - activeIndex;
      const offset = Math.max(-2, Math.min(2, rawOffset)) as (typeof carouselOffsets)[number];
      return { item, offset };
    });
  }

  return carouselOffsets.map((offset) => ({
    offset,
    item: items[(activeIndex + offset + items.length) % items.length],
  }));
}

function HomepageCarouselPreview({
  items,
  draggedId,
  onDragStart,
  onDragEnd,
  onDrop,
}: {
  items: ManagedVisibilityItem[];
  draggedId: string | null;
  onDragStart: (itemId: string) => void;
  onDragEnd: () => void;
  onDrop: (targetId: string) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeActiveIndex = items.length > 0 ? Math.min(activeIndex, items.length - 1) : 0;
  const slides = useMemo(
    () => getCarouselSlides(items, safeActiveIndex),
    [items, safeActiveIndex],
  );

  function goToSlide(index: number) {
    if (items.length === 0) {
      return;
    }
    setActiveIndex((index + items.length) % items.length);
  }

  function scroll(direction: -1 | 1) {
    goToSlide(safeActiveIndex + direction);
  }

  return (
    <Card className="mb-5 overflow-hidden border-[#ded6c7] bg-[#f8f4ec] shadow-sm">
      <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <CardDescription className="font-bold uppercase tracking-[0.2em] text-[#487330]">
            Podgląd karuzeli
          </CardDescription>
          <CardTitle className="font-serif text-3xl">
            Układ jak na stronie głównej
          </CardTitle>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68645c]">
            Przeciągnij zdjęcie na inne zdjęcie w karuzeli albo na taśmie miniatur,
            aby zmienić kolejność przed zapisem.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Poprzednie zdjęcie w podglądzie"
            onClick={() => scroll(-1)}
            disabled={items.length <= 1}
            className="rounded-full bg-[#fbfaf5]"
          >
            <ArrowLeft />
          </Button>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            {items.length} w karuzeli
          </Badge>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Następne zdjęcie w podglądzie"
            onClick={() => scroll(1)}
            disabled={items.length <= 1}
            className="rounded-full bg-[#fbfaf5]"
          >
            <ArrowRight />
          </Button>
        </div>
      </CardHeader>

      {items.length === 0 ? (
        <CardContent>
          <div className="rounded-2xl border border-dashed border-[#cfc4b2] bg-white/50 p-8 text-center text-sm text-[#68645c]">
            Włącz zdjęcia przełącznikiem „Na głównej”, a pojawią się tutaj w podglądzie karuzeli.
          </div>
        </CardContent>
      ) : (
        <CardContent className="space-y-5">
          <div className="relative h-[430px] overflow-hidden rounded-[28px] border border-[#e2d8c7] bg-[#eee6da] px-3 pt-6 shadow-inner sm:h-[470px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.75),transparent_36%),linear-gradient(180deg,rgba(72,115,48,0.08),transparent_48%)]" />
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-end justify-center gap-0">
              {slides.map(({ item, offset }) => (
                <button
                  key={item.id}
                  type="button"
                  draggable
                  onClick={() => goToSlide(items.findIndex((image) => image.id === item.id))}
                  onDragStart={() => onDragStart(item.id)}
                  onDragEnd={onDragEnd}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => onDrop(item.id)}
                  className={[
                    "group relative shrink-0 cursor-grab overflow-hidden rounded-[22px] bg-[#d8d0c4] text-left text-white transition-all duration-300 active:cursor-grabbing lg:rounded-[8px]",
                    offset < 0 ? "-mr-3 lg:-mr-2" : "",
                    offset > 0 ? "-ml-3 lg:-ml-2" : "",
                    carouselCardClasses[offset],
                    draggedId === item.id ? "scale-95 opacity-45 ring-2 ring-[#487330]" : "",
                  ].join(" ")}
                  aria-label={`Przestaw zdjęcie ${item.title}`}
                >
                  {item.coverImage ? (
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 288px, 58vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
                      <Home aria-hidden="true" />
                    </div>
                  )}
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,12,10,0.14)_0%,rgba(13,12,10,0.05)_42%,rgba(13,12,10,0.66)_100%)]" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-bold text-[#20301a] shadow-sm">
                    <GripVertical className="size-3.5" aria-hidden="true" />
                    #{items.findIndex((image) => image.id === item.id) + 1}
                  </span>
                  <span className="relative z-10 flex h-full flex-col justify-end p-5">
                    <span className="line-clamp-2 font-serif text-[23px] font-semibold leading-[1.02] drop-shadow-[0_2px_12px_rgba(0,0,0,0.38)]">
                      {item.title}
                    </span>
                    <span className="mt-3 text-[12px] font-bold uppercase tracking-[0.14em] text-white/85">
                      {item.category}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#24231f]">Pełna kolejność zdjęć</p>
              <p className="text-xs text-muted-foreground">Przeciągnij miniaturę na inną pozycję</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  draggable
                  onClick={() => goToSlide(index)}
                  onDragStart={() => onDragStart(item.id)}
                  onDragEnd={onDragEnd}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => onDrop(item.id)}
                  className={[
                    "group relative h-24 w-28 shrink-0 overflow-hidden rounded-xl border bg-card text-left shadow-sm transition",
                    safeActiveIndex === index ? "border-[#487330] ring-2 ring-[#487330]/25" : "border-border",
                    draggedId === item.id ? "opacity-45" : "",
                  ].join(" ")}
                  aria-label={`Ustaw zdjęcie ${item.title} jako pozycję ${index + 1}`}
                >
                  {item.coverImage ? (
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="112px"
                      className="object-cover transition group-hover:scale-105"
                    />
                  ) : null}
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute left-2 top-2 rounded-full bg-white/92 px-2 py-0.5 text-[10px] font-bold text-[#20301a]">
                    #{index + 1}
                  </span>
                  <span className="absolute bottom-2 left-2 right-2 line-clamp-2 text-[11px] font-semibold leading-tight text-white">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export function VisibilityOrderManager({ mode }: { mode: Mode }) {
  const { user } = useAdminAuth();
  const [items, setItems] = useState<ManagedVisibilityItem[]>([]);
  const [loading, setLoading] = useState(Boolean(db));
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingItem, setDeletingItem] = useState<ManagedVisibilityItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadLabel, setUploadLabel] = useState("");
  const [editingItem, setEditingItem] = useState<ManagedVisibilityItem | null>(null);
  const [editForm, setEditForm] = useState<HomepageImageEditForm>({
    title: "",
    caption: "",
    alt: "",
    category: "Strona główna",
    showOnHomepage: true,
  });
  
  // States for adding a new image with full descriptions and client-side compression
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addForm, setAddForm] = useState({
    title: "",
    caption: "",
    alt: "",
    category: "Strona główna",
    showOnHomepage: true,
  });
  const [addingNew, setAddingNew] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const closeAddDialog = () => {
    setAddDialogOpen(false);
    setSelectedFile(null);
    setIsDraggingFile(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setAddForm({
      title: "",
      caption: "",
      alt: "",
      category: "Strona główna",
      showOnHomepage: true,
    });
  };

  const processFile = (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Plik jest za duży. Maksymalny rozmiar to 15MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Wybierz plik graficzny (JPG, PNG, WEBP).");
      return;
    }
    setSelectedFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));

    const nextOrder = Math.max(0, ...items.map((item) => item.homepageOrder)) + 1;
    const rawFileTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim();
    const fallbackTitle = truncateText(rawFileTitle || `Zdjęcie strony głównej ${nextOrder}`, 80);
    const title = truncateText(fallbackTitle, MAX_HOMEPAGE_TITLE_LENGTH);
    setAddForm((current) => ({
      ...current,
      title: current.title || title,
      alt: current.alt || `${title} - meble na wymiar KOWER`,
      caption: current.caption || "Zdjęcie realizacji mebli na wymiar prezentowane w karuzeli strony głównej.",
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    if (addingNew) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!addingNew) setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  async function handleAddSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isHomepage || !db || !storage || !user || addingNew) {
      return;
    }

    if (!selectedFile) {
      toast.error("Wybierz zdjęcie z dysku.");
      return;
    }

    const title = truncateText(addForm.title, MAX_HOMEPAGE_TITLE_LENGTH);
    const alt = truncateText(addForm.alt, MAX_HOMEPAGE_ALT_LENGTH);
    const caption = addForm.caption.trim();
    const category = addForm.category.trim() || "Strona główna";

    if (!title) {
      toast.error("Tytuł zdjęcia jest wymagany.");
      return;
    }

    if (!alt) {
      toast.error("Opis alternatywny SEO jest wymagany.");
      return;
    }

    const activeDb = db;
    const activeStorage = storage;
    const actor = user.email || user.uid;
    const uploadedStoragePaths: string[] = [];

    setAddingNew(true);
    setUploadProgress(0);
    setUploadLabel("Przygotowuję zdjęcie...");

    try {
      const baseOrder = Math.max(0, ...items.map((item) => item.order));
      const baseHomepageOrder = Math.max(0, ...items.map((item) => item.homepageOrder));
      const orderNumber = baseOrder + 1;
      const homepageOrder = baseHomepageOrder + 1;

      setUploadLabel(`Kompresuję zdjęcie...`);
      setUploadProgress(10);

      // Compressing using the existing utility (which ensures WebP and small file size)
      const compressed = await compressAndCreateThumbnail(selectedFile, 1920, 500, 0.8);
      const extension = compressed.format === "image/webp" ? "webp" : "jpg";
      const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const baseName = slugify(`${title}-${uniqueId}`) || `strona-glowna-${uniqueId}`;
      const storagePath = `kower/gallery/strona-glowna/${baseName}_large.${extension}`;
      const mediumStoragePath = `kower/gallery/strona-glowna/${baseName}_medium.${extension}`;
      const thumbnailStoragePath = `kower/gallery/strona-glowna/${baseName}_thumb.${extension}`;

      const uploadBlob = async (
        path: string,
        blob: Blob,
        innerStart: number,
        innerSpan: number,
        label: string,
      ) => {
        setUploadLabel(label);
        const uploadTask = uploadBytesResumable(ref(activeStorage, path), blob, {
          contentType: compressed.format,
          customMetadata: {
            originalFileName: selectedFile.name,
            source: "homepage-carousel",
          },
        });

        const url = await new Promise<string>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const ratio = snapshot.totalBytes
                ? snapshot.bytesTransferred / snapshot.totalBytes
                : 0;
              setUploadProgress(Math.round(innerStart + ratio * innerSpan));
            },
            reject,
            async () => {
              resolve(await getDownloadURL(uploadTask.snapshot.ref));
            },
          );
        });
        uploadedStoragePaths.push(path);
        return url;
      };

      const imageUrl = await uploadBlob(storagePath, compressed.mainBlob, 15, 35, "Wysyłam duże zdjęcie");
      const mediumUrl = await uploadBlob(mediumStoragePath, compressed.mediumBlob, 50, 25, "Wysyłam wersję średnią");
      const thumbnailUrl = await uploadBlob(thumbnailStoragePath, compressed.thumbBlob, 75, 18, "Wysyłam miniaturę");

      setUploadLabel(`Zapisuję dane w bazie...`);
      setUploadProgress(95);

      const status: Exclude<ContentStatus, "draft"> = addForm.showOnHomepage ? "published" : "hidden";

      const payload = {
        title,
        caption,
        alt,
        category,
        tags: ["strona główna", "karuzela", "meble na wymiar"],
        imageUrl,
        mediumUrl,
        thumbnailUrl,
        storagePath,
        mediumStoragePath,
        thumbnailStoragePath,
        urlLarge: imageUrl,
        urlMedium: mediumUrl,
        urlThumb: thumbnailUrl,
        storagePathLarge: storagePath,
        storagePathMedium: mediumStoragePath,
        storagePathThumb: thumbnailStoragePath,
        originalFileName: selectedFile.name,
        width: compressed.width,
        height: compressed.height,
        mediumWidth: compressed.mediumWidth,
        mediumHeight: compressed.mediumHeight,
        thumbWidth: compressed.thumbWidth,
        thumbHeight: compressed.thumbHeight,
        sizeBytes: compressed.sizeBytes,
        compressedSizeBytes: compressed.compressedSizeBytes,
        mediumSizeBytes: compressed.mediumSizeBytes,
        thumbnailSizeBytes: compressed.thumbnailSizeBytes,
        format: compressed.format === "image/webp" ? "webp" : "jpeg",
        order: orderNumber,
        isPublished: addForm.showOnHomepage,
        featured: addForm.showOnHomepage,
        showOnHomepage: addForm.showOnHomepage,
        showInGallery: false,
        homepageOrder,
        galleryOrder: orderNumber,
        status,
        realizationId: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: actor,
        updatedBy: actor,
      };

      const documentRef = await addDoc(collection(activeDb, "kowerGallery"), payload);
      const newNormalizedItem = normalizeHomepageImage(documentRef.id, payload, items.length);

      setItems((current) =>
        [...current, newNormalizedItem].sort((left, right) => left.homepageOrder - right.homepageOrder),
      );

      await logAdminActivity({
        user,
        action: "upload",
        entityType: "kowerGallery",
        entityId: documentRef.id,
        entityLabel: title,
      });

      toast.success("Zdjęcie zostało pomyślnie dodane.");
      closeAddDialog();
    } catch (error) {
      const errorMessage = getUploadErrorMessage(error);
      console.error(`Błąd dodawania zdjęcia:`, error);
      await Promise.all(
        uploadedStoragePaths.map((path) =>
          deleteObject(ref(activeStorage, path)).catch((cleanupError) => {
            console.warn("Nie udało się usunąć pliku po nieudanym uploadzie:", cleanupError);
          }),
        ),
      );
      toast.error(`Nie udało się dodać zdjęcia. ${errorMessage}`);
    } finally {
      setAddingNew(false);
      setUploadProgress(0);
      setUploadLabel("");
    }
  }

  const [savingEdit, setSavingEdit] = useState(false);

  const isHomepage = mode === "homepage";
  const Icon = isHomepage ? Home : GalleryHorizontalEnd;
  const visibilityKey = isHomepage ? "showOnHomepage" : "showInGallery";
  const orderKey = isHomepage ? "homepageOrder" : "galleryOrder";
  const visibleCount = items.filter((item) => item[visibilityKey]).length;

  const sortedItems = useMemo(
    () =>
      [...items].sort((left, right) => {
        const leftVisible = left[visibilityKey] ? 0 : 1;
        const rightVisible = right[visibilityKey] ? 0 : 1;
        if (leftVisible !== rightVisible) {
          return leftVisible - rightVisible;
        }
        return left[orderKey] - right[orderKey];
      }),
    [items, orderKey, visibilityKey],
  );
  const visibleSortedItems = useMemo(
    () => sortedItems.filter((item) => item[visibilityKey]),
    [sortedItems, visibilityKey],
  );

  useEffect(() => {
    if (!db) {
      return;
    }

    let cancelled = false;
    const activeDb = db;

    const collectionName = isHomepage ? "kowerGallery" : "realizations";
    const sourceQuery = isHomepage
      ? collection(activeDb, collectionName)
      : query(collection(activeDb, collectionName), limit(150));

    void getDocs(sourceQuery)
      .then((snapshot) => {
        if (cancelled) {
          return;
        }

        const normalized = snapshot.docs
          .map((document, index) =>
            isHomepage
              ? normalizeHomepageImage(document.id, document.data(), index)
              : normalizeRealization(document.id, document.data(), index),
          )
          .sort((left, right) => left[orderKey] - right[orderKey]);

        setItems(normalized);
      })
      .catch((error) => {
        console.error("Błąd pobierania elementów do kolejności:", error);
        toast.error(
          isHomepage
            ? "Nie udało się pobrać zdjęć strony głównej."
            : "Nie udało się pobrać realizacji.",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isHomepage, orderKey, reloadKey]);

  function refresh() {
    setLoading(true);
    setReloadKey((value) => value + 1);
  }

  function openEdit(item: ManagedVisibilityItem) {
    setEditingItem(item);
    setEditForm({
      title: item.title,
      caption: item.caption,
      alt: item.alt || `${item.title} - meble na wymiar KOWER`,
      category: item.category || "Strona główna",
      showOnHomepage: item.showOnHomepage,
    });
  }

  async function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isHomepage || !db || !user || !editingItem || savingEdit) {
      return;
    }

    const title = truncateText(editForm.title, MAX_HOMEPAGE_TITLE_LENGTH);
    const alt = truncateText(editForm.alt, MAX_HOMEPAGE_ALT_LENGTH);
    const caption = editForm.caption.trim();
    const category = editForm.category.trim() || "Strona główna";

    if (!title) {
      toast.error("Tytuł zdjęcia jest wymagany.");
      return;
    }

    if (!alt) {
      toast.error("Opis alternatywny SEO jest wymagany.");
      return;
    }

    const status: Exclude<ContentStatus, "draft"> = editForm.showOnHomepage ? "published" : "hidden";
    const actor = user.email || user.uid;

    setSavingEdit(true);
    try {
      await updateDoc(doc(db, "kowerGallery", editingItem.id), {
        title,
        caption,
        alt,
        category,
        showOnHomepage: editForm.showOnHomepage,
        featured: editForm.showOnHomepage,
        isPublished: editForm.showOnHomepage,
        status,
        updatedAt: serverTimestamp(),
        updatedBy: actor,
      });

      setItems((current) =>
        current.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                title,
                caption,
                alt,
                category,
                showOnHomepage: editForm.showOnHomepage,
                status,
              }
            : item,
        ),
      );
      await logAdminActivity({
        user,
        action: "update",
        entityType: "kowerGallery",
        entityId: editingItem.id,
        entityLabel: title,
      });
      toast.success("Zapisano opis zdjęcia.");
      setEditingItem(null);
    } catch (error) {
      console.error("Błąd zapisu zdjęcia strony głównej:", error);
      toast.error("Nie udało się zapisać zmian zdjęcia.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete() {
    if (!isHomepage || !db || !user || !deletingItem || deleting) {
      return;
    }

    setDeleting(true);
    try {
      await deleteDoc(doc(db, "kowerGallery", deletingItem.id));

      const storagePaths = [
        deletingItem.storagePath,
        deletingItem.mediumStoragePath,
        deletingItem.thumbnailStoragePath,
      ].filter(Boolean);

      const activeStorage = storage;
      if (activeStorage) {
        await Promise.allSettled(
          storagePaths.map((path) =>
            deleteObject(ref(activeStorage, path)).catch((error) => {
              console.warn("Nie udało się usunąć pliku ze Storage:", error);
            })
          )
        );
      }

      setItems((current) => current.filter((item) => item.id !== deletingItem.id));

      await logAdminActivity({
        user,
        action: "delete",
        entityType: "kowerGallery",
        entityId: deletingItem.id,
        entityLabel: deletingItem.title,
      });

      toast.success("Zdjęcie zostało usunięte.");
      setDeletingItem(null);
    } catch (error) {
      console.error("Błąd podczas usuwania zdjęcia:", error);
      toast.error("Wystąpił błąd podczas usuwania zdjęcia.");
    } finally {
      setDeleting(false);
    }
  }

  function setOrderedItems(nextSortedItems: ManagedVisibilityItem[]) {
    setItems(
      nextSortedItems.map((item, index) => ({
        ...item,
        [orderKey]: index + 1,
      })),
    );
  }

  function reorderByTarget(sourceId: string | null, targetId: string) {
    if (!sourceId || sourceId === targetId) {
      setDraggedId(null);
      return;
    }

    const sourceIndex = sortedItems.findIndex((item) => item.id === sourceId);
    const targetIndex = sortedItems.findIndex((item) => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) {
      setDraggedId(null);
      return;
    }

    const nextItems = [...sortedItems];
    const [moved] = nextItems.splice(sourceIndex, 1);
    nextItems.splice(targetIndex, 0, moved);
    setOrderedItems(nextItems);
    setDraggedId(null);
  }

  function handleDrop(targetId: string) {
    reorderByTarget(draggedId, targetId);
  }

  function handleMove(itemId: string, direction: -1 | 1) {
    setOrderedItems(moveItem(sortedItems, itemId, direction));
  }

  async function handleVisibilityChange(itemId: string, checked: boolean) {
    let newOrder = 0;
    
    setItems((current) =>
      current.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        const wasVisible = item[visibilityKey];
        const maxVisibleOrder = Math.max(
          0,
          ...current
            .filter((currentItem) => currentItem[visibilityKey])
            .map((currentItem) => currentItem[orderKey]),
        );

        newOrder = checked && !wasVisible
              ? maxVisibleOrder + 1
              : item[orderKey] > 0
                ? item[orderKey]
                : Math.max(0, ...current.map((currentItem) => currentItem[orderKey])) + 1;

        return {
          ...item,
          [visibilityKey]: checked,
          [orderKey]: newOrder,
        };
      }),
    );

    if (!db || !user) return;
    try {
      const actor = user.email || user.uid;
      const collectionName = isHomepage ? "kowerGallery" : "realizations";
      const payload = isHomepage
        ? {
            showOnHomepage: checked,
            homepageOrder: newOrder,
            featured: checked,
            isPublished: checked,
            status: checked ? "published" : "hidden",
            updatedAt: serverTimestamp(),
            updatedBy: actor,
          }
        : {
            showInGallery: checked,
            galleryOrder: newOrder,
            order: newOrder,
            updatedAt: serverTimestamp(),
            updatedBy: actor,
          };
      await updateDoc(doc(db, collectionName, itemId), payload);
      toast.success(checked ? (isHomepage ? "Zdjęcie dodane do karuzeli." : "Realizacja włączona.") : (isHomepage ? "Zdjęcie usunięte z karuzeli." : "Realizacja ukryta."));
    } catch (error) {
      console.error("Błąd zapisu widoczności:", error);
      toast.error("Nie udało się zapisać zmiany widoczności.");
    }
  }

  async function handleSave() {
    if (!db || !user || saving) {
      return;
    }

    setSaving(true);
    try {
      const activeDb = db;
      const batch = writeBatch(activeDb);
      const actor = user.email || user.uid;
      const collectionName = isHomepage ? "kowerGallery" : "realizations";

      sortedItems.forEach((item, index) => {
        const nextOrder = index + 1;
        const payload = isHomepage
          ? {
              showOnHomepage: item.showOnHomepage,
              homepageOrder: nextOrder,
              featured: item.showOnHomepage,
              isPublished: item.showOnHomepage,
              status: item.showOnHomepage ? ("published" as const) : ("hidden" as const),
              updatedAt: serverTimestamp(),
              updatedBy: actor,
            }
          : {
              showInGallery: item.showInGallery,
              galleryOrder: nextOrder,
              order: nextOrder,
              updatedAt: serverTimestamp(),
              updatedBy: actor,
            };

        batch.update(doc(activeDb, collectionName, item.id), payload);
      });

      await batch.commit();
      await logAdminActivity({
        user,
        action: "update",
        entityType: isHomepage ? "kowerGallery" : "realizations",
        entityId: isHomepage ? "homepage-order" : "gallery-order",
        entityLabel: isHomepage
          ? "Kolejność zdjęć na stronie głównej"
          : "Kolejność galerii realizacji",
      });
      toast.success(
        isHomepage
          ? "Kolejność zdjęć na stronie głównej została zaktualizowana."
          : "Kolejność galerii realizacji została zaktualizowana.",
      );
      refresh();
    } catch (error) {
      console.error("Błąd zapisu kolejności:", error);
      toast.error("Nie udało się zapisać zmian. Spróbuj ponownie.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow={isHomepage ? "Strona główna" : "Widoczność i kolejność"}
        title={isHomepage ? "Zdjęcia strony głównej" : "Galeria realizacji"}
        description={
          isHomepage
            ? "Dodawaj, edytuj i ustawiaj kolejność zdjęć widocznych w karuzeli na stronie głównej."
            : "Wybierz realizacje widoczne na podstronie Realizacje i ustaw ich niezależną kolejność."
        }
        icon={Icon}
        actions={
          <>
            {isHomepage ? (
              <Button
                type="button"
                onClick={() => setAddDialogOpen(true)}
                disabled={addingNew || saving || uploading}
              >
                <Plus data-icon="inline-start" />
                Dodaj nowe zdjęcie
              </Button>
            ) : null}
            <Button type="button" variant="outline" onClick={refresh} disabled={loading || saving || uploading}>
              <RefreshCw data-icon="inline-start" />
              Odśwież
            </Button>
            <Button type="button" onClick={handleSave} disabled={loading || saving || uploading || items.length === 0}>
              <Save data-icon="inline-start" />
              {saving ? "Zapisywanie..." : "Zapisz kolejność"}
            </Button>
          </>
        }
      />

      {uploading ? (
        <Card className="mb-5 border-primary/20 bg-primary/5">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between gap-4 text-sm font-medium">
              <span>{uploadLabel || "Przesyłam zdjęcia..."}</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="mt-3" />
          </CardContent>
        </Card>
      ) : null}

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>
              {isHomepage ? "Wszystkie zdjęcia w bibliotece" : "Wszystkie realizacje"}
            </CardDescription>
            <CardTitle className="text-2xl">{items.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>
              {isHomepage ? "Widoczne na stronie głównej" : "Widoczne w tej sekcji"}
            </CardDescription>
            <CardTitle className="text-2xl">{visibleCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>
              {isHomepage ? "Niewidoczne na stronie głównej" : "Ukryte w tej sekcji"}
            </CardDescription>
            <CardTitle className="text-2xl">{items.length - visibleCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {isHomepage && visibleSortedItems.length > 0 ? (
        <HomepageCarouselPreview
          items={visibleSortedItems}
          draggedId={draggedId}
          onDragStart={(id) => setDraggedId(id)}
          onDragEnd={() => setDraggedId(null)}
          onDrop={handleDrop}
        />
      ) : null}

      {!db ? (
        <Card>
          <CardHeader>
            <CardTitle>Brak połączenia Firebase</CardTitle>
            <CardDescription>
              Skonfiguruj zmienne środowiskowe Firebase, aby zarządzać kolejnością.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : sortedItems.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {sortedItems.map((item, index) => {
            const visible = item[visibilityKey];

            return (
              <Card
                key={item.id}
                draggable
                onDragStart={() => setDraggedId(item.id)}
                onDragEnd={() => setDraggedId(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(item.id)}
                className={visible ? "bg-card" : "bg-muted/45 opacity-80"}
              >
                <CardContent className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted sm:w-44">
                    {item.coverImage ? (
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        sizes="176px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <Icon aria-hidden="true" />
                      </div>
                    )}
                    <Badge className="absolute left-2 top-2" variant="secondary">
                      #{index + 1}
                    </Badge>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={item.status} />
                      <Badge variant={visible ? "default" : "secondary"}>
                        {visible ? (
                          <Eye data-icon="inline-start" />
                        ) : (
                          <EyeOff data-icon="inline-start" />
                        )}
                        {visible ? "Widoczna" : "Ukryta"}
                      </Badge>
                    </div>

                    <h2 className="mt-3 line-clamp-2 font-serif text-2xl font-semibold">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.category} · {isHomepage ? "pojedyncze zdjęcie" : `${item.imageCount} zdjęć`}
                    </p>

                    {isHomepage && item.caption ? (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {item.caption}
                      </p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium">
                        <GripVertical className="text-muted-foreground" aria-hidden="true" />
                        Przeciągnij
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Przesuń wyżej"
                        onClick={() => handleMove(item.id, -1)}
                      >
                        <ArrowUp />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Przesuń niżej"
                        onClick={() => handleMove(item.id, 1)}
                      >
                        <ArrowDown />
                      </Button>
                      {isHomepage ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => openEdit(item)}
                        >
                          <Pencil data-icon="inline-start" />
                          Edytuj
                        </Button>
                      ) : null}
                      {isHomepage ? (
                        <Button
                          type="button"
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeletingItem(item)}
                        >
                          <Trash2 data-icon="inline-start" />
                          Usuń
                        </Button>
                      ) : null}
                      <label className="ml-auto inline-flex items-center gap-3 rounded-lg border bg-background px-3 py-2 text-sm font-medium">
                        <span>
                          {isHomepage
                            ? visible
                              ? "Na głównej"
                              : "Poza główną"
                            : visible
                              ? "Pokazuj"
                              : "Nie pokazuj"}
                        </span>
                        <Switch
                          checked={visible}
                          onCheckedChange={(checked) =>
                            handleVisibilityChange(item.id, checked)
                          }
                        />
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Icon />
            </EmptyMedia>
            <EmptyTitle>{isHomepage ? "Brak zdjęć w bibliotece" : "Brak realizacji"}</EmptyTitle>
            <EmptyDescription>
              {isHomepage
                ? "Dodaj pierwsze zdjęcie do biblioteki, aby ustawić widoczność i kolejność na stronie głównej."
                : "Dodaj pierwszą realizację, aby ustawić widoczność i kolejność."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              onClick={() => setAddDialogOpen(true)}
              disabled={addingNew || uploading}
            >
              <Plus data-icon="inline-start" />
              Dodaj nowe zdjęcie
              <span className="hidden">
                {isHomepage ? "Dodaj zdjęcia w realizacjach" : "Dodaj realizację"}
              </span>
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {isHomepage ? (
        <>
        <Dialog open={addDialogOpen} onOpenChange={(open) => !open && closeAddDialog()}>
          <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0">
            {/* Header with gradient accent */}
            <div className="border-b bg-gradient-to-r from-[#f8f4ec] via-white to-[#f0f8eb] px-6 pb-4 pt-5">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#487330]/10">
                    <ImagePlus className="size-5 text-[#487330]" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg">Dodaj nowe zdjęcie</DialogTitle>
                    <DialogDescription className="mt-0.5">
                      Przeciągnij plik lub kliknij, aby wybrać zdjęcie. Uzupełnij opisy przed dodaniem.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="max-h-[calc(100vh-220px)] space-y-0 overflow-y-auto">
                {/* Upload zone / Preview section */}
                <div className="p-6">
                  {previewUrl && selectedFile ? (
                    <div className="group relative overflow-hidden rounded-2xl border border-[#e2d8c7] bg-[#f8f4ec] shadow-sm">
                      {/* Image preview */}
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <img
                          src={previewUrl}
                          alt="Podgląd wybranego zdjęcia"
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                        {/* Gradient overlay for file info */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pb-4 pl-4 pr-4 pt-12">
                          <div className="flex items-end justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-white drop-shadow">
                                {selectedFile.name}
                              </p>
                              <div className="mt-1.5 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                                  <FileImage className="size-3" />
                                  {selectedFile.type.split("/")[1]?.toUpperCase() || "IMAGE"}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                                  {formatFileSize(selectedFile.size)}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#487330]/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                                  <Sparkles className="size-3" />
                                  Autokompresja WebP
                                </span>
                              </div>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              className="shrink-0 gap-1.5 rounded-full bg-white/90 text-[#24231f] shadow-lg backdrop-blur-sm hover:bg-white"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={addingNew}
                            >
                              <Replace className="size-3.5" />
                              Zamień
                            </Button>
                          </div>
                        </div>
                        {/* Success checkmark */}
                        <div className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-[#487330] shadow-lg">
                          <Check className="size-4 text-white" />
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={addingNew}
                      />
                    </div>
                  ) : (
                    /* Drag-and-drop upload zone */
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleFileDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      disabled={addingNew}
                      className={[
                        "relative w-full overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300",
                        isDraggingFile
                          ? "border-[#487330] bg-[#487330]/5 shadow-[inset_0_0_40px_rgba(72,115,48,0.08)]"
                          : "border-[#cfc4b2] bg-gradient-to-b from-[#faf8f4] to-[#f4f0e8] hover:border-[#487330]/50 hover:bg-[#487330]/[0.03] hover:shadow-sm",
                        addingNew ? "pointer-events-none opacity-50" : "cursor-pointer",
                      ].join(" ")}
                    >
                      <div className={[
                        "mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl transition-all duration-300",
                        isDraggingFile
                          ? "bg-[#487330]/15 shadow-lg shadow-[#487330]/10"
                          : "bg-[#e8e2d6]",
                      ].join(" ")}>
                        <UploadCloud className={[
                          "size-7 transition-all duration-300",
                          isDraggingFile
                            ? "text-[#487330] -translate-y-1"
                            : "text-[#8a8578]",
                        ].join(" ")} />
                      </div>
                      <p className="text-base font-semibold text-[#24231f]">
                        {isDraggingFile ? "Upuść zdjęcie tutaj" : "Przeciągnij zdjęcie lub kliknij, aby wybrać"}
                      </p>
                      <p className="mt-1.5 text-sm text-[#8a8578]">
                        JPG, PNG lub WEBP · Maksymalnie 15 MB
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-[#68645c] shadow-sm ring-1 ring-[#e2d8c7]">
                        <Sparkles className="size-3 text-[#487330]" />
                        Automatyczna kompresja do WebP
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={addingNew}
                      />
                    </button>
                  )}
                </div>

                {/* Separator with label */}
                <div className="relative px-6">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-medium uppercase tracking-widest text-[#8a8578]">
                    Opisy zdjęcia
                  </span>
                </div>

                {/* Metadata form section */}
                <div className="space-y-5 p-6">
                  {/* Title + Category side by side */}
                  <div className="grid gap-4 sm:grid-cols-[1fr,180px]">
                    <Field>
                      <FieldLabel htmlFor="homepage-image-add-title">
                        Tytuł zdjęcia
                      </FieldLabel>
                      <Input
                        id="homepage-image-add-title"
                        placeholder="np. Kuchnia nowoczesna z wyspą"
                        value={addForm.title}
                        maxLength={MAX_HOMEPAGE_TITLE_LENGTH}
                        onChange={(event) =>
                          setAddForm((current) => ({ ...current, title: event.target.value }))
                        }
                        disabled={addingNew}
                      />
                      <FieldDescription>
                        <span className={addForm.title.length > MAX_HOMEPAGE_TITLE_LENGTH * 0.9 ? "text-amber-600" : ""}>
                          {addForm.title.length}/{MAX_HOMEPAGE_TITLE_LENGTH}
                        </span>
                        {" "}znaków
                      </FieldDescription>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="homepage-image-add-category">Kategoria</FieldLabel>
                      <Input
                        id="homepage-image-add-category"
                        placeholder="np. Kuchnie"
                        value={addForm.category}
                        onChange={(event) =>
                          setAddForm((current) => ({ ...current, category: event.target.value }))
                        }
                        disabled={addingNew}
                      />
                    </Field>
                  </div>

                  {/* Alt text */}
                  <Field>
                    <div className="flex items-center gap-2">
                      <FieldLabel htmlFor="homepage-image-add-alt">Opis alternatywny SEO</FieldLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex size-4 cursor-help items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">?</span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs text-xs">
                            Tekst widoczny dla wyszukiwarek i czytników ekranu. Opisz co widać na zdjęciu i wpleć naturalnie słowo KOWER.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="homepage-image-add-alt"
                      placeholder="np. Nowoczesna kuchnia na wymiar z białymi frontami - meble KOWER"
                      value={addForm.alt}
                      maxLength={MAX_HOMEPAGE_ALT_LENGTH}
                      onChange={(event) =>
                        setAddForm((current) => ({ ...current, alt: event.target.value }))
                      }
                      disabled={addingNew}
                    />
                    <FieldDescription>
                      <span className={addForm.alt.length > MAX_HOMEPAGE_ALT_LENGTH * 0.9 ? "text-amber-600" : ""}>
                        {addForm.alt.length}/{MAX_HOMEPAGE_ALT_LENGTH}
                      </span>
                      {" "}znaków
                    </FieldDescription>
                  </Field>

                  {/* Caption */}
                  <Field>
                    <FieldLabel htmlFor="homepage-image-add-caption">Podpis / opis zdjęcia</FieldLabel>
                    <Textarea
                      id="homepage-image-add-caption"
                      rows={3}
                      placeholder="Krótki opis realizacji widoczny pod zdjęciem..."
                      value={addForm.caption}
                      onChange={(event) =>
                        setAddForm((current) => ({ ...current, caption: event.target.value }))
                      }
                      disabled={addingNew}
                    />
                  </Field>

                  {/* Visibility toggle card */}
                  <div className={[
                    "flex items-center gap-4 rounded-xl border p-4 transition-colors",
                    addForm.showOnHomepage
                      ? "border-[#487330]/20 bg-[#487330]/[0.04]"
                      : "border-border bg-muted/30",
                  ].join(" ")}>
                    <div className={[
                      "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                      addForm.showOnHomepage ? "bg-[#487330]/15 text-[#487330]" : "bg-muted text-muted-foreground",
                    ].join(" ")}>
                      {addForm.showOnHomepage ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <label htmlFor="homepage-image-add-visible" className="cursor-pointer text-sm font-semibold text-foreground">
                        Widoczne na stronie głównej
                      </label>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {addForm.showOnHomepage
                          ? "Zdjęcie pojawi się od razu w karuzeli na stronie głównej."
                          : "Zdjęcie zostanie dodane do biblioteki, ale nie będzie widoczne w karuzeli."}
                      </p>
                    </div>
                    <Switch
                      id="homepage-image-add-visible"
                      checked={addForm.showOnHomepage}
                      onCheckedChange={(checked) =>
                        setAddForm((current) => ({ ...current, showOnHomepage: checked }))
                      }
                      disabled={addingNew}
                    />
                  </div>

                  {/* Upload progress — modern step indicator */}
                  {addingNew ? (
                    <div className="overflow-hidden rounded-xl border border-[#487330]/20 bg-gradient-to-r from-[#487330]/[0.04] to-[#f0f8eb]">
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div className="relative flex size-8 shrink-0 items-center justify-center">
                          <Loader2 className="size-5 animate-spin text-[#487330]" />
                          <div className="absolute inset-0 animate-ping rounded-full bg-[#487330]/10" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#24231f]">
                            {uploadLabel || "Przesyłam zdjęcie..."}
                          </p>
                          <p className="mt-0.5 text-xs text-[#68645c]">
                            {uploadProgress < 15
                              ? "Przygotowanie pliku..."
                              : uploadProgress < 50
                                ? "Kompresja i konwersja do WebP..."
                                : uploadProgress < 93
                                  ? "Wysyłanie na serwer..."
                                  : "Zapisywanie danych..."}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-[#487330]/10 px-2.5 py-1 text-sm font-bold tabular-nums text-[#487330]">
                          {uploadProgress}%
                        </span>
                      </div>
                      <div className="px-4 pb-3">
                        <div className="h-2 overflow-hidden rounded-full bg-[#487330]/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#487330] to-[#6da44d] transition-all duration-500 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 border-t bg-[#faf8f4] px-6 py-4">
                <p className="hidden text-xs text-[#8a8578] sm:block">
                  {selectedFile
                    ? `Gotowe do dodania · ${formatFileSize(selectedFile.size)}`
                    : "Wybierz zdjęcie, aby kontynuować"}
                </p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={closeAddDialog} disabled={addingNew}>
                    Anuluj
                  </Button>
                  <Button
                    type="submit"
                    disabled={addingNew || !selectedFile}
                    className={selectedFile && !addingNew ? "bg-[#487330] hover:bg-[#3a5d26]" : ""}
                  >
                    {addingNew ? (
                      <Loader2 data-icon="inline-start" className="animate-spin" />
                    ) : (
                      <UploadCloud data-icon="inline-start" />
                    )}
                    {addingNew ? "Dodawanie..." : "Dodaj zdjęcie"}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(editingItem)} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0">
            {/* Header with gradient accent */}
            <div className="border-b bg-gradient-to-r from-[#f8f4ec] via-white to-[#f0f8eb] px-6 pb-4 pt-5">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#487330]/10">
                    <Pencil className="size-5 text-[#487330]" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg">Edytuj zdjęcie strony głównej</DialogTitle>
                    <DialogDescription className="mt-0.5">
                      Zmień opisy, kategorię oraz widoczność zdjęcia w karuzeli.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="max-h-[calc(100vh-220px)] space-y-0 overflow-y-auto">
                {/* Image preview */}
                {editingItem?.coverImage ? (
                  <div className="p-6">
                    <div className="group relative overflow-hidden rounded-2xl border border-[#e2d8c7] bg-[#f8f4ec] shadow-sm">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={editingItem.coverImage}
                          alt={editForm.alt || editingItem.title}
                          fill
                          sizes="(min-width: 768px) 640px, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                        {/* Gradient overlay with title */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pb-4 pl-4 pr-4 pt-12">
                          <p className="truncate text-sm font-semibold text-white drop-shadow">
                            {editForm.title || editingItem.title || "Bez tytułu"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Separator with label */}
                <div className="relative px-6">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-medium uppercase tracking-widest text-[#8a8578]">
                    Opisy zdjęcia
                  </span>
                </div>

                {/* Metadata form section */}
                <div className="space-y-5 p-6">
                  {/* Title + Category side by side */}
                  <div className="grid gap-4 sm:grid-cols-[1fr,180px]">
                    <Field>
                      <FieldLabel htmlFor="homepage-image-title">
                        Tytuł zdjęcia
                      </FieldLabel>
                      <Input
                        id="homepage-image-title"
                        placeholder="np. Kuchnia nowoczesna z wyspą"
                        value={editForm.title}
                        maxLength={MAX_HOMEPAGE_TITLE_LENGTH}
                        onChange={(event) =>
                          setEditForm((current) => ({ ...current, title: event.target.value }))
                        }
                        disabled={savingEdit}
                      />
                      <FieldDescription>
                        <span className={editForm.title.length > MAX_HOMEPAGE_TITLE_LENGTH * 0.9 ? "text-amber-600" : ""}>
                          {editForm.title.length}/{MAX_HOMEPAGE_TITLE_LENGTH}
                        </span>
                        {" "}znaków
                      </FieldDescription>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="homepage-image-category">Kategoria</FieldLabel>
                      <Input
                        id="homepage-image-category"
                        placeholder="np. Kuchnie"
                        value={editForm.category}
                        onChange={(event) =>
                          setEditForm((current) => ({ ...current, category: event.target.value }))
                        }
                        disabled={savingEdit}
                      />
                    </Field>
                  </div>

                  {/* Alt text */}
                  <Field>
                    <div className="flex items-center gap-2">
                      <FieldLabel htmlFor="homepage-image-alt">Opis alternatywny SEO</FieldLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex size-4 cursor-help items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">?</span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs text-xs">
                            Tekst widoczny dla wyszukiwarek i czytników ekranu. Opisz co widać na zdjęciu i wpleć naturalnie słowo KOWER.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="homepage-image-alt"
                      placeholder="np. Nowoczesna kuchnia na wymiar z białymi frontami - meble KOWER"
                      value={editForm.alt}
                      maxLength={MAX_HOMEPAGE_ALT_LENGTH}
                      onChange={(event) =>
                        setEditForm((current) => ({ ...current, alt: event.target.value }))
                      }
                      disabled={savingEdit}
                    />
                    <FieldDescription>
                      <span className={editForm.alt.length > MAX_HOMEPAGE_ALT_LENGTH * 0.9 ? "text-amber-600" : ""}>
                        {editForm.alt.length}/{MAX_HOMEPAGE_ALT_LENGTH}
                      </span>
                      {" "}znaków
                    </FieldDescription>
                  </Field>

                  {/* Caption */}
                  <Field>
                    <FieldLabel htmlFor="homepage-image-caption">Podpis / opis zdjęcia</FieldLabel>
                    <Textarea
                      id="homepage-image-caption"
                      rows={3}
                      placeholder="Krótki opis realizacji widoczny pod zdjęciem..."
                      value={editForm.caption}
                      onChange={(event) =>
                        setEditForm((current) => ({ ...current, caption: event.target.value }))
                      }
                      disabled={savingEdit}
                    />
                  </Field>

                  {/* Visibility toggle card */}
                  <div className={[
                    "flex items-center gap-4 rounded-xl border p-4 transition-colors",
                    editForm.showOnHomepage
                      ? "border-[#487330]/20 bg-[#487330]/[0.04]"
                      : "border-border bg-muted/30",
                  ].join(" ")}>
                    <div className={[
                      "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                      editForm.showOnHomepage ? "bg-[#487330]/15 text-[#487330]" : "bg-muted text-muted-foreground",
                    ].join(" ")}>
                      {editForm.showOnHomepage ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <label htmlFor="homepage-image-visible" className="cursor-pointer text-sm font-semibold text-foreground">
                        Widoczne na stronie głównej
                      </label>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {editForm.showOnHomepage
                          ? "Zdjęcie jest widoczne w karuzeli na stronie głównej."
                          : "Zdjęcie zostaje w bibliotece, ale nie jest widoczne w karuzeli."}
                      </p>
                    </div>
                    <Switch
                      id="homepage-image-visible"
                      checked={editForm.showOnHomepage}
                      onCheckedChange={(checked) =>
                        setEditForm((current) => ({ ...current, showOnHomepage: checked }))
                      }
                      disabled={savingEdit}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t bg-[#faf8f4] px-6 py-4">
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)} disabled={savingEdit}>
                  Anuluj
                </Button>
                <Button
                  type="submit"
                  disabled={savingEdit}
                  className={!savingEdit ? "bg-[#487330] hover:bg-[#3a5d26]" : ""}
                >
                  {savingEdit ? (
                    <Loader2 data-icon="inline-start" className="animate-spin" />
                  ) : (
                    <Save data-icon="inline-start" />
                  )}
                  Zapisz zdjęcie
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={Boolean(deletingItem)} onOpenChange={(open) => !open && !deleting && setDeletingItem(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Czy na pewno chcesz usunąć to zdjęcie?</AlertDialogTitle>
              <AlertDialogDescription>
                Ta akcja jest nieodwracalna. Zdjęcie zostanie trwale usunięte z bazy danych oraz serwera (pliki).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Anuluj</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Usuń trwale
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </>
      ) : null}
    </div>
  );
}
