import { LOCALES, type Locale } from "@/content/types";

export const LANGUAGE_STORAGE_KEY = "language";
export const DEFAULT_LOCALE: Locale = "pt";
export const HTML_LANG: Record<Locale, string> = { pt: "pt-BR", en: "en" };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function detectLocale(): Locale {
  const stored = readStoredLocale();
  if (stored) return stored;
  const browserLanguage = typeof navigator === "undefined" ? "" : navigator.language ?? "";
  return browserLanguage.toLowerCase().startsWith("en") ? "en" : DEFAULT_LOCALE;
}

export function createLanguageStore() {
  let current: Locale | null = null;
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());

  const onStorage = (event: StorageEvent) => {
    if (event.key !== LANGUAGE_STORAGE_KEY) return;
    current = null;
    notify();
  };

  return {
    subscribe(listener: () => void) {
      if (listeners.size === 0) window.addEventListener("storage", onStorage);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot(): Locale {
      current ??= detectLocale();
      return current;
    },
    getServerSnapshot(): Locale {
      return DEFAULT_LOCALE;
    },
    setLocale(locale: Locale) {
      if (!isLocale(locale) || locale === current) return;
      current = locale;
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
      } catch {
        // storage unavailable (private mode); keep in-memory choice
      }
      notify();
    },
  };
}

export type LanguageStore = ReturnType<typeof createLanguageStore>;
