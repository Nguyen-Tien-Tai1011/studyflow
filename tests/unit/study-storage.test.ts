import { describe, expect, it } from "vitest";
import { initialGoals, initialSessions, initialTasks } from "@/data/mockData";
import { defaultSubjects, newSubject } from "@/data/subject-catalog";
import {
  readStudyStorage,
  restoreStudyState,
  STUDY_STORAGE_KEY,
} from "@/utils/study-storage";

const legacy = () =>
  structuredClone({
    tasks: initialTasks,
    sessions: initialSessions,
    goals: initialGoals,
  });

describe("saved workspaces", () => {
  it("migrates the existing format without losing work", () => {
    const saved = legacy();
    saved.tasks[0].status = "Completed";
    saved.goals[0].current = 19;
    const result = restoreStudyState(saved)!;
    expect(result.tasks).toEqual(saved.tasks);
    expect(result.sessions).toEqual(saved.sessions);
    expect(result.goals).toEqual(saved.goals);
    expect(result.subjects.length).toBeGreaterThan(4);
    expect(result.recentSubjectIds).toEqual([]);
  });

  it("restores custom subjects and their task and session relationships", () => {
    const subject = newSubject("custom-n3", "Japanese N3", "Languages", true);
    const saved = {
      ...legacy(),
      subjects: [...defaultSubjects, subject],
      recentSubjectIds: [subject.id],
    };
    saved.tasks[0].subjectId = subject.id;
    saved.sessions[0].subjectId = subject.id;
    const result = restoreStudyState(JSON.parse(JSON.stringify(saved)))!;
    expect(result.subjects.find((s) => s.id === subject.id)).toEqual(subject);
    expect(result.tasks[0].subjectId).toBe(subject.id);
    expect(result.sessions[0].subjectId).toBe(subject.id);
    expect(result.recentSubjectIds).toEqual([subject.id]);
  });

  it("merges normalized duplicate names and remaps every reference", () => {
    const saved = {
      ...legacy(),
      subjects: [newSubject("duplicate-python", "  PYTHON  ", "Other", true)],
      recentSubjectIds: ["duplicate-python", "missing", "duplicate-python"],
    };
    saved.tasks[0].subjectId = "duplicate-python";
    saved.sessions[0].subjectId = "duplicate-python";
    const result = restoreStudyState(saved)!;
    const python = defaultSubjects.find((s) => s.name === "Python")!;
    expect(result.tasks[0].subjectId).toBe(python.id);
    expect(result.sessions[0].subjectId).toBe(python.id);
    expect(result.recentSubjectIds).toEqual([python.id]);
    expect(
      result.subjects.filter((s) => s.name.toLowerCase().trim() === "python"),
    ).toHaveLength(1);
  });

  it("preserves saved subject progress instead of resetting it to sample data", () => {
    const result = restoreStudyState({
      ...legacy(),
      subjects: [{ ...defaultSubjects[0], progress: 90 }],
    })!;
    expect(result.subjects[0].progress).toBe(90);
  });

  it.each([
    "{broken",
    "",
    "null",
    JSON.stringify({
      ...legacy(),
      tasks: [{ ...initialTasks[0], subjectId: "unknown" }],
    }),
  ])("keeps invalid original bytes intact: %s", (raw) => {
    localStorage.setItem(STUDY_STORAGE_KEY, raw);
    expect(readStudyStorage(localStorage)).toEqual({
      status: "invalid",
      state: null,
      original: raw,
    });
    expect(localStorage.getItem(STUDY_STORAGE_KEY)).toBe(raw);
  });

  it("distinguishes missing data from inaccessible browser storage", () => {
    expect(readStudyStorage(localStorage).status).toBe("ready");
    expect(
      readStudyStorage({
        getItem: () => {
          throw new Error("blocked");
        },
      }).status,
    ).toBe("unavailable");
  });
});
