"use client";

import { Check, Copy, Mail, X } from "lucide-react";
import { useEffect, useState } from "react";
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

type CopyState = "idle" | "copied" | "error";

const RESET_MS = 2000;

export function gmailComposeUrl(email: string): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function Contact({ data, email, socials }: ContactProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    if (copyState === "idle") return;
    const timer = setTimeout(() => setCopyState("idle"), RESET_MS);
    return () => clearTimeout(timer);
  }, [copyState]);

  const handleCopy = async () => {
    setCopyState((await copyToClipboard(email)) ? "copied" : "error");
  };

  const copyContent = {
    idle: { icon: Copy, label: data.copyLabel },
    copied: { icon: Check, label: data.copiedLabel },
    error: { icon: X, label: data.copyErrorLabel },
  }[copyState];
  const CopyIcon = copyContent.icon;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto max-w-5xl px-6 py-24"
    >
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
          <h2
            id="contact-title"
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {data.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">
            {data.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ExternalLink
              href={gmailComposeUrl(email)}
              className={buttonStyles.primary}
            >
              <Mail aria-hidden="true" className="h-4 w-4" />
              {data.gmailLabel}
            </ExternalLink>
            <button
              type="button"
              onClick={handleCopy}
              data-state={copyState}
              className={`${buttonStyles.secondary} data-[state=copied]:border-emerald-500 data-[state=copied]:text-emerald-600 data-[state=error]:border-red-500 data-[state=error]:text-red-600 dark:data-[state=copied]:text-emerald-400 dark:data-[state=error]:text-red-400`}
            >
              <CopyIcon aria-hidden="true" className="h-4 w-4" />
              {copyContent.label}
            </button>
          </div>
          <p role="status" aria-live="polite" className="sr-only">
            {copyState === "idle" ? "" : copyContent.label}
          </p>

          <p className="mt-4 font-mono text-sm text-zinc-500">{email}</p>
          <a
            href={`mailto:${email}`}
            className="mt-1 inline-block text-sm text-zinc-500 underline-offset-4 hover:text-brand-600 hover:underline dark:hover:text-accent-300"
          >
            {data.mailtoLabel}
          </a>

          {socials.length > 0 && (
            <ul className="mt-8 flex justify-center gap-3">
              {socials.map((social) => (
                <li key={social.href}>
                  <ExternalLink
                    href={social.href}
                    className={buttonStyles.secondary}
                  >
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
