"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const host = layer?.parentElement;
    if (!layer || !host || prefersReducedMotion()) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        layer.style.setProperty("--mx", `${x}px`);
        layer.style.setProperty("--my", `${y}px`);
        layer.dataset.spotlight = "on";
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      delete layer.dataset.spotlight;
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-testid="hero-background"
      className="group pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] [background-image:radial-gradient(circle,rgb(124_58_237/0.22)_1px,transparent_1px)] [background-size:26px_26px]" />
      <div className="absolute -top-32 -left-24 h-96 w-96 animate-blob-float rounded-full bg-brand-500/30 blur-3xl dark:bg-brand-600/30" />
      <div className="absolute top-10 -right-20 h-80 w-80 animate-blob-float rounded-full bg-accent-400/30 blur-3xl [animation-delay:-6s] dark:bg-accent-400/20" />
      <div className="absolute -bottom-32 left-1/3 h-80 w-80 animate-blob-float rounded-full bg-brand-400/25 blur-3xl [animation-delay:-12s]" />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 [background:radial-gradient(500px_circle_at_var(--mx,50%)_var(--my,50%),rgb(250_204_21/0.16),rgb(139_92_246/0.10)_35%,transparent_65%)] group-data-[spotlight=on]:opacity-100" />
    </div>
  );
}
