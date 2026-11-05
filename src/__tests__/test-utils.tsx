import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { LanguageProvider } from "@/i18n/LanguageProvider";

export function renderWithLanguage(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: LanguageProvider, ...options });
}

export function mockNavigatorLanguage(language: string | undefined) {
  Object.defineProperty(window.navigator, "language", { value: language, configurable: true });
}

type ObserverRecord = {
  callback: IntersectionObserverCallback;
  elements: Set<Element>;
  options?: IntersectionObserverInit;
  disconnected: boolean;
};

export const observers: ObserverRecord[] = [];

export function installIntersectionObserver() {
  observers.length = 0;
  class MockIntersectionObserver {
    record: ObserverRecord;
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      this.record = { callback, elements: new Set(), options, disconnected: false };
      observers.push(this.record);
    }
    observe(element: Element) {
      this.record.elements.add(element);
    }
    unobserve(element: Element) {
      this.record.elements.delete(element);
    }
    disconnect() {
      this.record.disconnected = true;
      this.record.elements.clear();
    }
    takeRecords() {
      return [];
    }
  }
  Object.defineProperty(window, "IntersectionObserver", {
    value: MockIntersectionObserver,
    configurable: true,
    writable: true,
  });
}

export function uninstallIntersectionObserver() {
  observers.length = 0;
  Reflect.deleteProperty(window, "IntersectionObserver");
}

export function triggerIntersect(element: Element, isIntersecting = true) {
  for (const record of observers) {
    if (!record.elements.has(element)) continue;
    record.callback(
      [{ target: element, isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  }
}

export function mockReducedMotion(reduce: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: reduce && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

export function unmockReducedMotion() {
  Reflect.deleteProperty(window, "matchMedia");
}
