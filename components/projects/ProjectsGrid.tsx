"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/types/project";
import { projectFilterCategories } from "@/lib/projects/project-data";
import { ProjectCard } from "./ProjectCard";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectLightbox, type ActiveProjectImage } from "./ProjectLightbox";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("Wszystkie");
  const [active, setActive] = useState<ActiveProjectImage>(null);

  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    for (const project of projects) {
      if (project.category && project.category.trim()) {
        categorySet.add(project.category.trim());
      }
    }

    const result: string[] = ["Wszystkie"];
    for (const cat of projectFilterCategories) {
      if (cat !== "Wszystkie") {
        result.push(cat);
        categorySet.delete(cat);
      }
    }
    for (const cat of categorySet) {
      result.push(cat);
    }
    return result;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "Wszystkie") {
      return projects;
    }

    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory, projects]);

  return (
    <>
      <ProjectFilters
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            variant="grid"
            className={project.featured && index % 5 === 0 ? "lg:col-span-2" : ""}
            onOpen={(selectedProject) =>
              setActive({
                projectSlug: selectedProject.slug,
                imageId: selectedProject.images[0]?.id,
              })
            }
          />
        ))}
      </div>

      <ProjectLightbox projects={projects} active={active} onActiveChange={setActive} onClose={() => setActive(null)} />
    </>
  );
}
