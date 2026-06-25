"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Project } from "@/types/project";

export type ActiveProjectImage = {
  projectSlug: string;
  imageId?: string;
} | null;

type ActiveProjectImageValue = NonNullable<ActiveProjectImage>;

type ProjectLightboxProps = {
  projects: Project[];
  active: ActiveProjectImage;
  onActiveChange: (active: ActiveProjectImageValue) => void;
  onClose: () => void;
};

export function ProjectLightbox({ projects, active, onActiveChange, onClose }: ProjectLightboxProps) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const images = useMemo(
    () =>
      projects.flatMap((project) =>
        project.images.map((image) => ({
          project,
          image,
        })),
      ),
    [projects],
  );

  const activeIndex = active
    ? images.findIndex(
        ({ project, image }) =>
          project.slug === active.projectSlug && (!active.imageId || image.id === active.imageId),
      )
    : -1;
  const currentIndex = activeIndex >= 0 ? activeIndex : 0;
  const current = active ? images[currentIndex] : null;

  const goToImage = useCallback((step: number) => {
    if (!active || images.length === 0) {
      return;
    }

    const nextIndex = (currentIndex + step + images.length) % images.length;
    const next = images[nextIndex];

    onActiveChange({
      projectSlug: next.project.slug,
      imageId: next.image.id,
    });
    setTouchStartX(null);
  }, [active, currentIndex, images, onActiveChange]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        goToImage(1);
      }

      if (event.key === "ArrowLeft") {
        goToImage(-1);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, goToImage, onClose]);

  if (!active || !current) {
    return null;
  }

  function handleTouchEnd(clientX: number) {
    if (touchStartX === null) {
      return;
    }

    const distance = clientX - touchStartX;

    if (Math.abs(distance) > 48) {
      goToImage(distance < 0 ? 1 : -1);
    }

    setTouchStartX(null);
  }

  return (
    <div
      aria-label="Podgląd realizacji"
      aria-modal="true"
      className="fixed inset-0 z-[90] bg-[#090806]/92 text-white backdrop-blur-xl"
      role="dialog"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Zamknij podgląd"
        className="absolute inset-0 h-full w-full cursor-default outline-none"
        onClick={onClose}
      />

      <div className="relative z-10 grid h-full grid-rows-[auto_1fr_auto] gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/55">
              {currentIndex + 1} / {images.length}
            </p>
            <h2 className="mt-2 font-serif text-[24px] leading-tight sm:text-[34px]">{current.project.title}</h2>
          </div>
          <button
            type="button"
            aria-label="Zamknij galerię"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" strokeWidth={1.7} />
          </button>
        </div>

        <div
          className="relative mx-auto flex w-full max-w-[1180px] items-center justify-center overflow-hidden"
          onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
          onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
        >
          <button
            type="button"
            aria-label="Poprzednie zdjęcie"
            className="absolute left-0 z-20 hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:inline-flex"
            onClick={() => goToImage(-1)}
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.7} />
          </button>

          <div className="relative h-[64vh] w-full max-w-[1020px] overflow-hidden rounded-[12px] bg-[#11100d]/80 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:h-[68vh] sm:rounded-[8px]">
            <Image
              fill
              alt={current.image.alt}
              className="object-contain"
              sizes="(min-width: 1024px) 1020px, 100vw"
              src={current.image.src}
            />
          </div>

          <button
            type="button"
            aria-label="Następne zdjęcie"
            className="absolute right-0 z-20 hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:inline-flex"
            onClick={() => goToImage(1)}
          >
            <ArrowRight className="h-5 w-5" strokeWidth={1.7} />
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3 border-t border-white/12 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="max-w-2xl text-sm leading-6 text-white/70">{current.image.caption ?? current.project.description}</p>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
              {current.project.tags.join(" / ")}
            </p>
          </div>
          <div className="flex gap-3 md:hidden">
            <button
              type="button"
              aria-label="Poprzednie zdjęcie"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              onClick={() => goToImage(-1)}
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1.7} />
            </button>
            <button
              type="button"
              aria-label="Następne zdjęcie"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              onClick={() => goToImage(1)}
            >
              <ArrowRight className="h-5 w-5" strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
