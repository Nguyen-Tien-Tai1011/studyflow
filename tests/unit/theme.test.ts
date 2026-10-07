import { afterEach, expect, it, vi } from "vitest";
import {
  parseTheme,
  resolveTheme,
  themeInitScript,
  THEME_STORAGE_KEY,
} from "@/utils/theme";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete document.documentElement.dataset.theme;
  document.documentElement.style.colorScheme = "";
});

it.each([null, "", "unknown", "system", "light", "dark"])(
  "initial script and runtime agree on saved preference %s",
  (saved) => {
    if (saved !== null) localStorage.setItem(THEME_STORAGE_KEY, saved);
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    new Function(themeInitScript)();
    expect(document.documentElement.dataset.theme).toBe(
      resolveTheme(parseTheme(saved), true),
    );
    expect(document.documentElement.style.colorScheme).toBe(
      document.documentElement.dataset.theme,
    );
  },
);

it("uses the system theme even if storage is blocked before first paint", () => {
  vi.stubGlobal("matchMedia", () => ({ matches: true }));
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  expect(() => new Function(themeInitScript)()).not.toThrow();
  expect(document.documentElement.dataset.theme).toBe("dark");
});

it("uses light safely when matchMedia is unavailable", () => {
  vi.stubGlobal("matchMedia", undefined);
  new Function(themeInitScript)();
  expect(document.documentElement.dataset.theme).toBe("light");
});
