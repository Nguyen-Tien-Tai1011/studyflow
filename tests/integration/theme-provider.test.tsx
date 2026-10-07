import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { StrictMode } from "react";
import { ThemeProvider, useTheme } from "@/components/theme/theme-provider";
import { THEME_STORAGE_KEY } from "@/utils/theme";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete document.documentElement.dataset.theme;
});
function os(dark = false) {
  const events = new EventTarget();
  const media = {
    matches: dark,
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
  };
  vi.stubGlobal("matchMedia", () => media);
  return (value: boolean) =>
    act(() => {
      media.matches = value;
      events.dispatchEvent(new Event("change"));
    });
}
function Controls() {
  const { preference, resolved, setTheme, storageError } = useTheme();
  return (
    <>
      <output>
        {preference}:{resolved}
      </output>
      {(["light", "dark", "system"] as const).map((value) => (
        <button key={value} onClick={() => setTheme(value)}>
          {value}
        </button>
      ))}
      {storageError && <p>Cannot save preference</p>}
    </>
  );
}
function mount() {
  return render(
    <StrictMode>
      <ThemeProvider>
        <Controls />
      </ThemeProvider>
    </StrictMode>,
  );
}

it("follows OS changes only in system mode and keeps study data untouched", () => {
  const changeOS = os();
  localStorage.setItem("studyflow-v1", "original-study-data");
  mount();
  expect(screen.getByRole("status").textContent).toBe("system:light");
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  changeOS(true);
  expect(document.documentElement.dataset.theme).toBe("dark");
  fireEvent.click(screen.getByText("light", { selector: "button" }));
  changeOS(false);
  changeOS(true);
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  fireEvent.click(screen.getByText("system", { selector: "button" }));
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(localStorage.getItem("studyflow-v1")).toBe("original-study-data");
});

it("restores saved preference, synchronizes tabs and cleans up listeners", () => {
  const changeOS = os(true);
  localStorage.setItem(THEME_STORAGE_KEY, "light");
  const { unmount } = mount();
  expect(document.documentElement.dataset.theme).toBe("light");
  act(() =>
    window.dispatchEvent(
      new StorageEvent("storage", { key: THEME_STORAGE_KEY, newValue: "dark" }),
    ),
  );
  expect(screen.getByRole("status").textContent).toBe("dark:dark");
  act(() =>
    window.dispatchEvent(
      new StorageEvent("storage", { key: THEME_STORAGE_KEY, newValue: null }),
    ),
  );
  expect(screen.getByRole("status").textContent).toBe("system:dark");
  unmount();
  changeOS(false);
  expect(document.documentElement.dataset.theme).toBe("dark");
});

it("keeps switching usable when localStorage reads and writes fail", () => {
  os(true);
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  mount();
  expect(document.documentElement.dataset.theme).toBe("dark");
  fireEvent.click(screen.getByText("light", { selector: "button" }));
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(screen.getByText("Cannot save preference")).toBeTruthy();
});
