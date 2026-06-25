"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/types/project";
import { projectFilterCategories } from "@/lib/projects/project-data";
import { ProjectCard } from "./ProjectCard";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectLightbox, type ActiveProjectImage } from "./ProjectLightbox";

type Category = (typeof projectFilterCategories)[number];

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>("Wszystkie");
  const [active, setActive] = useState<ActiveProjectImage>(null);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "Wszystkie") {
      return projects;
    }

    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory, projects]);

  return (
    <>
      <ProjectFilters
        categories={projectFilterCategories}
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
