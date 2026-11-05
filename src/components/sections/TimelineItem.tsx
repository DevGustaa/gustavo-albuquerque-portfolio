import { MapPin } from "lucide-react";
import type { ExperienceItem } from "@/content";
import { Reveal } from "../fx/Reveal";
import { tagStyles } from "../ui/styles";

interface TimelineItemProps {
  item: ExperienceItem;
  current?: boolean;
  delay?: number;
}

export function TimelineItem({ item, current = false, delay = 0 }: TimelineItemProps) {
  return (
    <Reveal as="li" delay={delay} className="group relative pl-8">
      <span
        aria-hidden="true"
        data-testid="timeline-dot"
        className={`absolute top-1.5 -left-[6px] h-3 w-3 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
          current
            ? "animate-pulse-ring border-accent-400 bg-accent-400"
            : "border-brand-500 bg-white dark:bg-zinc-950"
        }`}
      />
      <p className="font-mono text-sm text-brand-600 dark:text-brand-400">{item.period}</p>
      <h3 className="mt-1 text-xl font-semibold">
        {item.role} <span className="text-zinc-500 dark:text-zinc-400">· {item.company}</span>
      </h3>
      {item.location && (
        <p className="mt-1 inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
          <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-accent-600 dark:text-accent-400" />
          {item.location}
        </p>
      )}
      {item.achievements.length > 0 && (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-600 marker:text-accent-500 dark:text-zinc-300">
          {item.achievements.map((achievement) => (
            <li key={achievement}>{achievement}</li>
          ))}
        </ul>
      )}
      {item.stack && item.stack.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Stack">
          {item.stack.map((tech) => (
            <li key={tech} className={tagStyles}>
              {tech}
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}
