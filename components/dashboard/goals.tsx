"use client";
import Link from "next/link";
import { useState } from "react";
import { Target, Pencil, Check, CalendarDays, Plus } from "lucide-react";
import { useStudy } from "./study-provider";
import { Progress, SectionHeading } from "@/components/ui/primitives";
import { dateLabel } from "@/utils/format";
import { AddTask } from "./overview";
export function StudyGoals({ editable = false }: { editable?: boolean }) {
  const { state, updateGoal } = useStudy();
  const [edit, setEdit] = useState("");
  return (
    <section className="panel goals-panel">
      <SectionHeading
        title="Weekly goals"
        sub="A direction to work toward, at your own pace."
      >
        {!editable && (
          <Link href="/goals" className="text-button">
            Manage goals
          </Link>
        )}
      </SectionHeading>
      <div className="goals-list">
        {state.goals.map((g, i) => (
          <article key={g.id} className="goal-row">
            <div className="goal-top">
              <span className="goal-title">
                <Target size={15} />
                {g.title}
              </span>
              {editable && (
                <button
                  className="icon-button"
                  aria-label={`Edit ${g.title}`}
                  onClick={() => setEdit(edit === g.id ? "" : g.id)}
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>
            {edit === g.id ? (
              <form
                className="goal-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const d = new FormData(e.currentTarget);
                  updateGoal(
                    g.id,
                    Number(d.get("current")),
                    Number(d.get("target")),
                  );
                  setEdit("");
                }}
              >
                <label>
                  Progress ({g.unit})
                  <input
                    name="current"
                    type="number"
                    min="0"
                    max="10000"
                    step="0.01"
                    defaultValue={Number(g.current.toFixed(2))}
                    required
                  />
                </label>
                <label>
                  Target
                  <input
                    name="target"
                    type="number"
                    min="0.01"
                    max="10000"
                    step="0.01"
                    defaultValue={g.target}
                    required
                  />
                </label>
                <button className="button primary" type="submit">
                  <Check size={15} /> Save
                </button>
              </form>
            ) : (
              <>
                <div className="goal-values">
                  <span>
                    {Number(g.current.toFixed(1))} / {g.target} {g.unit}
                  </span>
                  <strong>{Math.round((g.current / g.target) * 100)}%</strong>
                </div>
                <Progress
                  value={(g.current / g.target) * 100}
                  color={["blue", "purple", "green", "orange"][i]}
                  label={g.title}
                />
              </>
            )}
          </article>
        ))}
      </div>
      <p className="goals-encouragement">
        Progress comes from consistency, not perfection.
      </p>
    </section>
  );
}
export function UpcomingTasks({ expanded = false }: { expanded?: boolean }) {
  const { state, subjects, toggleTask } = useStudy();
  const [adding, setAdding] = useState(false);
  const tasks = state.tasks.filter((t) => t.due !== "today");
  return (
    <section className="panel upcoming-panel">
      <SectionHeading
        title="Upcoming tasks"
        sub={expanded ? "Keep your next steps in sight." : undefined}
      >
        {expanded ? (
          <button className="text-button" onClick={() => setAdding(!adding)}>
            <Plus size={15} /> Add today’s task
          </button>
        ) : (
          <Link href="/goals" className="text-button">
            View all
          </Link>
        )}
      </SectionHeading>
      {adding && <AddTask onClose={() => setAdding(false)} />}
      <div className="upcoming-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            Nothing on the horizon. Enjoy a little time to review.
          </div>
        ) : (
          tasks.map((t) => (
            <article className="upcoming-row" key={t.id}>
              <button
                className={`upcoming-check ${t.status === "Completed" ? "checked" : ""}`}
                aria-label={`${t.status === "Completed" ? "Reopen" : "Complete"} ${t.title}`}
                aria-pressed={t.status === "Completed"}
                onClick={() => toggleTask(t.id)}
              >
                {t.status === "Completed" ? (
                  <Check size={14} />
                ) : (
                  <CalendarDays size={16} />
                )}
              </button>
              <div>
                <h3 className={t.status === "Completed" ? "done-text" : ""}>
                  {t.title}
                </h3>
                <p>{subjects.find((s) => s.id === t.subjectId)?.name}</p>
                <span className="due-date">Due {dateLabel(t.due)}</span>
              </div>
              <span
                className={`badge ${t.priority === "High" ? "orange" : t.priority === "Low" ? "green" : "neutral"}`}
              >
                {t.priority}
              </span>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
