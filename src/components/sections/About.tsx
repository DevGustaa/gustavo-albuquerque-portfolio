"use client";

import {
  Building2,
  Clock,
  Gamepad2,
  Guitar,
  type LucideIcon,
  MapPin,
  Mountain,
  Package,
  Sparkles,
  Trophy,
  Tv,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import type { Content, HobbyIcon } from "@/content";
import { CountUp } from "../fx/CountUp";
import { Reveal } from "../fx/Reveal";
import { TiltCard } from "../fx/TiltCard";
import { SectionHeading } from "../ui/SectionHeading";

interface AboutProps {
  data: Content["about"];
  name: string;
  initials: string;
  photoUrl?: string;
}

const HOBBY_ICON_COMPONENTS: Record<HobbyIcon, LucideIcon> = {
  guitar: Guitar,
  gamepad: Gamepad2,
  mountain: Mountain,
  tv: Tv,
};

const STAT_ICONS: LucideIcon[] = [Clock, Package];

const tileStyles =
  "flex h-full flex-col rounded-2xl border border-zinc-200 bg-white/60 p-5 hover:border-brand-400 hover:shadow-xl hover:shadow-brand-500/10 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-brand-500";

const labelStyles =
  "font-mono text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-400";

function IconBadge({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children?: ReactNode;
}) {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-500/10 text-brand-600 ring-1 ring-brand-500/20 transition-transform duration-300 group-hover/tilt:scale-110 group-hover/tilt:-rotate-6 dark:text-brand-300"
    >
      <Icon className="h-5 w-5" />
      {children}
    </span>
  );
}

function Tile({
  className = "",
  delay = 0,
  children,
}: {
  className?: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <Reveal delay={delay} className={className}>
      <TiltCard as="div" maxTilt={3} className={tileStyles}>
        {children}
      </TiltCard>
    </Reveal>
  );
}

function PhotoTile({
  name,
  role,
  initials,
  photoUrl,
}: Omit<AboutProps, "data"> & { role: string }) {
  return (
    <Reveal className="col-span-2 row-span-2 aspect-square md:aspect-auto md:min-h-[27rem]">
      <div className="group/photo relative h-full overflow-hidden rounded-2xl p-[3px]">
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 animate-spin-border bg-[conic-gradient(from_0deg,var(--color-brand-600),var(--color-accent-400),var(--color-brand-400),var(--color-accent-300),var(--color-brand-600))] motion-reduce:animate-none"
        />
        <div className="relative h-full overflow-hidden rounded-[13px] bg-zinc-900">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={name}
              fill
              sizes="(min-width: 768px) 480px, 100vw"
              className="object-cover object-[50%_35%] transition-transform duration-700 ease-out group-hover/photo:scale-[1.03] motion-reduce:transition-none"
            />
          ) : (
            <div
              aria-hidden="true"
              data-testid="avatar-fallback"
              className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 font-mono text-7xl font-bold text-white"
            >
              {initials}
              <span className="text-accent-300">.</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-16">
            <p className="text-lg font-semibold text-white">{name}</p>
            <p className="font-mono text-xs text-accent-300">{role}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function LocationTile({
  data,
  delay,
}: {
  data: Content["about"]["location"];
  delay: number;
}) {
  return (
    <Tile delay={delay} className="col-span-2">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-500" />
        </span>
        <p className={labelStyles}>{data.label}</p>
      </div>
      <p className="mt-auto flex items-center gap-2 pt-3 text-2xl font-bold">
        <MapPin aria-hidden="true" className="h-6 w-6 shrink-0 text-brand-500" />
        {data.city}
      </p>
    </Tile>
  );
}

export function About({ data, name, initials, photoUrl }: AboutProps) {
  const hasHobbies = data.hobbies.items.length > 0;
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto max-w-5xl px-6 py-20"
    >
      <SectionHeading id="about-title" title={data.title} />
      <div className="grid auto-rows-[minmax(9rem,auto)] grid-cols-2 gap-4 md:grid-cols-4">
        <PhotoTile
          name={name}
          role={data.role}
          initials={initials}
          photoUrl={photoUrl}
        />

        <Tile delay={100} className="col-span-2">
          <div className="flex items-center gap-3">
            <IconBadge icon={Building2} />
            <h3 className={labelStyles}>{data.now.label}</h3>
          </div>
          <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-300">
            {data.now.text}
          </p>
        </Tile>

        <Tile delay={200} className="col-span-2">
          <div className="flex items-center gap-3">
            <IconBadge icon={Trophy}>
              <span
                data-testid="trophy-shine"
                className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/60 to-transparent motion-reduce:hidden"
              />
            </IconBadge>
            <div>
              <h3 className={labelStyles}>{data.award.label}</h3>
              <p className="font-semibold text-brand-600 dark:text-brand-400">
                {data.award.title}
              </p>
            </div>
          </div>
          <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-300">
            {data.award.text}
          </p>
        </Tile>

        {data.highlights.length > 0 && (
          <dl className="contents">
            {data.highlights.map((highlight, index) => {
              const Icon = STAT_ICONS[index % STAT_ICONS.length]!;
              return (
                <Reveal
                  key={highlight.label}
                  delay={300 + index * 80}
                  className="col-span-1"
                >
                  <TiltCard as="div" maxTilt={3} className={tileStyles}>
                    <IconBadge icon={Icon} />
                    <div className="mt-auto flex flex-col-reverse pt-3">
                      <dt className="text-sm text-zinc-500 dark:text-zinc-400">
                        {highlight.label}
                      </dt>
                      <dd className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                        <CountUp value={highlight.value} />
                      </dd>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </dl>
        )}

        <LocationTile data={data.location} delay={540} />

        <Tile
          delay={600}
          className={hasHobbies ? "col-span-2" : "col-span-2 md:col-span-4"}
        >
          <div className="flex items-center gap-3">
            <IconBadge icon={Sparkles} />
            <h3 className={labelStyles}>{data.workflow.label}</h3>
          </div>
          <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-300">
            {data.workflow.text}
          </p>
        </Tile>

        {hasHobbies && (
          <Tile delay={680} className="col-span-2">
            <h3 className={labelStyles}>{data.hobbies.label}</h3>
            <ul
              aria-label={data.hobbies.label}
              className="mt-4 flex flex-wrap gap-2"
            >
              {data.hobbies.items.map((hobby) => {
                const Icon = HOBBY_ICON_COMPONENTS[hobby.icon];
                return (
                  <li
                    key={hobby.name}
                    className="group/chip inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-600 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:text-brand-300"
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-4 w-4 text-brand-500 group-hover/chip:animate-wiggle motion-reduce:group-hover/chip:animate-none"
                    />
                    {hobby.name}
                  </li>
                );
              })}
            </ul>
          </Tile>
        )}
      </div>
    </section>
  );
}
