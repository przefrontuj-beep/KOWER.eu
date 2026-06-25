"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  ChefHat,
  Bath,
  Briefcase,
  Tv,
  BedDouble,
  Smile,
  DoorClosed,
  Hammer,
  Trees,
  PanelTop,
  Sparkles,
  Boxes,
  Ruler,
  Layers3,
  MonitorCog,
  Grid2X2,
  Refrigerator,
  PackageCheck,
  Cpu,
  Package,
  ScanLine,
  SlidersHorizontal,
  Palette,
  FileSpreadsheet,
  Layers,
  Grid,
  Maximize2,
  Flame,
  Sun,
  AlignJustify,
  FolderOpen,
  Award,
  Handshake,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { offerItems } from "@/lib/offerItems";

const iconMap: Record<string, LucideIcon> = {
  Home,
  ChefHat,
  Bath,
  Briefcase,
  Tv,
  BedDouble,
  Smile,
  DoorClosed,
  Hammer,
  Trees,
  PanelTop,
  Sparkles,
  Boxes,
  Ruler,
  Layers3,
  MonitorCog,
  Grid2X2,
  Refrigerator,
  PackageCheck,
  Cpu,
  Package,
  ScanLine,
  SlidersHorizontal,
  Palette,
  FileSpreadsheet,
  Layers,
  Grid,
  Maximize2,
  Flame,
  Sun,
  AlignJustify,
  FolderOpen,
  Award,
  Handshake,
};

const filterGroups = [
  { id: "all", label: "Wszystkie" },
  { id: "meble", label: "Meble" },
  { id: "lamele", label: "Lamele" },
  { id: "agd", label: "AGD" },
  { id: "plyty", label: "Usługi płytowe" },
  { id: "materialy", label: "Materiały" },
] as const;

const AUTO_SCROLL_MS = 4200;
const MANUAL_PAUSE_MS = 6500;
const MOBILE_PROGRESS_DOTS = 7;

export default function OfferQuickNav() {
  const pathname = usePathname();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const interactionPauseUntilRef = useRef(0);
  const scrollFrameRef = useRef<number | null>(null);

  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Filter items based on selected group
  const filteredCards = offerItems.filter(
    (item) => selectedGroup === "all" || item.group === selectedGroup
  );
  const mobileProgressCount = Math.min(MOBILE_PROGRESS_DOTS, filteredCards.length);
  const activeMobileProgress =
    filteredCards.length <= 1 || mobileProgressCount <= 1
      ? 0
      : Math.round((activeIndex * (mobileProgressCount - 1)) / (filteredCards.length - 1));

  function getMobileProgressTarget(progressIndex: number) {
    if (filteredCards.length <= 1 || mobileProgressCount <= 1) {
      return 0;
    }

    return Math.round((progressIndex * (filteredCards.length - 1)) / (mobileProgressCount - 1));
  }

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const markInteraction = useCallback(() => {
    interactionPauseUntilRef.current = Date.now() + MANUAL_PAUSE_MS;
  }, []);

  const scrollToIndex = useCallback(
    (index: number, markAsManual = false) => {
      const scroller = scrollerRef.current;
      const card = scroller?.querySelector<HTMLElement>(`[data-carousel-index="${index}"]`);

      if (!scroller || !card) {
        return;
      }

      if (markAsManual) {
        markInteraction();
      }

      const scrollPaddingLeft = parseFloat(window.getComputedStyle(scroller).scrollPaddingLeft || "0");
      const left = Math.max(0, card.offsetLeft - scrollPaddingLeft);
      scroller.scrollTo({
        left,
        behavior: reducedMotion ? "auto" : "smooth",
      });
      activeIndexRef.current = index;
      setActiveIndex(index);
    },
    [markInteraction, reducedMotion],
  );

  // Reset to first card when group changes
  useEffect(() => {
    scrollToIndex(0, false);
  }, [selectedGroup, scrollToIndex]);

  const goToNext = useCallback(
    (markAsManual = false) => {
      if (filteredCards.length === 0) return;
      const nextIndex = (activeIndexRef.current + 1) % filteredCards.length;
      scrollToIndex(nextIndex, markAsManual);
    },
    [scrollToIndex, filteredCards.length],
  );

  const goToPrevious = useCallback(() => {
    if (filteredCards.length === 0) return;
    const previousIndex = Math.max(activeIndexRef.current - 1, 0);
    scrollToIndex(previousIndex, true);
  }, [scrollToIndex, filteredCards.length]);

  useEffect(() => {
    if (paused || reducedMotion || filteredCards.length === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      if (Date.now() < interactionPauseUntilRef.current) {
        return;
      }

      goToNext(false);
    }, AUTO_SCROLL_MS);

    return () => window.clearInterval(interval);
  }, [goToNext, paused, reducedMotion, filteredCards.length]);

  function handleScroll() {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    if (scrollFrameRef.current) {
      window.cancelAnimationFrame(scrollFrameRef.current);
    }

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const cards = Array.from(scroller.querySelectorAll<HTMLElement>("[data-carousel-index]"));
      const scrollPaddingLeft = parseFloat(window.getComputedStyle(scroller).scrollPaddingLeft || "0");
      const targetLeft = scroller.scrollLeft + scrollPaddingLeft;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card) => {
        const distance = Math.abs(targetLeft - card.offsetLeft);

        if (distance < closestDistance) {
          closestDistance = distance;
          const dataIndex = card.getAttribute("data-carousel-index");
          if (dataIndex !== null) {
            closestIndex = parseInt(dataIndex, 10);
          }
        }
      });

      activeIndexRef.current = closestIndex;
      setActiveIndex(closestIndex);
    });
  }

  return (
    <motion.section
      aria-labelledby="offer-quick-nav-title"
      className="relative overflow-hidden border-b border-[#ded6ca] bg-[#f3eee5]"
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reducedMotion ? 0.01 : 0.45, ease: "easeOut" }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_92%_0%,rgba(183,153,98,0.14),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.46),rgba(255,255,255,0)_40%)]" />
      <div className="relative mx-auto max-w-[1180px] px-5 py-8 sm:px-8 lg:px-0 lg:py-10">
        <h2 id="offer-quick-nav-title" className="sr-only">
          Szybka nawigacja po ofercie Kower
        </h2>

        {/* Navigation control row */}
        <div className="mb-6 grid grid-cols-[auto_1fr] items-center gap-5 md:gap-7">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#c8ad76] bg-[#fbf7ee] text-[#a97d34] shadow-[0_8px_18px_rgba(74,58,36,0.08)] transition hover:border-[#487330] hover:text-[#487330] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#487330]"
              aria-label="Poprzednie pozycje oferty"
              onClick={goToPrevious}
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#c8ad76] bg-[#fbf7ee] text-[#a97d34] shadow-[0_8px_18px_rgba(74,58,36,0.08)] transition hover:border-[#487330] hover:text-[#487330] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#487330]"
              aria-label="Następne pozycje oferty"
              onClick={() => goToNext(true)}
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-[#cfbd99]" aria-hidden="true" />
            <div
              className="flex items-center justify-center gap-2 sm:hidden"
              aria-label="Postęp przewijania oferty"
            >
              {Array.from({ length: mobileProgressCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    activeMobileProgress === index
                      ? "scale-125 bg-[#9e7938]"
                      : "bg-[#ccb98f] hover:bg-[#487330]"
                  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#487330]`}
                  aria-label={`Przejdź do segmentu oferty ${index + 1} z ${mobileProgressCount}`}
                  onClick={() => scrollToIndex(getMobileProgressTarget(index), true)}
                />
              ))}
            </div>
            <div 
              className="hidden max-w-md flex-wrap items-center justify-center gap-2 sm:flex md:max-w-lg" 
              aria-label="Postęp przewijania oferty"
            >
              {filteredCards.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === index 
                      ? "scale-125 bg-[#9e7938]" 
                      : "bg-[#ccb98f] hover:bg-[#487330]"
                  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#487330]`}
                  aria-label={`Przejdź do segmentu oferty ${index + 1}`}
                  onClick={() => scrollToIndex(index, true)}
                />
              ))}
            </div>
            <span className="hidden h-px flex-1 bg-[#cfbd99] sm:block" aria-hidden="true" />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="mb-6 overflow-x-auto hide-scrollbar -mx-5 px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
          <div className="flex gap-1.5 min-w-max border-b border-[#ded6ca]/70 pb-2">
            {filterGroups.map((group) => {
              const active = selectedGroup === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedGroup(group.id)}
                  className={`relative px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#487330] ${
                    active ? "text-[#487330]" : "text-[#7b7569] hover:text-[#24231f]"
                  }`}
                >
                  {group.label}
                  {active && (
                    <motion.span
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#487330]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative -mx-5 sm:-mx-8 lg:mx-0">
          <div
            ref={scrollerRef}
            className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 pt-1 sm:gap-4 sm:px-8 lg:px-0"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0, black 34px, black calc(100% - 34px), transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0, black 34px, black calc(100% - 34px), transparent 100%)",
              scrollPaddingLeft: "20px",
              scrollPaddingRight: "20px",
            }}
            onScroll={handleScroll}
            onWheel={markInteraction}
            onPointerDown={markInteraction}
            onTouchStart={markInteraction}
          >
            <AnimatePresence mode="popLayout">
              {filteredCards.map((item, index) => {
                const Icon = iconMap[item.iconName] || Home;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-carousel-index={index}
                    className={`group relative h-[346px] w-[230px] shrink-0 snap-start overflow-hidden rounded-[16px] border bg-[#fbf8ef] text-center shadow-[0_14px_30px_rgba(54,45,31,0.13)] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#487330] sm:w-[236px] md:w-[210px] lg:w-[188px] xl:w-[198px] ${
                      active
                        ? "border-[#487330] shadow-[0_18px_34px_rgba(72,115,48,0.15)]"
                        : "border-[#d9cdb9] hover:-translate-y-1 hover:border-[#c6a76f] hover:shadow-[0_20px_40px_rgba(54,45,31,0.16)]"
                    }`}
                  >
                    <span className="relative block h-[164px] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="(min-width: 1280px) 198px, (min-width: 1024px) 188px, (min-width: 768px) 210px, 236px"
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                        style={{ objectPosition: item.imagePosition || "center" }}
                      />
                      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(38,31,22,0.08))]" />
                    </span>

                    <span
                      className={`absolute left-1/2 top-[137px] z-10 grid h-[56px] w-[56px] -translate-x-1/2 place-items-center rounded-full border bg-[#fbf8ef] shadow-[0_10px_22px_rgba(63,49,27,0.14)] ${
                        active ? "border-[#487330] text-[#487330]" : "border-[#c9a96f] text-[#b1843f]"
                      }`}
                      aria-hidden="true"
                    >
                      <Icon className="h-[22px] w-[22px]" strokeWidth={1.45} />
                    </span>

                    <span className="flex h-[182px] flex-col items-center px-4 pb-12 pt-[43px]">
                      <span className="block min-h-[48px] font-serif text-[20px] font-semibold leading-[1.06] text-[#24231f] transition-colors group-hover:text-[#487330]">
                        {item.label}
                      </span>
                      <span className="mt-3 line-clamp-2 block max-w-[158px] text-[12px] leading-[1.5] text-[#6d6a62]">
                        {item.description}
                      </span>
                    </span>
                    <span className="absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a6c39] opacity-100 transition group-hover:text-[#487330]">
                      Zobacz
                      <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" strokeWidth={1.7} />
                    </span>
                  </Link>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
