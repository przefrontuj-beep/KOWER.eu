import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/content";
import Header from "./Header";
import Breadcrumbs from "./Breadcrumbs";

export default function BlogPostView({ post }: { post: BlogPost }) {
  return (
    <>
      <Header />
      <main className="bg-[#f7f3ea] pt-[104px] text-[#20221e]">
        <article>
          <header className="mx-auto max-w-[960px] px-5 pb-14 pt-10 lg:px-8">
            <Breadcrumbs
              items={[
                { label: "Start", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: post.title, href: `/blog/${post.slug}` },
              ]}
            />
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#5aaa22]">{post.category}</p>
            <h1 className="mt-5 font-serif text-[clamp(3rem,7vw,6.6rem)] font-medium leading-[0.92] text-[#22231f]">
              {post.title}
            </h1>
            <p className="mt-7 text-xl leading-9 text-[#5a5f55]">{post.lead}</p>
          </header>

          <div className="border-y border-[#dfe3d9] bg-[#fbfaf5]">
            <div className="mx-auto max-w-[860px] px-5 py-14 lg:px-8">
              {post.sections.map((section) => (
                <section key={section.title} className="mb-12 last:mb-0">
                  <h2 className="font-serif text-4xl font-medium leading-tight text-[#252820]">{section.title}</h2>
                  <div className="mt-5 space-y-5 text-lg leading-8 text-[#555b51]">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <section className="mx-auto max-w-[860px] px-5 py-14 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#5aaa22]">FAQ</p>
            <h2 className="mt-4 font-serif text-5xl font-medium leading-none">Pytania do tematu</h2>
            <div className="mt-8 space-y-3">
              {post.faq.map((item) => (
                <details key={item.question} className="border border-[#dfe3d9] bg-white p-5">
                  <summary className="cursor-pointer list-none text-lg font-medium text-[#252820]">
                    {item.question}
                  </summary>
                  <p className="mt-4 leading-7 text-[#5a5f55]">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-[960px] px-5 pb-20 lg:px-8">
            <div className="grid gap-4 md:grid-cols-3">
              {post.related.map((item) => (
                <Link
                  key={item.href}
                  className="group flex min-h-28 items-center justify-between border border-[#dfe3d9] bg-[#fbfaf5] p-5 text-lg text-[#2e302a] transition hover:border-[#5aaa22]"
                  href={item.href}
                >
                  {item.label}
                  <ArrowRight className="text-[#5aaa22] transition group-hover:translate-x-1" size={18} aria-hidden="true" />
                </Link>
              ))}
            </div>
            <div className="mt-10 bg-[#20251c] p-8 text-white md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#8fd15f]">Kower</p>
              <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <h2 className="font-serif text-5xl font-medium leading-none">Potrzebujesz wyceny?</h2>
                <Link
                  className="inline-flex h-12 items-center justify-center gap-3 bg-[#5aaa22] px-6 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#6bc92c]"
                  href="/wycena"
                >
                  Zapytaj o wycenę
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
