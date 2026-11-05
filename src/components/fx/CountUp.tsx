"use client";

import { useRef } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";

interface ParsedStat {
  prefix: string;
  number: number;
  suffix: string;
}

export function parseStat(value: string): ParsedStat | null {
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  if (!match) return null;
  return { prefix: match[1], number: Number(match[2]), suffix: match[3] };
}

export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const parsed = parseStat(value);
  const current = useCountUp(parsed?.number ?? 0, inView && parsed !== null);

  return (
    <span ref={ref} className={className}>
      {parsed ? (
        <>
          <span className="sr-only">{value}</span>
          <span aria-hidden="true" data-testid="count-up">
            {parsed.prefix}
            {current}
            {parsed.suffix}
          </span>
        </>
      ) : (
        value
      )}
    </span>
  );
}
