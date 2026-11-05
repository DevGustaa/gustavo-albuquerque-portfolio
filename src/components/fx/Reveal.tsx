"use client";

import { type CSSProperties, type HTMLAttributes, useRef } from "react";
import { useInView } from "@/hooks/useInView";

type RevealTag = "div" | "li" | "article" | "header";

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: RevealTag;
  delay?: number;
}

export function Reveal({ as: Tag = "div", delay = 0, style, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const shown = useInView(ref);
  const revealStyle = { ...style, "--reveal-delay": `${delay}ms` } as CSSProperties;
  return (
    <Tag
      ref={ref as never}
      data-reveal={shown ? "shown" : "hidden"}
      style={revealStyle}
      {...rest}
    >
      {children}
    </Tag>
  );
}
