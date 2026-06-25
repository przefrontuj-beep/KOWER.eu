import { collection, getDocs, doc, getDoc, query, where, orderBy, limit as firestoreLimit, DocumentData } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase/client";
import { projects as localProjects } from "./project-data";
import type { Project, ProjectCategory, ProjectImage } from "@/types/project";

const localProjectsBySlug = new Map(localProjects.map((project) => [project.slug, project]));
const legacyRealizationImageIdPattern = /^realizacja-\d+$/;
type PublicOrderField = "homepageOrder" | "galleryOrder";

function removeProjectLocation(project: Project): Project {
  const projectWithoutLocation = { ...project };
  delete projectWithoutLocation.location;
  return projectWithoutLocation;
}

function getOptionalNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getOptionalBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function withVisibilityDefaults(project: Project): Project {
  const showOnHomepage = getOptionalBoolean(project.showOnHomepage, project.featured);
  const showInGallery = getOptionalBoolean(project.showInGallery, true);
  const homepageOrder = getOptionalNumber(project.homepageOrder, project.order);
  const galleryOrder = getOptionalNumber(project.galleryOrder, project.order);

  return {
    ...project,
    showOnHomepage,
    showInGallery,
    homepageOrder,
    galleryOrder,
    featured: showOnHomepage,
    images: project.images.map((image) => ({
      ...image,
      showOnHomepage: getOptionalBoolean(image.showOnHomepage, showOnHomepage),
      showInGallery: getOptionalBoolean(image.showInGallery, showInGallery),
      homepageOrder: getOptionalNumber(image.homepageOrder, homepageOrder),
      galleryOrder: getOptionalNumber(image.galleryOrder, galleryOrder),
      status: image.status || (project.published === false ? "hidden" : "published"),
    })),
  };
}

function sortProjects(projects: Project[], orderField: PublicOrderField = "galleryOrder") {
  return projects.map(withVisibilityDefaults).sort((a, b) => {
    const orderA = getOptionalNumber(a[orderField], a.order);
    const orderB = getOptionalNumber(b[orderField], b.order);
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
}

function sortImages(images: ProjectImage[]) {
  return [...images].sort((left, right) => left.order - right.order);
}

function getUsableImages(images: ProjectImage[]) {
  return sortImages(images.filter((image) => Boolean(image.src)));
}

function isPublishedProject(project: Project) {
  return project.published !== false;
}

function isPublicProjectVisible(project: Project) {
  const normalized = withVisibilityDefaults(project);
  return (
    isPublishedProject(normalized) &&
    (normalized.showInGallery === true || normalized.showOnHomepage === true)
  );
}

function getGalleryProjects(projects: Project[], maxResults: number) {
  return sortProjects(projects, "galleryOrder")
    .filter((project) => isPublishedProject(project) && project.showInGallery !== false)
    .slice(0, maxResults);
}

function getHomepageProjectList(projects: Project[], maxResults?: number) {
  const homepageProjects = sortProjects(projects, "homepageOrder")
    .filter((project) => isPublishedProject(project) && project.showOnHomepage === true);

  return typeof maxResults === "number"
    ? homepageProjects.slice(0, maxResults)
    : homepageProjects;
}

function mergeProjectImages(left: ProjectImage[], right: ProjectImage[]) {
  const imagesById = new Map<string, ProjectImage>();
  for (const image of [...left, ...right]) {
    if (image.src) {
      imagesById.set(image.id, {
        ...imagesById.get(image.id),
        ...image,
      });
    }
  }
  return getUsableImages(Array.from(imagesById.values()));
}

function buildCoverFallbackImage(project: Project): ProjectImage | null {
  if (!project.coverImage) {
    return null;
  }

  return {
    id: `${project.id}-cover`,
    src: project.coverImage,
    alt: `${project.title} - KOWER`,
    caption: project.description,
    focalPoint: project.coverFocalPoint || "center",
    width: 1600,
    height: 1200,
    order: 1,
    path: project.coverImagePath || "",
  };
}

function hydrateProjectWithLocalCatalog(project: Project): Project | null {
  const localProject = localProjectsBySlug.get(project.slug);

  if (!localProject) {
    const images = getUsableImages(project.images);
    const fallbackCover = images[0] || buildCoverFallbackImage(project);
    if (!fallbackCover) {
      return null;
    }

    return removeProjectLocation({
      ...project,
      coverImage: project.coverImage || fallbackCover.src,
      images: images.length > 0 ? images : [fallbackCover],
    });
  }

  const imagesById = new Map<string, ProjectImage>();
  const localImageIds = new Set(localProject.images.map((image) => image.id));
  for (const image of project.images) {
    if (
      image.src &&
      (localImageIds.has(image.id) || !legacyRealizationImageIdPattern.test(image.id))
    ) {
      const localCatalogImage = localProject.images.find((item) => item.id === image.id);
      if (localCatalogImage && legacyRealizationImageIdPattern.test(image.id)) {
        imagesById.set(image.id, {
          ...image,
          alt: image.alt || localCatalogImage.alt,
          caption: image.caption || localCatalogImage.caption,
          focalPoint: image.focalPoint || localCatalogImage.focalPoint,
          width: image.width || localCatalogImage.width,
          height: image.height || localCatalogImage.height,
          order: image.order || localCatalogImage.order,
        });
        continue;
      }

      imagesById.set(image.id, {
        ...imagesById.get(image.id),
        ...image,
      });
    }
  }

  const images = getUsableImages(Array.from(imagesById.values()));
  const coverImage =
    project.coverImage
      ? project.coverImage
      : images[0]?.mediumUrl || images[0]?.thumbnailUrl || images[0]?.src || "";

  if (!coverImage) {
    return null;
  }

  return removeProjectLocation({
    ...project,
    title: project.title || localProject.title,
    category: project.category || localProject.category,
    description: project.description || localProject.description,
    tags: project.tags.length > 0 ? project.tags : localProject.tags,
    coverImage,
    coverFocalPoint: project.coverFocalPoint || localProject.coverFocalPoint,
    images,
  });
}

function completeProjectsWithLocalCatalog(
  projects: Project[],
  orderField: PublicOrderField = "galleryOrder",
) {
  const hydratedProjects = projects
    .map(hydrateProjectWithLocalCatalog)
    .filter((project): project is Project => project !== null);

  const bySlug = new Map<string, Project>();
  for (const project of hydratedProjects) {
    const existing = bySlug.get(project.slug);
    if (!existing) {
      bySlug.set(project.slug, project);
      continue;
    }

    bySlug.set(project.slug, removeProjectLocation({
      ...existing,
      ...project,
      description: project.description || existing.description,
      tags: project.tags.length > 0 ? project.tags : existing.tags,
      coverImage: project.coverImage || existing.coverImage,
      images: mergeProjectImages(existing.images, project.images),
    }));
  }

  const hydrated = Array.from(bySlug.values());
  return sortProjects(hydrated, orderField);
}

// Mapowanie kategorii z Firestore (małe litery) na kategorie publicznej strony (wielkie litery)
function mapCategory(category: string): ProjectCategory {
  const c = category ? category.toLowerCase().trim() : "";
  if (c === "kuchnie") return "Kuchnie";
  if (c === "łazienki") return "Łazienki";
  if (c === "garderoby" || c === "szafy") return "Szafy i garderoby";
  if (c === "biuro" || c === "biura" || c === "meble biurowe") return "Biura";
  if (c === "meble do salonu" || c === "meble do sypialni") return "Zabudowy nietypowe";
  if (c === "meble dziecięce") return "Inne";
  if (c === "lite drewno / fornir") return "Detale";
  if (c === "lamele") return "Lamele";
  if (c === "realizacje") return "Zabudowy nietypowe";
  if (c === "detale") return "Detale";
  return "Zabudowy nietypowe";
}

// Slugowanie tekstu
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// Mapowanie dokumentu Firestore na typ Project
function mapGalleryDocToProject(docData: DocumentData, id: string): Project | null {
  const linkedSlug =
    typeof docData.realizationId === "string" && docData.realizationId
      ? docData.realizationId
      : "";
  const localProject = linkedSlug ? localProjectsBySlug.get(linkedSlug) : undefined;
  const title = docData.title || localProject?.title || "Realizacja";
  const thumbnailUrl = docData.urlThumb || docData.thumbnailUrl || "";
  const mediumUrl = docData.urlMedium || docData.mediumUrl || docData.imageUrl || thumbnailUrl;
  const imageUrl = docData.urlLarge || docData.imageUrl || mediumUrl || thumbnailUrl;

  // Odrzuć dokumenty bez URL-i do zdjęć
  if (!imageUrl && !thumbnailUrl) {
    return null;
  }

  const categoryStr = docData.category || "inne";
  const mappedCategory = mapCategory(categoryStr);

  const rawCreatedAt = docData.createdAt;
  const rawUpdatedAt = docData.updatedAt;

  const createdAtString = rawCreatedAt && typeof rawCreatedAt === "object" && rawCreatedAt.toDate 
    ? rawCreatedAt.toDate().toISOString() 
    : (rawCreatedAt as string) || "";

  const updatedAtString = rawUpdatedAt && typeof rawUpdatedAt === "object" && rawUpdatedAt.toDate 
    ? rawUpdatedAt.toDate().toISOString() 
    : (rawUpdatedAt as string) || "";

  const tags = docData.tags || [];
  const published =
    typeof docData.status === "string"
      ? docData.status === "published"
      : docData.isPublished !== undefined
        ? docData.isPublished === true
        : true;
  const order = getOptionalNumber(docData.order, 0);
  const showOnHomepage = getOptionalBoolean(docData.showOnHomepage, docData.featured === true);
  const showInGallery = getOptionalBoolean(docData.showInGallery, published);
  const homepageOrder = getOptionalNumber(docData.homepageOrder, order);
  const galleryOrder = getOptionalNumber(docData.galleryOrder, order);

  return {
    id: id,
    title: title,
    slug: linkedSlug || docData.slug || slugify(title) || id,
    category: mappedCategory || localProject?.category,
    description: docData.caption || localProject?.description || "",
    coverImage: mediumUrl || thumbnailUrl,
    coverFocalPoint: "center",
    coverImagePath:
      docData.storagePathMedium ||
      docData.mediumStoragePath ||
      docData.storagePathThumb ||
      docData.thumbnailStoragePath ||
      docData.storagePathLarge ||
      docData.storagePath ||
      "",
    tags: tags.length > 0 ? tags : localProject?.tags || [],
    featured: showOnHomepage,
    showOnHomepage,
    showInGallery,
    homepageOrder,
    galleryOrder,
    published,
    order,
    images: [
      {
        id: id,
        src: imageUrl,
        mediumUrl,
        thumbnailUrl,
        alt: docData.alt || `${title} - realizacja mebli na wymiar KOWER`,
        caption: docData.caption || "",
        focalPoint: "center",
        width: docData.width || 1600,
        height: docData.height || 1200,
        order: 1,
        showOnHomepage,
        showInGallery,
        homepageOrder,
        galleryOrder,
        status: published ? "published" : "hidden",
        storagePathLarge: docData.storagePathLarge || docData.storagePath || "",
        storagePathMedium: docData.storagePathMedium || docData.mediumStoragePath || "",
        storagePathThumb: docData.storagePathThumb || docData.thumbnailStoragePath || "",
        path: docData.storagePathLarge || docData.storagePath || ""
      }
    ],
    createdAt: createdAtString,
    updatedAt: updatedAtString
  };
}

function toDateString(value: unknown) {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toISOString();
  }
  return typeof value === "string" ? value : "";
}

function mapRealizationDocToProject(
  docData: DocumentData,
  id: string,
): Project | null {
  const rawImages = Array.isArray(docData.images) ? docData.images : [];
  const order = getOptionalNumber(docData.order, 0);
  const showOnHomepage = getOptionalBoolean(docData.showOnHomepage, docData.featured === true);
  const showInGallery = getOptionalBoolean(docData.showInGallery, true);
  const homepageOrder = getOptionalNumber(docData.homepageOrder, order);
  const galleryOrder = getOptionalNumber(docData.galleryOrder, order);
  const published = docData.status === "published";
  const images: ProjectImage[] = rawImages
    .map((image: DocumentData, index: number) => {
      const imageStatus = (image.status === "hidden" ? "hidden" : published ? "published" : "draft") as ProjectImage["status"];
      const largeUrl = String(image.urlLarge || image.src || image.imageUrl || "");
      const mediumUrl = String(image.urlMedium || image.mediumUrl || largeUrl);
      const thumbnailUrl = String(image.urlThumb || image.thumbnailUrl || mediumUrl || largeUrl);

      return {
        id: String(image.id || `${id}-${index + 1}`),
        src: largeUrl,
        mediumUrl,
        thumbnailUrl,
        alt: String(image.alt || `${docData.title || "Realizacja"} - KOWER`),
        caption: String(image.caption || ""),
        focalPoint: "center" as const,
        width: Number(image.width) || undefined,
        height: Number(image.height) || undefined,
        order: getOptionalNumber(image.order, index + 1),
        showOnHomepage: getOptionalBoolean(image.showOnHomepage, showOnHomepage),
        showInGallery: getOptionalBoolean(image.showInGallery, showInGallery),
        homepageOrder: getOptionalNumber(image.homepageOrder, homepageOrder),
        galleryOrder: getOptionalNumber(image.galleryOrder, galleryOrder),
        status: imageStatus,
        storagePathLarge: String(image.storagePathLarge || image.storagePath || ""),
        storagePathMedium: String(image.storagePathMedium || image.mediumStoragePath || ""),
        storagePathThumb: String(image.storagePathThumb || image.thumbnailStoragePath || ""),
        path: String(image.storagePathLarge || image.storagePath || ""),
      };
    })
    .filter((image: ProjectImage) => Boolean(image.src) && image.status !== "hidden")
    .sort((left: ProjectImage, right: ProjectImage) => left.order - right.order);
  const coverImage = String(
    docData.coverImage ||
      images[0]?.mediumUrl ||
      images[0]?.thumbnailUrl ||
      images[0]?.src ||
      "",
  );

  if (!coverImage) {
    return null;
  }

  return {
    id,
    title: String(docData.title || "Realizacja"),
    slug: String(docData.slug || id),
    category: mapCategory(String(docData.category || "inne")),
    description: String(docData.description || docData.longDescription || ""),
    coverImage,
    coverFocalPoint: "center",
    coverImagePath: String(docData.coverImagePath || ""),
    images,
    tags: Array.isArray(docData.tags) ? docData.tags.map(String) : [],
    featured: showOnHomepage,
    showOnHomepage,
    showInGallery,
    homepageOrder,
    galleryOrder,
    published,
    order,
    createdAt: toDateString(docData.createdAt),
    updatedAt: toDateString(docData.updatedAt),
  };
}

export async function getProjects(maxResults = 100): Promise<Project[]> {
  if (!isFirebaseConfigured || !db) {
    return getGalleryProjects(localProjects, maxResults);
  }

  try {
    const realizationsSnapshot = await getDocs(
      query(
        collection(db, "realizations"),
        where("status", "==", "published"),
        orderBy("order", "asc"),
        firestoreLimit(maxResults),
      ),
    );
    const realizations = realizationsSnapshot.docs
      .map((document) =>
        mapRealizationDocToProject(document.data(), document.id),
      )
      .filter((project): project is Project => project !== null);

    if (realizations.length > 0) {
      return getGalleryProjects(
        completeProjectsWithLocalCatalog(realizations, "galleryOrder"),
        maxResults,
      );
    }

    const galleryRef = collection(db, "kowerGallery");
    const q = query(
      galleryRef,
      where("isPublished", "==", true),
      orderBy("order", "asc"),
      firestoreLimit(maxResults)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.warn("[getProjects] Brak opublikowanych zdjęć w Firestore. Używam danych lokalnych.");
      return [];
    }

    const projectsList: Project[] = [];
    querySnapshot.forEach((docSnap) => {
      const project = mapGalleryDocToProject(docSnap.data(), docSnap.id);
      if (project) {
        projectsList.push(project);
      }
    });

    return getGalleryProjects(
      completeProjectsWithLocalCatalog(projectsList, "galleryOrder"),
      maxResults,
    );
  } catch (error) {
    console.error("[getProjects] Błąd Firestore, używam fallbacku:", error);
    return getGalleryProjects(localProjects, maxResults);
  }
}

export async function getHomepageProjects(maxResults?: number): Promise<Project[]> {
  if (!isFirebaseConfigured || !db) {
    return getHomepageProjectList(localProjects, maxResults);
  }

  try {
    const gallerySnapshot = await getDocs(
      typeof maxResults === "number"
        ? query(
            collection(db, "kowerGallery"),
            where("status", "==", "published"),
            firestoreLimit(Math.max(maxResults * 3, 150)),
          )
        : query(collection(db, "kowerGallery"), where("status", "==", "published")),
    );

    const galleryProjects = gallerySnapshot.docs
      .map((document) => mapGalleryDocToProject(document.data(), document.id))
      .filter((project): project is Project => project !== null);
    const homepageImages = getHomepageProjectList(galleryProjects, maxResults);

    if (homepageImages.length > 0) {
      return homepageImages;
    }

    const realizationsSnapshot = await getDocs(
      typeof maxResults === "number"
        ? query(
            collection(db, "realizations"),
            where("status", "==", "published"),
            orderBy("order", "asc"),
            firestoreLimit(maxResults),
          )
        : query(
            collection(db, "realizations"),
            where("status", "==", "published"),
            orderBy("order", "asc"),
          ),
    );
    const realizations = realizationsSnapshot.docs
      .map((document) =>
        mapRealizationDocToProject(document.data(), document.id),
      )
      .filter((project): project is Project => project !== null);

    if (realizations.length > 0) {
      return getHomepageProjectList(
        completeProjectsWithLocalCatalog(realizations, "homepageOrder"),
        maxResults,
      );
    }

    return [];
  } catch (error) {
    console.error("[getHomepageProjects] Błąd Firestore, używam fallbacku:", error);
    return getHomepageProjectList(localProjects, maxResults);
  }
}

export async function getFeaturedProjects(limit = 8): Promise<Project[]> {
  return getHomepageProjects(limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isFirebaseConfigured || !db) {
    const localProject = localProjects.find((project) => project.slug === slug);
    return localProject ? withVisibilityDefaults(localProject) : null;
  }

  try {
    const realizationSnapshot = await getDoc(doc(db, "realizations", slug));
    if (
      realizationSnapshot.exists() &&
      realizationSnapshot.data().status === "published"
    ) {
      const project = mapRealizationDocToProject(
        realizationSnapshot.data(),
        realizationSnapshot.id,
      );
      const hydrated = project ? hydrateProjectWithLocalCatalog(project) : null;
      return hydrated && isPublicProjectVisible(hydrated) ? hydrated : null;
    }

    const docRef = doc(db, "kowerGallery", slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const project = mapGalleryDocToProject(docSnap.data(), docSnap.id);
      const hydrated = project ? hydrateProjectWithLocalCatalog(project) : null;
      return hydrated && isPublicProjectVisible(hydrated) ? hydrated : null;
    }

    // Przeszukaj po polu slug
    const galleryRef = collection(db, "kowerGallery");
    const q = query(galleryRef, where("isPublished", "==", true));
    const querySnapshot = await getDocs(q);

    for (const docS of querySnapshot.docs) {
      const data = docS.data();
      const derivedSlug = data.realizationId || data.slug || slugify(data.title || "");
      if (derivedSlug === slug) {
        const project = mapGalleryDocToProject(data, docS.id);
        const hydrated = project ? hydrateProjectWithLocalCatalog(project) : null;
        return hydrated && isPublicProjectVisible(hydrated) ? hydrated : null;
      }
    }

    return null;
  } catch (error) {
    console.error(`[getProjects] Błąd pobierania projektu "${slug}":`, error);
    const localProject = localProjects.find((project) => project.slug === slug);
    return localProject ? withVisibilityDefaults(localProject) : null;
  }
}
