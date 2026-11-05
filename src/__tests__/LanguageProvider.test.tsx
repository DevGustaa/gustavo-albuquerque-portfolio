import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "@/i18n/LanguageProvider";
import { LANGUAGE_STORAGE_KEY } from "@/i18n/languageStore";
import { mockNavigatorLanguage, renderWithLanguage } from "./test-utils";

function Probe() {
  const { locale, t } = useTranslation();
  return (
    <p>
      {locale}:{t.nav.about}
    </p>
  );
}

describe("LanguageProvider", () => {
  it("renders the stored locale and syncs <html lang> and title", () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "en");
    renderWithLanguage(<Probe />);
    expect(screen.getByText("en:About")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("en");
    expect(document.title).toContain("Full Stack Developer");
  });

  it("toggles between PT and EN and persists the choice", async () => {
    mockNavigatorLanguage("pt-BR");
    renderWithLanguage(
      <>
        <Probe />
        <LanguageToggle />
      </>,
    );
    expect(screen.getByText("pt:Sobre")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Switch to English" }));
    expect(screen.getByText("en:About")).toBeInTheDocument();
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("en");
    expect(document.documentElement.lang).toBe("en");

    await userEvent.click(screen.getByRole("button", { name: "Mudar para português" }));
    expect(screen.getByText("pt:Sobre")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("pt-BR");
  });

  it("shows the target language in the toggle label", () => {
    mockNavigatorLanguage("pt-BR");
    renderWithLanguage(<LanguageToggle />);
    expect(screen.getByRole("button")).toHaveTextContent("EN");
  });

  it("throws a helpful error when used outside the provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/within a LanguageProvider/);
  });
});
