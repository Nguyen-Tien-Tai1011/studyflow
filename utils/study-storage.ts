import { initialGoals } from "@/data/mockData";
import {
  cleanSubjectName,
  defaultSubjects,
  subjectNameKey,
} from "@/data/subject-catalog";
import type { StudyState, Subject } from "@/types";

export const STUDY_STORAGE_KEY = "studyflow-v1";
function isSubject(value: unknown): value is Subject {
  if (!value || typeof value !== "object") return false;
  const s = value as Subject;
  return (
    typeof s.id === "string" &&
    !!s.id &&
    typeof s.name === "string" &&
    !!s.name.trim() &&
    typeof s.category === "string" &&
    typeof s.isCustom === "boolean" &&
    typeof s.description === "string" &&
    ["Beginner", "Intermediate"].includes(s.level) &&
    typeof s.color === "string" &&
    [s.progress, s.minutes, s.lessons, s.totalLessons].every(
      (n) => Number.isFinite(n) && n >= 0,
    ) &&
    s.progress <= 100 &&
    (s.createdAt === undefined || typeof s.createdAt === "string")
  );
}

/** Extend the existing storage format without discarding tasks, sessions, or goals. */
export function restoreStudyState(value: unknown): StudyState | null {
  if (!value || typeof value !== "object") return null;
  const v = value as StudyState;
  if (
    v.subjects !== undefined &&
    (!Array.isArray(v.subjects) || !v.subjects.every(isSubject))
  )
    return null;
  const subjects = [...defaultSubjects];
  const idAliases = new Map<string, string>();
  for (const saved of v.subjects ?? []) {
    const match = subjects.find(
      (s) =>
        s.id === saved.id ||
        subjectNameKey(s.name) === subjectNameKey(saved.name),
    );
    if (match) {
      idAliases.set(saved.id, match.id);
      if (match.id === saved.id)
        subjects[subjects.indexOf(match)] = {
          ...saved,
          name: cleanSubjectName(saved.name),
        };
    } else subjects.push({ ...saved, name: cleanSubjectName(saved.name) });
  }
  const ids = new Set(subjects.map((s) => s.id));
  const resolveId = (id: string) => idAliases.get(id) ?? id;
  if (
    !Array.isArray(v.tasks) ||
    !v.tasks.every(
      (t) =>
        t &&
        typeof t.id === "string" &&
        typeof t.title === "string" &&
        ids.has(resolveId(t.subjectId)) &&
        ["Not started", "In progress", "Completed"].includes(t.status) &&
        ["High", "Medium", "Low"].includes(t.priority) &&
        typeof t.due === "string" &&
        Number.isFinite(t.minutes) &&
        t.minutes > 0,
    ) ||
    !Array.isArray(v.sessions) ||
    !v.sessions.every(
      (s) =>
        s &&
        typeof s.id === "string" &&
        ids.has(resolveId(s.subjectId)) &&
        typeof s.topic === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(s.date) &&
        Number.isFinite(s.minutes) &&
        s.minutes > 0,
    ) ||
    !Array.isArray(v.goals) ||
    !initialGoals.every((required) =>
      v.goals.some((g) => g?.id === required.id),
    ) ||
    !v.goals.every(
      (g) =>
        g &&
        typeof g.id === "string" &&
        typeof g.title === "string" &&
        typeof g.unit === "string" &&
        Number.isFinite(g.current) &&
        g.current >= 0 &&
        Number.isFinite(g.target) &&
        g.target > 0,
    )
  )
    return null;
  const recentSubjectIds = Array.isArray(v.recentSubjectIds)
    ? [
        ...new Set(
          v.recentSubjectIds
            .filter((id) => typeof id === "string")
            .map(resolveId),
        ),
      ]
        .filter((id) => ids.has(id))
        .slice(0, 5)
    : [];
  return {
    subjects,
    recentSubjectIds,
    tasks: v.tasks.map((t) => ({ ...t, subjectId: resolveId(t.subjectId) })),
    sessions: v.sessions.map((s) => ({
      ...s,
      subjectId: resolveId(s.subjectId),
    })),
    goals: v.goals,
  };
}

export type StoredStudyData =
  | { status: "ready"; state: StudyState | null; original: null }
  | { status: "invalid"; state: null; original: string }
  | { status: "unavailable"; state: null; original: null };

/** Invalid data stays untouched: the caller must not enable autosave. */
export function readStudyStorage(
  storage: Pick<Storage, "getItem">,
): StoredStudyData {
  let raw: string | null;
  try {
    raw = storage.getItem(STUDY_STORAGE_KEY);
  } catch {
    return { status: "unavailable", state: null, original: null };
  }
  if (raw === null) return { status: "ready", state: null, original: null };
  try {
    const state = restoreStudyState(JSON.parse(raw));
    return state
      ? { status: "ready", state, original: null }
      : { status: "invalid", state: null, original: raw };
  } catch {
    return { status: "invalid", state: null, original: raw };
  }
}
