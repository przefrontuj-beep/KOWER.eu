"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/project";
import { getFocalPointObjectPosition } from "@/lib/projects/focal-point";

type ProjectCardProps = {
  project: Project;
  index: number;
  variant?: "carousel" | "grid";
  className?: string;
  onOpen: (project: Project) => void;
};

export function ProjectCard({ project, index, variant = "carousel", className = "", onOpen }: ProjectCardProps) {
  const firstImage = project.images[0];
  const isCarousel = variant === "carousel";
  const isFeatureCard = isCarousel && index === 2;
  const meta = project.category;

  return (
    <button
      type="button"
      className={[
        "group relative overflow-hidden rounded-[22px] bg-[#d8d0c4] text-left shadow-[0_18px_44px_rgba(31,26,20,0.12)] transition duration-500 hover:z-10 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(31,26,20,0.18)] focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#487330] lg:rounded-[8px]",
        isCarousel
          ? "h-[clamp(380px,105vw,460px)] w-[84vw] max-w-[420px] shrink-0"
          : "min-h-[420px] w-full",
        className,
      ].join(" ")}
      onClick={() => onOpen(project)}
    >
      <Image
        fill
        alt={firstImage?.alt ?? project.title}
        className="object-cover transition duration-700 [filter:contrast(1.03)_saturate(.96)_brightness(1.01)_sepia(.04)] group-hover:scale-[1.035]"
        loading={index < 2 && isCarousel ? "eager" : "lazy"}
        sizes={
          isCarousel
            ? "(min-width: 1024px) 430px, (min-width: 640px) 420px, 84vw"
            : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        }
        src={project.coverImage}
        style={{ objectPosition: getFocalPointObjectPosition(project.coverFocalPoint ?? firstImage?.focalPoint) }}
      />
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,12,10,0.1)_0%,rgba(13,12,10,0.04)_42%,rgba(13,12,10,0.62)_100%)] lg:bg-[linear-gradient(180deg,rgba(13,12,10,0.62)_0%,rgba(13,12,10,0.34)_24%,rgba(13,12,10,0.06)_56%,rgba(13,12,10,0.58)_100%)]" />
      <span className="absolute inset-0 bg-[#7a6240]/10 mix-blend-multiply lg:bg-[#6f5f4a]/20" />

      {isCarousel ? (
        <span className="relative z-10 flex h-full flex-col justify-end gap-5 p-5 text-white sm:p-6 lg:justify-between lg:gap-0 lg:p-7">
          <span>
            <span className="block max-w-[260px] font-serif text-[24px] font-semibold leading-[1.04] tracking-normal text-pretty drop-shadow-[0_2px_12px_rgba(0,0,0,0.38)] sm:text-[26px] lg:text-[27px] lg:font-bold lg:leading-[0.96]">
              {project.title}
            </span>
            {!isFeatureCard && (
              <span className="mt-3 block text-[13px] font-bold leading-none text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] lg:mt-5 lg:text-[14px]">
                {meta}
              </span>
            )}
          </span>

          <span className="flex items-end justify-between gap-4">
            {isFeatureCard ? (
              <span className="text-[14px] font-bold leading-none text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                {meta}
              </span>
            ) : (
              <span />
            )}
          </span>
        </span>
      ) : (
        <span className="relative z-10 flex h-full flex-col justify-between p-5 text-white sm:p-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/24 bg-black/16 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/86 backdrop-blur-sm">
            {project.category}
          </span>

          <span>
            <span className="block max-w-[280px] font-serif text-[25px] font-semibold leading-[1.02] text-pretty sm:text-[29px]">
              {project.title}
            </span>
            <span className="mt-3 line-clamp-2 block max-w-[310px] text-[13px] leading-6 text-white/78">
              {project.description}
            </span>
            <span className="mt-5 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
              Zobacz realizację
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/45 bg-white/10 text-[24px] font-light leading-none transition group-hover:bg-white group-hover:text-[#20301a]">
                +
              </span>
            </span>
          </span>
        </span>
      )}
    </button>
  );
}
