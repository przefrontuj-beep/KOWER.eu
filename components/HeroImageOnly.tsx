"use client";

import Image from "next/image";

export function HeroImageOnly() {
  return (
    <section
      id="hero-image-only"
      aria-labelledby="hero-title"
      className="relative h-[calc(100vh-92px)] min-h-[660px] max-h-[850px] overflow-hidden bg-[#17120c] sm:h-auto sm:min-h-[640px] sm:max-h-none sm:bg-[#f6f2ea] lg:h-[calc(100vh-115px-100px)] lg:min-h-[600px] lg:max-h-[780px]"
    >
      {/* SEO Hidden H1 */}
      <h1 id="hero-title" className="sr-only">
        KOWER – Projektowanie i produkcja mebli na wymiar
      </h1>

      {/* Mobile background image */}
      <Image
        src="/client-assets/hero-mobile-kower-dining.webp"
        alt="Jadalnia z drewnianym stołem i zabudową wykonaną na wymiar przez Kower"
        fill
        priority
        sizes="(max-width: 640px) 100vw, 0vw"
        className="select-none object-cover object-[center_90%] sm:hidden"
      />
      {/* Desktop main kitchen background */}
      <Image
        src="/client-assets/hero-kitchen-whatsapp.webp"
        alt="Jasna kuchnia na wymiar z białymi frontami, drewnianym blatem i dekoracyjnymi lamelami Kower"
        fill
        priority
        sizes="(min-width: 640px) 100vw, 0vw"
        className="hidden select-none object-cover sm:block hero-desktop-bg"
      />

      {/* Gradients and Overlays for Mobile */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(13,8,5,0.72)_0%,rgba(13,8,5,0.4)_44%,rgba(13,8,5,0.1)_78%,rgba(16,11,7,0.76)_100%)] sm:hidden" />

      {/* Desktop Soft Overlay */}
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(250,246,236,0.22)_0%,rgba(250,246,236,0.08)_40%,transparent_70%)] sm:block" />

      {/* Standing Kower Logo on Floor - usunięty na PC, ponieważ napis jest teraz wtopiony bezpośrednio w nowy render tła */}
    </section>
  );
}
