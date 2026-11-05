"use client";

import type { HTMLAttributes, PointerEvent } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface TiltCardProps extends HTMLAttributes<HTMLElement> {
  as?: "article" | "div";
  maxTilt?: number;
}

const TILT_PROPS = ["--rx", "--ry", "--gx", "--gy"] as const;

export function TiltCard({
  as: Tag = "article",
  maxTilt = 6,
  className = "",
  children,
  onPointerMove,
  onPointerLeave,
  ...rest
}: TiltCardProps) {
  const reducedMotion = usePrefersReducedMotion();

  const handleMove = (event: PointerEvent<HTMLElement>) => {
    onPointerMove?.(event);
    if (reducedMotion || event.pointerType !== "mouse") return;
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    element.style.setProperty("--rx", `${((0.5 - py) * 2 * maxTilt).toFixed(2)}deg`);
    element.style.setProperty("--ry", `${((px - 0.5) * 2 * maxTilt).toFixed(2)}deg`);
    element.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    element.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    element.dataset.tilting = "true";
  };

  const handleLeave = (event: PointerEvent<HTMLElement>) => {
    onPointerLeave?.(event);
    const element = event.currentTarget;
    TILT_PROPS.forEach((prop) => element.style.removeProperty(prop));
    delete element.dataset.tilting;
  };

  return (
    <Tag
      {...rest}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`group/tilt relative transition-transform duration-200 ease-out [transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [background:radial-gradient(420px_circle_at_var(--gx,50%)_var(--gy,50%),rgb(250_204_21/0.16),rgb(139_92_246/0.10)_40%,transparent_70%)] group-data-[tilting=true]/tilt:opacity-100"
      />
      {children}
    </Tag>
  );
}
