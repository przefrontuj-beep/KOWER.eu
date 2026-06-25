"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  GripVertical,
  Images,
  Loader2,
  Pencil,
  Plus,
  Search,
  Star,
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
  writeBatch,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "sonner";
import { db, storage } from "@/lib/firebase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { logAdminActivity } from "@/lib/admin/activity";
import { gallerySeedItems, realizationSeedItems } from "@/lib/admin/seed-data";
import {
  CONTENT_STATUS_OPTIONS,
  REALIZATION_CATEGORIES,
} from "@/lib/admin/constants";
import { slugify, slugToDocumentId } from "@/lib/admin/utils";
import type {
  ContentStatus,
  GalleryImageRecord,
  RealizationImage,
  RealizationRecord,
} from "@/types/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { compressAndCreateThumbnail } from "@/lib/projects/compression";

type RealizationForm = {
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  location: string;
  date: string;
  featured: boolean;
  showOnHomepage: boolean;
  showInGallery: boolean;
  homepageOrder: number;
  galleryOrder: number;
  status: ContentStatus;
  order: number;
  coverImageId: string;
  images: RealizationImage[];
};

const emptyForm: RealizationForm = {
  title: "",
  slug: "",
  description: "",
  longDescription: "",
  category: "Kuchnie",
  location: "",
  date: "",
  featured: false,
  showOnHomepage: false,
  showInGallery: true,
  homepageOrder: 0,
  galleryOrder: 0,
  status: "draft",
  order: 0,
  coverImageId: "",
  images: [],
};

const MAX_INLINE_UPLOAD_FILES = 20;
const MAX_GALLERY_TITLE_LENGTH = 100;
const MAX_GALLERY_ALT_LENGTH = 180;

function truncateText(value: string, maxLength: number) {
  const normalizedValue = value.trim().replace(/\s+/g, " ");
  if (normalizedValue.length <= maxLength) {
    return normalizedValue;
  }
  return normalizedValue.slice(0, maxLength).trim();
}

function buildInlineImageText(form: RealizationForm, file: File, selectedOrder: number) {
  const rawFileTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim();
  const fallbackTitle = truncateText(rawFileTitle || "Zdjęcie realizacji", 80);
  const titleSuffix = ` - zdjęcie ${selectedOrder}`;
  const titleBase = form.title.trim() || fallbackTitle;
  const title = form.title.trim()
    ? `${truncateText(titleBase, MAX_GALLERY_TITLE_LENGTH - titleSuffix.length)}${titleSuffix}`
    : fallbackTitle;
  const altSuffix = " - realizacja mebli na wymiar KOWER";
  const alt = `${truncateText(title, MAX_GALLERY_ALT_LENGTH - altSuffix.length)}${altSuffix}`;

  return {
    title: truncateText(title, MAX_GALLERY_TITLE_LENGTH),
    caption: form.description.trim(),
    alt: truncateText(alt, MAX_GALLERY_ALT_LENGTH),
  };
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
      return "Firebase odrzucił zapis. Sprawdź uprawnienia administratora i reguły zapisu.";
    }
    if (error.code === "storage/quota-exceeded") {
      return "Przekroczono limit Storage w Firebase.";
    }
    return error.code;
  }

  return "Nieznany błąd uploadu.";
}

function mapGalleryImage(image: GalleryImageRecord, order: number): RealizationImage {
  return {
    id: image.id,
    src: image.urlLarge || image.imageUrl,
    mediumUrl: image.urlMedium || image.mediumUrl || image.imageUrl,
    thumbnailUrl: image.thumbnailUrl || image.imageUrl,
    alt: image.alt,
    caption: image.caption,
    storagePath: image.storagePathLarge || image.storagePath,
    mediumStoragePath: image.storagePathMedium || image.mediumStoragePath,
    thumbnailStoragePath: image.storagePathThumb || image.thumbnailStoragePath,
    urlLarge: image.urlLarge || image.imageUrl,
    urlMedium: image.urlMedium || image.mediumUrl || image.imageUrl,
    urlThumb: image.urlThumb || image.thumbnailUrl || image.imageUrl,
    storagePathLarge: image.storagePathLarge || image.storagePath,
    storagePathMedium: image.storagePathMedium || image.mediumStoragePath,
    storagePathThumb: image.storagePathThumb || image.thumbnailStoragePath,
    width: image.width,
    height: image.height,
    mediumWidth: image.mediumWidth,
    mediumHeight: image.mediumHeight,
    thumbWidth: image.thumbWidth,
    thumbHeight: image.thumbHeight,
    order,
    showOnHomepage: image.showOnHomepage ?? image.featured,
    showInGallery: image.showInGallery ?? image.isPublished,
    homepageOrder: image.homepageOrder ?? image.order,
    galleryOrder: image.galleryOrder ?? image.order,
    status: image.status ?? (image.isPublished ? "published" : "hidden"),
  };
}

function normalizeRealization(documentId: string, data: Record<string, unknown>): RealizationRecord {
  const images = Array.isArray(data.images)
    ? data.images.filter((item): item is RealizationImage => Boolean(item && typeof item === "object"))
    : [];
  const order = typeof data.order === "number" ? data.order : 0;
  const showOnHomepage =
    typeof data.showOnHomepage === "boolean" ? data.showOnHomepage : data.featured === true;
  const showInGallery =
    typeof data.showInGallery === "boolean" ? data.showInGallery : true;
  const homepageOrder =
    typeof data.homepageOrder === "number" ? data.homepageOrder : order;
  const galleryOrder =
    typeof data.galleryOrder === "number" ? data.galleryOrder : order;

  return {
    id: documentId,
    title: typeof data.title === "string" ? data.title : "Realizacja",
    slug: typeof data.slug === "string" ? data.slug : documentId,
    description: typeof data.description === "string" ? data.description : "",
    longDescription: typeof data.longDescription === "string" ? data.longDescription : "",
    category: typeof data.category === "string" ? data.category : "Inne",
    location: typeof data.location === "string" ? data.location : "",
    date: typeof data.date === "string" ? data.date : "",
    coverImage: typeof data.coverImage === "string" ? data.coverImage : images[0]?.src || "",
    coverImagePath: typeof data.coverImagePath === "string" ? data.coverImagePath : images[0]?.storagePath || "",
    coverImageId: typeof data.coverImageId === "string" ? data.coverImageId : images[0]?.id || "",
    images,
    featured: showOnHomepage,
    showOnHomepage,
    showInGallery,
    homepageOrder,
    galleryOrder,
    status:
      data.status === "published" || data.status === "hidden"
        ? data.status
        : "draft",
    order,
    createdAt: data.createdAt as RealizationRecord["createdAt"],
    updatedAt: data.updatedAt as RealizationRecord["updatedAt"],
    createdBy: typeof data.createdBy === "string" ? data.createdBy : "",
    updatedBy: typeof data.updatedBy === "string" ? data.updatedBy : "",
  };
}

export function RealizationsManager() {
  const { user } = useAdminAuth();
  const [realizations, setRealizations] = useState<RealizationRecord[]>([]);
  const [gallery, setGallery] = useState<GalleryImageRecord[]>([]);
  const [loading, setLoading] = useState(Boolean(db));
  const [reloadKey, setReloadKey] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [mediaSearch, setMediaSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editing, setEditing] = useState<RealizationRecord | null>(null);
  const [form, setForm] = useState<RealizationForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [importingCurrentSite, setImportingCurrentSite] = useState(false);
  const [uploadingInlineImages, setUploadingInlineImages] = useState(false);
  const [inlineUploadProgress, setInlineUploadProgress] = useState(0);
  const [inlineUploadLabel, setInlineUploadLabel] = useState("");
  const [isInlineUploadDragging, setIsInlineUploadDragging] = useState(false);
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<RealizationRecord | null>(null);
  const inlineFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!db) {
      return;
    }

    let cancelled = false;
    const activeDb = db;
    void Promise.all([
      getDocs(query(collection(activeDb, "realizations"), limit(100))),
      getDocs(query(collection(activeDb, "kowerGallery"), limit(120))),
    ])
      .then(([realizationSnapshot, gallerySnapshot]) => {
        if (cancelled) {
          return;
        }

        setRealizations(
          realizationSnapshot.docs
            .map((document) => normalizeRealization(document.id, document.data()))
            .sort((left, right) => left.galleryOrder - right.galleryOrder),
        );
        setGallery(
          gallerySnapshot.docs
            .map((document) => {
              const data = document.data() as GalleryImageRecord;
              const order = typeof data.order === "number" ? data.order : 0;
              const isPublished =
                typeof data.isPublished === "boolean" ? data.isPublished : true;
              const featured = data.featured === true;

              return {
                ...data,
                id: document.id,
                order,
                isPublished,
                featured,
                imageUrl: data.urlLarge || data.imageUrl,
                mediumUrl: data.urlMedium || data.mediumUrl || data.imageUrl,
                thumbnailUrl: data.urlThumb || data.thumbnailUrl || data.urlMedium || data.mediumUrl || data.imageUrl,
                storagePath: data.storagePathLarge || data.storagePath,
                mediumStoragePath: data.storagePathMedium || data.mediumStoragePath,
                thumbnailStoragePath: data.storagePathThumb || data.thumbnailStoragePath,
                urlLarge: data.urlLarge || data.imageUrl,
                urlMedium: data.urlMedium || data.mediumUrl || data.imageUrl,
                urlThumb: data.urlThumb || data.thumbnailUrl || data.imageUrl,
                storagePathLarge: data.storagePathLarge || data.storagePath,
                storagePathMedium: data.storagePathMedium || data.mediumStoragePath,
                storagePathThumb: data.storagePathThumb || data.thumbnailStoragePath,
                showOnHomepage:
                  typeof data.showOnHomepage === "boolean"
                    ? data.showOnHomepage
                    : featured,
                showInGallery:
                  typeof data.showInGallery === "boolean"
                    ? data.showInGallery
                    : isPublished,
                homepageOrder:
                  typeof data.homepageOrder === "number" ? data.homepageOrder : order,
                galleryOrder:
                  typeof data.galleryOrder === "number" ? data.galleryOrder : order,
                status: data.status || (isPublished ? "published" : "hidden"),
              } satisfies GalleryImageRecord;
            })
            .sort((left, right) => (left.galleryOrder ?? left.order) - (right.galleryOrder ?? right.order)),
        );
      })
      .catch((error) => {
        console.error("Błąd pobierania realizacji:", error);
        toast.error("Nie udało się pobrać realizacji i biblioteki zdjęć.");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const filteredRealizations = useMemo(() => {
    const search = searchValue.trim().toLocaleLowerCase("pl");
    if (!search) {
      return realizations;
    }
    return realizations.filter((realization) =>
      [realization.title, realization.slug, realization.category, realization.location || ""]
        .join(" ")
        .toLocaleLowerCase("pl")
        .includes(search),
    );
  }, [realizations, searchValue]);

  const filteredMedia = useMemo(() => {
    const search = mediaSearch.trim().toLocaleLowerCase("pl");
    return gallery
      .filter((image) => image.isPublished || form.images.some((selected) => selected.id === image.id))
      .filter((image) =>
        search
          ? [image.title, image.alt, image.category]
              .join(" ")
              .toLocaleLowerCase("pl")
              .includes(search)
          : true,
      )
      .slice(0, 60);
  }, [form.images, gallery, mediaSearch]);

  const coverImage =
    form.images.find((image) => image.id === form.coverImageId) || form.images[0];

  function refresh() {
    setLoading(true);
    setReloadKey((value) => value + 1);
  }

  function openNew() {
    const nextOrder = realizations.length + 1;
    setEditing(null);
    setForm({
      ...emptyForm,
      order: nextOrder,
      homepageOrder: nextOrder,
      galleryOrder: nextOrder,
    });
    setFormOpen(true);
  }

  function openEdit(realization: RealizationRecord) {
    setEditing(realization);
    setForm({
      title: realization.title,
      slug: realization.slug,
      description: realization.description,
      longDescription: realization.longDescription,
      category: realization.category,
      location: realization.location || "",
      date: realization.date,
      featured: realization.featured,
      showOnHomepage: realization.showOnHomepage,
      showInGallery: realization.showInGallery,
      homepageOrder: realization.homepageOrder,
      galleryOrder: realization.galleryOrder,
      status: realization.status,
      order: realization.order,
      coverImageId: realization.coverImageId || realization.images[0]?.id || "",
      images: realization.images.toSorted((left, right) => left.order - right.order),
    });
    setFormOpen(true);
  }

  useEffect(() => {
    if (loading) {
      return;
    }

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const editId = params.get("edit");
      if (params.get("new") === "1") {
        openNew();
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (editId) {
        const realization = realizations.find((item) => item.id === editId || item.slug === editId);
        if (realization) {
          openEdit(realization);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }, 0);

    return () => window.clearTimeout(timer);
    // URL parameters are consumed once after the list is loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, realizations]);

  async function handleImportCurrentSite() {
    if (!db || !user || importingCurrentSite) {
      return;
    }

    setImportingCurrentSite(true);
    try {
      const batch = writeBatch(db);
      const actor = user.email || user.uid;

      for (const image of gallerySeedItems) {
        const { id, realizationId, ...payload } = image;
        batch.set(
          doc(db, "kowerGallery", id),
          {
            ...payload,
            realizationId: realizationId ? slugToDocumentId(realizationId) : "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: actor,
            updatedBy: actor,
          },
          { merge: true },
        );
      }

      for (const realization of realizationSeedItems) {
        batch.set(
          doc(db, "realizations", slugToDocumentId(realization.slug)),
          {
            ...realization,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: actor,
            updatedBy: actor,
          },
          { merge: true },
        );
      }

      await batch.commit();
      await logAdminActivity({
        user,
        action: "create",
        entityType: "realizations",
        entityId: "current-site-import",
        entityLabel: `Import aktualnych realizacji (${realizationSeedItems.length})`,
      });
      toast.success("Aktualne zdjęcia i realizacje ze strony zostały wczytane do CMS.");
      refresh();
    } catch (error) {
      console.error("Błąd importu aktualnych zdjęć:", error);
      toast.error("Nie udało się wczytać aktualnych zdjęć do CMS.");
    } finally {
      setImportingCurrentSite(false);
    }
  }

  async function handleInlineFilesUpload(fileList: FileList | File[]) {
    if (!db || !storage || !user || uploadingInlineImages) {
      return;
    }

    const allFiles = Array.from(fileList);
    const files = allFiles.filter((file) => file.type.startsWith("image/"));

    if (files.length === 0) {
      toast.error("Wybierz pliki graficzne w formacie JPG, PNG lub WEBP.");
      return;
    }

    if (files.length !== allFiles.length) {
      toast.error("Pominięto pliki, które nie są obrazami.");
    }

    if (files.length > MAX_INLINE_UPLOAD_FILES) {
      toast.error(`Możesz dodać maksymalnie ${MAX_INLINE_UPLOAD_FILES} zdjęć naraz.`);
      return;
    }

    const activeDb = db;
    const activeStorage = storage;
    const actor = user.email || user.uid;
    const uploadedGalleryImages: GalleryImageRecord[] = [];
    let failedCount = 0;

    setUploadingInlineImages(true);
    setInlineUploadProgress(0);
    setInlineUploadLabel("Przygotowuję zdjęcia...");

    for (let fileIndex = 0; fileIndex < files.length; fileIndex += 1) {
      const file = files[fileIndex];
      const fileNumber = fileIndex + 1;
      const progressStart = (fileIndex / files.length) * 100;
      const progressSpan = 100 / files.length;
      const uploadedStoragePaths: string[] = [];

      const setFileProgress = (innerProgress: number) => {
        setInlineUploadProgress(
          Math.min(100, Math.round(progressStart + (progressSpan * innerProgress) / 100)),
        );
      };

      try {
        const selectedOrder = form.images.length + uploadedGalleryImages.length + 1;
        const imageText = buildInlineImageText(form, file, selectedOrder);
        const category = form.category || "Inne";
        const categorySlug = slugify(category) || "inne";

        setInlineUploadLabel(`Kompresuję: ${file.name} (${fileNumber}/${files.length})`);
        setFileProgress(8);

        const compResult = await compressAndCreateThumbnail(file, 1920, 500, 0.8);
        const extension = compResult.format === "image/webp" ? "webp" : "jpg";
        const uniqueId = `${Date.now()}-${fileIndex}-${Math.random().toString(36).slice(2, 8)}`;
        const baseName = slugify(`${imageText.title}-${uniqueId}`) || `realizacja-${uniqueId}`;
        const storagePath = `kower/gallery/${categorySlug}/${baseName}_large.${extension}`;
        const mediumStoragePath = `kower/gallery/${categorySlug}/${baseName}_medium.${extension}`;
        const thumbnailStoragePath = `kower/gallery/${categorySlug}/${baseName}_thumb.${extension}`;

        const uploadBlob = async (
          path: string,
          blob: Blob,
          innerStart: number,
          innerSpan: number,
          label: string,
        ) => {
          setInlineUploadLabel(`${label}: ${file.name} (${fileNumber}/${files.length})`);
          const uploadTask = uploadBytesResumable(ref(activeStorage, path), blob, {
            contentType: compResult.format,
          });

          const url = await new Promise<string>((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const ratio = snapshot.totalBytes
                  ? snapshot.bytesTransferred / snapshot.totalBytes
                  : 0;
                setFileProgress(innerStart + ratio * innerSpan);
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

        const mainUrl = await uploadBlob(storagePath, compResult.mainBlob, 15, 35, "Wysyłam duże zdjęcie");
        const mediumUrl = await uploadBlob(mediumStoragePath, compResult.mediumBlob, 50, 25, "Wysyłam wersję średnią");
        const thumbUrl = await uploadBlob(thumbnailStoragePath, compResult.thumbBlob, 75, 18, "Wysyłam miniaturę");

        setInlineUploadLabel(`Zapisuję w bibliotece: ${file.name}`);
        setFileProgress(96);

        const orderNumber = gallery.length + uploadedGalleryImages.length + 1;
        const galleryStatus: Exclude<ContentStatus, "draft"> =
          form.status === "published" ? "published" : "hidden";
        const linkedRealizationId =
          editing?.id || (form.slug ? slugToDocumentId(slugify(form.slug)) : "");
        const payload: Omit<GalleryImageRecord, "id"> = {
          title: imageText.title,
          caption: imageText.caption,
          alt: imageText.alt,
          category,
          tags: [],
          imageUrl: mainUrl,
          mediumUrl,
          thumbnailUrl: thumbUrl,
          storagePath,
          mediumStoragePath,
          thumbnailStoragePath,
          urlLarge: mainUrl,
          urlMedium: mediumUrl,
          urlThumb: thumbUrl,
          storagePathLarge: storagePath,
          storagePathMedium: mediumStoragePath,
          storagePathThumb: thumbnailStoragePath,
          originalFileName: file.name,
          width: compResult.width,
          height: compResult.height,
          mediumWidth: compResult.mediumWidth,
          mediumHeight: compResult.mediumHeight,
          thumbWidth: compResult.thumbWidth,
          thumbHeight: compResult.thumbHeight,
          sizeBytes: compResult.sizeBytes,
          compressedSizeBytes: compResult.compressedSizeBytes,
          mediumSizeBytes: compResult.mediumSizeBytes,
          thumbnailSizeBytes: compResult.thumbnailSizeBytes,
          format: compResult.format === "image/webp" ? "webp" : "jpeg",
          order: orderNumber,
          isPublished: form.status === "published",
          featured: form.showOnHomepage && selectedOrder === 1,
          showOnHomepage: form.showOnHomepage && selectedOrder === 1,
          showInGallery: form.showInGallery,
          homepageOrder: (Number(form.homepageOrder) || Number(form.order) || orderNumber) * 100 + selectedOrder,
          galleryOrder: (Number(form.galleryOrder) || Number(form.order) || orderNumber) * 100 + selectedOrder,
          status: galleryStatus,
          realizationId: linkedRealizationId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: actor,
          updatedBy: actor,
        };

        const documentRef = await addDoc(collection(activeDb, "kowerGallery"), payload);
        uploadedGalleryImages.push({ id: documentRef.id, ...payload });
        setFileProgress(100);
      } catch (error) {
        failedCount += 1;
        const errorMessage = getUploadErrorMessage(error);
        console.error(`Błąd dodawania zdjęcia ${file.name}:`, error);
        await Promise.all(
          uploadedStoragePaths.map((path) =>
            deleteObject(ref(activeStorage, path)).catch((cleanupError) => {
              console.warn("Nie udało się usunąć pliku po nieudanym uploadzie:", cleanupError);
            }),
          ),
        );
        toast.error(`Nie udało się dodać zdjęcia: ${file.name}. ${errorMessage}`);
      }
    }

    if (uploadedGalleryImages.length > 0) {
      setGallery((current) =>
        [...uploadedGalleryImages, ...current].sort(
          (left, right) => (left.galleryOrder ?? left.order) - (right.galleryOrder ?? right.order),
        ),
      );
      setForm((current) => {
        const existingIds = new Set(current.images.map((image) => image.id));
        const newImages = uploadedGalleryImages
          .filter((image) => !existingIds.has(image.id))
          .map((image, index) => mapGalleryImage(image, current.images.length + index + 1));
        const images = [...current.images, ...newImages].map((image, index) => ({
          ...image,
          order: index + 1,
        }));

        return {
          ...current,
          images,
          coverImageId: current.coverImageId || images[0]?.id || "",
        };
      });
      await logAdminActivity({
        user,
        action: "upload",
        entityType: "kowerGallery",
        entityId: uploadedGalleryImages[0].id,
        entityLabel:
          uploadedGalleryImages.length === 1
            ? uploadedGalleryImages[0].title
            : `Dodano zdjęcia realizacji (${uploadedGalleryImages.length})`,
      });
      toast.success(
        uploadedGalleryImages.length === 1
          ? "Zdjęcie zostało dodane i przypięte do realizacji."
          : `Dodano ${uploadedGalleryImages.length} zdjęć i przypięto je do realizacji.`,
      );
    }

    if (uploadedGalleryImages.length === 0 && failedCount === 0) {
      toast.error("Nie dodano żadnego zdjęcia.");
    }

    setUploadingInlineImages(false);
    setInlineUploadProgress(0);
    setInlineUploadLabel("");
  }

  function toggleImage(image: GalleryImageRecord) {
    setForm((current) => {
      const exists = current.images.some((selected) => selected.id === image.id);
      if (exists) {
        const nextImages = current.images
          .filter((selected) => selected.id !== image.id)
          .map((selected, index) => ({ ...selected, order: index + 1 }));
        return {
          ...current,
          images: nextImages,
          coverImageId:
            current.coverImageId === image.id
              ? nextImages[0]?.id || ""
              : current.coverImageId,
        };
      }
      const nextImages = [
        ...current.images,
        mapGalleryImage(image, current.images.length + 1),
      ];
      return {
        ...current,
        images: nextImages,
        coverImageId: current.coverImageId || image.id,
      };
    });
  }

  function moveImage(imageId: string, direction: -1 | 1) {
    setForm((current) => {
      const index = current.images.findIndex((image) => image.id === imageId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.images.length) {
        return current;
      }
      const nextImages = [...current.images];
      [nextImages[index], nextImages[target]] = [nextImages[target], nextImages[index]];
      return {
        ...current,
        images: nextImages.map((image, nextIndex) => ({
          ...image,
          order: nextIndex + 1,
        })),
      };
    });
  }

  function dropImage(targetImageId: string) {
    if (!draggedImageId || draggedImageId === targetImageId) {
      return;
    }
    setForm((current) => {
      const sourceIndex = current.images.findIndex((image) => image.id === draggedImageId);
      const targetIndex = current.images.findIndex((image) => image.id === targetImageId);
      if (sourceIndex < 0 || targetIndex < 0) {
        return current;
      }
      const nextImages = [...current.images];
      const [moved] = nextImages.splice(sourceIndex, 1);
      nextImages.splice(targetIndex, 0, moved);
      return {
        ...current,
        images: nextImages.map((image, index) => ({ ...image, order: index + 1 })),
      };
    });
    setDraggedImageId(null);
  }

  function validate() {
    if (!form.title.trim()) {
      toast.error("Tytuł realizacji jest wymagany.");
      return false;
    }
    if (!form.slug.trim()) {
      toast.error("Slug realizacji jest wymagany.");
      return false;
    }
    if (!form.category.trim()) {
      toast.error("Kategoria realizacji jest wymagana.");
      return false;
    }
    const normalizedSlug = slugify(form.slug);
    if (
      realizations.some(
        (realization) =>
          realization.id !== editing?.id && realization.slug === normalizedSlug,
      )
    ) {
      toast.error("Ten slug jest już używany.");
      return false;
    }
    if (form.description.length > 320 || form.longDescription.length > 6000) {
      toast.error("Opis realizacji przekracza dozwoloną długość.");
      return false;
    }
    if (form.status === "published" && form.images.length === 0) {
      toast.error("Nie można opublikować realizacji bez zdjęcia głównego.");
      return false;
    }
    if (
      form.status === "published" &&
      form.images.some((image) => !image.alt.trim())
    ) {
      toast.error("Każde opublikowane zdjęcie musi mieć opis alternatywny.");
      return false;
    }
    return true;
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !user || saving || !validate()) {
      return;
    }

    setSaving(true);
    try {
      const slug = slugify(form.slug);
      const documentId = editing?.id || slugToDocumentId(slug);
      const selectedCover =
        form.images.find((image) => image.id === form.coverImageId) || form.images[0];
      const homepageOrder = Number(form.homepageOrder) || Number(form.order) || 0;
      const galleryOrder = Number(form.galleryOrder) || Number(form.order) || 0;
      const publicImageStatus = form.status === "published" ? "published" : "hidden";
      const images = form.images.map((image, index) => ({
        ...image,
        order: index + 1,
        showOnHomepage: form.showOnHomepage,
        showInGallery: form.showInGallery,
        homepageOrder: homepageOrder * 100 + index + 1,
        galleryOrder: galleryOrder * 100 + index + 1,
        status: publicImageStatus,
      }));
      const payload = {
        title: form.title.trim(),
        slug,
        description: form.description.trim(),
        longDescription: form.longDescription.trim(),
        category: form.category,
        location: form.location.trim(),
        date: form.date,
        featured: form.showOnHomepage,
        showOnHomepage: form.showOnHomepage,
        showInGallery: form.showInGallery,
        homepageOrder,
        galleryOrder,
        status: form.status,
        order: galleryOrder,
        coverImageId: selectedCover?.id || "",
        coverImage: selectedCover?.mediumUrl || selectedCover?.thumbnailUrl || selectedCover?.src || "",
        coverImagePath:
          selectedCover?.mediumStoragePath ||
          selectedCover?.storagePathMedium ||
          selectedCover?.thumbnailStoragePath ||
          selectedCover?.storagePath ||
          "",
        images,
        updatedAt: serverTimestamp(),
        updatedBy: user.email || user.uid,
        ...(!editing
          ? {
              createdAt: serverTimestamp(),
              createdBy: user.email || user.uid,
            }
          : {}),
      };

      const batch = writeBatch(db);
      batch.set(doc(db, "realizations", documentId), payload, { merge: true });
      for (const image of images) {
        batch.update(doc(db, "kowerGallery", image.id), {
          realizationId: documentId,
          isPublished: form.status === "published",
          featured: form.showOnHomepage && selectedCover?.id === image.id,
          showOnHomepage: form.showOnHomepage && selectedCover?.id === image.id,
          showInGallery: form.showInGallery,
          homepageOrder: image.homepageOrder,
          galleryOrder: image.galleryOrder,
          status: publicImageStatus,
          updatedAt: serverTimestamp(),
          updatedBy: user.email || user.uid,
        });
      }
      await batch.commit();
      await logAdminActivity({
        user,
        action:
          form.status === "published"
            ? "publish"
            : form.status === "hidden"
              ? "hide"
              : editing
                ? "update"
                : "create",
        entityType: "realizations",
        entityId: documentId,
        entityLabel: form.title,
      });
      toast.success("Realizacja została zapisana.");
      setFormOpen(false);
      refresh();
    } catch (error) {
      console.error("Błąd zapisu realizacji:", error);
      toast.error("Nie udało się zapisać realizacji.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!db || !user || !toDelete) {
      return;
    }
    try {
      await deleteDoc(doc(db, "realizations", toDelete.id));
      await logAdminActivity({
        user,
        action: "delete",
        entityType: "realizations",
        entityId: toDelete.id,
        entityLabel: toDelete.title,
      });
      toast.success("Realizacja została usunięta. Zdjęcia pozostały w bibliotece.");
      setToDelete(null);
      refresh();
    } catch (error) {
      console.error("Błąd usuwania realizacji:", error);
      toast.error("Nie udało się usunąć realizacji.");
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Portfolio"
        title="Realizacje"
        description="Twórz kompletne realizacje, przypisuj zdjęcia z biblioteki, ustawiaj okładkę, kolejność i widoczność."
        icon={Images}
        actions={
          <>
            {realizations.length === 0 ? (
              <Button
                variant="secondary"
                onClick={handleImportCurrentSite}
                disabled={importingCurrentSite}
              >
                <Images data-icon="inline-start" />
                {importingCurrentSite ? "Wczytuję..." : "Wczytaj aktualne zdjęcia"}
              </Button>
            ) : null}
            <Button onClick={openNew}>
              <Plus data-icon="inline-start" />
              Dodaj realizację
            </Button>
          </>
        }
      />

      {!loading && realizations.length === 0 ? (
        <Card className="mb-6 overflow-hidden border-primary/25 bg-primary/5">
          <CardHeader className="gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Aktualne zdjęcia ze strony są gotowe do wczytania</CardTitle>
                <CardDescription className="mt-2 max-w-3xl">
                  Publiczna strona pokazuje teraz {realizationSeedItems.length} realizacji i{" "}
                  {gallerySeedItems.length} zdjęć z lokalnych plików projektu. Wczytaj je do CMS,
                  żeby pojawiły się w panelu i można było edytować opisy, okładki oraz podmieniać
                  zdjęcia.
                </CardDescription>
              </div>
              <Button
                onClick={handleImportCurrentSite}
                disabled={importingCurrentSite}
                className="shrink-0"
              >
                <Images data-icon="inline-start" />
                {importingCurrentSite ? "Wczytywanie..." : "Wczytaj do CMS"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {realizationSeedItems.slice(0, 6).map((realization) => (
                <div
                  key={realization.slug}
                  className="overflow-hidden rounded-xl border bg-background shadow-sm"
                >
                  <div className="relative aspect-[16/10] bg-muted">
                    <Image
                      src={realization.coverImage}
                      alt={realization.title}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-1 text-sm font-semibold">{realization.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {realization.images.length} zdjęć · {realization.category}
                      {realization.location ? ` · ${realization.location}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Wszystkie realizacje</CardTitle>
            <CardDescription>
              Szkice nie są widoczne na stronie publicznej.
            </CardDescription>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Szukaj realizacji…"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-72" />
              ))}
            </div>
          ) : filteredRealizations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredRealizations.map((realization) => (
                <Card key={realization.id} className="overflow-hidden p-0">
                  <div className="relative aspect-[16/10] bg-muted">
                    {realization.coverImage ? (
                      <Image
                        src={realization.coverImage}
                        alt={realization.title}
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <Images />
                      </div>
                    )}
                    <div className="absolute left-3 top-3 flex gap-2">
                      <StatusBadge status={realization.status} />
                      {realization.showOnHomepage ? (
                        <span
                          className="inline-flex size-6 items-center justify-center rounded-full bg-background text-primary shadow"
                          title="Widoczna na stronie głównej"
                        >
                          <Star fill="currentColor" />
                        </span>
                      ) : null}
                      {realization.showInGallery ? (
                        <span
                          className="inline-flex size-6 items-center justify-center rounded-full bg-background text-primary shadow"
                          title="Widoczna w galerii realizacji"
                        >
                          <Eye />
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{realization.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {realization.description || "Brak krótkiego opisu."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-3 border-t py-3">
                    <span className="text-xs text-muted-foreground">
                      {realization.images.length} zdjęć · {realization.category}
                      {realization.location ? ` · ${realization.location}` : ""}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edytuj realizację"
                        onClick={() => openEdit(realization)}
                      >
                        <Pencil />
                      </Button>
                      {realization.status === "published" ? (
                        <Button asChild variant="ghost" size="icon">
                          <Link
                            href={`/realizacje?project=${realization.slug}`}
                            target="_blank"
                            aria-label="Podgląd realizacji"
                          >
                            <Eye />
                          </Link>
                        </Button>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Usuń realizację"
                        onClick={() => setToDelete(realization)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Images />
                </EmptyMedia>
                <EmptyTitle>Brak realizacji</EmptyTitle>
                <EmptyDescription>
                  Utwórz pierwszy projekt i przypisz do niego zdjęcia z galerii.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={openNew}>
                  <Plus data-icon="inline-start" />
                  Dodaj realizację
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </CardContent>
      </Card>

      <Sheet open={formOpen} onOpenChange={setFormOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-4xl">
          <SheetHeader>
            <SheetTitle>{editing ? `Edytuj: ${editing.title}` : "Nowa realizacja"}</SheetTitle>
            <SheetDescription>
              Najpierw uzupełnij opis, następnie wybierz zdjęcia i ustaw okładkę.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSave} className="flex flex-1 flex-col">
            <div className="flex flex-col gap-7 px-4">
              <FieldGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="realization-title">Tytuł *</FieldLabel>
                  <Input
                    id="realization-title"
                    value={form.title}
                    maxLength={100}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        title: event.target.value,
                        slug: editing ? current.slug : slugify(event.target.value),
                      }))
                    }
                  />
                  <FieldDescription>{form.title.length}/100 znaków</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="realization-slug">Slug URL *</FieldLabel>
                  <Input
                    id="realization-slug"
                    value={form.slug}
                    maxLength={120}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, slug: slugify(event.target.value) }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="realization-category">Kategoria *</FieldLabel>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm((current) => ({ ...current, category: value }))
                    }
                  >
                    <SelectTrigger id="realization-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {REALIZATION_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="realization-status">Status *</FieldLabel>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        status: value as ContentStatus,
                      }))
                    }
                  >
                    <SelectTrigger id="realization-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {CONTENT_STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="realization-description">Krótki opis *</FieldLabel>
                  <Textarea
                    id="realization-description"
                    rows={4}
                    maxLength={320}
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, description: event.target.value }))
                    }
                  />
                  <FieldDescription>{form.description.length}/320 znaków</FieldDescription>
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="realization-long-description">
                    Dłuższy opis
                  </FieldLabel>
                  <Textarea
                    id="realization-long-description"
                    rows={7}
                    maxLength={6000}
                    value={form.longDescription}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, longDescription: event.target.value }))
                    }
                  />
                  <FieldDescription>{form.longDescription.length}/6000 znaków</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="realization-date">Data realizacji</FieldLabel>
                  <Input
                    id="realization-date"
                    type="date"
                    value={form.date}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, date: event.target.value }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="realization-location">Lokalizacja opcjonalnie</FieldLabel>
                  <Input
                    id="realization-location"
                    value={form.location}
                    maxLength={120}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, location: event.target.value }))
                    }
                  />
                  <FieldDescription>
                    Nie jest wymagana i nie musi pojawiać się w podpisach zdjęć.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="realization-homepage-order">
                    Kolejność na stronie głównej
                  </FieldLabel>
                  <Input
                    id="realization-homepage-order"
                    type="number"
                    min={0}
                    max={999}
                    value={form.homepageOrder}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        homepageOrder: Number(event.target.value),
                      }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="realization-gallery-order">
                    Kolejność w galerii realizacji
                  </FieldLabel>
                  <Input
                    id="realization-gallery-order"
                    type="number"
                    min={0}
                    max={999}
                    value={form.galleryOrder}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        galleryOrder: Number(event.target.value),
                        order: Number(event.target.value),
                      }))
                    }
                  />
                </Field>
                <Field orientation="horizontal" className="sm:col-span-2">
                  <div className="flex-1">
                    <FieldLabel htmlFor="realization-show-homepage">
                      Widoczna na stronie głównej
                    </FieldLabel>
                    <FieldDescription>
                      Okładka realizacji trafi do karuzeli na stronie głównej, jeśli status to opublikowane.
                    </FieldDescription>
                  </div>
                  <Switch
                    id="realization-show-homepage"
                    checked={form.showOnHomepage}
                    onCheckedChange={(checked) =>
                      setForm((current) => ({ ...current, showOnHomepage: checked }))
                    }
                  />
                </Field>
                <Field orientation="horizontal" className="sm:col-span-2">
                  <div className="flex-1">
                    <FieldLabel htmlFor="realization-show-gallery">
                      Widoczna w galerii realizacji
                    </FieldLabel>
                    <FieldDescription>
                      Realizacja pojawi się na podstronie Realizacje, jeśli status to opublikowane.
                    </FieldDescription>
                  </div>
                  <Switch
                    id="realization-show-gallery"
                    checked={form.showInGallery}
                    onCheckedChange={(checked) =>
                      setForm((current) => ({ ...current, showInGallery: checked }))
                    }
                  />
                </Field>
              </FieldGroup>

              <section className="flex flex-col gap-4 border-t pt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold">Zdjęcia realizacji</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Przeciągnij wybrane zdjęcia, aby ustawić ich kolejność.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      ref={inlineFileInputRef}
                      id="realization-inline-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="sr-only"
                      disabled={uploadingInlineImages}
                      onChange={(event) => {
                        if (event.target.files) {
                          void handleInlineFilesUpload(event.target.files);
                          event.target.value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => inlineFileInputRef.current?.click()}
                      disabled={uploadingInlineImages}
                    >
                      {uploadingInlineImages ? (
                        <Loader2 data-icon="inline-start" className="animate-spin" />
                      ) : (
                        <UploadCloud data-icon="inline-start" />
                      )}
                      Dodaj zdjęcia z dysku
                    </Button>
                  </div>
                </div>

                <div
                  onDragEnter={(event) => {
                    event.preventDefault();
                    if (!uploadingInlineImages) {
                      setIsInlineUploadDragging(true);
                    }
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    if (!uploadingInlineImages) {
                      setIsInlineUploadDragging(true);
                    }
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    if (event.currentTarget === event.target) {
                      setIsInlineUploadDragging(false);
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsInlineUploadDragging(false);
                    if (!uploadingInlineImages && event.dataTransfer.files.length > 0) {
                      void handleInlineFilesUpload(event.dataTransfer.files);
                    }
                  }}
                  className={`rounded-2xl border border-dashed p-4 transition ${
                    isInlineUploadDragging
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/25"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <span className="rounded-xl bg-background p-2 text-primary shadow-sm">
                        <UploadCloud className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-medium">
                          Przeciągnij zdjęcia tutaj albo wybierz je z dysku.
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Obsługiwane formaty: JPG, PNG i WEBP. Maksymalnie {MAX_INLINE_UPLOAD_FILES} zdjęć naraz.
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => inlineFileInputRef.current?.click()}
                      disabled={uploadingInlineImages}
                      className="shrink-0"
                    >
                      Wybierz pliki
                    </Button>
                  </div>
                  {uploadingInlineImages ? (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <span className="truncate">{inlineUploadLabel || "Dodawanie zdjęć..."}</span>
                        <span>{inlineUploadProgress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-background">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${inlineUploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>

                {form.images.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {form.images.map((image, index) => (
                      <div
                        key={image.id}
                        draggable
                        onDragStart={() => setDraggedImageId(image.id)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => dropImage(image.id)}
                        className="flex items-center gap-3 rounded-xl border bg-card p-2"
                      >
                        <GripVertical className="cursor-grab text-muted-foreground" aria-hidden="true" />
                        <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={image.thumbnailUrl || image.src}
                            alt={image.alt}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {index + 1}. {image.caption || image.alt}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{image.alt}</p>
                        </div>
                        <Button
                          type="button"
                          variant={form.coverImageId === image.id ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              coverImageId: image.id,
                            }))
                          }
                        >
                          <Star data-icon="inline-start" />
                          {form.coverImageId === image.id ? "Okładka" : "Ustaw okładkę"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Przesuń zdjęcie w górę"
                          onClick={() => moveImage(image.id, -1)}
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Przesuń zdjęcie w dół"
                          onClick={() => moveImage(image.id, 1)}
                        >
                          <ArrowDown />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Usuń zdjęcie z realizacji"
                          onClick={() => {
                            const galleryImage = gallery.find((item) => item.id === image.id);
                            if (galleryImage) {
                              toggleImage(galleryImage);
                            }
                          }}
                        >
                          <X />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                    Wybierz co najmniej jedno zdjęcie z biblioteki poniżej.
                  </div>
                )}

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={mediaSearch}
                    onChange={(event) => setMediaSearch(event.target.value)}
                    placeholder="Szukaj zdjęcia po tytule, kategorii lub alt…"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {filteredMedia.map((image) => {
                    const selected = form.images.some((item) => item.id === image.id);
                    return (
                      <label
                        key={image.id}
                        className="group cursor-pointer overflow-hidden rounded-xl border bg-card"
                      >
                        <div className="relative aspect-[4/3] bg-muted">
                          <Image
                            src={image.thumbnailUrl || image.imageUrl}
                            alt={image.alt}
                            fill
                            sizes="(min-width: 1024px) 180px, 50vw"
                            className="object-cover"
                          />
                          <span className="absolute left-2 top-2 rounded-md bg-background/92 p-1 shadow">
                            <Checkbox
                              checked={selected}
                              onCheckedChange={() => toggleImage(image)}
                              aria-label={`Wybierz zdjęcie ${image.title}`}
                            />
                          </span>
                        </div>
                        <p className="truncate px-3 py-2 text-xs font-medium">{image.title}</p>
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="border-t pt-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold">Podgląd karty</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Szybka kontrola przed publikacją.
                    </p>
                  </div>
                  <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}>
                    <Eye data-icon="inline-start" />
                    Otwórz podgląd
                  </Button>
                </div>
              </section>
            </div>

            <SheetFooter className="border-t">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Anuluj
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Zapisywanie…" : "Zapisz realizację"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Podgląd realizacji</SheetTitle>
            <SheetDescription>
              Podgląd nie publikuje zmian.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <Card className="overflow-hidden p-0">
              <div className="relative aspect-[4/3] bg-muted">
                {coverImage ? (
                  <Image
                    src={coverImage.src}
                    alt={coverImage.alt}
                    fill
                    sizes="500px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <Images />
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <StatusBadge status={form.status} />
                  <span className="text-xs text-muted-foreground">{form.category}</span>
                </div>
                <CardTitle>{form.title || "Tytuł realizacji"}</CardTitle>
                <CardDescription>
                  {form.description || "Krótki opis realizacji pojawi się tutaj."}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy usunąć realizację?</AlertDialogTitle>
            <AlertDialogDescription>
              Rekord realizacji zostanie usunięty. Zdjęcia pozostaną w bibliotece, aby uniknąć przypadkowej utraty plików.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Usuń realizację
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
