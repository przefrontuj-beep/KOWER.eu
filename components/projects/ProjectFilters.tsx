"use client";

import type { projectFilterCategories } from "@/lib/projects/project-data";

type Category = (typeof projectFilterCategories)[number];

type ProjectFiltersProps = {
  categories: readonly Category[];
  activeCategory: Category;
  onChange: (category: Category) => void;
};

export function ProjectFilters({ categories, activeCategory, onChange }: ProjectFiltersProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2" aria-label="Filtry realizacji">
      {categories.map((category) => {
        const active = category === activeCategory;

        return (
          <button
            key={category}
            type="button"
            aria-pressed={active}
            className={`min-h-10 rounded-full border px-4 text-[11px] font-bold uppercase tracking-[0.14em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#487330] ${
              active
                ? "border-[#487330] bg-[#487330] text-white"
                : "border-[#d8d0c4] bg-[#fbfaf5] text-[#4f5049] hover:border-[#487330] hover:text-[#487330]"
            }`}
            onClick={() => onChange(category)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
