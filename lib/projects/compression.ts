export interface CompressionResult {
  mainBlob: Blob;
  mediumBlob: Blob;
  thumbBlob: Blob;
  width: number;
  height: number;
  mediumWidth: number;
  mediumHeight: number;
  thumbWidth: number;
  thumbHeight: number;
  format: "image/webp" | "image/jpeg";
  sizeBytes: number;
  compressedSizeBytes: number;
  mediumSizeBytes: number;
  thumbnailSizeBytes: number;
}

function validateImageFile(file: File, maxInputSize = 10 * 1024 * 1024) {
  if (file.size > maxInputSize) {
    throw new Error("Plik wejściowy jest za duży. Maksymalny rozmiar to 10 MB.");
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Niedozwolony format pliku. Obsługiwane formaty: JPG, JPEG, PNG, WEBP.");
  }

  if (typeof window === "undefined") {
    throw new Error("Kompresja obrazów przy użyciu Canvas jest możliwa tylko w przeglądarce.");
  }
}

function readImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Nie udało się załadować obrazu do podglądu."));
    };
    reader.onerror = () => reject(new Error("Nie udało się odczytać pliku."));
  });
}

function getScaledSize(width: number, height: number, maxWidth: number) {
  if (width <= maxWidth) {
    return { width, height };
  }

  return {
    width: maxWidth,
    height: Math.round((height * maxWidth) / width),
  };
}

function drawToCanvas(img: HTMLImageElement, maxWidth: number) {
  const size = getScaledSize(img.width, img.height, maxWidth);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Nie udało się uzyskać kontekstu 2D dla elementu Canvas.");
  }
  ctx.drawImage(img, 0, 0, size.width, size.height);
  return { canvas, ...size };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: "image/webp" | "image/jpeg",
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Wystąpił błąd podczas konwersji obrazu."));
          return;
        }
        resolve(blob);
      },
      mime,
      quality,
    );
  });
}

/**
 * Kompresuje pojedynczy obraz po stronie przeglądarki przy użyciu Canvas API.
 */
export async function compressImage(
  file: File,
  maxWidth: number,
  quality: number,
): Promise<Blob> {
  validateImageFile(file, 12 * 1024 * 1024);
  const img = await readImage(file);
  const { canvas } = drawToCanvas(img, maxWidth);

  try {
    return await canvasToBlob(canvas, "image/webp", quality);
  } catch {
    return canvasToBlob(canvas, "image/jpeg", quality);
  }
}

/**
 * Tworzy trzy wersje zdjęcia przed wysłaniem do Firebase Storage:
 * large do lightboxa, medium do kart i thumbnail do panelu/list.
 */
export async function compressAndCreateThumbnail(
  file: File,
  maxMainWidth = 1920,
  maxThumbWidth = 500,
  quality = 0.8,
  maxMediumWidth = 1200,
): Promise<CompressionResult> {
  validateImageFile(file);
  const img = await readImage(file);

  const main = drawToCanvas(img, maxMainWidth);
  const medium = drawToCanvas(img, maxMediumWidth);
  const thumb = drawToCanvas(img, maxThumbWidth);

  let format: "image/webp" | "image/jpeg" = "image/webp";
  let mainBlob: Blob;
  let mediumBlob: Blob;
  let thumbBlob: Blob;

  try {
    [mainBlob, mediumBlob, thumbBlob] = await Promise.all([
      canvasToBlob(main.canvas, "image/webp", quality),
      canvasToBlob(medium.canvas, "image/webp", quality),
      canvasToBlob(thumb.canvas, "image/webp", quality),
    ]);
  } catch {
    format = "image/jpeg";
    [mainBlob, mediumBlob, thumbBlob] = await Promise.all([
      canvasToBlob(main.canvas, "image/jpeg", quality),
      canvasToBlob(medium.canvas, "image/jpeg", quality),
      canvasToBlob(thumb.canvas, "image/jpeg", quality),
    ]);
  }

  const MAX_MAIN_SIZE = 1.5 * 1024 * 1024;
  const MAX_MEDIUM_SIZE = 900 * 1024;
  const MAX_THUMB_SIZE = 200 * 1024;

  if (mainBlob.size > MAX_MAIN_SIZE) {
    throw new Error("Zdjęcie po kompresji jest za duże (przekracza 1.5 MB). Spróbuj wybrać mniejszy plik.");
  }

  if (mediumBlob.size > MAX_MEDIUM_SIZE) {
    throw new Error("Wersja medium po kompresji przekracza 900 KB. Spróbuj wybrać mniejszy plik.");
  }

  if (thumbBlob.size > MAX_THUMB_SIZE) {
    throw new Error("Miniatura po kompresji przekracza 200 KB. Spróbuj wybrać mniejszy plik.");
  }

  return {
    mainBlob,
    mediumBlob,
    thumbBlob,
    width: main.width,
    height: main.height,
    mediumWidth: medium.width,
    mediumHeight: medium.height,
    thumbWidth: thumb.width,
    thumbHeight: thumb.height,
    format,
    sizeBytes: file.size,
    compressedSizeBytes: mainBlob.size,
    mediumSizeBytes: mediumBlob.size,
    thumbnailSizeBytes: thumbBlob.size,
  };
}
