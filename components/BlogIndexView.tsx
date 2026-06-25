import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/content";
import Header from "./Header";
import Breadcrumbs from "./Breadcrumbs";

export default function BlogIndexView({ posts }: { posts: BlogPost[] }) {
  return (
    <>
      <Header />
      <main className="bg-[#f7f3ea] pt-[104px] text-[#20221e]">
        <section className="mx-auto max-w-[1180px] px-5 pb-16 pt-10 lg:px-8 lg:pb-20">
          <Breadcrumbs
            items={[
              { label: "Start", href: "/" },
              { label: "Blog", href: "/blog" },
            ]}
          />
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#5aaa22]">Blog</p>
          <h1 className="mt-5 max-w-4xl font-serif text-[clamp(3.2rem,7vw,7rem)] font-medium leading-[0.92]">
            Wiedza o materiałach, wymiarach i dobrym projekcie.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5a5f55]">
            Praktyczne artykuły o lamelach, płytach, AGD i detalach, które wpływają na trwałość oraz wygodę realizacji.
          </p>
        </section>

        <section className="mx-auto grid max-w-[1180px] gap-4 px-5 pb-20 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              className="group flex min-h-[310px] flex-col justify-between border border-[#dfe3d9] bg-[#fbfaf5] p-6 transition hover:border-[#5aaa22]"
              href={`/blog/${post.slug}`}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#5aaa22]">{post.category}</p>
                <h2 className="mt-5 font-serif text-4xl font-medium leading-none text-[#252820]">{post.title}</h2>
                <p className="mt-5 leading-7 text-[#5a5f55]">{post.lead}</p>
              </div>
              <span className="mt-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#2d302a]">
                Czytaj
                <ArrowRight size={17} className="text-[#5aaa22] transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}
