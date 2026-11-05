"use client";

import { useTypewriter } from "@/hooks/useTypewriter";

interface TypewriterProps {
  words: string[];
  label: string;
  className?: string;
}

export function Typewriter({ words, label, className }: TypewriterProps) {
  const text = useTypewriter(words.length > 0 ? words : [label]);
  return (
    <span className={className}>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" data-testid="typewriter">
        {text}
        <span className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.12em] animate-caret-blink rounded-sm bg-accent-400" />
      </span>
    </span>
  );
}
