"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { content, type Content, type Locale } from "@/content";
import { createLanguageStore, HTML_LANG } from "./languageStore";

interface LanguageContextValue {
  locale: Locale;
  t: Content;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createLanguageStore);
  const locale = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale];
    document.title = content[locale].meta.title;
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      t: content[locale],
      setLocale: store.setLocale,
      toggleLocale: () => store.setLocale(locale === "pt" ? "en" : "pt"),
    }),
    [locale, store],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation must be used within a LanguageProvider");
  return context;
}
