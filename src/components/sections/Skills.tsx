"use client";

import { type KeyboardEvent, type ReactNode, useRef, useState } from "react";
import type { Content, SkillGroup } from "@/content";
import { useInView } from "@/hooks/useInView";
import { useTypedText } from "@/hooks/useTypedText";
import { Reveal } from "../fx/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { slugify } from "../ui/slugify";

const GROUP_COLORS = [
  "text-brand-400",
  "text-accent-400",
  "text-emerald-400",
  "text-sky-400",
  "text-pink-400",
  "text-orange-400",
  "text-teal-400",
];

const STAGGER_MS = 35;
const TYPE_MS = 55;

export function skillsCommand(group?: SkillGroup): string {
  return group ? `ls skills/${slugify(group.name)}` : "ls -R skills/";
}

function fadeClass(shown: boolean): string {
  return shown ? "animate-fade-up" : "opacity-0";
}

function colorFor(index: number): string {
  return GROUP_COLORS[index % GROUP_COLORS.length]!;
}

function SkillList({
  group,
  colorIndex,
  offset = 0,
  shown,
}: {
  group: SkillGroup;
  colorIndex: number;
  offset?: number;
  shown: boolean;
}) {
  return (
    <ul aria-label={group.name} className="flex flex-wrap gap-x-2 gap-y-1">
      {group.items.map((item, index) => (
        <li
          key={item}
          style={{ animationDelay: `${(offset + index) * STAGGER_MS}ms` }}
          className={`group/skill inline-flex cursor-default ${fadeClass(shown)} items-center gap-1.5 rounded-md px-2 py-1 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/5 motion-reduce:animate-none`}
        >
          <span
            aria-hidden="true"
            className={`transition-transform duration-200 group-hover/skill:translate-x-0.5 ${colorFor(colorIndex)}`}
          >
            ▸
          </span>
          <span className="text-zinc-200 transition-colors group-hover/skill:text-accent-300">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Prompt({ children }: { children?: ReactNode }) {
  return (
    <p className="break-all">
      <span className="text-emerald-400">gustavo@portfolio</span>
      <span className="text-zinc-500">:</span>
      <span className="text-brand-300">~</span>
      <span className="text-zinc-500">$ </span>
      {children}
    </p>
  );
}

const caret = (
  <span
    aria-hidden="true"
    className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-caret-blink bg-accent-300 motion-reduce:animate-none"
  />
);

export function Skills({ data }: { data: Content["skills"] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inView = useInView(terminalRef, { threshold: 0.3 });
  const tabs = [data.allTab, ...data.groups.map((group) => group.name)];
  const activeGroup = active === 0 ? undefined : data.groups[active - 1];
  const command = skillsCommand(activeGroup);
  const { typed, done } = useTypedText(command, {
    charMs: TYPE_MS,
    start: inView,
  });

  const count = activeGroup
    ? activeGroup.items.length
    : data.groups.reduce((total, group) => total + group.items.length, 0);

  const select = (index: number) => {
    const next = (index + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key]!);
  };

  const offsets = data.groups.map((_, index) =>
    data.groups
      .slice(0, index)
      .reduce((total, group) => total + group.items.length, 0),
  );

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="mx-auto max-w-5xl px-6 py-20"
    >
      <SectionHeading
        id="skills-title"
        title={data.title}
        subtitle={data.subtitle}
      />
      <Reveal>
        <div
          ref={terminalRef}
          className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-brand-500/10"
        >
          <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
            <div aria-hidden="true" className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <p className="flex-1 text-center font-mono text-xs text-zinc-500">
              ~/gustavo/skills — zsh
            </p>
            <span aria-hidden="true" className="w-12" />
          </div>

          {data.groups.length > 0 && (
            <div
              role="tablist"
              aria-label={data.tabsLabel}
              className="flex gap-1 overflow-x-auto border-b border-zinc-800 px-3 py-2 [scrollbar-width:none]"
            >
              {tabs.map((label, index) => {
                const selected = index === active;
                return (
                  <button
                    key={label}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`skills-tab-${index}`}
                    aria-selected={selected}
                    aria-controls="skills-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(index)}
                    onKeyDown={handleKeyDown}
                    className={`shrink-0 rounded-md px-3 py-1.5 font-mono text-xs whitespace-nowrap transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand-500 ${
                      selected
                        ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                    }`}
                  >
                    {index > 0 && (
                      <span
                        aria-hidden="true"
                        className={`mr-1.5 ${selected ? "text-accent-300" : colorFor(index - 1)}`}
                      >
                        ●
                      </span>
                    )}
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          <div
            role={data.groups.length > 0 ? "tabpanel" : undefined}
            id="skills-panel"
            aria-labelledby={
              data.groups.length > 0 ? `skills-tab-${active}` : undefined
            }
            className="min-h-72 space-y-4 p-5 font-mono text-sm"
          >
            <Prompt>
              <span className="text-zinc-100" data-testid="skills-command">
                {typed}
              </span>
              {!done && caret}
            </Prompt>

            <div
              key={active}
              data-testid="skills-output"
              data-state={done ? "shown" : "hidden"}
              aria-busy={!done}
              className="space-y-3"
            >
              {activeGroup ? (
                <SkillList
                  group={activeGroup}
                  colorIndex={active - 1}
                  shown={done}
                />
              ) : (
                data.groups.map((group, index) => (
                  <div key={group.name}>
                    <p
                      style={{
                        animationDelay: `${(offsets[index] ?? 0) * STAGGER_MS}ms`,
                      }}
                      className={`mb-1 motion-reduce:animate-none ${colorFor(index)} ${fadeClass(done)}`}
                    >
                      skills/{slugify(group.name)}:
                    </p>
                    <SkillList
                      group={group}
                      colorIndex={index}
                      offset={offsets[index]}
                      shown={done}
                    />
                  </div>
                ))
              )}
              <div
                style={{ animationDelay: `${count * STAGGER_MS}ms` }}
                className={`space-y-3 motion-reduce:animate-none ${fadeClass(done)}`}
              >
                <p className="text-xs text-zinc-500">
                  {count} {data.countLabel}
                </p>
                <Prompt>{caret}</Prompt>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
