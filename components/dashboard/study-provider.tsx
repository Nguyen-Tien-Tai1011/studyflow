"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { initialTasks, initialSessions, initialGoals } from "@/data/mockData";
import type { StudyState, Subject, SubjectId, Task } from "@/types";
import {
  activeSubjects,
  cleanSubjectName,
  defaultSubjects,
  newSubject,
  recentSubjectsAfterUse,
  subjectNameKey,
} from "@/data/subject-catalog";
import {
  readStudyStorage,
  STUDY_STORAGE_KEY,
  type StoredStudyData,
} from "@/utils/study-storage";
import { downloadStudyBackup } from "@/utils/study-backup";
import { localDate } from "@/utils/format";
import { useFocusTimer } from "./use-focus-timer";
import { useStudyWebMcp } from "./use-study-webmcp";
const initial: StudyState = {
  subjects: defaultSubjects,
  recentSubjectIds: [],
  tasks: initialTasks,
  sessions: initialSessions,
  goals: initialGoals,
};
type Context = {
  storageStatus: "loading" | StoredStudyData["status"];
  exportBackup: () => void;
  exportOriginal: () => void;
  subjects: Subject[];
  activeSubjects: Subject[];
  createSubject: (name: string, category: string) => Subject | null;
  state: StudyState;
  ready: boolean;
  notice: string;
  notify: (message: string) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  undoRemoveTask: () => void;
  lastRemovedTask: Task | null;
  addTask: (task: Omit<Task, "id" | "status">) => void;
  updateGoal: (id: string, current: number, target: number) => void;
  logSession: (subjectId: SubjectId, topic: string, minutes: number) => void;
  focus: ReturnType<typeof useFocusTimer>;
  selectStudy: (id: SubjectId, topic?: string) => void;
};
const StudyContext = createContext<Context | null>(null);
export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StudyState>(initial);
  const [ready, setReady] = useState(false);
  const [storageStatus, setStorageStatus] =
    useState<Context["storageStatus"]>("loading");
  const [originalData, setOriginalData] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [removedTasks, setRemovedTasks] = useState<
    { task: Task; index: number }[]
  >([]);
  const notify = useCallback((message: string) => setNotice(message), []);
  // Hydrate browser-only persistence after the server-rendered sample is mounted.
  /* eslint-disable react-hooks/set-state-in-effect -- Synchronizing browser storage after SSR hydration. */
  useEffect(() => {
    try {
      const stored = readStudyStorage(localStorage);
      if (stored.state) setState(stored.state);
      setStorageStatus(stored.status);
      setOriginalData(stored.original);
    } catch {
      setStorageStatus("unavailable");
    }
    setReady(true);
  }, []);
  // Surface an external storage failure; this is not derived application state.
  useEffect(() => {
    if (ready && storageStatus === "ready") {
      try {
        localStorage.setItem(STUDY_STORAGE_KEY, JSON.stringify(state));
      } catch {
        setStorageStatus("unavailable");
        setNotice(
          "Your browser could not save these changes. They are available for this visit.",
        );
      }
    }
  }, [state, ready, storageStatus]);
  /* eslint-enable react-hooks/set-state-in-effect */
  useStudyWebMcp(state, setState, ready);
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timeout);
  }, [notice]);
  const toggleTask = (id: string) =>
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "Completed" ? "Not started" : "Completed",
            }
          : t,
      ),
    }));
  const createSubject: Context["createSubject"] = (name, category) => {
    const cleaned = cleanSubjectName(name);
    if (!cleaned || cleaned.length > 80 || !ready) return null;
    const existing = state.subjects.find(
      (s) => subjectNameKey(s.name) === subjectNameKey(cleaned),
    );
    if (existing) return existing;
    const subject = {
      ...newSubject(crypto.randomUUID(), cleaned, category, true),
      createdAt: new Date().toISOString(),
    };
    setState((previous) => ({
      ...previous,
      subjects: [...previous.subjects, subject],
    }));
    return subject;
  };
  const addTask: Context["addTask"] = (task) => {
    if (!ready || !state.subjects.some((s) => s.id === task.subjectId)) return;
    setState((prev) => ({
      ...prev,
      recentSubjectIds: recentSubjectsAfterUse(
        prev.recentSubjectIds,
        task.subjectId,
      ),
      tasks: [
        ...prev.tasks,
        { ...task, id: crypto.randomUUID(), status: "Not started" },
      ],
    }));
    notify("Added to your study plan. One step at a time.");
  };
  const removeTask = (id: string) => {
    const index = state.tasks.findIndex((task) => task.id === id);
    if (index === -1 || !ready) return;
    setRemovedTasks((previous) => [
      ...previous,
      { task: state.tasks[index], index },
    ]);
    setState((previous) => ({
      ...previous,
      tasks: previous.tasks.filter((task) => task.id !== id),
    }));
  };
  const undoRemoveTask = () => {
    const removed = removedTasks.at(-1);
    if (!removed) return;
    setState((previous) => {
      if (previous.tasks.some((task) => task.id === removed.task.id))
        return previous;
      const tasks = [...previous.tasks];
      tasks.splice(removed.index, 0, removed.task);
      return { ...previous, tasks };
    });
    setRemovedTasks((previous) => previous.slice(0, -1));
    notify(`Restored “${removed.task.title}” to your study plan.`);
  };
  const updateGoal: Context["updateGoal"] = (id, current, target) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id ? { ...g, current, target } : g,
      ),
    }));
    notify("Your goal has been updated.");
  };
  const logSession: Context["logSession"] = useCallback(
    (subjectId, topic, minutes) => {
      setState((prev) => ({
        ...prev,
        recentSubjectIds: recentSubjectsAfterUse(
          prev.recentSubjectIds,
          subjectId,
        ),
        sessions: [
          {
            id: crypto.randomUUID(),
            subjectId,
            topic: topic.trim() || "Focus session",
            minutes,
            date: localDate(),
          },
          ...prev.sessions,
        ],
        goals: prev.goals.map((g) =>
          g.id === "hours" || (g.id === "math" && subjectId === "calculus")
            ? { ...g, current: g.current + minutes / 60 }
            : g,
        ),
      }));
      notify(
        `Nice work! ${minutes} focused minute${minutes === 1 ? "" : "s"} saved.`,
      );
    },
    [notify],
  );
  const focus = useFocusTimer(logSession, notify);
  const selectStudy: Context["selectStudy"] = (
    subjectId,
    topic = "Independent study",
  ) => {
    focus.select(subjectId, topic);
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.title === topic && t.status !== "Completed"
          ? { ...t, status: "In progress" }
          : t,
      ),
    }));
    document
      .getElementById("focus")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    notify("Your session is ready. Press Start when you’re ready to focus.");
  };
  return (
    <StudyContext.Provider
      value={{
        storageStatus,
        exportBackup: () =>
          downloadStudyBackup(
            JSON.stringify(state, null, 2),
            `studyflow-backup-${localDate()}.json`,
          ),
        exportOriginal: () => {
          if (originalData !== null)
            downloadStudyBackup(
              originalData,
              `studyflow-recovery-${localDate()}.json`,
            );
        },
        state,
        subjects: state.subjects,
        activeSubjects: activeSubjects(state.subjects, [
          focus.subject,
          ...state.recentSubjectIds,
          ...[...state.tasks, ...state.sessions].map((item) => item.subjectId),
        ]),
        createSubject,
        ready,
        notice,
        notify,
        toggleTask,
        removeTask,
        undoRemoveTask,
        lastRemovedTask: removedTasks.at(-1)?.task ?? null,
        addTask,
        updateGoal,
        logSession,
        focus,
        selectStudy,
      }}
    >
      {children}
      <div className={`toast ${notice ? "visible" : ""}`} role="status">
        {notice}
      </div>
    </StudyContext.Provider>
  );
}
export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) throw new Error("StudyProvider is required");
  return context;
}
