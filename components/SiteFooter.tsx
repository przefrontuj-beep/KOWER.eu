"use client";

import Image from "next/image";
import Link from "next/link";
import { footerGroups } from "@/lib/site";
import { usePublicContactSettings } from "@/hooks/usePublicContactSettings";

export default function SiteFooter() {
  const contact = usePublicContactSettings();
  return (
    <footer className="border-t border-[#dfe3d9] bg-[#f3efe6]">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-14 md:grid-cols-[1.1fr_2fr] lg:px-8">
        <div>
          <Link className="inline-flex" href="/" aria-label="Kower - strona główna">
            <Image
              src="/logo/kower-logo.png"
              alt="Kower Pracownia Meblarska"
              width={168}
              height={58}
              className="h-auto w-[168px]"
            />
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-7 text-[#5e6258]">
            Meble, lamele i elementy techniczne projektowane z myślą o materiale, proporcji i codziennym użytkowaniu.
          </p>
          <div className="mt-8 space-y-2 text-sm text-[#2b2d28]">
            <p className="font-semibold">{contact.phone}</p>
            <p className="font-semibold">{contact.email}</p>
            <p>{contact.address}</p>
            <p className="mt-3 text-xs text-[#5e6258]">
              <span className="font-bold uppercase tracking-wider block text-[10px] text-[#487330] mb-1">Obszar działania</span>
              <Link href="/kontakt" className="hover:text-[#487330] underline decoration-[#487330]/20">Kosin</Link> · <Link href="/kontakt" className="hover:text-[#487330] underline decoration-[#487330]/20">Kraśnik</Link> · <Link href="/kontakt" className="hover:text-[#487330] underline decoration-[#487330]/20">Janów Lubelski</Link> · <Link href="/kontakt" className="hover:text-[#487330] underline decoration-[#487330]/20">Lublin</Link> · woj. lubelskie
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/umow-konsultacje"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#487330] px-5 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#3c5f27] focus-ring"
            >
              Umów konsultację
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#c9d3bd] px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#263020] transition hover:border-[#487330] hover:text-[#487330] focus-ring"
            >
              Kontakt
            </Link>
          </div>
        </div>

        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">
          {footerGroups.map((group) => (
            <FooterGroup key={group.title} title={group.title} items={group.items} />
          ))}
        </div>
      </div>
      <div className="border-t border-[#dfe3d9] px-5 py-5 text-center text-xs uppercase tracking-[0.18em] text-[#777b70]">
        © {new Date().getFullYear()} Kower Pracownia Meblarska
      </div>
    </footer>
  );
}

function FooterGroup({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-[#487330]">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm text-[#34372f]">
        {items.map((item) => (
          <li key={item.href}>
            <Link className="transition hover:text-[#487330]" href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
