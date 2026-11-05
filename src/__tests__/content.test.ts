import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { content, HOBBY_ICONS, LOCALES, profile } from "@/content";

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, nested]) => [key, shape(nested)]),
    );
  }
  return typeof value;
}

describe("content", () => {
  it("has a dictionary for every locale", () => {
    for (const locale of LOCALES) expect(content[locale]).toBeDefined();
  });

  it("keeps PT and EN with the same structure and item counts", () => {
    expect(shape(content.en)).toEqual(shape(content.pt));
  });

  it("has no empty strings in any locale", () => {
    const collect = (value: unknown): string[] =>
      typeof value === "string"
        ? [value]
        : value && typeof value === "object"
          ? Object.values(value).flatMap(collect)
          : [];
    for (const locale of LOCALES) {
      expect(
        collect(content[locale]).filter((text) => text.trim() === ""),
      ).toEqual([]);
    }
  });

  it("uses absolute https URLs for social links and projects", () => {
    const urls = [
      ...profile.socials.map((social) => social.href),
      ...LOCALES.flatMap((locale) =>
        content[locale].projects.items.flatMap((project) =>
          [project.repoUrl, project.demoUrl].filter(Boolean),
        ),
      ),
    ];
    for (const url of urls) expect(url).toMatch(/^https:\/\//);
  });

  it("uses local root-relative paths with alt text for project logos", () => {
    const logos = LOCALES.flatMap((locale) =>
      content[locale].projects.items.flatMap((project) =>
        project.logo ? [project.logo] : [],
      ),
    );
    expect(logos.length).toBeGreaterThan(0);
    for (const logo of logos) {
      expect(logo.src).toMatch(/^\/logos\/[\w-]+\.png$/);
      expect(logo.alt.trim()).not.toBe("");
      expect(existsSync(join(process.cwd(), "public", logo.src))).toBe(true);
    }
  });

  it("uses existing local paths with alt text for project screenshots", () => {
    const shots = LOCALES.flatMap((locale) =>
      content[locale].projects.items.flatMap((project) =>
        project.screenshot ? [project.screenshot] : [],
      ),
    );
    for (const shot of shots) {
      expect(shot.src).toMatch(/^\/projects\/[\w-]+\.(png|jpe?g|webp)$/);
      expect(shot.alt.trim()).not.toBe("");
      expect(existsSync(join(process.cwd(), "public", shot.src))).toBe(true);
    }
  });

  it("uses valid statuses and hostnames for projects", () => {
    for (const locale of LOCALES) {
      for (const project of content[locale].projects.items) {
        if (project.status)
          expect(["production", "staging"]).toContain(project.status);
        if (project.host) expect(project.host).toMatch(/^[a-z0-9.-]+$/);
      }
    }
  });

  it("explains missing previews with guidelines, not security alarms", () => {
    for (const locale of LOCALES) {
      const text = content[locale].ui.screenshotUnavailableText.toLowerCase();
      expect(text).toMatch(/diretrizes|guidelines/);
      expect(text).not.toMatch(/seguran|security/);
    }
  });

  it("uses known hobby icons in the about section", () => {
    for (const locale of LOCALES) {
      for (const hobby of content[locale].about.hobbies.items)
        expect(HOBBY_ICONS).toContain(hobby.icon);
    }
  });

  it("points the profile photo to an existing local file", () => {
    if (!profile.photoUrl) return;
    expect(profile.photoUrl).toMatch(/^\/[\w-]+\.(png|jpe?g|webp)$/);
    expect(existsSync(join(process.cwd(), "public", profile.photoUrl))).toBe(
      true,
    );
  });

  it("has a valid-looking e-mail", () => {
    expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});
