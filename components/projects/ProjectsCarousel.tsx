"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import type { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./ProjectCard";
import { ProjectLightbox, type ActiveProjectImage } from "./ProjectLightbox";

const slideOffsets = [-2, -1, 0, 1, 2] as const;

const slideClasses: Record<(typeof slideOffsets)[number], string> = {
  [-2]: "hidden lg:block lg:!h-[330px] lg:!w-[220px] lg:!max-w-none lg:opacity-70",
  [-1]: "!h-[350px] !w-[56vw] !max-w-[240px] opacity-78 lg:!h-[390px] lg:!w-[286px] lg:!max-w-none lg:opacity-88",
  0: "z-20 !h-[clamp(390px,105vw,460px)] !w-[84vw] !max-w-[420px] opacity-100 shadow-[0_28px_80px_rgba(31,26,20,0.2)] lg:!h-[500px] lg:!w-[430px] lg:!max-w-none",
  1: "!h-[350px] !w-[56vw] !max-w-[240px] opacity-78 lg:!h-[390px] lg:!w-[286px] lg:!max-w-none lg:opacity-88",
  2: "hidden lg:block lg:!h-[330px] lg:!w-[220px] lg:!max-w-none lg:opacity-70",
};

export function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const dragRef = useRef({
    isDragging: false,
    moved: false,
    startX: 0,
  });
  const preventClickRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [active, setActive] = useState<ActiveProjectImage>(null);
  const carouselProjects = projects;
  const slideCount = carouselProjects.length;
  const visibleSlides = useMemo(() => {
    if (slideCount === 0) {
      return [];
    }

    return slideOffsets.map((offset) => ({
      offset,
      project: carouselProjects[(activeIndex + offset + slideCount) % slideCount],
    }));
  }, [activeIndex, carouselProjects, slideCount]);

  function goToSlide(index: number) {
    if (slideCount === 0) {
      return;
    }

    setActiveIndex((index + slideCount) % slideCount);
  }

  function scroll(direction: -1 | 1) {
    goToSlide(activeIndex + direction);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 && event.pointerType !== "touch") {
      return;
    }

    dragRef.current = {
      isDragging: true,
      moved: false,
      startX: event.clientX,
    };
    preventClickRef.current = false;
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.isDragging) {
      return;
    }

    const distance = event.clientX - dragRef.current.startX;

    if (Math.abs(distance) > 4) {
      dragRef.current.moved = true;
      preventClickRef.current = true;
    }

    if (!dragRef.current.moved) {
      return;
    }

    event.preventDefault();
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.isDragging) {
      return;
    }

    const distance = event.clientX - dragRef.current.startX;
    dragRef.current.isDragging = false;

    if (Math.abs(distance) > 48) {
      scroll(distance > 0 ? -1 : 1);
    }

  }

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!preventClickRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    preventClickRef.current = false;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scroll(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scroll(-1);
    }
  }

  if (slideCount === 0) {
    return null;
  }

  return (
    <section id="realizacje" aria-labelledby="projects-title" className="relative overflow-hidden bg-[#f8f4ec] py-12 md:py-16">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-0">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#487330]">Realizacje</p>
            <h2 id="projects-title" className="font-serif text-[30px] font-medium leading-[1.08] tracking-tight text-[#24231f] text-pretty sm:text-[38px] lg:text-[44px]">
              Zobacz wybrane projekty
            </h2>
            <p className="mt-4 max-w-xl text-[14px] leading-7 text-[#68645c]">
              Każde wnętrze ma swoją historię. Zobacz wybrane realizacje mebli i zabudów wykonanych na wymiar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 md:flex">
              <Button
                type="button"
                variant="outline"
                aria-label="Poprzednie realizacje"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d6d0c3] bg-[#fbfaf5] p-0 text-[#68645c] hover:border-[#487330] hover:text-[#487330]"
                onClick={() => scroll(-1)}
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={1.6} />
              </Button>
              <Button
                type="button"
                variant="outline"
                aria-label="Następne realizacje"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#b5c5a9] bg-[#fbfaf5] p-0 text-[#487330] hover:bg-[#487330] hover:text-white"
                onClick={() => scroll(1)}
              >
                <ArrowRight className="h-5 w-5" strokeWidth={1.6} />
              </Button>
            </div>
            <Button asChild className="inline-flex h-12 rounded-full bg-[#487330] px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#3c5f27]">
              <Link href="/realizacje">Pełna galeria</Link>
            </Button>
          </div>
        </div>
      </div>

      <div
        aria-label="Wybrane realizacje Kower"
        className="relative mx-auto h-[480px] max-w-[1452px] touch-pan-y overflow-hidden px-5 pb-3 sm:h-[500px] sm:px-6 lg:h-[520px] lg:cursor-grab lg:px-0 lg:active:cursor-grabbing outline-none focus-visible:ring-2 focus-visible:ring-[#487330] focus-visible:ring-offset-2 rounded-2xl"
        onClickCapture={handleClickCapture}
        onKeyDown={handleKeyDown}
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerEnd}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        tabIndex={0}
      >
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-end justify-center gap-0 transition-transform duration-500 ease-out">
          {visibleSlides.map(({ project, offset }, slotIndex) => (
            <ProjectCard
              key={`${project.id}-${offset}`}
              className={[
                "mx-0 transition-all duration-500 ease-out",
                offset < 0 ? "-mr-3 lg:-mr-2" : "",
                offset > 0 ? "-ml-3 lg:-ml-2" : "",
                offset === 0 ? "pointer-events-auto" : "cursor-pointer",
                slideClasses[offset],
              ].join(" ")}
              project={project}
              index={slotIndex}
              onOpen={(selectedProject) => {
                setActive({
                  projectSlug: selectedProject.slug,
                  imageId: selectedProject.images[0]?.id,
                });
              }}
            />
          ))}
        </div>
      </div>

      <ProjectLightbox projects={projects} active={active} onActiveChange={setActive} onClose={() => setActive(null)} />
    </section>
  );
}
