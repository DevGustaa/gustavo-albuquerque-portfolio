import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "@/components/ThemeToggle";
import { applyTheme, getTheme, THEME_STORAGE_KEY, themeInitScript, toggleTheme } from "@/theme/theme";
import { mockNavigatorLanguage, renderWithLanguage } from "./test-utils";

function mockPrefersDark(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia;
}

const runInitScript = () => new Function(themeInitScript)();

afterEach(() => vi.restoreAllMocks());

describe("theme helpers", () => {
  it("applies and persists the theme", () => {
    applyTheme("dark");
    expect(getTheme()).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("toggles between light and dark", () => {
    expect(getTheme()).toBe("light");
    expect(toggleTheme()).toBe("dark");
    expect(toggleTheme()).toBe("light");
  });

  it("still applies the theme when localStorage is unavailable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    applyTheme("dark");
    expect(getTheme()).toBe("dark");
  });
});

describe("themeInitScript", () => {
  it("uses the stored theme over the system preference", () => {
    mockPrefersDark(true);
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    runInitScript();
    expect(getTheme()).toBe("light");
  });

  it("follows the system preference when nothing is stored", () => {
    mockPrefersDark(true);
    runInitScript();
    expect(getTheme()).toBe("dark");
  });

  it("ignores an invalid stored value", () => {
    mockPrefersDark(false);
    localStorage.setItem(THEME_STORAGE_KEY, "purple");
    runInitScript();
    expect(getTheme()).toBe("light");
  });

  it("does not throw when matchMedia is unavailable", () => {
    window.matchMedia = undefined as unknown as typeof window.matchMedia;
    expect(runInitScript).not.toThrow();
  });
});

describe("ThemeToggle", () => {
  it("has an accessible label and toggles the theme on click", async () => {
    mockNavigatorLanguage("pt-BR");
    renderWithLanguage(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Alternar tema claro/escuro" });

    await userEvent.click(button);
    expect(getTheme()).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    await userEvent.click(button);
    expect(getTheme()).toBe("light");
  });
});
