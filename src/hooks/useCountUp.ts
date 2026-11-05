import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export function useCountUp(target: number, active: boolean, durationMs = 1400): number {
  const reducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(0);
  const skip = reducedMotion || target <= 0 || durationMs <= 0;

  useEffect(() => {
    if (skip || !active) return;
    let frame = 0;
    let start: number | undefined;
    const step = (now: number) => {
      start ??= now;
      const progress = Math.min((now - start) / durationMs, 1);
      setValue(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [skip, active, target, durationMs]);

  return skip || !active ? target : value;
}
