import { type RefObject, useEffect, useState, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface InViewOptions {
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

const noopSubscribe = () => () => {};

export function canObserve(): boolean {
  return typeof window !== "undefined" && "IntersectionObserver" in window;
}

export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { once = true, threshold = 0.15, rootMargin = "0px 0px -10% 0px" }: InViewOptions = {},
): boolean {
  const reducedMotion = usePrefersReducedMotion();
  const unsupported = useSyncExternalStore(noopSubscribe, () => !canObserve(), () => false);
  const [observed, setObserved] = useState(false);
  const bypass = reducedMotion || unsupported;

  useEffect(() => {
    const element = ref.current;
    if (bypass || !element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setObserved(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setObserved(false);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, bypass, once, threshold, rootMargin]);

  return bypass || observed;
}
