import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface TypedOptions {
  charMs?: number;
  start?: boolean;
}

interface TypedState {
  text: string;
  length: number;
}

export function useTypedText(
  text: string,
  { charMs = 35, start = true }: TypedOptions = {},
): { typed: string; done: boolean } {
  const reducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState<TypedState>({ text, length: 0 });

  if (state.text !== text) {
    setState({ text, length: 0 });
  }

  const length = state.text === text ? state.length : 0;

  useEffect(() => {
    if (reducedMotion || !start || length >= text.length) return;
    const timer = setTimeout(
      () => setState((prev) => ({ ...prev, length: prev.length + 1 })),
      charMs,
    );
    return () => clearTimeout(timer);
  }, [reducedMotion, start, length, text, charMs]);

  if (reducedMotion) return { typed: text, done: true };
  return { typed: text.slice(0, length), done: length >= text.length };
}
