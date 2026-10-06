import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { ThemeSettings } from "@/components/theme/theme-settings";
import { THEME_STORAGE_KEY } from "@/utils/theme";

afterEach(() => {
  vi.unstubAllGlobals();
  delete document.documentElement.dataset.theme;
});
it("synchronizes the settings choices and navigation menu, with Escape restoring focus", () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  render(
    <ThemeProvider>
      <ThemeSwitcher />
      <ThemeSettings />
    </ThemeProvider>,
  );
  fireEvent.click(screen.getByRole("radio", { name: "Tối" }));
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  const trigger = screen.getByRole("button", { name: "Đổi giao diện: Tối" });
  fireEvent.click(trigger);
  expect(
    screen
      .getAllByRole("radio", { name: "Tối" })
      .every((el) => (el as HTMLInputElement).checked),
  ).toBe(true);
  fireEvent.keyDown(document.activeElement!, { key: "Escape" });
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(trigger);
});

