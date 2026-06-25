import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Diamond,
  Ruler,
  ShieldCheck,
  Sparkles,
  TreePine,
} from "lucide-react";
import OfferQuickNav from "@/components/OfferQuickNav";
import { Reveal } from "@/components/Reveal";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { ProjectsCarousel } from "@/components/projects/ProjectsCarousel";
import { Button } from "@/components/ui/button";
import { getHomepageProjects } from "@/lib/projects/getProjects";
import {
  getPublicContactSettings,
  getPublicHomepageSettings,
} from "@/lib/cms/public";

export const dynamic = "force-dynamic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import JsonLd from "@/components/JsonLd";
import { localBusinessSchema } from "@/lib/schema";

const benefits = [
  {
    icon: Ruler,
    title: "Pomiar i doradztwo",
    text: "Dokładna wizja lokalna, laserowa inwentaryzacja oraz analiza instalacji przed rozpoczęciem prac.",
  },
  {
    icon: TreePine,
    title: "Materiały klasy premium",
    text: "Pracujemy na płytach i blatach czołowych producentów, m.in. Egger, Swiss Krono i Kronospan, oraz trwałym drewnie naturalnym.",
  },
  {
    icon: Diamond,
    title: "Rzemieślnicza precyzja",
    text: "Dbamy o niewidoczne łączenia korpusów, idealne krawędzie i spasowanie z dokładnością do milimetra.",
  },
  {
    icon: ShieldCheck,
    title: "Trwałość na dziesięciolecia",
    text: "Stosujemy wyłącznie certyfikowane systemy szuflad i zawiasów Blum objęte dożywotnią gwarancją.",
  },
  {
    icon: Sparkles,
    title: "Własny montaż",
    text: "Nie korzystamy z podwykonawców. Meble montuje ta sama ekipa stolarzy, która je produkowała.",
  },
  {
    icon: ArrowRight,
    title: "Jasne terminy",
    text: "Szanujemy Twój czas. Gwarantujemy dotrzymanie harmonogramu i transparentne warunki wyceny.",
  },
];

const steps = [
  ["01", "Rozmowa i potrzeby", "Poznajemy oczekiwania, preferencje estetyczne i budżet inwestycji."],
  ["02", "Pomiar i inwentaryzacja", "Wykonujemy precyzyjną wizję lokalną w miejscu planowanej realizacji."],
  ["03", "Dobór materiałów i wycena", "Prezentujemy próbki dekorów i przygotowujemy transparentny kosztorys."],
  ["04", "Produkcja warsztatowa", "Wytwarzamy elementy mebli z dbałością o detale w naszej pracowni."],
  ["05", "Montaż i odbiór", "Sprawnie instalujemy meble, dbając o porządek i ostateczną regulację frontów."],
];

const producerLogos = [
  { name: "Kronospan", src: "/producer-logos/kronospan.svg", width: 160, height: 32 },
  { name: "Swiss Krono", src: "/producer-logos/swiss-krono.svg", width: 170, height: 32 },
  { name: "EGGER", src: "/producer-logos/egger.svg", width: 118, height: 32 },
  { name: "Niemann", src: "/producer-logos/niemann.svg", width: 38, height: 38 },
  { name: "Wiech", src: "/producer-logos/wiech.svg", width: 118, height: 36 },
  { name: "Fundermax", src: "/producer-logos/fundermax.png", width: 150, height: 32 },
  { name: "Nomet", src: "/producer-logos/nomet.svg", width: 128, height: 32 },
  { name: "Gamet", src: "/producer-logos/gamet.png", width: 165, height: 32 },
  { name: "GTV", src: "/producer-logos/gtv.svg", width: 128, height: 32 },
  { name: "Rejs", src: "/producer-logos/rejs.svg", width: 126, height: 32 },
  { name: "Blum", src: "/producer-logos/blum-official.svg", width: 95, height: 32 },
  { name: "Hettich", src: "/producer-logos/hettich-official.svg", width: 70, height: 44 },
  { name: "Forner", src: "/producer-logos/forner.svg", width: 150, height: 32 },
  { name: "SIRO", src: "/producer-logos/siro.svg", width: 100, height: 33 },
  { name: "Abet Laminati", src: "/producer-logos/abet-laminati.png", width: 185, height: 24 },
  { name: "Design Light", src: "/producer-logos/design-light.jpg", width: 116, height: 32 },
  { name: "PEKA", src: "/producer-logos/peka.svg", width: 112, height: 32 },
];

export const metadata: Metadata = {
  title: "Kower | Meble na wymiar Kraśnik, Kosin · Kuchnie i szafy",
  description:
    "Pracownia stolarska Kower oferuje nowoczesne kuchnie na wymiar, szafy wnękowe, garderoby oraz lamele. Obsługujemy Kraśnik, Kosin i woj. lubelskie. Sprawdź!",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kower | Meble na wymiar Kraśnik, Kosin · Kuchnie i szafy",
    description:
      "Pracownia stolarska Kower oferuje nowoczesne kuchnie na wymiar, szafy wnękowe, garderoby oraz lamele. Obsługujemy Kraśnik, Kosin i woj. lubelskie. Sprawdź!",
    url: "/",
    type: "website",
  },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const heroVariant = resolvedSearchParams.hero === "imageOnly" ? "imageOnly" : "wallText";
  const [homepageSettings, contactSettings] = await Promise.all([
    getPublicHomepageSettings(),
    getPublicContactSettings(),
  ]);
  const producerLogoRows = [producerLogos, producerLogos];

  return (
    <div id="top" className="min-h-screen bg-[#f6f2ea] text-[#1b1b18]">
      <JsonLd data={localBusinessSchema(contactSettings)} />
      <Header />

      <main className="pt-[92px] lg:pt-[115px]">
        <Hero variant={heroVariant} settings={homepageSettings} />

        {/* Sekcja 2: Krótki pasek z głównymi usługami */}
        <section className="border-y border-[#ded6ca] bg-[#1f211a] py-5 text-white">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-0 flex flex-wrap justify-between items-center gap-y-4 gap-x-8 text-[11px] font-bold uppercase tracking-[0.25em] text-[#e6edd9]">
            <span>Kuchnie na wymiar</span>
            <span className="hidden md:inline text-[#487330]" aria-hidden="true">•</span>
            <span>Szafy i Garderoby</span>
            <span className="hidden md:inline text-[#487330]" aria-hidden="true">•</span>
            <span>Zabudowy Meblowe</span>
            <span className="hidden md:inline text-[#487330]" aria-hidden="true">•</span>
            <span>Lamele ścienne</span>
            <span className="hidden md:inline text-[#487330]" aria-hidden="true">•</span>
            <span>Precyzyjne cięcie płyt</span>
          </div>
        </section>

        <ProjectsCarousel projects={await getHomepageProjects()} />

        <section aria-label="Producenci, na których pracujemy" className="border-y border-[#ded6ca] bg-[#f4efe6] py-6 text-[#24231f]">
          <style>{`
            @keyframes producer-marquee {
              from {
                transform: translateX(0);
              }

              to {
                transform: translateX(-50%);
              }
            }

            .producer-marquee-track {
              animation: producer-marquee 44s linear infinite;
            }

            .producer-marquee:hover .producer-marquee-track {
              animation-play-state: paused;
            }

            @media (prefers-reduced-motion: reduce) {
              .producer-marquee-track {
                animation: none;
                transform: none;
              }
            }
          `}</style>
          <div className="mx-auto flex max-w-[1180px] items-center gap-5 px-5 sm:px-8 lg:px-0">
            <p className="hidden shrink-0 text-[9px] font-bold uppercase leading-[1.35] tracking-[0.22em] text-[#487330] sm:block lg:w-[185px]">
              Pracujemy na komponentach
            </p>
            <div className="producer-marquee relative min-w-0 flex-1 overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#f4efe6] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#f4efe6] to-transparent" />
              <div className="producer-marquee-track flex w-max items-center">
                {producerLogoRows.map((row, rowIndex) => (
                  <div
                    aria-hidden={rowIndex > 0}
                    className="flex shrink-0 items-center gap-3 pr-3"
                    key={rowIndex}
                  >
                    {row.map((producer) => (
                      <span
                        className="relative inline-flex h-14 w-[160px] shrink-0 items-center justify-center rounded-xl border border-[#ded6ca] bg-white/60 px-4 transition hover:border-[#487330]/45 hover:bg-white"
                        key={`${producer.name}-${rowIndex}`}
                      >
                        <Image
                          alt={rowIndex > 0 ? "" : `${producer.name} logo`}
                          className="h-auto max-h-8 w-auto max-w-[130px] object-contain"
                          height={producer.height}
                          src={producer.src}
                          width={producer.width}
                        />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <OfferQuickNav />



        {/* Sekcja 5: "Dlaczego warto" / Nasze atuty */}
        <section id="dlaczego-warto" aria-labelledby="why-us-title" className="bg-[#e9e4dc] py-16 md:py-20 border-b border-[#ded6ca]">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-0">
            <div className="mb-12 text-center">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#487330]">Nasze Atuty</p>
              <h2 id="why-us-title" className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-medium leading-[1.1] tracking-tight text-[#24231f] text-pretty">
                Dlaczego warto wybrać Kower?
              </h2>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#faf6ec] text-[#487330] shadow-sm">
                      <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-serif text-[18px] sm:text-[20px] font-semibold leading-tight text-[#2c2b27] text-pretty">
                        {benefit.title}
                      </h3>
                      <p className="mt-2 text-[13px] leading-6 text-[#6d6a62]">
                        {benefit.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sekcja Detal */}
        <section
          id="materialy"
          aria-labelledby="detail-title"
          className="grid min-h-[430px] border-y border-[#ded6ca] bg-[#f4efe6] lg:grid-cols-[34%_66%]"
        >
          <div className="relative z-10 flex items-center px-5 py-16 sm:px-8 lg:justify-end lg:pr-12">
            <Reveal className="max-w-[285px]">
              <p className="mb-4 text-[11px] font-bold uppercase text-[#487330]">
                Detal, który ma znaczenie
              </p>
              <h2 id="detail-title" className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-medium leading-[1.1] tracking-tight text-[#24231f] text-pretty">
                Precyzja ukryta
                <br />w szczegółach.
              </h2>
              <p className="mt-6 text-[14px] leading-6 text-[#5f5c55]">
                Łączymy rzemieślnicze doświadczenie z technologią obróbki maszynowej, by tworzyć meble dopracowane w każdym milimetrze.
              </p>
              <Link
                href="#proces"
                className="group mt-8 inline-flex items-center gap-7 text-[12px] font-bold uppercase text-[#24231f] transition hover:text-[#487330] focus-ring"
              >
                Zobacz nasz proces
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>

          <div className="relative min-h-[330px] overflow-hidden lg:min-h-[430px]">
            <Image
              src="/client-assets/about-detail-2026.png"
              alt="Stolarz Kower podczas pracy przy drewnianych elementach mebli na wymiar"
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,239,230,0.16),rgba(244,239,230,0)_42%)]" />
            <div className="absolute left-8 top-9 hidden h-24 w-24 items-center justify-center rounded-full border border-[#d7cebe] bg-[#f8f4ec]/92 text-center font-serif text-[13px] font-bold uppercase leading-[1.05] text-[#6a675f] shadow-[0_18px_42px_rgba(38,31,24,0.12)] md:flex lg:left-[-48px] lg:top-[76px]">
              <span>Rzemiosło<br />w rękach</span>
            </div>
          </div>
        </section>

        {/* Sekcja "Proces współpracy" */}
        <section id="proces" aria-labelledby="process-title" className="bg-[#f6f2ea] py-16 md:py-20">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-0">
            <Reveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase text-[#487330]">
                  Proces
                </p>
                <h2 id="process-title" className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-medium leading-[1.1] tracking-tight text-[#24231f] text-pretty">
                  Od pierwszej rozmowy
                  <br />do gotowego montażu.
                </h2>
              </div>
              <p className="max-w-[360px] text-[14px] leading-6 text-[#6d6a62]">
                Pracujemy spokojnie, precyzyjnie i transparentnie, dbając o to, by projekt zachował swój styl na każdym etapie.
              </p>
            </Reveal>

            <div className="grid border-t border-[#d8d0c4] grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map(([number, title, text], index) => (
                <Reveal
                  key={number}
                  className={`min-h-[190px] border-b border-[#d8d0c4] py-7 lg:border-b-0 lg:px-6 ${
                    index > 0 ? "lg:border-l border-[#d8d0c4]" : ""
                  } ${index === 1 || index === 3 ? "sm:border-l border-[#d8d0c4]" : ""}`}
                >
                  <span className="text-[13px] font-bold text-[#487330]">{number}</span>
                  <h3 className="mt-8 font-serif text-[18px] sm:text-[20px] font-semibold leading-tight text-[#24231f] text-pretty">{title}</h3>
                  <p className="mt-4 max-w-[230px] text-[13px] leading-6 text-[#6d6a62]">{text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Sekcja SEO / poradnikowa */}
        <section className="bg-[#f4efe6] py-16 md:py-20 border-t border-b border-[#ded6ca]">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-0">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#487330]">Wiedza i Doświadczenie</p>
                <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-medium leading-[1.1] tracking-tight text-[#24231f] text-pretty">
                  Stolarka na wymiar – meble tworzone dla Twojego wnętrza
                </h2>
                <p className="mt-6 text-[14px] leading-7 text-[#6d6a62]">
                  Jako rzemieślnicza pracownia stolarska z Kosina, łączymy tradycyjne techniki obróbki drewna z nowoczesnym parkiem maszynowym. Wykonujemy meble na wymiar dostosowane do indywidualnych potrzeb – od nowoczesnych kuchni w matowych wykończeniach, przez pojemne garderoby wnękowe, aż po dekoracyjne lamele ścienne ocieplające przestrzeń.
                </p>
                <p className="mt-4 text-[14px] leading-7 text-[#6d6a62]">
                  Współpracujemy zarówno z klientami indywidualnymi z województwa lubelskiego, jak i architektami wnętrz poszukującymi solidnego wykonawcy swoich projektów. Oferujemy także precyzyjne cięcie i oklejanie płyt meblowych pod zadany wymiar.
                </p>
              </div>
              <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-[#ded6ca] lg:min-h-[400px]">
                <Image
                  src="/client-assets/kower-experience.png"
                  alt="Pracownia stolarska Kower z przygotowanymi elementami do produkcji mebli na wymiar"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sekcja FAQ */}
        <section id="faq" className="bg-[#fbfaf5] py-16 md:py-20 border-b border-[#ded6ca]">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-0">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#487330]">FAQ</p>
                <h2 className="mt-4 font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-medium leading-[1.1] tracking-tight text-[#24231f] text-pretty">Najczęstsze pytania</h2>
                <p className="mt-6 text-[14px] leading-6 text-[#6d6a62]">
                  Masz pytania dotyczące mebli na wymiar lub procesu realizacji zlecenia? Zebraliśmy najważniejsze informacje, które pomogą Ci podjąć decyzję o współpracy z naszą pracownią stolarską.
                </p>
              </div>
              
              <Accordion type="single" collapsible className="space-y-3">
                <AccordionItem value="item-0" className="border border-[#dfe3d9] bg-white p-5 transition hover:border-[#487330] rounded-xl shadow-[0_4px_12px_rgba(43,38,28,0.01)]">
                  <AccordionTrigger className="cursor-pointer text-base font-semibold text-[#252820] hover:text-[#487330] hover:no-underline p-0 focus-visible:text-[#487330] focus-visible:ring-2 focus-visible:ring-[#487330] focus-visible:ring-offset-4 rounded-md outline-none">
                    Ile trwa realizacja mebli na wymiar?
                  </AccordionTrigger>
                  <AccordionContent className="mt-4 text-[14px] leading-7 text-[#5a5f55] p-0 pb-0">
                    Standardowy czas produkcji kuchni i dużych zabudów meblowych wynosi zazwyczaj od 6 do 8 tygodni od momentu zatwierdzenia projektu i doboru materiałów. Mniejsze zlecenia, takie jak lamele czy formatki płytowe, realizujemy znacznie szybciej.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-1" className="border border-[#dfe3d9] bg-white p-5 transition hover:border-[#487330] rounded-xl shadow-[0_4px_12px_rgba(43,38,28,0.01)]">
                  <AccordionTrigger className="cursor-pointer text-base font-semibold text-[#252820] hover:text-[#487330] hover:no-underline p-0 focus-visible:text-[#487330] focus-visible:ring-2 focus-visible:ring-[#487330] focus-visible:ring-offset-4 rounded-md outline-none">
                    Czy można zamówić samą wycenę?
                  </AccordionTrigger>
                  <AccordionContent className="mt-4 text-[14px] leading-7 text-[#5a5f55] p-0 pb-0">
                    Tak. Wstępną wycenę projektu przygotowujemy całkowicie bezpłatnie na podstawie przesłanych przez Ciebie orientacyjnych wymiarów lub projektu architektonicznego. Szczegółowy pomiar w miejscu inwestycji wykonujemy po zaakceptowaniu wstępnego kosztorysu.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border border-[#dfe3d9] bg-white p-5 transition hover:border-[#487330] rounded-xl shadow-[0_4px_12px_rgba(43,38,28,0.01)]">
                  <AccordionTrigger className="cursor-pointer text-base font-semibold text-[#252820] hover:text-[#487330] hover:no-underline p-0 focus-visible:text-[#487330] focus-visible:ring-2 focus-visible:ring-[#487330] focus-visible:ring-offset-4 rounded-md outline-none">
                    Czy pomagacie dobrać materiały i dekory?
                  </AccordionTrigger>
                  <AccordionContent className="mt-4 text-[14px] leading-7 text-[#5a5f55] p-0 pb-0">
                    Tak, dysponujemy bogatym wzornikiem płyt meblowych, blatów kompaktowych, laminatów oraz próbek lakierów i naturalnych fornirów. Doradzamy pod kątem odporności na wilgoć, ścieranie oraz spójności kolorystycznej z resztą wnętrza.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border border-[#dfe3d9] bg-white p-5 transition hover:border-[#487330] rounded-xl shadow-[0_4px_12px_rgba(43,38,28,0.01)]">
                  <AccordionTrigger className="cursor-pointer text-base font-semibold text-[#252820] hover:text-[#487330] hover:no-underline p-0 focus-visible:text-[#487330] focus-visible:ring-2 focus-visible:ring-[#487330] focus-visible:ring-offset-4 rounded-md outline-none">
                    Czy wykonujecie meble pod nietypowe wymiary i skosy?
                  </AccordionTrigger>
                  <AccordionContent className="mt-4 text-[14px] leading-7 text-[#5a5f55] p-0 pb-0">
                    Tak. Specjalizujemy się w zabudowach nietypowych – wnękach, skosach poddaszy, szafach pod schodami czy nietypowych układach łazienkowych, gdzie standardowe meble modułowe nie zdają egzaminu.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border border-[#dfe3d9] bg-white p-5 transition hover:border-[#487330] rounded-xl shadow-[0_4px_12px_rgba(43,38,28,0.01)]">
                  <AccordionTrigger className="cursor-pointer text-base font-semibold text-[#252820] hover:text-[#487330] hover:no-underline p-0 focus-visible:text-[#487330] focus-visible:ring-2 focus-visible:ring-[#487330] focus-visible:ring-offset-4 rounded-md outline-none">
                    Czy obsługujecie klientów hurtowych i stolarzy?
                  </AccordionTrigger>
                  <AccordionContent className="mt-4 text-[14px] leading-7 text-[#5a5f55] p-0 pb-0">
                    Tak. Nasz park maszynowy umożliwia precyzyjne seryjne cięcie i oklejanie płyt meblowych, produkcję lameli ściennych oraz opłaszczowywanie elementów na zlecenie innych firm stolarskich, deweloperów czy biur projektowych.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border border-[#dfe3d9] bg-white p-5 transition hover:border-[#487330] rounded-xl shadow-[0_4px_12px_rgba(43,38,28,0.01)]">
                  <AccordionTrigger className="cursor-pointer text-base font-semibold text-[#252820] hover:text-[#487330] hover:no-underline p-0 focus-visible:text-[#487330] focus-visible:ring-2 focus-visible:ring-[#487330] focus-visible:ring-offset-4 rounded-md outline-none">
                    Czy można przesłać wymiary lub inspiracje online?
                  </AccordionTrigger>
                  <AccordionContent className="mt-4 text-[14px] leading-7 text-[#5a5f55] p-0 pb-0">
                    Oczywiście. Wygodny formularz w zakładce „Umów konsultację” pozwala na opisanie swoich potrzeb oraz dołączenie rzutów, rysunków odręcznych lub zdjęć inspiracyjnych w formatach JPG, PNG, WEBP oraz PDF.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Sekcja Kontakt CTA */}
        <section id="kontakt" aria-labelledby="cta-title" className="bg-[#1f211a] px-5 py-16 text-[#f8f4ec] sm:px-8 md:py-20">
          <Reveal className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="mb-4 inline-flex items-center gap-3 text-[12px] font-bold uppercase text-[#e6edd9]">
                <Sparkles className="h-4 w-4 text-[#487330]" strokeWidth={1.4} />
                Kower Pracownia Meblarska
              </p>
              <h2 id="cta-title" className="font-serif text-[32px] sm:text-[44px] lg:text-[54px] font-medium leading-[1.05] tracking-tight text-[#f8f4ec] text-pretty">
                Stwórzmy przestrzeń
                <br />dopasowaną do Ciebie.
              </h2>
            </div>
            <Button asChild className="group inline-flex h-14 items-center justify-center gap-5 rounded-full bg-[#487330] px-8 text-[13px] font-bold uppercase text-white shadow-[0_12px_28px_rgba(72,115,48,0.22)] hover:bg-[#3c5f27] cursor-pointer">
              <Link href="/umow-konsultacje">
                Umów bezpłatną konsultację
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.8} />
              </Link>
            </Button>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
