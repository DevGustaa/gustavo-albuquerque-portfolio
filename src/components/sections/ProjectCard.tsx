import { ExternalLink as ExternalLinkIcon, Lock } from "lucide-react";
import Image from "next/image";
import type { Content, Project, ProjectStatus } from "@/content";
import { TiltCard } from "../fx/TiltCard";
import { ExternalLink } from "../ui/ExternalLink";
import { ScreenshotPlaceholder } from "../ui/ScreenshotPlaceholder";
import { slugify } from "../ui/slugify";
import { SocialIcon } from "../ui/SocialIcon";

interface ProjectCardProps {
  project: Project;
  labels: Pick<
    Content["ui"],
    | "repository"
    | "liveDemo"
    | "statusProduction"
    | "statusStaging"
    | "screenshotUnavailableTitle"
    | "screenshotUnavailableText"
  >;
}

const linkStyles =
  "inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-brand-600 dark:text-zinc-300 dark:hover:text-accent-300";

const statusStyles: Record<ProjectStatus, { dot: string; text: string }> = {
  production: {
    dot: "bg-emerald-500",
    text: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  staging: {
    dot: "bg-amber-500",
    text: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
};

export function projectHost(project: Pick<Project, "title" | "host">): string {
  if (project.host) return project.host;
  const slug = slugify(project.title);
  return `${slug || "project"}.app`;
}

export function ProjectCard({ project, labels }: ProjectCardProps) {
  const hasLinks = Boolean(project.repoUrl || project.demoUrl);
  const statusLabel =
    project.status === "production"
      ? labels.statusProduction
      : project.status === "staging"
        ? labels.statusStaging
        : undefined;

  return (
    <TiltCard className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 hover:border-brand-400 hover:shadow-xl hover:shadow-brand-500/10 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-brand-500">
      <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-100/80 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/80">
        <div aria-hidden="true" className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <div
          data-testid="browser-host"
          className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-white px-3 py-1 font-mono text-xs text-zinc-500 ring-1 ring-zinc-200 dark:bg-zinc-950 dark:text-zinc-400 dark:ring-zinc-800"
        >
          <Lock
            aria-hidden="true"
            className="h-3 w-3 shrink-0 text-emerald-500"
          />
          <span className="truncate">{projectHost(project)}</span>
        </div>
      </div>

      <div className="relative aspect-video overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        {project.screenshot ? (
          <Image
            src={project.screenshot.src}
            alt={project.screenshot.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover/tilt:scale-105 motion-reduce:transition-none motion-reduce:group-hover/tilt:scale-100"
          />
        ) : (
          <ScreenshotPlaceholder
            title={project.title}
            heading={labels.screenshotUnavailableTitle}
            message={labels.screenshotUnavailableText}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3">
          {project.logo && (
            <Image
              src={project.logo.src}
              alt={project.logo.alt}
              title={project.logo.alt}
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-lg bg-white object-contain p-0.5 ring-1 ring-zinc-200 transition-transform duration-300 group-hover/tilt:scale-110 group-hover/tilt:-rotate-3 dark:ring-zinc-700"
            />
          )}
          <h3 className="text-xl font-semibold transition-colors group-hover/tilt:text-brand-600 dark:group-hover/tilt:text-accent-300">
            {project.title}
          </h3>
          {project.status && statusLabel && (
            <span
              className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${statusStyles[project.status].text}`}
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:animate-none ${statusStyles[project.status].dot}`}
                />
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${statusStyles[project.status].dot}`}
                />
              </span>
              {statusLabel}
            </span>
          )}
        </div>

        <p className="mt-3 flex-1 leading-relaxed text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>

        {project.stack.length > 0 && (
          <div className="mt-5 rounded-lg bg-zinc-950 p-3 font-mono text-xs ring-1 ring-zinc-800">
            <p aria-hidden="true" className="text-zinc-500">
              <span className="text-emerald-400">$</span> stack --list
            </p>
            <ul
              className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1"
              aria-label="Stack"
            >
              {project.stack.map((tech) => (
                <li key={tech} className="text-zinc-200">
                  <span aria-hidden="true" className="text-accent-400">
                    ›{" "}
                  </span>
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasLinks && (
          <div className="mt-6 flex gap-5">
            {project.repoUrl && (
              <ExternalLink
                href={project.repoUrl}
                className={linkStyles}
                aria-label={`${labels.repository}: ${project.title}`}
              >
                <SocialIcon label="github" className="h-4 w-4" />
                {labels.repository}
              </ExternalLink>
            )}
            {project.demoUrl && (
              <ExternalLink
                href={project.demoUrl}
                className={linkStyles}
                aria-label={`${labels.liveDemo}: ${project.title}`}
              >
                <ExternalLinkIcon aria-hidden="true" className="h-4 w-4" />
                {labels.liveDemo}
              </ExternalLink>
            )}
          </div>
        )}
      </div>
    </TiltCard>
  );
}
