import type { CompanyLogo, SocialLink } from "./types";

export const companyLogos = {
  hgf: { src: "/logos/hgf.png", alt: "Hospital Geral de Fortaleza" },
  bnb: { src: "/logos/bnb.png", alt: "Banco do Nordeste" },
} satisfies Record<string, CompanyLogo>;

export const profile = {
  name: "Gustavo de Albuquerque Lemos",
  initials: "GA",
  email: "gustavoalbdeveloper@gmail.com",
  cvUrl: "/cv.pdf",
  photoUrl: "/profile.jpg" as string | undefined,
  socials: [
    { label: "GitHub", href: "https://github.com/DevGustaa" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/gustavo-albuquerque-lemos" },
  ] satisfies SocialLink[],
};
