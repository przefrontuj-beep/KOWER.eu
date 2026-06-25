"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { mainNavigation, offerGroups, offerNavigation } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { usePublicContactSettings } from "@/hooks/usePublicContactSettings";

export function Header() {
  const contact = usePublicContactSettings();
  const pathname = usePathname();
  const desktopOfferId = useId();
  const mobileOfferId = useId();
  const [open, setOpen] = useState(false);
  const [desktopOfferOpen, setDesktopOfferOpen] = useState(false);

  const offerActive = offerNavigation.some((item) => item.href === pathname) || pathname === "/oferta";
  const phoneHref = contact.phone.startsWith("[") ? "/kontakt" : `tel:${contact.phone.replace(/\s/g, "")}`;
  const emailHref = contact.email.startsWith("[") ? "/kontakt" : `mailto:${contact.email}`;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setDesktopOfferOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMobileMenu() {
    setOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-[70] border-b border-white/10 bg-[#17120c] transition-all duration-300 lg:border-[#28231c]/12 lg:bg-[#f5f1e8]/95 lg:backdrop-blur-xl">
      <div className="mx-auto flex h-[92px] lg:h-[115px] max-w-[1720px] items-center justify-between px-6 sm:px-12 lg:px-16">
        <Link
          href="/"
          aria-label="Kower Pracownia Meblarska - strona główna"
          className="relative z-[72] block transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3f7730]"
        >
          <Image
            src="/logo/kower-logo-mobile.png"
            alt="Kower Pracownia Meblarska"
            width={2104}
            height={747}
            priority
            className="h-auto w-[168px] sm:w-[190px] lg:hidden"
            style={{ height: "auto" }}
          />
          <Image
            src="/logo/kower-logo.png"
            alt=""
            aria-hidden="true"
            width={206}
            height={65}
            priority
            className="hidden h-auto lg:block lg:w-[184px] xl:w-[206px]"
            style={{ height: "auto" }}
          />
        </Link>

        <nav aria-label="Główne menu" className="hidden items-center gap-6 lg:flex xl:gap-8">
          {mainNavigation.map((item) =>
            item.label === "Oferta" ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setDesktopOfferOpen(true)}
                onMouseLeave={() => setDesktopOfferOpen(false)}
              >
                <button
                  type="button"
                  aria-expanded={desktopOfferOpen}
                  aria-controls={desktopOfferId}
                  onClick={() => setDesktopOfferOpen((value) => !value)}
                  onFocus={() => setDesktopOfferOpen(true)}
                  className={`inline-flex h-10 items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3f7730] ${
                    offerActive ? "text-[#3f7730]" : "text-[#1c1b18] hover:text-[#3f7730]"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${desktopOfferOpen ? "rotate-180" : ""}`}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={desktopOfferId}
                  className={`absolute left-1/2 top-full w-[920px] -translate-x-1/2 pt-7 transition duration-200 ${
                    desktopOfferOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="grid grid-cols-3 gap-0 border border-[#d9d3c7] bg-[#fbfaf5] shadow-[0_24px_70px_rgba(35,31,24,0.12)]">
                    {offerGroups.map((group, index) => (
                      <div
                        key={group.title}
                        className={`min-h-[236px] p-5 ${index % 3 !== 0 ? "border-l border-[#e3ded3]" : ""} ${
                          index > 2 ? "border-t border-[#e3ded3]" : ""
                        }`}
                      >
                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#3f7730]">{group.title}</p>
                        <p className="mt-3 min-h-[48px] text-[12px] leading-5 text-[#6b685f]">{group.description}</p>
                        <div className="mt-4 grid gap-1">
                          {group.links.map((link) => {
                            const active = pathname === link.href;

                            return (
                              <Link
                                key={link.href}
                                className={`group flex min-h-8 items-center justify-between border-b border-transparent py-1 text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3f7730] ${
                                  active ? "text-[#3f7730]" : "text-[#2f302a] hover:border-[#d9d3c7] hover:text-[#3f7730]"
                                }`}
                                href={link.href}
                              >
                                {link.label}
                                <ArrowRight
                                  className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                                  strokeWidth={1.7}
                                  aria-hidden="true"
                                />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13px] font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3f7730] ${
                  pathname === item.href ? "text-[#3f7730]" : "text-[#1c1b18] hover:text-[#3f7730]"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <div className="hidden min-w-[142px] text-right xl:block">
            <Link href={phoneHref} className="block text-[13px] font-bold text-[#1c1b18] transition hover:text-[#3f7730]">
              {contact.phone}
            </Link>
            <Link href={emailHref} className="mt-0.5 block text-[11px] font-semibold text-[#1c1b18]/65 transition hover:text-[#3f7730]">
              {contact.email}
            </Link>
          </div>
          <span className="h-8 w-px bg-[#28231c]/12" aria-hidden="true" />
          <Button asChild className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#3f7730] px-7 text-[12px] font-bold uppercase tracking-[0.04em] text-white shadow-none hover:bg-[#326026] cursor-pointer">
            <Link href="/umow-konsultacje">
              Umów konsultację
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.8} />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
          className="mobile-menu-toggle rounded-full border border-white/25 bg-white/8 text-[#f6f2ea] shadow-[0_10px_26px_rgba(0,0,0,0.22)] transition hover:border-[#62b724] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#62b724]"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        } fixed inset-x-0 bottom-0 top-[92px] z-[65] overflow-y-auto bg-[#f6f2ea] transition-opacity duration-300`}
      >
        <nav aria-label="Menu mobilne" className="flex min-h-full flex-col px-5 py-7">
          <div className="flex flex-col border-y border-[#d9d3c7]">
            {mainNavigation.map((item) =>
              item.label === "Oferta" ? (
                <details key={item.href} className="group border-b border-[#d9d3c7]" open>
                  <summary
                    aria-controls={mobileOfferId}
                    className="flex min-h-16 cursor-pointer list-none items-center justify-between text-left font-serif text-[30px] leading-none text-[#1b1b18] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#3f7730] [&::-webkit-details-marker]:hidden"
                  >
                    {item.label}
                    <ChevronDown
                      className="h-5 w-5 text-[#3f7730] transition-transform duration-200 group-open:rotate-180"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  </summary>
                  <div
                    id={mobileOfferId}
                    className="overflow-hidden transition-[max-height,opacity] duration-300 group-open:opacity-100"
                  >
                    <div className="grid gap-5 pb-6 pt-2">
                      {offerGroups.map((group) => (
                        <div key={group.title} className="border-l border-[#bfc8b1] pl-4">
                          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#3f7730]">{group.title}</p>
                          <div className="mt-2 grid gap-1">
                            {group.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMobileMenu}
                                className={`flex min-h-10 items-center justify-between text-[15px] font-semibold text-[#34342f] transition hover:text-[#3f7730] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f7730] ${
                                  pathname === link.href ? "text-[#3f7730]" : ""
                                }`}
                              >
                                {link.label}
                                <ArrowRight className="h-4 w-4 text-[#3f7730]" strokeWidth={1.5} aria-hidden="true" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="flex min-h-16 items-center justify-between border-b border-[#d9d3c7] font-serif text-[30px] leading-none text-[#1b1b18] last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#3f7730]"
                >
                  {item.label}
                  <ArrowRight className="h-5 w-5 text-[#3f7730]" strokeWidth={1.6} />
                </Link>
              ),
            )}
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              href={phoneHref}
              onClick={closeMobileMenu}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#c9d3bd] bg-[#fffaf0] px-5 text-[12px] font-bold uppercase tracking-[0.12em] text-[#263020]"
            >
              Zadzwoń
            </Link>
            <Link
              href={emailHref}
              onClick={closeMobileMenu}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#c9d3bd] bg-[#fffaf0] px-5 text-[12px] font-bold uppercase tracking-[0.12em] text-[#263020]"
            >
              Napisz email
            </Link>
          </div>
          <Button asChild className="mt-8 inline-flex h-14 items-center justify-center gap-4 rounded-full bg-[#3f7730] px-7 text-[14px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_12px_28px_rgba(72,115,48,0.18)] hover:bg-[#326026] cursor-pointer">
            <Link href="/umow-konsultacje" onClick={closeMobileMenu}>
              Umów konsultację
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
