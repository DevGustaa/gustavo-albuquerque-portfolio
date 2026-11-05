import { ArrowRight } from "lucide-react";
import type { Content, SocialLink } from "@/content";
import { HeroBackground } from "../fx/HeroBackground";
import { Typewriter } from "../fx/Typewriter";
import { ExternalLink } from "../ui/ExternalLink";
import { SocialIcon } from "../ui/SocialIcon";
import { buttonStyles } from "../ui/styles";

interface HeroProps {
  data: Content["hero"];
  name: string;
  socials: SocialLink[];
}

const stagger = (step: number) => ({ animationDelay: `${step * 120}ms` });

export function Hero({ data, name, socials }: HeroProps) {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <HeroBackground />
      <div className="mx-auto max-w-5xl px-6 pt-20 pb-24 sm:pt-32">
        <p
          className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 font-mono text-sm text-brand-700 dark:text-brand-300"
          style={stagger(0)}
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 animate-pulse-ring rounded-full bg-accent-400"
          />
          {data.greeting}
        </p>
        <h1
          className="mt-4 text-4xl font-bold tracking-tight text-brand-600 sm:text-6xl dark:text-brand-400"
          style={stagger(1)}
        >
          {name}
        </h1>
        <p
          className="mt-3 min-h-[1.5em] animate-fade-up text-2xl font-semibold text-zinc-600 sm:text-3xl dark:text-zinc-300"
          style={stagger(2)}
        >
          <span
            aria-hidden="true"
            className="mr-2 font-mono text-accent-600 dark:text-accent-400"
          >
            &gt;
          </span>
          <Typewriter words={data.roles} label={data.role} />
        </p>
        <p
          className="mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-zinc-600 dark:text-zinc-300"
          style={stagger(3)}
        >
          {data.tagline}
        </p>

        <div
          className="mt-10 flex animate-fade-up flex-wrap gap-3"
          style={stagger(4)}
        >
          <a href="#projects" className={`${buttonStyles.primary} group`}>
            {data.ctaProjects}
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </a>
          <a href="#contact" className={buttonStyles.ghost}>
            {data.ctaContact}
          </a>
        </div>

        {socials.length > 0 && (
          <ul className="mt-10 flex animate-fade-up gap-4" style={stagger(5)}>
            {socials.map((social) => (
              <li key={social.href}>
                <ExternalLink
                  href={social.href}
                  aria-label={social.label}
                  className="inline-block text-zinc-500 transition-all hover:-translate-y-1 hover:text-brand-600 dark:text-zinc-400 dark:hover:text-accent-300"
                >
                  <SocialIcon label={social.label} className="h-6 w-6" />
                </ExternalLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
