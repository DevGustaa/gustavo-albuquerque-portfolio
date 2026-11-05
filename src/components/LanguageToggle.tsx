"use client";

import { useTranslation } from "@/i18n/LanguageProvider";
import { iconButtonStyles } from "./ui/styles";

export function LanguageToggle() {
  const { locale, t, toggleLocale } = useTranslation();
  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t.ui.switchLanguage}
      title={t.ui.switchLanguage}
      className={`${iconButtonStyles} font-mono`}
    >
      {locale === "pt" ? "EN" : "PT"}
    </button>
  );
}
