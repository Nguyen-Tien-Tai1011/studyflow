"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { initialTasks, initialSessions, initialGoals } from "@/data/mockData";
import type { StudyState, SubjectId, Task } from "@/types";
import { localDate } from "@/utils/format";
import { useFocusTimer } from "./use-focus-timer";
import { useStudyWebMcp } from "./use-study-webmcp";
const initial: StudyState = {
  tasks: initialTasks,
  sessions: initialSessions,
  goals: initialGoals,
};
type Context = {
  state: StudyState;
  ready: boolean;
  notice: string;
  notify: (message: string) => void;
  toggleTask: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "status">) => void;
  updateGoal: (id: string, current: number, target: number) => void;
  logSession: (subjectId: SubjectId, topic: string, minutes: number) => void;
  focus: ReturnType<typeof useFocusTimer>;
  selectStudy: (id: SubjectId, topic?: string) => void;
};
const StudyContext = createContext<Context | null>(null);
function validState(value: unknown): value is StudyState {
  if (!value || typeof value !== "object") return false;
  const v = value as StudyState;
  const ids = ["programming", "database", "calculus", "dsa"];
  return (
    Array.isArray(v.tasks) &&
    v.tasks.every(
      (t) =>
        t &&
        typeof t.id === "string" &&
        typeof t.title === "string" &&
        ids.includes(t.subjectId) &&
        ["Not started", "In progress", "Completed"].includes(t.status) &&
        ["High", "Medium", "Low"].includes(t.priority) &&
        typeof t.due === "string" &&
        Number.isFinite(t.minutes) &&
        t.minutes > 0,
    ) &&
    Array.isArray(v.sessions) &&
    v.sessions.every(
      (s) =>
        s &&
        typeof s.id === "string" &&
        ids.includes(s.subjectId) &&
        typeof s.topic === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(s.date) &&
        Number.isFinite(s.minutes) &&
        s.minutes > 0,
    ) &&
    Array.isArray(v.goals) &&
    initialGoals.every((required) =>
      v.goals.some((goal) => goal?.id === required.id),
    ) &&
    v.goals.every(
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
  );
}
export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StudyState>(initial);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const notify = useCallback((message: string) => setNotice(message), []);
  // Hydrate browser-only persistence after the server-rendered sample is mounted.
  /* eslint-disable react-hooks/set-state-in-effect -- Synchronizing browser storage after SSR hydration. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("studyflow-v1");
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (validState(parsed)) setState(parsed);
        else
          setNotice(
            "Saved data could not be restored. Your sample workspace is ready.",
          );
      }
    } catch {
      setNotice(
        "Browser storage is unavailable. Changes will last for this visit.",
      );
    }
    setReady(true);
  }, []);
  // Surface an external storage failure; this is not derived application state.
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("studyflow-v1", JSON.stringify(state));
      } catch {
        setNotice(
          "Your browser could not save these changes. They are available for this visit.",
        );
      }
    }
  }, [state, ready]);
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
  const addTask: Context["addTask"] = (task) => {
    setState((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        { ...task, id: crypto.randomUUID(), status: "Not started" },
      ],
    }));
    notify("Added to your study plan. One step at a time.");
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
        state,
        ready,
        notice,
        notify,
        toggleTask,
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
