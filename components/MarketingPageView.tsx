import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, CornerDownRight } from "lucide-react";
import type { MarketingPage } from "@/lib/content";
import type { Project } from "@/types/project";
import Breadcrumbs from "./Breadcrumbs";
import ContactForm from "./ContactForm";
import Header from "./Header";
import { ProjectsGrid } from "./projects/ProjectsGrid";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function MarketingPageView({ page, projects }: { page: MarketingPage; projects?: Project[] }) {
  const pathSegments = page.slug.split("/");
  const parentBreadcrumbs = pathSegments.slice(0, -1).map((segment, index) => ({
    label: segment
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    href: `/${pathSegments.slice(0, index + 1).join("/")}`,
  }));
  const breadcrumbs = [
    { label: "Start", href: "/" },
    ...parentBreadcrumbs,
    { label: page.title, href: `/${page.slug}` },
  ];

  return (
    <>
      <Header />
      <main className="bg-[#f7f3ea] pt-[104px] text-[#20221e]">
        <section className="mx-auto max-w-[1180px] px-5 pb-16 pt-10 lg:px-8 lg:pb-24">
          <Breadcrumbs items={breadcrumbs} />
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#487330]">{page.eyebrow}</p>
              <h1 className="mt-5 max-w-3xl font-serif text-[32px] sm:text-[44px] lg:text-[54px] font-medium leading-[1.08] lg:leading-[1.04] text-[#22231f] text-balance">
                {page.h1}
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#5a5f55]">{page.intro}</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button asChild className="inline-flex h-auto min-h-12 w-full max-w-full items-center justify-center gap-3 whitespace-normal bg-[#487330] px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_14px_30px_rgba(72,115,48,0.22)] hover:bg-[#3c5f27] sm:w-auto sm:px-6 sm:text-sm sm:tracking-[0.18em] cursor-pointer">
                  <Link href={page.ctaHref}>
                    {page.ctaLabel}
                    <ArrowRight data-icon="inline-end" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="inline-flex h-12 w-full items-center justify-center border border-[#cfd5c6] px-6 text-sm font-bold uppercase tracking-[0.18em] text-[#272a25] hover:border-[#487330] hover:text-[#3c5f27] sm:w-auto cursor-pointer">
                  <Link href="/oferta">
                    Zobacz ofertę
                  </Link>
                </Button>
              </div>
            </div>
            {page.image && (
              <div className="relative min-h-[320px] overflow-hidden border border-[#e0dfd6] bg-[#eee8dc] lg:min-h-[520px]">
                <Image
                  fill
                  priority
                  alt={page.imageAlt || page.title}
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  src={page.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
              </div>
            )}
          </div>
        </section>

        <section className="border-y border-[#dfe3d9] bg-[#f1ece2]">
          <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-14 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
            <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[38px] font-medium leading-[1.1] tracking-tight text-[#242620] text-pretty">{page.leadTitle}</h2>
            <div className="space-y-5 text-base leading-8 text-[#555b51]">
              {page.lead.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {page.listNote && (
                <div className="border border-dashed border-[#b8c3ad] bg-[#fbfaf5] px-5 py-4 text-sm font-bold uppercase tracking-[0.16em] text-[#4b951f]">
                  {page.listNote}
                </div>
              )}
            </div>
          </div>
        </section>

        {page.catalogCards && (
          <section className="mx-auto max-w-[1180px] px-5 py-16 lg:px-8">
            <div className="mb-9 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#487330]">Kategorie</p>
                <h2 className="mt-4 font-serif text-[32px] sm:text-[38px] lg:text-[44px] font-medium leading-[1.1] tracking-tight text-[#242620] text-pretty">
                  Wybierz zakres
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#62685d]">
                Zdjęcia są dobrane z obecnych materiałów i mogą zostać podmienione na finalne fotografie klienta.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {page.catalogCards.map((card) => (
                <Card
                  key={card.href}
                  className="group overflow-hidden border border-[#dfe3d9] bg-[#fbfaf5] shadow-[0_18px_50px_rgba(43,38,28,0.06)] transition hover:-translate-y-1 hover:border-[#487330] hover:shadow-[0_22px_60px_rgba(43,38,28,0.1)] focus-ring rounded-xl p-0"
                >
                  <Link href={card.href} className="flex flex-col h-full">
                    <div className="relative h-56 overflow-hidden bg-[#ede6d9]">
                      <Image
                        fill
                        src={card.image}
                        alt={card.imageAlt}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-white/10" />
                    </div>
                    <CardHeader className="p-6 pb-0">
                      <CardTitle className="font-serif text-[22px] sm:text-[24px] font-semibold leading-tight text-[#272a24] text-pretty">
                        {card.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-4 flex-1">
                      <CardDescription className="min-h-14 text-sm leading-6 text-[#62685d]">
                        {card.description}
                      </CardDescription>
                      <span className="mt-6 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#2d302a]">
                        Przejdź
                        <ArrowRight size={16} className="text-[#487330] transition group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}

        {page.kind === "gallery" && (
          <section aria-labelledby="gallery-grid-title" className="mx-auto max-w-[1180px] px-5 py-16 lg:px-8">
            <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#487330]">Realizacje</p>
                <h2 id="gallery-grid-title" className="mt-4 font-serif text-[32px] sm:text-[38px] lg:text-[44px] font-medium leading-[1.1] tracking-tight text-[#242620] text-pretty">
                  Galeria prac Kower
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#62685d]">
                Zdjęcia pochodzą bezpośrednio z bazy danych Firebase i są w pełni zarządzalne z poziomu panelu administratora.
              </p>
            </div>
            <ProjectsGrid projects={projects || []} />
          </section>
        )}

        <section className="mx-auto max-w-[1180px] px-5 py-16 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {page.benefits.map((benefit) => (
              <Card key={benefit} className="border border-[#dfe3d9] bg-[#fbfaf5] p-6 shadow-[0_8px_24px_rgba(43,38,28,0.02)] rounded-xl flex flex-col gap-0 items-start justify-start">
                <Check className="mb-8 text-[#487330]" size={22} aria-hidden="true" />
                <p className="text-lg leading-7 text-[#2e302a]">{benefit}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1180px] gap-12 px-5 pb-16 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#487330]">Proces</p>
            <h2 className="mt-4 font-serif text-[32px] sm:text-[38px] lg:text-[44px] font-medium leading-[1.1] tracking-tight text-pretty">Jak pracujemy</h2>
            <div className="mt-10 space-y-0 border-y border-[#dfe3d9]">
              {page.process.map((step, index) => (
                <div key={step} className="grid grid-cols-[76px_1fr] border-b border-[#dfe3d9] py-6 last:border-b-0">
                  <span className="font-serif text-4xl text-[#9fa892]">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-xl text-[#2d302a]">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#487330]">Zastosowania</p>
            <h2 className="mt-4 font-serif text-[32px] sm:text-[38px] lg:text-[44px] font-medium leading-[1.1] tracking-tight text-pretty">Gdzie to się sprawdza</h2>
            <ul className="mt-10 grid gap-3">
              {page.applications.map((item) => (
                <li key={item} className="flex items-center gap-3 border-b border-[#dfe3d9] py-4 text-lg text-[#34372f]">
                  <CornerDownRight size={18} className="text-[#487330]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {page.formVariant && (
          <section className="mx-auto max-w-[980px] px-5 pb-16 lg:px-8">
            <ContactForm variant={page.formVariant} />
          </section>
        )}

        <section className="border-y border-[#dfe3d9] bg-[#fbfaf5]">
          <div className="mx-auto grid max-w-[1180px] gap-12 px-5 py-16 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#487330]">FAQ</p>
              <h2 className="mt-4 font-serif text-[32px] sm:text-[38px] lg:text-[44px] font-medium leading-[1.1] tracking-tight text-pretty">Najczęstsze pytania</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {page.faq.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`item-${index}`}
                  className="border border-[#dfe3d9] bg-white p-5 transition hover:border-[#487330] rounded-lg"
                >
                  <AccordionTrigger className="cursor-pointer text-lg font-medium text-[#252820] hover:text-[#487330] hover:no-underline p-0 focus-visible:text-[#487330] focus-visible:ring-2 focus-visible:ring-[#487330] focus-visible:ring-offset-2 rounded-sm outline-none">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="mt-4 leading-7 text-[#5a5f55] p-0 pb-0">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#487330]">Powiązane</p>
              <h2 className="mt-4 font-serif text-[32px] sm:text-[38px] lg:text-[44px] font-medium leading-[1.1] tracking-tight text-pretty">Przejdź dalej</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {page.related.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  className="group flex min-h-24 items-center justify-between border border-[#dfe3d9] bg-[#fbfaf5] p-5 text-lg text-[#2e302a] transition hover:border-[#487330] focus-ring"
                  href={item.href}
                >
                  {item.label}
                  <ArrowRight className="text-[#487330] transition group-hover:translate-x-1" size={18} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 lg:px-8">
          <div className="relative overflow-hidden mx-auto max-w-[1180px] px-6 py-12 text-white md:px-10 md:py-16 rounded-[24px] shadow-[0_20px_50px_rgba(32,37,28,0.12)]">
            <Image
              src="/client-assets/cta-background.png"
              alt="Gotowa zabudowa meblowa Kower w tle sekcji kontaktowej"
              fill
              sizes="(min-width: 1180px) 1180px, 100vw"
              className="object-cover object-center z-0"
              priority
            />
            <div className="absolute inset-0 bg-black/25 z-1" />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#baa883]">Kower</p>
              <div className="mt-5 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <h2 className="max-w-2xl font-serif text-[32px] sm:text-[44px] lg:text-[54px] font-medium leading-[1.05] tracking-tight text-pretty">
                  Stwórzmy coś wyjątkowego.
                </h2>
                <Link
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-3 bg-[#487330] px-6 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#3c5f27] rounded-full shadow-[0_10px_24px_rgba(72,115,48,0.25)] focus-ring"
                  href={page.ctaHref}
                >
                  {page.ctaLabel}
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
