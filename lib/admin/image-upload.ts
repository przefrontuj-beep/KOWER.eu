"use client";

import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase/client";
import { compressAndCreateThumbnail } from "@/lib/projects/compression";
import { slugify } from "@/lib/admin/utils";

export type UploadedAdminImage = {
  imageUrl: string;
  thumbnailUrl: string;
  storagePath: string;
  thumbnailStoragePath: string;
  width: number;
  height: number;
  sizeBytes: number;
  compressedSizeBytes: number;
  thumbnailSizeBytes: number;
  format: string;
};

type UploadOptions = {
  folder: string;
  label: string;
  onProgress?: (progress: number) => void;
};

export async function uploadAdminImage(
  file: File,
  options: UploadOptions,
): Promise<UploadedAdminImage> {
  if (!storage) {
    throw new Error("Firebase Storage nie jest skonfigurowany.");
  }
  const activeStorage = storage;

  const compressed = await compressAndCreateThumbnail(file, 1920, 600, 0.82);
  options.onProgress?.(20);

  const uniqueId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  const extension = compressed.format === "image/webp" ? "webp" : "jpg";
  const baseName = `${slugify(options.label) || "obraz"}-${uniqueId}`;
  const storagePath = `kower/cms/${options.folder}/${baseName}.${extension}`;
  const thumbnailStoragePath = `kower/cms/${options.folder}/${baseName}-thumb.${extension}`;
  const mainRef = ref(activeStorage, storagePath);
  const thumbRef = ref(activeStorage, thumbnailStoragePath);

  try {
    const mainTask = uploadBytesResumable(mainRef, compressed.mainBlob, {
      contentType: compressed.format,
      customMetadata: {
        originalFileName: file.name,
      },
    });

    await new Promise<void>((resolve, reject) => {
      mainTask.on(
        "state_changed",
        (snapshot) => {
          const value = snapshot.totalBytes
            ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 45)
            : 0;
          options.onProgress?.(20 + value);
        },
        reject,
        resolve,
      );
    });

    const thumbTask = uploadBytesResumable(thumbRef, compressed.thumbBlob, {
      contentType: compressed.format,
      customMetadata: {
        originalFileName: file.name,
        variant: "thumbnail",
      },
    });

    await new Promise<void>((resolve, reject) => {
      thumbTask.on(
        "state_changed",
        (snapshot) => {
          const value = snapshot.totalBytes
            ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 30)
            : 0;
          options.onProgress?.(65 + value);
        },
        reject,
        resolve,
      );
    });

    const [imageUrl, thumbnailUrl] = await Promise.all([
      getDownloadURL(mainRef),
      getDownloadURL(thumbRef),
    ]);
    options.onProgress?.(100);

    return {
      imageUrl,
      thumbnailUrl,
      storagePath,
      thumbnailStoragePath,
      width: compressed.width,
      height: compressed.height,
      sizeBytes: compressed.sizeBytes,
      compressedSizeBytes: compressed.compressedSizeBytes,
      thumbnailSizeBytes: compressed.thumbnailSizeBytes,
      format: extension,
    };
  } catch (error) {
    await Promise.allSettled([deleteObject(mainRef), deleteObject(thumbRef)]);
    throw error;
  }
}

export async function deleteAdminImage(paths: Array<string | undefined>) {
  if (!storage) {
    return;
  }
  const activeStorage = storage;

  await Promise.allSettled(
    paths
      .filter((path): path is string => Boolean(path))
      .map((path) => deleteObject(ref(activeStorage, path))),
  );
}
