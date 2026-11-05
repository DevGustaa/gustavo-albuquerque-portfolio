"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageProvider";
import { toggleTheme } from "@/theme/theme";
import { iconButtonStyles } from "./ui/styles";

export function ThemeToggle() {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t.ui.toggleTheme}
      title={t.ui.toggleTheme}
      className={iconButtonStyles}
    >
      <Sun aria-hidden="true" className="hidden h-5 w-5 dark:block" />
      <Moon aria-hidden="true" className="h-5 w-5 dark:hidden" />
    </button>
  );
}
