import { act, renderHook } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import {
  CUSTOM_MODE,
  useFocusTimer,
} from "@/components/dashboard/use-focus-timer";

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

it("records the custom duration once and restarts with the same duration", () => {
  const { result, log } = setup();
  act(() => result.current.changeMode(CUSTOM_MODE));
  act(() => result.current.applyCustomMinutes(40));
  expect(result.current.remaining).toBe(2400);
  act(() => result.current.toggle());
  act(() => vi.advanceTimersByTime(40 * 60_000));
  act(() => result.current.finish());
  expect(log).toHaveBeenCalledTimes(1);
  expect(log).toHaveBeenCalledWith("programming", "Practice C Arrays", 40);
  act(() => result.current.toggle());
  expect(result.current.remaining).toBe(2400);
  act(() => vi.advanceTimersByTime(40 * 60_000));
  expect(log).toHaveBeenCalledTimes(2);
});

it("locks custom duration while running or paused, and saves only studied minutes", () => {
  const { result, log } = setup();
  act(() => result.current.changeMode(CUSTOM_MODE));
  act(() => result.current.applyCustomMinutes(45));
  act(() => result.current.toggle());
  act(() => result.current.applyCustomMinutes(10));
  expect(result.current.duration).toBe(2700);
  act(() => vi.advanceTimersByTime(90_000));
  act(() => result.current.toggle());
  act(() => result.current.applyCustomMinutes(10));
  act(() => vi.advanceTimersByTime(5 * 60_000));
  expect(result.current.remaining).toBe(2610);
  act(() => result.current.toggle());
  act(() => vi.advanceTimersByTime(30_000));
  act(() => result.current.finish());
  expect(log).toHaveBeenCalledWith("programming", "Practice C Arrays", 2);
  expect(result.current.remaining).toBe(2700);
  expect(result.current.running).toBe(false);
});

it("validates custom limits, preserves the choice across modes, and resets it correctly", () => {
  const { result, log } = setup();
  act(() => result.current.changeMode(CUSTOM_MODE));
  for (const invalid of [0, -1, 181, 1.5, NaN, Infinity]) {
    act(() => result.current.applyCustomMinutes(invalid));
    expect(result.current.remaining).toBe(1500);
  }
  act(() => result.current.applyCustomMinutes(180));
  expect(result.current.remaining).toBe(10800);
  act(() => result.current.changeMode(1));
  expect(result.current.remaining).toBe(300);
  act(() => result.current.changeMode(CUSTOM_MODE));
  expect(result.current.remaining).toBe(10800);
  act(() => result.current.toggle());
  act(() => vi.advanceTimersByTime(30_000));
  act(() => result.current.changeMode(CUSTOM_MODE));
  expect(result.current.remaining).toBe(10800);
  expect(result.current.running).toBe(false);
  act(() => result.current.applyCustomMinutes(1));
  act(() => result.current.toggle());
  act(() => vi.advanceTimersByTime(60_000));
  expect(log).toHaveBeenCalledWith("programming", "Practice C Arrays", 1);
});
