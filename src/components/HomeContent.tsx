"use client";

import { profile } from "@/content";
import { useTranslation } from "@/i18n/LanguageProvider";
import { Marquee } from "./fx/Marquee";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Experience } from "./sections/Experience";
import { Hero } from "./sections/Hero";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";

export function HomeContent() {
  const { t } = useTranslation();
  const skills = [...new Set(t.skills.groups.flatMap((group) => group.items))];
  return (
    <main className="flex-1">
      <Hero data={t.hero} name={profile.name} socials={profile.socials} />
      <Marquee items={skills} />
      <About
        data={t.about}
        name={profile.name}
        initials={profile.initials}
        photoUrl={profile.photoUrl}
      />
      <Skills data={t.skills} />
      <Projects data={t.projects} labels={t.ui} />
      <Experience data={t.experience} />
      <Contact
        data={t.contact}
        email={profile.email}
        socials={profile.socials}
      />
    </main>
  );
}
