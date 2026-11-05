"use client";

import { profile } from "@/content";
import { useTranslation } from "@/i18n/LanguageProvider";

export function Footer({ year }: { year: number }) {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
      © {year} {profile.name}. {t.footer.rights}
    </footer>
  );
}
