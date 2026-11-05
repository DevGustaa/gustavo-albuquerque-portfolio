import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Footer } from "@/components/Footer";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { ProjectCard, projectHost } from "@/components/sections/ProjectCard";
import { Projects } from "@/components/sections/Projects";
import { Skills, skillsCommand } from "@/components/sections/Skills";
import { ScreenshotPlaceholder } from "@/components/ui/ScreenshotPlaceholder";
import { pt } from "@/content/pt";
import {
  mockNavigatorLanguage,
  installIntersectionObserver,
  mockReducedMotion,
  renderWithLanguage,
  triggerIntersect,
  uninstallIntersectionObserver,
  unmockReducedMotion,
} from "./test-utils";

const socials = [
  { label: "GitHub", href: "https://github.com/user" },
  { label: "Twitter", href: "https://x.com/user" },
];

describe("Hero", () => {
  it("renders name, role and CTAs", () => {
    render(
      <Hero data={pt.hero} name="Fulano" cvUrl="/cv.pdf" socials={socials} />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Fulano" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ver projetos/ })).toHaveAttribute(
      "href",
      "#projects",
    );
    expect(screen.getByRole("link", { name: /Baixar CV/ })).toHaveAttribute(
      "download",
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "target",
      "_blank",
    );
  });

  it("hides the CV button and socials when not provided", () => {
    render(<Hero data={pt.hero} name="Fulano" socials={[]} />);
    expect(screen.queryByRole("link", { name: /Baixar CV/ })).toBeNull();
    expect(screen.queryByRole("list")).toBeNull();
  });
});

describe("About", () => {
  afterEach(() => {
    vi.useRealTimers();
    unmockReducedMotion();
  });

  it("renders every bento tile with its content", () => {
    render(<About data={pt.about} name="Fulano" initials="FL" />);
    expect(
      screen.getByRole("heading", { name: "Sobre mim" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: pt.about.now.label }),
    ).toBeInTheDocument();
    expect(screen.getByText(pt.about.now.text)).toBeInTheDocument();
    expect(screen.getByText(pt.about.award.title)).toBeInTheDocument();
    expect(screen.getByText(pt.about.award.text)).toBeInTheDocument();
    expect(screen.getByText(pt.about.workflow.text)).toBeInTheDocument();
    expect(screen.getByText(pt.about.location.city)).toBeInTheDocument();
    expect(screen.getByText("Fulano")).toBeInTheDocument();
    expect(screen.getByText(pt.about.role)).toBeInTheDocument();
    expect(screen.getByText("anos de experiência")).toBeInTheDocument();
  });

  it("renders the initials fallback when there is no photo", () => {
    render(<About data={pt.about} name="Fulano" initials="FL" />);
    expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("FL");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("renders the photo when provided", () => {
    render(
      <About data={pt.about} name="Fulano" initials="FL" photoUrl="/me.jpg" />,
    );
    const photo = screen.getByRole("img", { name: "Fulano" });
    expect(decodeURIComponent(photo.getAttribute("src")!)).toContain("/me.jpg");
    expect(screen.queryByTestId("avatar-fallback")).toBeNull();
  });

  it("lists the hobbies with decorative icons", () => {
    render(<About data={pt.about} name="Fulano" initials="FL" />);
    const list = screen.getByRole("list", { name: pt.about.hobbies.label });
    const items = within(list).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(
      pt.about.hobbies.items.map((hobby) => hobby.name),
    );
    items.forEach((item) =>
      expect(item.querySelector("svg")).toHaveAttribute("aria-hidden", "true"),
    );
  });

  it("omits the hobbies tile and widens the workflow tile when there are no hobbies", () => {
    render(
      <About
        data={{ ...pt.about, hobbies: { ...pt.about.hobbies, items: [] } }}
        name="Fulano"
        initials="FL"
      />,
    );
    expect(
      screen.queryByRole("list", { name: pt.about.hobbies.label }),
    ).toBeNull();
    const workflow = screen
      .getByRole("heading", { name: pt.about.workflow.label })
      .closest("[data-reveal]")!;
    expect(workflow).toHaveClass("md:col-span-4");
  });

  it("omits the highlights list when empty", () => {
    const { container } = render(
      <About
        data={{ ...pt.about, highlights: [] }}
        name="Fulano"
        initials="FL"
      />,
    );
    expect(container.querySelector("dl")).toBeNull();
  });
});

describe("Skills", () => {
  const total = pt.skills.groups.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  function tickTyping(times: number) {
    for (let i = 0; i < times; i++) act(() => vi.advanceTimersByTime(60));
  }

  afterEach(() => {
    vi.useRealTimers();
    unmockReducedMotion();
    uninstallIntersectionObserver();
  });

  it("keeps every skill in the DOM (hidden) while the command is typed", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    render(<Skills data={pt.skills} />);
    const output = screen.getByTestId("skills-output");
    expect(output).toHaveAttribute("data-state", "hidden");
    expect(screen.getByTestId("skills-command")).toHaveTextContent(/^$/);
    for (const group of pt.skills.groups) {
      const list = screen.getByRole("list", { name: group.name });
      expect(within(list).getAllByRole("listitem")).toHaveLength(
        group.items.length,
      );
    }
    within(output)
      .getAllByRole("listitem")
      .forEach((item) => expect(item).toHaveClass("opacity-0"));
  });

  it("types 'ls -R skills/' on first view and then reveals the skills with animation", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    render(<Skills data={pt.skills} />);
    tickTyping(5);
    expect(screen.getByTestId("skills-command").textContent).toBe("ls -R");
    tickTyping(20);
    expect(screen.getByTestId("skills-command")).toHaveTextContent(
      "ls -R skills/",
    );
    const output = screen.getByTestId("skills-output");
    expect(output).toHaveAttribute("data-state", "shown");
    within(output)
      .getAllByRole("listitem")
      .forEach((item) => expect(item).toHaveClass("animate-fade-up"));
    expect(screen.getByText(`${total} itens`)).toBeInTheDocument();
  });

  it("only starts typing once the terminal scrolls into view", () => {
    installIntersectionObserver();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    render(<Skills data={pt.skills} />);
    tickTyping(30);
    expect(screen.getByTestId("skills-command")).toHaveTextContent(/^$/);
    const terminal = screen.getByRole("tablist").parentElement!;
    act(() => triggerIntersect(terminal, true));
    tickTyping(30);
    expect(screen.getByTestId("skills-command")).toHaveTextContent(
      "ls -R skills/",
    );
  });

  it("renders one tab per group plus 'all', linked to the panel", () => {
    render(<Skills data={pt.skills} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(pt.skills.groups.length + 1);
    expect(tabs[0]).toHaveAccessibleName("todas");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("aria-labelledby", "skills-tab-0");
    tabs.forEach((tab) =>
      expect(tab).toHaveAttribute("aria-controls", panel.id),
    );
  });

  it("retypes the command and shows only the selected group", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    render(<Skills data={pt.skills} />);
    tickTyping(20);
    fireEvent.click(screen.getByRole("tab", { name: /Back-end/ }));

    const command = screen.getByTestId("skills-command");
    expect(command).toHaveTextContent(/^$/);
    expect(screen.getByTestId("skills-output")).toHaveAttribute(
      "data-state",
      "hidden",
    );

    tickTyping(5);
    expect(command.textContent).toBe("ls sk");

    tickTyping(40);
    expect(command).toHaveTextContent("ls skills/back-end");
    const backEnd = pt.skills.groups.find(
      (group) => group.name === "Back-end",
    )!;
    const list = screen.getByRole("list", { name: "Back-end" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(
      backEnd.items.length,
    );
    expect(screen.queryByRole("list", { name: "Front-end" })).toBeNull();
    expect(
      screen.getByText(`${backEnd.items.length} itens`),
    ).toBeInTheDocument();
    expect(screen.getByTestId("skills-output")).toHaveAttribute(
      "data-state",
      "shown",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      "skills-tab-2",
    );
  });

  it("shows everything immediately when the user prefers reduced motion", () => {
    mockReducedMotion(true);
    render(<Skills data={pt.skills} />);
    expect(screen.getByTestId("skills-command")).toHaveTextContent(
      "ls -R skills/",
    );
    fireEvent.click(screen.getByRole("tab", { name: /Dados/ }));
    expect(screen.getByTestId("skills-command")).toHaveTextContent(
      "ls skills/dados",
    );
    expect(screen.getByTestId("skills-output")).toHaveAttribute(
      "data-state",
      "shown",
    );
  });

  it("moves between tabs with arrow keys, Home and End (wrapping around)", () => {
    render(<Skills data={pt.skills} />);
    const tabs = () => screen.getAllByRole("tab");
    fireEvent.keyDown(tabs()[0]!, { key: "ArrowLeft" });
    expect(tabs().at(-1)).toHaveAttribute("aria-selected", "true");
    expect(tabs().at(-1)).toHaveFocus();
    fireEvent.keyDown(tabs().at(-1)!, { key: "ArrowRight" });
    expect(tabs()[0]).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tabs()[0]!, { key: "End" });
    expect(tabs().at(-1)).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tabs().at(-1)!, { key: "Home" });
    expect(tabs()[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs()[0]).toHaveAttribute("tabindex", "0");
    expect(tabs()[1]).toHaveAttribute("tabindex", "-1");
  });

  it("ignores unrelated keys", () => {
    render(<Skills data={pt.skills} />);
    fireEvent.keyDown(screen.getAllByRole("tab")[0]!, { key: "a" });
    expect(screen.getAllByRole("tab")[0]).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("renders without groups", () => {
    render(<Skills data={{ ...pt.skills, groups: [] }} />);
    expect(screen.getByRole("heading", { name: "Skills" })).toBeInTheDocument();
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.queryByRole("listitem")).toBeNull();
    expect(screen.getByText("0 itens")).toBeInTheDocument();
  });
});

describe("skillsCommand", () => {
  it("builds the 'all' and per-group commands", () => {
    expect(skillsCommand()).toBe("ls -R skills/");
    expect(skillsCommand({ name: "Infra e DevOps", items: [] })).toBe(
      "ls skills/infra-e-devops",
    );
    expect(skillsCommand({ name: "Segurança", items: [] })).toBe(
      "ls skills/seguranca",
    );
  });
});

describe("ProjectCard", () => {
  const base = { title: "App", description: "Desc", stack: ["React", "Node"] };

  it("renders repo and demo links with safe attributes", () => {
    render(
      <ProjectCard
        project={{
          ...base,
          repoUrl: "https://github.com/x/app",
          demoUrl: "https://app.dev",
        }}
        labels={pt.ui}
      />,
    );
    const repo = screen.getByRole("link", { name: "Código: App" });
    expect(repo).toHaveAttribute("href", "https://github.com/x/app");
    expect(repo).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "Demo: App" })).toHaveAttribute(
      "href",
      "https://app.dev",
    );
  });

  it("renders only the links that exist", () => {
    render(
      <ProjectCard
        project={{ ...base, demoUrl: "https://app.dev" }}
        labels={pt.ui}
      />,
    );
    expect(screen.queryByRole("link", { name: /Código/ })).toBeNull();
    expect(screen.getByRole("link", { name: /Demo/ })).toBeInTheDocument();
  });

  it("renders the company logo when provided", () => {
    render(
      <ProjectCard
        project={{ ...base, logo: { src: "/logos/acme.png", alt: "ACME" } }}
        labels={pt.ui}
      />,
    );
    const logo = screen.getByRole("img", { name: "ACME" });
    expect(decodeURIComponent(logo.getAttribute("src")!)).toContain(
      "/logos/acme.png",
    );
  });

  it("renders no logo when absent", () => {
    render(<ProjectCard project={base} labels={pt.ui} />);
    expect(screen.queryByRole("img", { name: "ACME" })).toBeNull();
    expect(screen.queryAllByRole("img")).toHaveLength(0);
    expect(
      screen.getByRole("heading", { level: 3, name: "App" }),
    ).toBeInTheDocument();
  });

  it("renders the screenshot inside the browser frame when provided", () => {
    render(
      <ProjectCard
        project={{
          ...base,
          screenshot: { src: "/projects/app.png", alt: "Tela do App" },
        }}
        labels={pt.ui}
      />,
    );
    const shot = screen.getByRole("img", { name: "Tela do App" });
    expect(decodeURIComponent(shot.getAttribute("src")!)).toContain(
      "/projects/app.png",
    );
    expect(screen.queryByTestId("screenshot-unavailable")).toBeNull();
  });

  it("renders the confidential placeholder when there is no screenshot", () => {
    render(<ProjectCard project={base} labels={pt.ui} />);
    const placeholder = screen.getByTestId("screenshot-unavailable");
    expect(placeholder).toHaveTextContent(pt.ui.screenshotUnavailableTitle);
    expect(placeholder).toHaveTextContent(pt.ui.screenshotUnavailableText);
  });

  it("shows the given host in the address bar", () => {
    render(
      <ProjectCard
        project={{ ...base, host: "app.hgf.local" }}
        labels={pt.ui}
      />,
    );
    expect(screen.getByTestId("browser-host")).toHaveTextContent(
      "app.hgf.local",
    );
  });

  it("derives the host from the title when absent", () => {
    render(
      <ProjectCard
        project={{ ...base, title: "Sala Pronta" }}
        labels={pt.ui}
      />,
    );
    expect(screen.getByTestId("browser-host")).toHaveTextContent(
      "sala-pronta.app",
    );
  });

  it("renders the production and staging badges", () => {
    const { rerender } = render(
      <ProjectCard
        project={{ ...base, status: "production" }}
        labels={pt.ui}
      />,
    );
    expect(screen.getByText("Em produção")).toBeInTheDocument();
    rerender(
      <ProjectCard project={{ ...base, status: "staging" }} labels={pt.ui} />,
    );
    expect(screen.getByText("Em homologação")).toBeInTheDocument();
    expect(screen.queryByText("Em produção")).toBeNull();
  });

  it("renders no status badge when status is absent", () => {
    render(<ProjectCard project={base} labels={pt.ui} />);
    expect(screen.queryByText("Em produção")).toBeNull();
    expect(screen.queryByText("Em homologação")).toBeNull();
  });

  it("renders the stack items in the terminal block", () => {
    render(<ProjectCard project={base} labels={pt.ui} />);
    const stack = screen.getByRole("list", { name: "Stack" });
    expect(
      within(stack)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual(["› React", "› Node"]);
  });

  it("renders no links and no stack when absent", () => {
    render(<ProjectCard project={{ ...base, stack: [] }} labels={pt.ui} />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.queryByRole("list", { name: "Stack" })).toBeNull();
  });
});

describe("projectHost", () => {
  it("prefers the explicit host", () => {
    expect(projectHost({ title: "SIGA", host: "siga.hgf.local" })).toBe(
      "siga.hgf.local",
    );
  });

  it("slugifies accents, spaces and symbols", () => {
    expect(projectHost({ title: "  Gestão & Ação  " })).toBe("gestao-acao.app");
  });

  it("falls back to a generic slug when the title has no valid characters", () => {
    expect(projectHost({ title: "!!!" })).toBe("project.app");
  });
});

describe("ScreenshotPlaceholder", () => {
  it("shows the heading, the message and a screen-reader-only project name", () => {
    render(
      <ScreenshotPlaceholder
        title="Nexus"
        heading="Imagem confidencial"
        message="Motivo"
      />,
    );
    expect(screen.getByText("Imagem confidencial")).toBeInTheDocument();
    expect(screen.getByText("Motivo")).toBeInTheDocument();
    expect(screen.getByText("Nexus:")).toHaveClass("sr-only");
  });

  it("hides the decorative skeleton and magnifier from assistive technologies", () => {
    render(<ScreenshotPlaceholder title="Nexus" heading="H" message="M" />);
    const root = screen.getByTestId("screenshot-unavailable");
    expect(root.querySelector("[data-skeleton]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    root
      .querySelectorAll("svg")
      .forEach((svg) => expect(svg).toHaveAttribute("aria-hidden", "true"));
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("animates the magnifier only when motion is allowed", () => {
    render(<ScreenshotPlaceholder title="Nexus" heading="H" message="M" />);
    const animated = screen
      .getByTestId("screenshot-unavailable")
      .querySelectorAll('[class*="animate-search-roam"]');
    expect(animated).toHaveLength(1);
    expect(animated[0]!.getAttribute("class")).toContain(
      "motion-reduce:animate-none",
    );
  });
});

describe("Projects", () => {
  it("renders one card per project", () => {
    render(<Projects data={pt.projects} labels={pt.ui} />);
    expect(screen.getAllByRole("article")).toHaveLength(
      pt.projects.items.length,
    );
  });

  it("renders the projects in a horizontal list with navigation", () => {
    render(<Projects data={pt.projects} labels={pt.ui} />);
    const track = screen.getByRole("list", { name: pt.projects.title });
    expect(within(track).getAllByRole("article")).toHaveLength(
      pt.projects.items.length,
    );
    expect(
      screen.getByRole("button", { name: "Projeto anterior" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Próximo projeto" }),
    ).toBeInTheDocument();
  });

  it("renders without projects", () => {
    render(<Projects data={{ ...pt.projects, items: [] }} labels={pt.ui} />);
    expect(screen.queryByRole("article")).toBeNull();
  });
});

describe("Experience", () => {
  it("renders timeline items with achievements, location and stack", () => {
    render(<Experience data={pt.experience} />);
    const [first] = pt.experience.items;
    expect(screen.getByText(first.period)).toBeInTheDocument();
    expect(screen.getByText(first.achievements[0])).toBeInTheDocument();
    expect(screen.getAllByText(first.location!).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("list", { name: "Stack" })).toHaveLength(
      pt.experience.items.filter((item) => item.stack?.length).length,
    );
  });

  it("handles items without optional fields", () => {
    render(
      <Experience
        data={{
          ...pt.experience,
          items: [
            { company: "ACME", role: "Dev", period: "2020", achievements: [] },
          ],
        }}
      />,
    );
    expect(
      screen.getByRole("heading", { name: /Dev · ACME/ }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Stack" })).toBeNull();
  });

  it("renders without items", () => {
    render(<Experience data={{ ...pt.experience, items: [] }} />);
    expect(screen.queryByRole("listitem")).toBeNull();
  });
});

describe("Contact", () => {
  it("renders a mailto link and external social links", () => {
    render(<Contact data={pt.contact} email="me@site.dev" socials={socials} />);
    expect(screen.getByRole("link", { name: /Enviar e-mail/ })).toHaveAttribute(
      "href",
      "mailto:me@site.dev",
    );
    for (const social of socials) {
      const link = screen.getByRole("link", { name: social.label });
      expect(link).toHaveAttribute("href", social.href);
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("hides the socials list when empty", () => {
    render(<Contact data={pt.contact} email="me@site.dev" socials={[]} />);
    expect(screen.queryByRole("list")).toBeNull();
  });
});

describe("Footer", () => {
  it("shows the given year and translated rights", () => {
    mockNavigatorLanguage("pt-BR");
    renderWithLanguage(<Footer year={2030} />);
    expect(screen.getByRole("contentinfo")).toHaveTextContent("© 2030");
    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      "Todos os direitos reservados.",
    );
  });
});
