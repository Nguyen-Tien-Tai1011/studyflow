import { act, renderHook } from "@testing-library/react";
import { StrictMode, type ReactNode } from "react";
import { expect, it, vi } from "vitest";
import { StudyProvider, useStudy } from "@/components/dashboard/study-provider";
import { STUDY_STORAGE_KEY } from "@/utils/study-storage";
import { initialTasks } from "@/data/mockData";
import type { StudyState } from "@/types";
import { downloadStudyBackup } from "@/utils/study-backup";

vi.mock("@/utils/study-backup", () => ({ downloadStudyBackup: vi.fn() }));
function wrapper({ children }: { children: ReactNode }) {
  return (
    <StrictMode>
      <StudyProvider>{children}</StudyProvider>
    </StrictMode>
  );
}
const task = {
  title: "Read chapter one",
  subjectId: "programming",
  minutes: 25,
  priority: "Medium" as const,
  due: "today",
};

it.each(["{broken", JSON.stringify({ tasks: [] })])(
  "never overwrites invalid saved data after user actions or remount: %s",
  (raw) => {
    localStorage.setItem(STUDY_STORAGE_KEY, raw);
    const { result, unmount } = renderHook(useStudy, { wrapper });
    expect(result.current.storageStatus).toBe("invalid");
    act(() => result.current.addTask(task));
    expect(result.current.state.tasks).toHaveLength(initialTasks.length + 1);
    expect(localStorage.getItem(STUDY_STORAGE_KEY)).toBe(raw);
    act(() => result.current.exportOriginal());
    expect(downloadStudyBackup).toHaveBeenCalledWith(
      raw,
      expect.stringMatching(/^studyflow-recovery-/),
    );
    unmount();
    const again = renderHook(useStudy, { wrapper });
    expect(again.result.current.storageStatus).toBe("invalid");
    expect(localStorage.getItem(STUDY_STORAGE_KEY)).toBe(raw);
  },
);

it("keeps changes available when saving fails and reports the failure persistently", () => {
  const { result } = renderHook(useStudy, { wrapper });
  const previous = localStorage.getItem(STUDY_STORAGE_KEY);
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("quota");
  });
  act(() => result.current.addTask(task));
  expect(result.current.storageStatus).toBe("unavailable");
  expect(result.current.state.tasks.at(-1)?.title).toBe(task.title);
  expect(localStorage.getItem(STUDY_STORAGE_KEY)).toBe(previous);
});

it("removes only the chosen task and Undo restores its status and position", () => {
  const { result } = renderHook(useStudy, { wrapper });
  const before = result.current.state.tasks;
  const removed = before[1];
  act(() => result.current.removeTask(removed.id));
  expect(result.current.state.tasks).toEqual(
    before.filter((t) => t.id !== removed.id),
  );
  expect(result.current.lastRemovedTask).toEqual(removed);
  act(() => result.current.undoRemoveTask());
  expect(result.current.state.tasks).toEqual(before);
  expect(result.current.lastRemovedTask).toBeNull();
  expect(JSON.parse(localStorage.getItem(STUDY_STORAGE_KEY)!).tasks).toEqual(
    before,
  );
});

it("reuses duplicate subject names and restores custom tasks, sessions and recents", () => {
  const { result, unmount } = renderHook(useStudy, { wrapper });
  let customId = "";
  act(() => {
    customId = result.current.createSubject(
      "  Japanese   N3  ",
      "Languages",
    )!.id;
  });
  act(() => {
    expect(result.current.createSubject("japanese n3", "Other")!.id).toBe(
      customId,
    );
  });
  act(() => result.current.addTask({ ...task, subjectId: customId }));
  act(() => result.current.logSession(customId, "Read chapter one", 2));
  const saved: StudyState = JSON.parse(
    localStorage.getItem(STUDY_STORAGE_KEY)!,
  );
  expect(saved.subjects.filter((s) => s.id === customId)).toHaveLength(1);
  unmount();
  const again = renderHook(useStudy, { wrapper });
  expect(again.result.current.state).toEqual(saved);
  expect(again.result.current.state.recentSubjectIds[0]).toBe(customId);
  expect(
    again.result.current.activeSubjects.find((s) => s.id === customId)?.name,
  ).toBe("Japanese N3");
});

it("keeps the timer's selected subject available after removing its only task", () => {
  const { result } = renderHook(useStudy, { wrapper });
  const python = result.current.subjects.find((s) => s.name === "Python")!;
  act(() => result.current.addTask({ ...task, subjectId: python.id }));
  const id = result.current.state.tasks.at(-1)!.id;
  act(() => result.current.selectStudy(python.id, task.title));
  act(() => result.current.removeTask(id));
  expect(result.current.focus.subject).toBe(python.id);
  expect(result.current.activeSubjects.some((s) => s.id === python.id)).toBe(
    true,
  );
});
