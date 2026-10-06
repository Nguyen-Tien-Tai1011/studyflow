"use client";
import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { flushSync } from "react-dom";
import type { StudyState } from "@/types";
interface ModelContext {
  registerTool(
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean };
      execute: (input: unknown) => unknown;
    },
    options: { signal: AbortSignal },
  ): void | Promise<void>;
}
/** Optional progressive enhancement; unsupported browsers keep the same UI. */
export function useStudyWebMcp(
  state: StudyState,
  setState: Dispatch<SetStateAction<StudyState>>,
  ready: boolean,
) {
  const latest = useRef(state);
  useEffect(() => {
    latest.current = state;
  }, [state]);
  useEffect(() => {
    if (!ready) return;
    const context = (document as Document & { modelContext?: ModelContext })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: Parameters<ModelContext["registerTool"]>[0]) => {
      try {
        void Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => {
          /* Optional browser integration must never interrupt study. */
        });
      } catch {
        /* Unsupported experimental implementation. */
      }
    };
    register({
      name: "read_study_plan",
      title: "Read study plan",
      description:
        "Read the current StudyFlow tasks and their completion state. Does not change data.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: () => ({
        tasks: latest.current.tasks.map(
          ({ id, title, subjectId, status, due }) => ({
            id,
            title,
            subjectId,
            status,
            due,
          }),
        ),
      }),
    });
    register({
      name: "set_study_tasks_completed",
      title: "Update task completion",
      description:
        "Mark existing StudyFlow tasks completed or reopen them. Updates this browser’s saved study plan.",
      inputSchema: {
        type: "object",
        properties: {
          taskIds: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
            maxItems: 100,
          },
          completed: { type: "boolean" },
        },
        required: ["taskIds", "completed"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute: (input) => {
        if (!input || typeof input !== "object")
          throw new Error("Expected taskIds and completed.");
        const data = input as { taskIds?: unknown; completed?: unknown };
        if (
          !Array.isArray(data.taskIds) ||
          !data.taskIds.length ||
          data.taskIds.length > 100 ||
          data.taskIds.some(
            (id) =>
              typeof id !== "string" ||
              !latest.current.tasks.some((t) => t.id === id),
          ) ||
          typeof data.completed !== "boolean"
        )
          throw new Error(
            "Provide existing task IDs and a boolean completed value.",
          );
        const ids = new Set(data.taskIds);
        const status = data.completed
          ? ("Completed" as const)
          : ("Not started" as const);
        flushSync(() =>
          setState((prev) => ({
            ...prev,
            tasks: prev.tasks.map((task) =>
              ids.has(task.id) ? { ...task, status } : task,
            ),
          })),
        );
        return {
          tasks: latest.current.tasks
            .filter((t) => ids.has(t.id))
            .map(({ id, status }) => ({ id, status })),
        };
      },
    });
    return () => lifecycle.abort();
  }, [ready, setState]);
}
