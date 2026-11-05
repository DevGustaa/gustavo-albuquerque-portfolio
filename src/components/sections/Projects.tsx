import type { Content } from "@/content";
import { HorizontalScroller } from "../fx/HorizontalScroller";
import { Reveal } from "../fx/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";

interface ProjectsProps {
  data: Content["projects"];
  labels: Content["ui"];
}

export function Projects({ data, labels }: ProjectsProps) {
  return (
    <section id="projects" aria-labelledby="projects-title" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeading id="projects-title" title={data.title} subtitle={data.subtitle} />
      <HorizontalScroller
        label={data.title}
        previousLabel={labels.previousProject}
        nextLabel={labels.nextProject}
      >
        {data.items.map((project, index) => (
          <Reveal
            as="li"
            key={project.title}
            delay={Math.min(index, 2) * 120}
            className="w-[82%] shrink-0 snap-start sm:w-[68%] md:w-[44%]"
          >
            <ProjectCard project={project} labels={labels} />
          </Reveal>
        ))}
      </HorizontalScroller>
    </section>
  );
}
