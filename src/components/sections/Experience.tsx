"use client";

import { useRef } from "react";
import type { Content } from "@/content";
import { useInView } from "@/hooks/useInView";
import { SectionHeading } from "../ui/SectionHeading";
import { TimelineItem } from "./TimelineItem";

export function Experience({ data }: { data: Content["experience"] }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const drawn = useInView(timelineRef, { threshold: 0.05 });
  return (
    <section id="experience" aria-labelledby="experience-title" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeading id="experience-title" title={data.title} subtitle={data.subtitle} />
      <div ref={timelineRef} className="relative">
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 h-full w-px bg-zinc-200 dark:bg-zinc-800"
        />
        <span
          aria-hidden="true"
          data-testid="timeline-progress"
          data-drawn={drawn}
          className="absolute top-0 left-0 h-full w-px origin-top scale-y-0 bg-gradient-to-b from-accent-400 via-brand-500 to-brand-600 transition-transform duration-[1600ms] ease-out data-[drawn=true]:scale-y-100"
        />
        <ol className="space-y-12">
          {data.items.map((item, index) => (
            <TimelineItem
              key={`${item.company}-${item.period}`}
              item={item}
              current={index === 0}
              delay={index * 150}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
