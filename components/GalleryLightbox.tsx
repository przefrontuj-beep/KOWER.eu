"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

const galleryItems = [
  {
    title: "Zabudowa biurowa z charakterem",
    label: "Zabudowa biurowa",
    image: "/client-assets/project-office.jpg",
  },
  {
    title: "Schody i detale drewniane",
    label: "Detale z drewna",
    image: "/client-assets/project-stairs.jpg",
  },
  {
    title: "Kuchnia w kamieniu i orzechu",
    label: "Kuchnia na wymiar",
    image: "/client-assets/project-kitchen.jpg",
  },
  {
    title: "Łazienka w naturalnych tonach",
    label: "Zabudowa łazienkowa",
    image: "/client-assets/project-bathroom.jpg",
  },
  {
    title: "Detal materiału do podmiany",
    label: "Detal materiału",
    image: "/client-assets/wood-detail.jpg",
  },
];

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

export default function GalleryLightbox() {
  const [active, setActive] = useState<(typeof galleryItems)[number] | null>(null);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {galleryItems.map((item, index) => (
          <button
            key={item.title}
            className={`group relative min-h-[360px] overflow-hidden text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[#487330] focus-visible:ring-offset-2 outline-none ${
              index === 2 ? "md:col-span-2 xl:col-span-2" : ""
            }`}
            type="button"
            onClick={() => setActive(item)}
          >
            <Image
              fill
              alt={item.title}
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes={index === 2 ? "(min-width: 1280px) 50vw, 100vw" : "(min-width: 1280px) 25vw, 100vw"}
              src={item.image}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <span className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <span className="block font-serif text-2xl leading-tight">{item.title}</span>
              <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.18em] text-white/75">{item.label}</span>
            </span>
          </button>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent 
          showCloseButton={false} 
          className="max-w-5xl w-full border-none bg-transparent shadow-none p-0 flex flex-col justify-center items-center gap-4 outline-none"
        >
            <DialogHeader className="sr-only">
              <DialogTitle>{active?.title || "Podgląd galerii"}</DialogTitle>
            <DialogDescription>{active?.label || "Zdjęcie z realizacji"}</DialogDescription>
          </DialogHeader>
          
          <DialogClose asChild>
            <button
              type="button"
              className="absolute right-5 top-5 z-50 grid h-11 w-11 place-items-center border border-white/25 bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
              aria-label="Zamknij podgląd"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </DialogClose>

          <div className="relative h-[70vh] w-full overflow-hidden bg-[#eee8dc]">
            {active && (
              <Image fill alt={active.title} className="object-contain" sizes="90vw" src={active.image} />
            )}
          </div>

          {active && (
            <div className="text-center text-white">
              <p className="font-serif text-xl">{active.title}</p>
              <p className="text-xs uppercase tracking-widest text-white/60 mt-1">{active.label}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
