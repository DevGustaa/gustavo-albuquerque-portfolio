import { Mail } from "lucide-react";
import type { Content, SocialLink } from "@/content";
import { Reveal } from "../fx/Reveal";
import { ExternalLink } from "../ui/ExternalLink";
import { SocialIcon } from "../ui/SocialIcon";
import { buttonStyles } from "../ui/styles";

interface ContactProps {
  data: Content["contact"];
  email: string;
  socials: SocialLink[];
}

export function Contact({ data, email, socials }: ContactProps) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-5xl px-6 py-24">
      <Reveal className="relative overflow-hidden rounded-3xl p-px">
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 animate-spin-border bg-[conic-gradient(from_0deg,transparent_0deg,var(--color-brand-500)_80deg,var(--color-accent-400)_140deg,transparent_200deg)] opacity-80"
        />
        <div className="relative isolate overflow-hidden rounded-[calc(1.5rem-1px)] bg-zinc-100 px-6 py-16 text-center dark:bg-zinc-900">
          <span
            aria-hidden="true"
            className="absolute -top-20 -left-16 -z-10 h-64 w-64 animate-blob-float rounded-full bg-brand-500/20 blur-3xl"
          />
          <span
            aria-hidden="true"
            className="absolute -right-16 -bottom-20 -z-10 h-64 w-64 animate-blob-float rounded-full bg-accent-400/20 blur-3xl [animation-delay:-9s]"
          />
          <h2 id="contact-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">{data.subtitle}</p>
          <a href={`mailto:${email}`} className={`${buttonStyles.primary} mt-8`}>
            <Mail aria-hidden="true" className="h-4 w-4" />
            {data.emailLabel}
          </a>
          <p className="mt-3 font-mono text-sm text-zinc-500">{email}</p>
          {socials.length > 0 && (
            <ul className="mt-8 flex justify-center gap-3">
              {socials.map((social) => (
                <li key={social.href}>
                  <ExternalLink href={social.href} className={buttonStyles.secondary}>
                    <SocialIcon label={social.label} className="h-4 w-4" />
                    {social.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>
    </section>
  );
}
