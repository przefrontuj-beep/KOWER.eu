# Kower homepage hero snapshot - 2026-05-29

Snapshot obecnego wariantu homepage hero, zapisany po przywroceniu sekcji pod hero.

## Assety

- Hero image: `/client-assets/hero-kower-final.webp`
- Logo: `/logo/kower-logo.svg`

## Importy potrzebne dla header + hero

```tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Mail, Phone, Play } from "lucide-react";
```

## Nawigacja

```tsx
const navigation = [
  { label: "O nas", href: "/o-nas" },
  { label: "Oferta", href: "/oferta", hasDropdown: true },
  { label: "Lamele", href: "/lamele" },
  { label: "Materialy", href: "/materialy-i-fronty" },
  { label: "Realizacje", href: "/realizacje" },
  { label: "Kontakt", href: "/kontakt" },
];
```

## Header + hero JSX

```tsx
<header className="relative z-30 border-b border-[#d8d0c4]/72 bg-[#f7f2e9]/93 backdrop-blur-xl">
  <div className="mx-auto flex h-[94px] max-w-[1390px] items-center px-8 xl:px-12">
    <Link
      href="/"
      aria-label="Kower Pracownia Meblarska - strona glowna"
      className="flex w-[282px] shrink-0 items-center transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#62b724]"
    >
      <Image
        src="/logo/kower-logo.svg"
        alt="Kower Pracownia Meblarska"
        width={214}
        height={68}
        priority
        className="h-auto w-[210px]"
      />
    </Link>

    <nav aria-label="Glowne menu" className="flex flex-1 items-center justify-center gap-10">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group inline-flex h-11 items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.13em] text-[#2f302a] transition-colors hover:text-[#62b724] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#62b724]"
        >
          {item.label}
          {item.hasDropdown ? (
            <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" strokeWidth={1.7} />
          ) : null}
        </Link>
      ))}
    </nav>

    <div className="flex w-[422px] shrink-0 items-center justify-end gap-5">
      <div className="grid min-w-[158px] gap-2 whitespace-nowrap text-[12px] font-semibold text-[#35362f]">
        <Link href="/kontakt" className="inline-flex items-center gap-2 transition hover:text-[#62b724]">
          <Phone className="h-4 w-4 text-[#708a5e]" strokeWidth={1.7} />
          <span>+48 123 456 789</span>
        </Link>
        <Link href="/kontakt" className="inline-flex items-center gap-2 transition hover:text-[#62b724]">
          <Mail className="h-4 w-4 text-[#708a5e]" strokeWidth={1.7} />
          <span>biuro@kower-meble.pl</span>
        </Link>
      </div>
      <span className="h-9 w-px bg-[#1f211a]/18" aria-hidden="true" />
      <Link
        href="/umow-konsultacje"
        className="group inline-flex h-[52px] items-center justify-center gap-5 rounded-full bg-[#62b724] px-7 text-[12px] font-bold uppercase tracking-[0.06em] text-white shadow-[0_15px_30px_rgba(80,143,31,0.28)] transition duration-300 hover:bg-[#559e1f] hover:shadow-[0_16px_34px_rgba(80,143,31,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#62b724]"
      >
        Umow konsultacje
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.9} />
      </Link>
    </div>
  </div>
</header>

<section
  id="about"
  aria-labelledby="hero-title"
  className="relative min-h-[calc(100vh-95px)] overflow-hidden bg-[#f6f2ea]"
>
  <Image
    src="/client-assets/hero-kower-final.webp"
    alt="Kower - kuchnia z zabudowa i trojwymiarowym napisem"
    fill
    priority
    sizes="100vw"
    className="select-none object-cover object-[center_bottom]"
  />
  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(250,246,236,0.8)_0%,rgba(250,246,236,0.52)_27%,rgba(250,246,236,0.1)_49%,transparent_66%)]" />
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_23%_20%,rgba(255,255,255,0.36),rgba(246,242,234,0)_29%)]" />

  <div className="relative z-10 mx-auto min-h-[calc(100vh-95px)] max-w-[1390px] px-8 xl:px-12">
    <div className="flex min-h-[calc(100vh-95px)] items-start">
      <div className="ml-[3.8vw] mt-[9.2vh] max-w-[590px] rounded-[30px] bg-[#faf6ec]/46 px-9 py-8 shadow-[0_24px_70px_rgba(64,49,32,0.04)] backdrop-blur-[4px]">
        <p className="mb-5 text-[12px] font-bold uppercase tracking-[0.28em] text-[#4f8f1f]">
          Meble na wymiar
        </p>
        <h1
          id="hero-title"
          className="font-serif text-[76px] font-medium leading-[0.93] tracking-[0.005em] text-[#171714]"
        >
          Rzemioslo
          <br />
          <span className="whitespace-nowrap">z charakterem.</span>
        </h1>
        <p className="mt-7 max-w-[438px] text-[16px] font-medium leading-[1.72] text-[#58564f]">
          Tworzymy meble i zabudowy na wymiar, ktore lacza piekno naturalnych materialow z precyzyjnym wykonaniem.
        </p>
        <div className="mt-7 flex items-center gap-7">
          <Link
            href="#proces"
            className="group inline-flex h-[52px] items-center justify-center gap-4 rounded-full bg-[#62b724] px-7 text-[12px] font-bold uppercase tracking-[0.07em] text-white shadow-[0_15px_30px_rgba(80,143,31,0.28)] transition duration-300 hover:bg-[#559e1f] hover:shadow-[0_16px_34px_rgba(80,143,31,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#62b724]"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/22">
              <Play className="h-3 w-3 fill-white" strokeWidth={0} />
            </span>
            Zobacz jak pracujemy
          </Link>
          <Link
            href="/umow-konsultacje"
            className="group inline-flex h-[52px] items-center justify-center gap-7 border-b border-[#2c2b27]/24 px-1 text-[12px] font-bold uppercase tracking-[0.08em] text-[#24231f] transition-colors hover:text-[#62b724] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#62b724]"
          >
            Umow konsultacje
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>
```

## Uwagi

- Snapshot jest dokumentem referencyjnym, nie jest importowany przez aplikacje.
- Aby wrocic do tego wariantu, skopiuj fragment `Header + hero JSX` w miejsce aktualnego headera i sekcji hero w `app/page.tsx`.
