import { act, render, renderHook, screen } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import {
  prefersReducedMotion,
  usePrefersReducedMotion,
} from "@/hooks/usePrefersReducedMotion";
import { useTypedText } from "@/hooks/useTypedText";
import { useTypewriter } from "@/hooks/useTypewriter";
import { slugify } from "@/components/ui/slugify";
import {
  installIntersectionObserver,
  mockReducedMotion,
  observers,
  triggerIntersect,
  uninstallIntersectionObserver,
  unmockReducedMotion,
} from "./test-utils";

const FAKE: Parameters<typeof vi.useFakeTimers>[0] = {
  toFake: [
    "setTimeout",
    "clearTimeout",
    "requestAnimationFrame",
    "cancelAnimationFrame",
    "performance",
  ],
};

function tick(ms: number, times = 1) {
  for (let i = 0; i < times; i++) act(() => vi.advanceTimersByTime(ms));
}

afterEach(() => {
  vi.useRealTimers();
  uninstallIntersectionObserver();
  unmockReducedMotion();
});

describe("usePrefersReducedMotion", () => {
  it("is false when matchMedia is unavailable", () => {
    expect(prefersReducedMotion()).toBe(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it("reflects the media query", () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });
});

function InViewProbe({ once = true }: { once?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once });
  return <div ref={ref} data-testid="probe" data-in-view={inView} />;
}

describe("useInView", () => {
  it("reports visible when IntersectionObserver is unsupported", () => {
    render(<InViewProbe />);
    expect(screen.getByTestId("probe")).toHaveAttribute("data-in-view", "true");
  });

  it("reports visible immediately with reduced motion", () => {
    installIntersectionObserver();
    mockReducedMotion(true);
    render(<InViewProbe />);
    expect(screen.getByTestId("probe")).toHaveAttribute("data-in-view", "true");
    expect(observers).toHaveLength(0);
  });

  it("switches to visible on intersection and disconnects when once", () => {
    installIntersectionObserver();
    render(<InViewProbe />);
    const probe = screen.getByTestId("probe");
    expect(probe).toHaveAttribute("data-in-view", "false");

    act(() => triggerIntersect(probe, false));
    expect(probe).toHaveAttribute("data-in-view", "false");

    act(() => triggerIntersect(probe));
    expect(probe).toHaveAttribute("data-in-view", "true");
    expect(observers[0].disconnected).toBe(true);
  });

  it("toggles back to hidden when not once", () => {
    installIntersectionObserver();
    render(<InViewProbe once={false} />);
    const probe = screen.getByTestId("probe");
    act(() => triggerIntersect(probe));
    expect(probe).toHaveAttribute("data-in-view", "true");
    act(() => triggerIntersect(probe, false));
    expect(probe).toHaveAttribute("data-in-view", "false");
  });

  it("disconnects on unmount", () => {
    installIntersectionObserver();
    const { unmount } = render(<InViewProbe />);
    unmount();
    expect(observers[0].disconnected).toBe(true);
  });
});

describe("useTypewriter", () => {
  beforeEach(() => vi.useFakeTimers(FAKE));

  it("types, holds, deletes and moves to the next word, looping back", () => {
    const { result } = renderHook(() =>
      useTypewriter(["ab", "c"], { typeMs: 10, deleteMs: 5, holdMs: 100 }),
    );
    expect(result.current).toBe("");
    act(() => vi.advanceTimersByTime(10));
    expect(result.current).toBe("a");
    act(() => vi.advanceTimersByTime(10));
    expect(result.current).toBe("ab");
    act(() => vi.advanceTimersByTime(99));
    expect(result.current).toBe("ab");
    act(() => vi.advanceTimersByTime(1));
    act(() => vi.advanceTimersByTime(5));
    expect(result.current).toBe("a");
    act(() => vi.advanceTimersByTime(5));
    expect(result.current).toBe("");
    act(() => vi.advanceTimersByTime(5));
    act(() => vi.advanceTimersByTime(10));
    expect(result.current).toBe("c");
    act(() => vi.advanceTimersByTime(100));
    act(() => vi.advanceTimersByTime(5));
    act(() => vi.advanceTimersByTime(5));
    act(() => vi.advanceTimersByTime(10));
    expect(result.current).toBe("a");
  });

  it("keeps a single word typed without deleting", () => {
    const { result } = renderHook(() =>
      useTypewriter(["ok"], { typeMs: 10, holdMs: 50 }),
    );
    tick(10, 2);
    expect(result.current).toBe("ok");
    tick(50, 10);
    expect(result.current).toBe("ok");
  });

  it("returns the first word fully with reduced motion", () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useTypewriter(["Full Stack", "Other"]));
    expect(result.current).toBe("Full Stack");
    act(() => vi.advanceTimersByTime(10_000));
    expect(result.current).toBe("Full Stack");
  });

  it("returns an empty string for an empty list", () => {
    const { result } = renderHook(() => useTypewriter([]));
    expect(result.current).toBe("");
  });

  it("restarts when the words change (e.g. language switch)", () => {
    const { result, rerender } = renderHook(
      ({ words }) => useTypewriter(words, { typeMs: 10 }),
      {
        initialProps: { words: ["abc"] },
      },
    );
    tick(10, 2);
    expect(result.current).toBe("ab");
    rerender({ words: ["xyz"] });
    expect(result.current).toBe("");
    act(() => vi.advanceTimersByTime(10));
    expect(result.current).toBe("x");
  });
});

describe("useCountUp", () => {
  beforeEach(() => vi.useFakeTimers(FAKE));

  it("shows the target while inactive and counts up from zero once active", () => {
    const { result, rerender } = renderHook(
      ({ active }) => useCountUp(8, active, 1000),
      {
        initialProps: { active: false },
      },
    );
    expect(result.current).toBe(8);
    rerender({ active: true });
    expect(result.current).toBe(0);
    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBeGreaterThan(0);
    expect(result.current).toBeLessThan(8);
    act(() => vi.advanceTimersByTime(600));
    expect(result.current).toBe(8);
  });

  it("returns the target directly for zero or negative targets", () => {
    expect(renderHook(() => useCountUp(0, true)).result.current).toBe(0);
    expect(renderHook(() => useCountUp(-3, true)).result.current).toBe(-3);
  });

  it("skips the animation with reduced motion", () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useCountUp(42, true));
    expect(result.current).toBe(42);
  });
});

describe("useActiveSection", () => {
  function Sections() {
    const active = useActiveSection(["a", "b"]);
    return (
      <>
        <section id="a" />
        <section id="b" />
        <output data-testid="active">{active ?? "none"}</output>
      </>
    );
  }

  it("returns null when IntersectionObserver is unsupported", () => {
    render(<Sections />);
    expect(screen.getByTestId("active")).toHaveTextContent("none");
  });

  it("tracks the intersecting section", () => {
    installIntersectionObserver();
    render(<Sections />);
    act(() => triggerIntersect(document.getElementById("b")!));
    expect(screen.getByTestId("active")).toHaveTextContent("b");
    act(() => triggerIntersect(document.getElementById("a")!, false));
    expect(screen.getByTestId("active")).toHaveTextContent("b");
    act(() => triggerIntersect(document.getElementById("a")!));
    expect(screen.getByTestId("active")).toHaveTextContent("a");
  });

  it("does nothing when no section exists", () => {
    installIntersectionObserver();
    const { result } = renderHook(() => useActiveSection(["missing"]));
    expect(result.current).toBeNull();
    expect(observers).toHaveLength(0);
  });
});

describe("useTypedText", () => {
  it("types the text one character at a time from the start", () => {
    vi.useFakeTimers(FAKE);
    const { result } = renderHook(() => useTypedText("abc", { charMs: 10 }));
    expect(result.current).toEqual({ typed: "", done: false });
    tick(10);
    expect(result.current.typed).toBe("a");
    tick(10, 2);
    expect(result.current).toEqual({ typed: "abc", done: true });
    tick(10, 3);
    expect(result.current.typed).toBe("abc");
  });

  it("waits until start is true", () => {
    vi.useFakeTimers(FAKE);
    const { result, rerender } = renderHook(
      ({ start }) => useTypedText("ab", { charMs: 10, start }),
      { initialProps: { start: false } },
    );
    tick(10, 5);
    expect(result.current).toEqual({ typed: "", done: false });
    rerender({ start: true });
    tick(10, 2);
    expect(result.current).toEqual({ typed: "ab", done: true });
  });

  it("restarts when the text changes mid-typing", () => {
    vi.useFakeTimers(FAKE);
    const { result, rerender } = renderHook(
      ({ text }) => useTypedText(text, { charMs: 10 }),
      { initialProps: { text: "hello" } },
    );
    tick(10, 2);
    expect(result.current.typed).toBe("he");
    rerender({ text: "bye" });
    expect(result.current.typed).toBe("");
    tick(10, 3);
    expect(result.current).toEqual({ typed: "bye", done: true });
  });

  it("shows the full text at once when the user prefers reduced motion", () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useTypedText("abc", { start: false }));
    expect(result.current).toEqual({ typed: "abc", done: true });
  });

  it("is done immediately for empty text", () => {
    const { result } = renderHook(() => useTypedText(""));
    expect(result.current).toEqual({ typed: "", done: true });
  });
});

describe("slugify", () => {
  it("removes accents, lowercases and joins words with dashes", () => {
    expect(slugify("Infra e DevOps")).toBe("infra-e-devops");
    expect(slugify("  Segurança & LGPD! ")).toBe("seguranca-lgpd");
  });

  it("returns an empty string when nothing is left", () => {
    expect(slugify("!!!")).toBe("");
  });
});
