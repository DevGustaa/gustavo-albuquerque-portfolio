import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createLanguageStore,
  DEFAULT_LOCALE,
  detectLocale,
  isLocale,
  LANGUAGE_STORAGE_KEY,
} from "@/i18n/languageStore";
import { mockNavigatorLanguage } from "./test-utils";

afterEach(() => {
  mockNavigatorLanguage("en-US");
  vi.restoreAllMocks();
});

describe("isLocale", () => {
  it.each(["pt", "en"])("accepts %s", (value) => expect(isLocale(value)).toBe(true));
  it.each(["es", "", "PT", null, undefined, 1])("rejects %s", (value) =>
    expect(isLocale(value)).toBe(false),
  );
});

describe("detectLocale", () => {
  it("prefers the stored locale", () => {
    mockNavigatorLanguage("en-US");
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "pt");
    expect(detectLocale()).toBe("pt");
  });

  it("uses English when the browser language is English", () => {
    mockNavigatorLanguage("en-GB");
    expect(detectLocale()).toBe("en");
  });

  it("falls back to Portuguese for other browser languages", () => {
    mockNavigatorLanguage("es-ES");
    expect(detectLocale()).toBe(DEFAULT_LOCALE);
  });

  it("ignores an invalid stored value", () => {
    mockNavigatorLanguage("fr-FR");
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "klingon");
    expect(detectLocale()).toBe("pt");
  });

  it("handles a missing navigator language", () => {
    mockNavigatorLanguage(undefined);
    expect(detectLocale()).toBe("pt");
  });

  it("falls back when localStorage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    mockNavigatorLanguage("en-US");
    expect(detectLocale()).toBe("en");
  });
});

describe("createLanguageStore", () => {
  it("returns the default locale as the server snapshot", () => {
    mockNavigatorLanguage("en-US");
    expect(createLanguageStore().getServerSnapshot()).toBe("pt");
  });

  it("persists the locale and notifies subscribers", () => {
    const store = createLanguageStore();
    const listener = vi.fn();
    store.subscribe(listener);
    store.setLocale("en");
    expect(store.getSnapshot()).toBe("en");
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("en");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("does not notify when setting the current locale again", () => {
    mockNavigatorLanguage("pt-BR");
    const store = createLanguageStore();
    const listener = vi.fn();
    store.subscribe(listener);
    store.getSnapshot();
    store.setLocale("pt");
    expect(listener).not.toHaveBeenCalled();
  });

  it("ignores invalid locales", () => {
    const store = createLanguageStore();
    store.setLocale("de" as never);
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBeNull();
  });

  it("keeps the choice in memory when localStorage is unavailable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    mockNavigatorLanguage("pt-BR");
    const store = createLanguageStore();
    store.setLocale("en");
    expect(store.getSnapshot()).toBe("en");
  });

  it("stops notifying after unsubscribe", () => {
    const store = createLanguageStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.setLocale("en");
    expect(listener).not.toHaveBeenCalled();
  });

  it("syncs when another tab changes the stored language", () => {
    mockNavigatorLanguage("pt-BR");
    const store = createLanguageStore();
    const listener = vi.fn();
    store.subscribe(listener);
    expect(store.getSnapshot()).toBe("pt");

    localStorage.setItem(LANGUAGE_STORAGE_KEY, "en");
    window.dispatchEvent(new StorageEvent("storage", { key: LANGUAGE_STORAGE_KEY }));

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).toBe("en");
  });

  it("ignores storage events for other keys", () => {
    const store = createLanguageStore();
    const listener = vi.fn();
    store.subscribe(listener);
    window.dispatchEvent(new StorageEvent("storage", { key: "theme" }));
    expect(listener).not.toHaveBeenCalled();
  });
});
