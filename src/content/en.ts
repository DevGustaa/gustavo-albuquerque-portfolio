import { companyLogos } from "./profile";
import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "Gustavo de Albuquerque Lemos | Full Stack Developer",
    description:
      "Portfolio of Gustavo de Albuquerque Lemos, full stack developer based in Fortaleza, Brazil. Hospital systems, SSO, security, data privacy and AI applications.",
  },
  nav: {
    about: "About",
    skills: "Skills",
    projects: "Projects",
    experience: "Experience",
    contact: "Contact",
  },
  ui: {
    toggleTheme: "Toggle light/dark theme",
    switchLanguage: "Mudar para português",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    repository: "Code",
    liveDemo: "Demo",
    mainNavigation: "Main navigation",
    statusProduction: "In production",
    statusStaging: "In staging",
    screenshotUnavailableTitle: "Preview unavailable",
    screenshotUnavailableText: "Not every project can have its screens shared. Due to company or client guidelines, this one may not have an image.",
    previousProject: "Previous project",
    nextProject: "Next project",
  },
  hero: {
    greeting: "Hi, I'm",
    role: "Full Stack Developer",
    roles: [
      "Full Stack Developer",
      "Software Engineer",
      "SSO, RBAC & LGPD",
      "Award-winning AI apps",
    ],
    tagline:
      "I work across the whole software lifecycle — requirements, architecture, development, infrastructure, deployment and maintenance — with a focus on security, data privacy (LGPD) and AI applications.",
    ctaProjects: "View projects",
    ctaCv: "Download CV",
    ctaContact: "Get in touch",
  },
  about: {
    title: "About me",
    role: "Full Stack Developer",
    now: {
      label: "Now @ HGF",
      text: "I'm solely responsible for developing the systems of Hospital Geral de Fortaleza, focusing on centralized authentication, security and LGPD compliance for health data.",
    },
    award: {
      label: "Recognition",
      title: "21st Banking Transformation Award",
      text: "At Banco do Nordeste, I built the front-end and back-end of AI applications for credit analysis that won in the Credit Innovation category.",
    },
    workflow: {
      label: "How I work",
      text: "I use AI in my engineering workflow to boost productivity, while keeping architecture, code review and security under my own responsibility.",
    },
    location: {
      label: "Based in",
      city: "Fortaleza, Brazil",
    },
    highlights: [
      { value: "2+", label: "years of experience" },
      { value: "8", label: "systems delivered at HGF" },
    ],
    hobbies: {
      label: "Off the keyboard",
      items: [
        { name: "Guitar", icon: "guitar" },
        { name: "Video games", icon: "gamepad" },
        { name: "Hiking", icon: "mountain" },
        { name: "Anime", icon: "tv" },
      ],
    },
  },
  skills: {
    title: "Skills",
    subtitle: "Technologies and practices I use every day.",
    allTab: "all",
    tabsLabel: "Skill categories",
    countLabel: "items",
    groups: [
      {
        name: "Front-end",
        items: ["HTML5", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "React Native"],
      },
      {
        name: "Back-end",
        items: ["TypeScript", "NestJS", "Java", "Spring Boot", "REST APIs"],
      },
      { name: "Data", items: ["PostgreSQL", "SQL", "Redis"] },
      {
        name: "Infra & DevOps",
        items: [
          "Docker",
          "Linux",
          "Windows Server",
          "Nginx",
          "CI/CD",
          "GitHub Actions/Runners",
          "Git",
          "AWS",
        ],
      },
      {
        name: "Security",
        items: ["SSO", "RBAC", "Audit trail", "Secure development", "LGPD"],
      },
      {
        name: "Engineering",
        items: [
          "Requirements elicitation",
          "User stories",
          "Business rules",
          "Prototyping",
          "Architecture",
        ],
      },
      {
        name: "AI",
        items: [
          "AI applications",
          "Document analysis",
          "Assistants",
          "AI-assisted development",
        ],
      },
    ],
  },
  projects: {
    title: "Featured projects",
    subtitle: "Systems I've built that are in production or staging.",
    items: [
      {
        title: "SIGA",
        logo: companyLogos.hgf,
        host: "siga.hgf.local",
        status: "production",
        description:
          "Local-network patient calling and service management system at HGF. It started recording real flow data, revealing peak hours and enabling staff schedule adjustments, and eliminated calling patients out loud.",
        stack: ["TypeScript", "NestJS", "React", "PostgreSQL"],
      },
      {
        title: "Nexus",
        logo: companyLogos.hgf,
        host: "nexus.hgf.local",
        status: "production",
        description:
          "Centralized authentication (SSO), RBAC and audit trail service for the hospital's applications, built with secure development and LGPD practices.",
        stack: ["TypeScript", "NestJS", "PostgreSQL", "SSO", "RBAC"],
      },
      {
        title: "Sala Pronta",
        logo: companyLogos.hgf,
        host: "salapronta.hgf.local",
        status: "production",
        description:
          "Real-time operating room management with a TV dashboard, RBAC and auditing.",
        stack: ["TypeScript", "NestJS", "React", "PostgreSQL"],
      },
      {
        title: "Design System HGF",
        logo: companyLogos.hgf,
        host: "design-system.hgf.local",
        status: "production",
        description:
          "Reusable component library published via GitHub Packages and used across the hospital's applications.",
        stack: ["React", "TypeScript", "GitHub Packages"],
      },
      {
        title: "AnalisaAI",
        logo: companyLogos.bnb,
        host: "analisaai.bnb.local",
        description:
          "AI application for reading and analyzing documents at Banco do Nordeste, speeding up analysts' work. Winner of the 21st Banking Transformation Award, Credit Innovation category.",
        stack: ["AI", "Front-end", "Back-end"],
      },
      {
        title: "LuzIA",
        logo: companyLogos.bnb,
        host: "luzia.bnb.local",
        description:
          "Assistant that answers questions about Banco do Nordeste's credit lines, improving customer service. Winner of the 21st Banking Transformation Award.",
        stack: ["AI", "Assistant", "Front-end", "Back-end"],
      },
    ],
  },
  experience: {
    title: "Experience",
    subtitle: "My professional journey.",
    items: [
      {
        company: "Hospital Geral de Fortaleza",
        role: "Software Engineer",
        period: "Jul 2026 — present",
        location: "Fortaleza, Brazil",
        achievements: [
          "Delivered 8 systems (4 in production and 4 in staging), from critical services like SSO and operating room management to kiosk apps for TVs and tablets.",
          "In staging: Sentinela Digital (tracking of computers, tablets and TVs with remote commands), FeedbackHGF (satisfaction surveys on kiosks and tablets), Kiosk TV and Kiosk Tablet.",
          "Requirements gathering and validation with stakeholders, user stories, business rules and prototyping.",
          "Defined the stack and architecture; solo development of the entire codebase.",
          "Created the hospital's GitHub organization (repository standards and permissions), CI/CD with GitHub Actions and runners, Docker, Linux servers and Nginx.",
        ],
        stack: ["TypeScript", "NestJS", "React", "PostgreSQL", "Docker", "Nginx", "GitHub Actions"],
      },
      {
        company: "Banco do Nordeste",
        role: "Full Stack Developer",
        period: "Jan 2025 — Dec 2025",
        location: "Fortaleza, Brazil",
        achievements: [
          "Built the front-end and back-end of AnalisaAI, an AI application for reading and analyzing documents, and LuzIA, an assistant about the bank's credit lines.",
          "Both solutions sped up analysts' work, improved customer service and won the 21st Banking Transformation Award, Credit Innovation category.",
        ],
        stack: ["AI", "Front-end", "Back-end"],
      },
      {
        company: "Ilegra",
        role: "Software Developer",
        period: "1 year",
        achievements: [
          "Built SOS, a web system for a law firm that manages its clients' domestic employees, with employee registration and control plus support for eSocial filings.",
          "Custom software development for client companies.",
        ],
        stack: ["NestJS", "Next.js", "TypeScript"],
      },
    ],
  },
  contact: {
    title: "Let's talk?",
    subtitle: "I'm open to new opportunities and partnerships. Feel free to reach out.",
    emailLabel: "Send an e-mail",
  },
  footer: { rights: "All rights reserved." },
};
