import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface TypewriterOptions {
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
}

interface TypewriterState {
  wordIndex: number;
  length: number;
  deleting: boolean;
}

const INITIAL: TypewriterState = { wordIndex: 0, length: 0, deleting: false };

export function useTypewriter(
  words: string[],
  { typeMs = 70, deleteMs = 35, holdMs = 1800 }: TypewriterOptions = {},
): string {
  const reducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState(INITIAL);
  const [wordsKey, setWordsKey] = useState(words.join("|"));
  const isStatic = reducedMotion || words.length === 0;

  const currentKey = words.join("|");
  if (currentKey !== wordsKey) {
    setWordsKey(currentKey);
    setState(INITIAL);
  }

  const word = words[state.wordIndex % Math.max(words.length, 1)] ?? "";

  useEffect(() => {
    if (isStatic) return;
    const typed = state.length === word.length;
    const erased = state.length === 0;

    let delay = state.deleting ? deleteMs : typeMs;
    if (!state.deleting && typed) delay = holdMs;

    const timer = setTimeout(() => {
      setState((prev) => {
        if (!prev.deleting && typed) {
          return words.length > 1 ? { ...prev, deleting: true } : prev;
        }
        if (prev.deleting && erased) {
          return { wordIndex: (prev.wordIndex + 1) % words.length, length: 0, deleting: false };
        }
        return { ...prev, length: prev.length + (prev.deleting ? -1 : 1) };
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [state, word, words.length, isStatic, typeMs, deleteMs, holdMs]);

  if (isStatic) return words[0] ?? "";
  return word.slice(0, state.length);
}
