import { act, renderHook } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { useFocusTimer } from "@/components/dashboard/use-focus-timer";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-06T09:00:00Z"));
});
function setup() {
  const log = vi.fn();
  const notify = vi.fn();
  return { ...renderHook(() => useFocusTimer(log, notify)), log, notify };
}
it("logs a completed Pomodoro exactly once, including repeated finish attempts", () => {
  const { result, log } = setup();
  act(() => result.current.toggle());
  act(() => vi.advanceTimersByTime(25 * 60_000));
  act(() => {
    result.current.finish();
    result.current.finish();
    vi.advanceTimersByTime(60_000);
  });
  expect(log).toHaveBeenCalledTimes(1);
  expect(log).toHaveBeenCalledWith("programming", "Practice C Arrays", 25);
  expect(result.current.running).toBe(false);
});
it("does not count paused time and saves an early custom-subject session once", () => {
  const { result, log } = setup();
  act(() => result.current.select("custom-n3", "Read Japanese"));
  act(() => result.current.toggle());
  act(() => vi.advanceTimersByTime(60_000));
  act(() => result.current.toggle());
  act(() => vi.advanceTimersByTime(5 * 60_000));
  expect(result.current.remaining).toBe(1440);
  act(() => result.current.toggle());
  act(() => vi.advanceTimersByTime(60_000));
  act(() => {
    result.current.finish();
    result.current.finish();
  });
  expect(log).toHaveBeenCalledTimes(1);
  expect(log).toHaveBeenCalledWith("custom-n3", "Read Japanese", 2);
});
it("uses the deadline after a suspended tab, not the number of interval ticks", () => {
  const { result, log } = setup();
  act(() => result.current.toggle());
  act(() => {
    vi.setSystemTime(new Date("2026-10-06T09:30:00Z"));
    vi.advanceTimersByTime(250);
  });
  expect(result.current.remaining).toBe(0);
  expect(log).toHaveBeenCalledTimes(1);
});
it("does not record a break or a session shorter than one minute", () => {
  const { result, log, notify } = setup();
  act(() => result.current.toggle());
  act(() => vi.advanceTimersByTime(59_000));
  act(() => result.current.finish());
  expect(log).not.toHaveBeenCalled();
  act(() => result.current.changeMode(1));
  act(() => result.current.toggle());
  act(() => vi.advanceTimersByTime(5 * 60_000));
  expect(log).not.toHaveBeenCalled();
  expect(notify).toHaveBeenCalledWith(
    "Break complete. Ready for a fresh start?",
  );
});
