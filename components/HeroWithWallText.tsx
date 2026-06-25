"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomepageSettings } from "@/types/admin";

export function HeroWithWallText({ settings }: { settings?: HomepageSettings }) {
  return (
    <section
      id="hero-wall-text"
      aria-labelledby="hero-title"
      aria-describedby="hero-description"
      className="relative h-[calc(100vh-92px)] min-h-[660px] max-h-[850px] overflow-hidden bg-[#17120c] sm:h-auto sm:min-h-[650px] sm:max-h-none sm:bg-[#f6f2ea] lg:h-[calc(100vh-115px)] lg:min-h-[650px] lg:max-h-[960px]"
    >
      {/* Mobile background image */}
      <Image
        src="/client-assets/hero-mobile-kower-dining.webp"
        alt="Jadalnia z drewnianym stołem i zabudową wykonaną na wymiar przez Kower"
        fill
        priority
        sizes="(max-width: 640px) 100vw, 0vw"
        className="select-none object-cover object-[center_95%] sm:hidden"
      />
      {/* Desktop main kitchen background */}
      <Image
        src={settings?.heroImage || "/client-assets/hero-kitchen-whatsapp.webp"}
        alt="Jasna kuchnia na wymiar z białymi frontami, drewnianym blatem i dekoracyjnymi lamelami Kower"
        fill
        priority
        sizes="(min-width: 640px) 100vw, 0vw"
        className="hidden select-none object-cover sm:block hero-desktop-bg"
      />

      {/* Gradients and Overlays for Mobile */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(13,8,5,0.85)_0%,rgba(13,8,5,0.55)_35%,rgba(13,8,5,0.3)_60%,rgba(13,8,5,0)_75%)] sm:hidden" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[58%] bg-[radial-gradient(ellipse_at_18%_28%,rgba(12,8,5,0.42),rgba(12,8,5,0.15)_48%,transparent_76%)] sm:hidden" />

      {/* Desktop Wall Shadow / Soft Overlay for text readability on the wall */}
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(250,246,236,0.48)_0%,rgba(250,246,236,0.26)_32%,rgba(250,246,236,0.04)_52%,transparent_70%)] sm:block" />
      <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.26),rgba(246,242,234,0)_36%)] sm:block" />

      <div className="relative z-10 mx-auto h-full max-w-[1720px] px-6 sm:h-auto sm:min-h-[650px] sm:px-12 lg:h-[calc(100vh-115px)] lg:min-h-[650px] lg:px-16">
        <div className="flex h-full items-start pb-8 pt-[60px] sm:h-auto sm:min-h-[650px] sm:items-start sm:pt-8 lg:pt-10 sm:pb-8 lg:h-[calc(100vh-115px)] lg:min-h-[650px]">
          <div className="mx-0 w-full p-0 sm:ml-[4vw] sm:max-w-[580px] lg:ml-[3vw] lg:max-w-[440px] xl:ml-[3vw] xl:max-w-[480px] 2xl:ml-[5vw] 2xl:max-w-[620px] hero-wall-text-container">
            {/* Eyebrow */}
            {settings?.eyebrow ? (
              <div className="mb-6 text-[12px] font-bold uppercase tracking-[0.28em] text-[#83c66d] sm:mb-4 sm:text-[11px] sm:tracking-[0.24em] sm:text-[#3f7730]">
                {settings.eyebrow}
              </div>
            ) : (
            <div className="mb-6 flex flex-wrap items-center gap-2 text-[12px] font-bold uppercase tracking-[0.28em] text-[#83c66d] sm:mb-4 sm:gap-2 sm:text-[11px] sm:tracking-[0.24em] sm:text-[#3f7730]">
              <span>Kuchnie</span>
              <span className="text-[#a9bca1]/60" aria-hidden="true">•</span>
              <span>Szafy</span>
              <span className="text-[#a9bca1]/60" aria-hidden="true">•</span>
              <span>Meble na wymiar</span>
              <span className="hidden sm:inline text-[#a9bca1]/60" aria-hidden="true">•</span>
              <span className="hidden sm:inline">Lamele</span>
              <span className="hidden sm:inline text-[#a9bca1]/60" aria-hidden="true">•</span>
              <span className="hidden sm:inline">Cięcie płyt</span>
            </div>
            )}

            {/* H1 with Wall Emboss effect */}
            <h1
              id="hero-title"
              className="hero-title-emboss max-w-[calc(100vw-48px)] font-serif text-[clamp(32px,8.8vw,42px)] font-semibold leading-[1.08] tracking-tight text-[#fbf3e7] drop-shadow-[0_4px_24px_rgba(0,0,0,0.46)] sm:max-w-none sm:text-[40px] sm:leading-[1.05] sm:text-[#1c1b18] sm:drop-shadow-none lg:text-[48px] lg:leading-[0.98] xl:text-[54px] 2xl:text-[62px] text-balance"
            >
              {settings?.title || (
                <>
                  Meble na wymiar
                  <br />{" "}
                  <span className="text-[0.92em] sm:text-[1em]">z rzemieślniczą </span>
                  <span className="block text-[0.92em] sm:inline sm:text-[1em]">precyzją.</span>
                </>
              )}
            </h1>

            {/* Green separator line from Reference 1 */}
            <div className="w-14 h-[3px] bg-[#3f7730] mt-6 sm:mt-4 mb-6 sm:mb-4 rounded-full" />

            {/* Description */}
            <div className="relative mt-5 sm:mt-0">
              <p id="hero-description" className="sr-only">
                {settings?.description || "Projektujemy i tworzymy kuchnie, szafy oraz autorskie zabudowy meblowe. Łączymy precyzję nowoczesnego parku maszynowego z rzemieślniczą dbałością o każdy milimetr."}
              </p>
              {/* Soft dark glow background for mobile readability */}
              <div 
                className="absolute inset-[-10px_-16px] rounded-2xl sm:hidden pointer-events-none" 
                style={{
                  background: 'rgba(12, 8, 5, 0.6)',
                  filter: 'blur(16px)'
                }}
              />
              <p
                aria-hidden="true"
                className="relative z-10 max-w-[320px] text-[16px] leading-[1.6] text-[#e3dbcf] drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)] sm:mt-4 sm:max-w-[500px] sm:text-[14px] sm:leading-[1.65] sm:text-[#1c1b18]/85 sm:drop-shadow-none lg:text-[15px] hero-mobile-text-shadow"
              >
                {settings?.description || <span className="hero-description-copy" />}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col items-start gap-5 sm:mt-6 sm:flex-row sm:items-center sm:gap-6">
              <Button
                asChild
                className="inline-flex h-[60px] w-[300px] max-w-[calc(100vw-48px)] items-center justify-center gap-3 rounded-[6px] border-2 border-[#4e8d3c] bg-[#3f7730] px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[#326026] hover:border-[#3f7730] shadow-none cursor-pointer sm:h-12 sm:w-auto sm:rounded-full sm:px-8 sm:text-[12px] sm:tracking-[0.06em]"
              >
                <Link href={settings?.primaryCtaHref || "/umow-konsultacje"}>
                  {settings?.primaryCtaLabel || "Umów bezpłatną konsultację"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.8} />
                </Link>
              </Button>
              <div className="relative inline-flex">
                {/* Soft dark glow background for mobile readability */}
                <div 
                  className="absolute inset-[-6px_-18px] rounded-full sm:hidden pointer-events-none" 
                  style={{
                    background: 'rgba(12, 8, 5, 0.75)',
                    filter: 'blur(10px)'
                  }}
                />
                <Link
                  href={settings?.secondaryCtaHref || "/realizacje"}
                  className="relative z-10 inline-flex items-center gap-2 text-[14px] font-bold text-[#83c66d] underline decoration-[#83c66d]/40 decoration-1 underline-offset-4 transition-colors hover:text-[#95d77f] hover:decoration-[#95d77f] hero-mobile-text-shadow sm:h-12 sm:justify-center sm:rounded-full sm:border sm:border-[#1c1b18]/25 sm:bg-transparent sm:px-8 sm:text-[12px] sm:uppercase sm:tracking-[0.06em] sm:text-[#1c1b18] sm:no-underline sm:drop-shadow-none sm:hover:border-[#3f7730] sm:hover:text-[#3f7730]"
                >
                  {settings?.secondaryCtaLabel || "Zobacz realizacje"}
                  <ArrowRight className="h-4 w-4 text-[#83c66d] sm:hidden" strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standing Kower Logo on Floor - usunięty na PC, ponieważ napis jest wbudowany bezpośrednio w nowy render tła */}
    </section>
  );
}
