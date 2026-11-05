"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "@/content";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useTranslation } from "@/i18n/LanguageProvider";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { iconButtonStyles } from "./ui/styles";

export const NAV_SECTIONS = ["about", "skills", "projects", "experience", "contact"] as const;

const linkStyles =
  "relative text-zinc-600 transition-colors hover:text-brand-600 aria-[current=true]:text-brand-600 dark:text-zinc-300 dark:hover:text-accent-300 dark:aria-[current=true]:text-accent-300";

const underlineStyles =
  "after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-gradient-to-r after:from-brand-500 after:to-accent-400 after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=true]:after:scale-x-100";

export function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection(NAV_SECTIONS);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <a
          href="#top"
          className="group font-mono text-lg font-bold transition-colors hover:text-brand-600 dark:hover:text-brand-400"
          aria-label={profile.name}
        >
          {profile.initials}
          <span className="inline-block text-accent-500 transition-transform duration-300 group-hover:scale-150">
            .
          </span>
        </a>

        <nav aria-label={t.ui.mainNavigation} className="hidden md:block">
          <ul className="flex gap-6 text-sm">
            {NAV_SECTIONS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`${linkStyles} ${underlineStyles}`}
                  aria-current={activeSection === id ? "true" : undefined}
                >
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            className={`${iconButtonStyles} md:hidden`}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.ui.closeMenu : t.ui.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label={t.ui.mainNavigation}
          className="animate-fade-up border-t border-zinc-200 px-6 py-4 [animation-duration:0.3s] md:hidden dark:border-zinc-800"
        >
          <ul className="flex flex-col gap-4">
            {NAV_SECTIONS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={linkStyles}
                  aria-current={activeSection === id ? "true" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
