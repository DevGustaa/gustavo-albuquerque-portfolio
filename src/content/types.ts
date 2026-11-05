export const LOCALES = ["pt", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export interface SocialLink {
  label: string;
  href: string;
}

export interface CompanyLogo {
  src: string;
  alt: string;
}

export type ImageAsset = CompanyLogo;

export type ProjectStatus = "production" | "staging";

export interface Project {
  title: string;
  logo?: CompanyLogo;
  screenshot?: ImageAsset;
  host?: string;
  status?: ProjectStatus;
  description: string;
  stack: string[];
  repoUrl?: string;
  demoUrl?: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location?: string;
  achievements: string[];
  stack?: string[];
}

export const HOBBY_ICONS = ["guitar", "gamepad", "mountain", "tv"] as const;
export type HobbyIcon = (typeof HOBBY_ICONS)[number];

export interface Hobby {
  name: string;
  icon: HobbyIcon;
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface Content {
  meta: { title: string; description: string };
  nav: {
    about: string;
    skills: string;
    projects: string;
    experience: string;
    contact: string;
  };
  ui: {
    toggleTheme: string;
    switchLanguage: string;
    openMenu: string;
    closeMenu: string;
    repository: string;
    liveDemo: string;
    mainNavigation: string;
    statusProduction: string;
    statusStaging: string;
    screenshotUnavailableTitle: string;
    screenshotUnavailableText: string;
    previousProject: string;
    nextProject: string;
  };
  hero: {
    greeting: string;
    role: string;
    roles: string[];
    tagline: string;
    ctaProjects: string;
    ctaCv: string;
    ctaContact: string;
  };
  about: {
    title: string;
    role: string;
    now: { label: string; text: string };
    award: { label: string; title: string; text: string };
    workflow: { label: string; text: string };
    location: {
      label: string;
      city: string;
    };
    highlights: { value: string; label: string }[];
    hobbies: { label: string; items: Hobby[] };
  };
  skills: {
    title: string;
    subtitle: string;
    allTab: string;
    tabsLabel: string;
    countLabel: string;
    groups: SkillGroup[];
  };
  projects: { title: string; subtitle: string; items: Project[] };
  experience: { title: string; subtitle: string; items: ExperienceItem[] };
  contact: { title: string; subtitle: string; emailLabel: string };
  footer: { rights: string };
}
