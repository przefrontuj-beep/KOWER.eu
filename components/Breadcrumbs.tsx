import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Breadcrumbs({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <Breadcrumb className="mb-10 text-[11px] font-semibold uppercase tracking-[0.24em]">
      <BreadcrumbList className="flex-row items-center gap-3 text-[11px] text-[#6d7566]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={item.href}>
              <BreadcrumbItem className="inline-flex items-center gap-0">
                {isLast ? (
                  <BreadcrumbPage className="text-[#1f211d] font-semibold uppercase tracking-[0.24em] text-[11px]">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="text-[#6d7566] hover:text-accent font-semibold uppercase tracking-[0.24em] text-[11px]">
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className="flex items-center gap-0 px-3 select-none">
                  <span className="h-px w-6 bg-[#ccd2c5]" aria-hidden="true" />
                </BreadcrumbSeparator>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
