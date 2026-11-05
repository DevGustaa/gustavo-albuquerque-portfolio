import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Header, NAV_SECTIONS } from "@/components/Header";
import {
  installIntersectionObserver,
  mockNavigatorLanguage,
  renderWithLanguage,
  triggerIntersect,
  uninstallIntersectionObserver,
} from "./test-utils";

beforeEach(() => mockNavigatorLanguage("pt-BR"));
afterEach(() => uninstallIntersectionObserver());

describe("Header", () => {
  it("renders anchor links for every section", () => {
    renderWithLanguage(<Header />);
    const nav = screen.getByRole("navigation", { name: "Navegação principal" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual(
      NAV_SECTIONS.map((id) => `#${id}`),
    );
  });

  it("opens and closes the mobile menu", async () => {
    renderWithLanguage(<Header />);
    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-menu")).toBeNull();

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName("Fechar menu");
    expect(document.getElementById("mobile-menu")).not.toBeNull();

    await userEvent.click(toggle);
    expect(document.getElementById("mobile-menu")).toBeNull();
  });

  it("closes the mobile menu when a link is clicked", async () => {
    renderWithLanguage(<Header />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
    const menu = document.getElementById("mobile-menu")!;
    await userEvent.click(within(menu).getByRole("link", { name: "Projetos" }));
    expect(document.getElementById("mobile-menu")).toBeNull();
  });

  it("closes the mobile menu with Escape", async () => {
    renderWithLanguage(<Header />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
    await userEvent.keyboard("{Escape}");
    expect(document.getElementById("mobile-menu")).toBeNull();
  });

  it("translates navigation labels when the language changes", async () => {
    renderWithLanguage(<Header />);
    await userEvent.click(screen.getByRole("button", { name: "Switch to English" }));
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toHaveTextContent(
      "Experience",
    );
  });

  it("highlights the link of the section in view", () => {
    installIntersectionObserver();
    renderWithLanguage(
      <>
        <Header />
        {NAV_SECTIONS.map((id) => (
          <section key={id} id={id} />
        ))}
      </>,
    );
    const nav = screen.getByRole("navigation", { name: "Navegação principal" });
    expect(within(nav).queryByRole("link", { current: true })).toBeNull();

    act(() => triggerIntersect(document.getElementById("projects")!));
    expect(within(nav).getByRole("link", { current: true })).toHaveTextContent("Projetos");
  });
});
