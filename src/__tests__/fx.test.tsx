import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CountUp, parseStat } from "@/components/fx/CountUp";
import { HeroBackground } from "@/components/fx/HeroBackground";
import { decayVelocity, HorizontalScroller } from "@/components/fx/HorizontalScroller";
import { Marquee } from "@/components/fx/Marquee";
import { Reveal } from "@/components/fx/Reveal";
import { TiltCard } from "@/components/fx/TiltCard";
import { Typewriter } from "@/components/fx/Typewriter";
import { Experience } from "@/components/sections/Experience";
import { pt } from "@/content/pt";
import {
  installIntersectionObserver,
  mockReducedMotion,
  triggerIntersect,
  uninstallIntersectionObserver,
  unmockReducedMotion,
} from "./test-utils";

afterEach(() => {
  vi.useRealTimers();
  uninstallIntersectionObserver();
  unmockReducedMotion();
});

describe("Reveal", () => {
  it("starts hidden and shows when it enters the viewport", () => {
    installIntersectionObserver();
    render(
      <Reveal as="li" delay={160} data-testid="reveal">
        Conteúdo
      </Reveal>,
    );
    const element = screen.getByTestId("reveal");
    expect(element.tagName).toBe("LI");
    expect(element).toHaveAttribute("data-reveal", "hidden");
    expect(element.style.getPropertyValue("--reveal-delay")).toBe("160ms");
    act(() => triggerIntersect(element));
    expect(element).toHaveAttribute("data-reveal", "shown");
  });

  it("is shown right away without IntersectionObserver", () => {
    render(<Reveal data-testid="reveal">Conteúdo</Reveal>);
    expect(screen.getByTestId("reveal")).toHaveAttribute("data-reveal", "shown");
  });
});

describe("parseStat / CountUp", () => {
  it("parses numeric stats with prefix and suffix", () => {
    expect(parseStat("2+")).toEqual({ prefix: "", number: 2, suffix: "+" });
    expect(parseStat("8")).toEqual({ prefix: "", number: 8, suffix: "" });
    expect(parseStat("~10k")).toEqual({ prefix: "~", number: 10, suffix: "k" });
  });

  it("returns null for non-numeric stats", () => {
    expect(parseStat("∞")).toBeNull();
    expect(parseStat("")).toBeNull();
    expect(parseStat("1.5")).toBeNull();
  });

  it("keeps the real value for screen readers and counts the visual one", () => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    installIntersectionObserver();
    const { container } = render(<CountUp value="8+" />);
    expect(container.querySelector(".sr-only")).toHaveTextContent("8+");
    const visual = screen.getByTestId("count-up");
    expect(visual).toHaveAttribute("aria-hidden", "true");
    expect(visual).toHaveTextContent("8+");

    act(() => triggerIntersect(container.firstElementChild!));
    expect(visual).toHaveTextContent("0+");
    act(() => vi.advanceTimersByTime(2000));
    expect(visual).toHaveTextContent("8+");
  });

  it("renders non-numeric values as plain text", () => {
    render(<CountUp value="∞" />);
    expect(screen.getByText("∞")).toBeInTheDocument();
    expect(screen.queryByTestId("count-up")).toBeNull();
  });
});

describe("TiltCard", () => {
  const rect = { left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100 };

  function renderCard() {
    render(<TiltCard data-testid="card">Card</TiltCard>);
    const card = screen.getByTestId("card");
    card.getBoundingClientRect = () => rect as DOMRect;
    return card;
  }

  it("renders an article with its children", () => {
    renderCard();
    expect(screen.getByRole("article")).toHaveTextContent("Card");
  });

  it("tilts towards a mouse pointer and resets on leave", () => {
    const card = renderCard();
    fireEvent.pointerMove(card, { pointerType: "mouse", clientX: 200, clientY: 0 });
    expect(card.style.getPropertyValue("--rx")).toBe("6.00deg");
    expect(card.style.getPropertyValue("--ry")).toBe("6.00deg");
    expect(card.style.getPropertyValue("--gx")).toBe("100.0%");
    expect(card).toHaveAttribute("data-tilting", "true");

    fireEvent.pointerLeave(card);
    expect(card.style.getPropertyValue("--rx")).toBe("");
    expect(card).not.toHaveAttribute("data-tilting");
  });

  it("ignores touch pointers", () => {
    const card = renderCard();
    fireEvent.pointerMove(card, { pointerType: "touch", clientX: 200, clientY: 0 });
    expect(card).not.toHaveAttribute("data-tilting");
  });

  it("ignores pointers with reduced motion", () => {
    mockReducedMotion(true);
    const card = renderCard();
    fireEvent.pointerMove(card, { pointerType: "mouse", clientX: 200, clientY: 0 });
    expect(card).not.toHaveAttribute("data-tilting");
  });

  it("ignores elements without size and still calls user handlers", () => {
    const onPointerMove = vi.fn();
    const onPointerLeave = vi.fn();
    render(
      <TiltCard data-testid="card" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
        Card
      </TiltCard>,
    );
    const card = screen.getByTestId("card");
    fireEvent.pointerMove(card, { pointerType: "mouse", clientX: 10, clientY: 10 });
    fireEvent.pointerLeave(card);
    expect(card).not.toHaveAttribute("data-tilting");
    expect(onPointerMove).toHaveBeenCalledOnce();
    expect(onPointerLeave).toHaveBeenCalledOnce();
  });
});

describe("Typewriter", () => {
  it("exposes the static label to screen readers and hides the animation", () => {
    render(<Typewriter words={["Dev", "Eng"]} label="Desenvolvedor Full Stack" />);
    expect(screen.getByText("Desenvolvedor Full Stack")).toHaveClass("sr-only");
    expect(screen.getByTestId("typewriter")).toHaveAttribute("aria-hidden", "true");
  });

  it("falls back to the label when there are no words", () => {
    mockReducedMotion(true);
    render(<Typewriter words={[]} label="Dev" />);
    expect(screen.getByTestId("typewriter")).toHaveTextContent("Dev");
  });
});

describe("Marquee", () => {
  it("renders the items twice inside a decorative container", () => {
    render(<Marquee items={["React", "NestJS"]} />);
    const marquee = screen.getByTestId("marquee");
    expect(marquee).toHaveAttribute("aria-hidden", "true");
    expect(marquee.querySelectorAll("li")).toHaveLength(4);
  });

  it("renders nothing without items", () => {
    render(<Marquee items={[]} />);
    expect(screen.queryByTestId("marquee")).toBeNull();
  });
});

describe("HeroBackground", () => {
  function renderInHost() {
    render(
      <section data-testid="host">
        <HeroBackground />
      </section>,
    );
    const host = screen.getByTestId("host");
    host.getBoundingClientRect = () => ({ left: 10, top: 20 }) as DOMRect;
    return { host, layer: screen.getByTestId("hero-background") };
  }

  it("is decorative", () => {
    const { layer } = renderInHost();
    expect(layer).toHaveAttribute("aria-hidden", "true");
  });

  it("follows the mouse and hides the spotlight on leave", () => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame"] });
    const { host, layer } = renderInHost();
    fireEvent.pointerMove(host, { pointerType: "mouse", clientX: 110, clientY: 70 });
    act(() => vi.advanceTimersByTime(20));
    expect(layer.style.getPropertyValue("--mx")).toBe("100px");
    expect(layer.style.getPropertyValue("--my")).toBe("50px");
    expect(layer).toHaveAttribute("data-spotlight", "on");

    fireEvent.pointerLeave(host);
    expect(layer).not.toHaveAttribute("data-spotlight");
  });

  it("ignores touch and reduced motion", () => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame"] });
    const { host, layer } = renderInHost();
    fireEvent.pointerMove(host, { pointerType: "touch", clientX: 110, clientY: 70 });
    act(() => vi.advanceTimersByTime(20));
    expect(layer).not.toHaveAttribute("data-spotlight");
  });

  it("does not listen with reduced motion", () => {
    mockReducedMotion(true);
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame"] });
    const { host, layer } = renderInHost();
    fireEvent.pointerMove(host, { pointerType: "mouse", clientX: 110, clientY: 70 });
    act(() => vi.advanceTimersByTime(20));
    expect(layer).not.toHaveAttribute("data-spotlight");
  });
});

describe("Experience timeline animation", () => {
  it("draws the line when the timeline enters the viewport and pulses the current item", () => {
    installIntersectionObserver();
    render(<Experience data={pt.experience} />);
    const line = screen.getByTestId("timeline-progress");
    expect(line).toHaveAttribute("data-drawn", "false");
    act(() => triggerIntersect(line.parentElement!));
    expect(line).toHaveAttribute("data-drawn", "true");

    const dots = screen.getAllByTestId("timeline-dot");
    expect(dots[0]).toHaveClass("animate-pulse-ring");
    expect(dots.slice(1).some((dot) => dot.classList.contains("animate-pulse-ring"))).toBe(false);
  });
});

describe("decayVelocity", () => {
  it("applies friction to the velocity", () => {
    expect(decayVelocity(1)).toBeCloseTo(0.94);
    expect(decayVelocity(-1)).toBeCloseTo(-0.94);
  });

  it("stops when the velocity becomes negligible", () => {
    expect(decayVelocity(0.01)).toBe(0);
    expect(decayVelocity(0)).toBe(0);
  });
});

describe("HorizontalScroller", () => {
  function setup({ scrollWidth = 1000, clientWidth = 400, scrollLeft = 0 } = {}) {
    render(
      <HorizontalScroller label="Projetos" previousLabel="Anterior" nextLabel="Próximo">
        <li>A</li>
        <li>B</li>
      </HorizontalScroller>,
    );
    const track = screen.getByRole("list", { name: "Projetos" });
    const scrollBy = vi.fn();
    Object.defineProperty(track, "scrollWidth", { configurable: true, value: scrollWidth });
    Object.defineProperty(track, "clientWidth", { configurable: true, value: clientWidth });
    track.scrollLeft = scrollLeft;
    track.scrollBy = scrollBy;
    fireEvent.scroll(track);
    return {
      track,
      scrollBy,
      prev: screen.getByRole("button", { name: "Anterior" }),
      next: screen.getByRole("button", { name: "Próximo" }),
    };
  }

  it("renders the items inside a labelled list", () => {
    setup();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("disables previous at the start and enables next when there is overflow", () => {
    const { prev, next } = setup();
    expect(prev).toBeDisabled();
    expect(next).toBeEnabled();
  });

  it("disables next at the end of the track", () => {
    const { prev, next } = setup({ scrollLeft: 600 });
    expect(prev).toBeEnabled();
    expect(next).toBeDisabled();
  });

  it("disables both arrows when the content fits", () => {
    const { prev, next } = setup({ scrollWidth: 400, clientWidth: 400 });
    expect(prev).toBeDisabled();
    expect(next).toBeDisabled();
  });

  it("scrolls by most of a page in each direction with smooth behavior", () => {
    const { track, scrollBy, prev, next } = setup();
    fireEvent.click(next);
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 340, behavior: "smooth" });
    track.scrollLeft = 300;
    fireEvent.scroll(track);
    fireEvent.click(prev);
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -340, behavior: "smooth" });
  });

  it("scrolls instantly when the user prefers reduced motion", () => {
    mockReducedMotion(true);
    const { scrollBy, next } = setup();
    fireEvent.click(next);
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 340, behavior: "auto" });
  });

  it("shows edge fades only where there is more content", () => {
    const { track } = setup();
    const start = document.querySelector('[data-edge="start"]')!;
    const end = document.querySelector('[data-edge="end"]')!;
    expect(start).toHaveClass("opacity-0");
    expect(end).toHaveClass("opacity-100");
    track.scrollLeft = 600;
    fireEvent.scroll(track);
    expect(start).toHaveClass("opacity-100");
    expect(end).toHaveClass("opacity-0");
  });

  it("drags with the mouse, disabling snap while dragging", () => {
    const { track } = setup({ scrollLeft: 100 });
    fireEvent.pointerDown(track, { pointerType: "mouse", button: 0, pointerId: 1, clientX: 300 });
    fireEvent.pointerMove(track, { pointerType: "mouse", pointerId: 1, clientX: 200 });
    expect(track.scrollLeft).toBe(200);
    expect(track).toHaveAttribute("data-dragging", "true");
    expect(track.style.getPropertyValue("scroll-snap-type")).toBe("none");
    fireEvent.pointerUp(track, { pointerType: "mouse", pointerId: 1, clientX: 200 });
    expect(track).not.toHaveAttribute("data-dragging");
  });

  it("ignores tiny movements below the drag threshold", () => {
    const { track } = setup({ scrollLeft: 100 });
    fireEvent.pointerDown(track, { pointerType: "mouse", button: 0, pointerId: 1, clientX: 300 });
    fireEvent.pointerMove(track, { pointerType: "mouse", pointerId: 1, clientX: 297 });
    expect(track.scrollLeft).toBe(100);
    expect(track).not.toHaveAttribute("data-dragging");
  });

  it("ignores touch and non-primary buttons (native scrolling handles touch)", () => {
    const { track } = setup({ scrollLeft: 100 });
    fireEvent.pointerDown(track, { pointerType: "touch", button: 0, pointerId: 1, clientX: 300 });
    fireEvent.pointerMove(track, { pointerType: "touch", pointerId: 1, clientX: 100 });
    fireEvent.pointerDown(track, { pointerType: "mouse", button: 2, pointerId: 2, clientX: 300 });
    fireEvent.pointerMove(track, { pointerType: "mouse", pointerId: 2, clientX: 100 });
    expect(track.scrollLeft).toBe(100);
  });

  it("suppresses the click that ends a drag but not later clicks", () => {
    const onClick = vi.fn();
    render(
      <HorizontalScroller label="Lista" previousLabel="Anterior" nextLabel="Próximo">
        <li>
          <button type="button" onClick={onClick}>
            Item
          </button>
        </li>
      </HorizontalScroller>,
    );
    const track = screen.getByRole("list", { name: "Lista" });
    const item = screen.getByRole("button", { name: "Item" });
    fireEvent.pointerDown(track, { pointerType: "mouse", button: 0, pointerId: 1, clientX: 300 });
    fireEvent.pointerMove(track, { pointerType: "mouse", pointerId: 1, clientX: 200 });
    fireEvent.pointerUp(track, { pointerType: "mouse", pointerId: 1, clientX: 200 });
    fireEvent.click(item);
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.click(item);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("keeps gliding with momentum after a fast drag and restores snap at the end", () => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    const { track } = setup({ scrollLeft: 300 });
    fireEvent.pointerDown(track, { pointerType: "mouse", button: 0, pointerId: 1, clientX: 400 });
    vi.advanceTimersByTime(10);
    fireEvent.pointerMove(track, { pointerType: "mouse", pointerId: 1, clientX: 380 });
    vi.advanceTimersByTime(10);
    fireEvent.pointerMove(track, { pointerType: "mouse", pointerId: 1, clientX: 360 });
    fireEvent.pointerUp(track, { pointerType: "mouse", pointerId: 1, clientX: 360 });
    const afterRelease = track.scrollLeft;
    vi.advanceTimersByTime(32);
    expect(track.scrollLeft).toBeGreaterThan(afterRelease);
    vi.advanceTimersByTime(5000);
    expect(track.style.getPropertyValue("scroll-snap-type")).toBe("");
  });

  it("skips momentum when the user prefers reduced motion", () => {
    mockReducedMotion(true);
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    const { track } = setup({ scrollLeft: 300 });
    fireEvent.pointerDown(track, { pointerType: "mouse", button: 0, pointerId: 1, clientX: 400 });
    vi.advanceTimersByTime(10);
    fireEvent.pointerMove(track, { pointerType: "mouse", pointerId: 1, clientX: 360 });
    fireEvent.pointerUp(track, { pointerType: "mouse", pointerId: 1, clientX: 360 });
    const afterRelease = track.scrollLeft;
    vi.advanceTimersByTime(100);
    expect(track.scrollLeft).toBe(afterRelease);
    expect(track.style.getPropertyValue("scroll-snap-type")).toBe("");
  });

  it("recomputes edges on window resize", () => {
    const { track, next } = setup();
    Object.defineProperty(track, "scrollWidth", { configurable: true, value: 400 });
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    expect(next).toBeDisabled();
  });
});
