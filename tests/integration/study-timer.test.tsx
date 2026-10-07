import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { StudyProvider } from "@/components/dashboard/study-provider";
import { StudyTimer } from "@/components/dashboard/study-timer";

it("applies custom minutes, prevents mid-session edits, and retains the applied duration after navigation", () => {
  vi.useFakeTimers();
  const view = (show: boolean) => (
    <StudyProvider>{show ? <StudyTimer /> : <p>Another page</p>}</StudyProvider>
  );
  const { rerender } = render(view(true));
  fireEvent.click(screen.getByRole("tab", { name: "Custom" }));
  const minutes = screen.getByRole("spinbutton", {
    name: "Duration (minutes)",
  });
  fireEvent.change(minutes, { target: { value: "45" } });
  fireEvent.click(screen.getByRole("button", { name: "Apply" }));
  expect(screen.getByRole("timer").textContent).toBe("45:00");
  fireEvent.click(screen.getByRole("button", { name: "Start session" }));
  act(() => vi.advanceTimersByTime(1000));
  expect(
    (screen.getByRole("spinbutton", { name: "Duration (minutes)" }) as HTMLInputElement).disabled,
  ).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Pause session" }));
  expect(
    (screen.getByRole("button", { name: "Apply" }) as HTMLButtonElement)
      .disabled,
  ).toBe(true);
  rerender(view(false));
  rerender(view(true));
  expect(screen.getByRole("timer").textContent).toBe("44:59");
  expect(
    (
      screen.getByRole("spinbutton", {
        name: "Duration (minutes)",
      }) as HTMLInputElement
    ).value,
  ).toBe("45");
  fireEvent.click(screen.getByRole("button", { name: "Reset timer" }));
  expect(screen.getByRole("timer").textContent).toBe("45:00");
  expect(
    (screen.getByRole("button", { name: "Apply" }) as HTMLButtonElement)
      .disabled,
  ).toBe(false);
});
