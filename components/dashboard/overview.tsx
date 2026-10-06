"use client";
import {
  Clock3,
  ChartNoAxesCombined,
  Flame,
  CircleCheck,
  TrendingUp,
  CalendarDays,
  Play,
  Plus,
  Sparkles,
  Trash2,
  Undo2,
} from "lucide-react";
import { useState } from "react";
import { useStudy } from "./study-provider";
import { initialSessions } from "@/data/mockData";
import { duration, localDate } from "@/utils/format";
import {
  Progress,
  SectionHeading,
  SubjectIcon,
} from "@/components/ui/primitives";
import { SubjectSelector } from "./subject-selector";
import { StudyTimer } from "./study-timer";
export function Overview() {
  const {
    state,
    subjects,
    ready,
    toggleTask,
    selectStudy,
    removeTask,
    undoRemoveTask,
    lastRemovedTask,
  } = useStudy();
  const [adding, setAdding] = useState(false);
  const todayTasks = state.tasks.filter(
    (t) => t.due === "today" || t.due === (ready ? localDate() : "2026-10-05"),
  );
  const completed = todayTasks.filter((t) => t.status === "Completed").length;
  const added = state.sessions
    .filter(
      (s) =>
        !initialSessions.some((i) => i.id === s.id) && s.date === localDate(),
    )
    .reduce((sum, s) => sum + s.minutes, 0);
  const weeklyGoal = state.goals.find((g) => g.id === "hours")!;
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span /> YOUR LEARNING, IN FLOW
          </div>
          <h1>
            Chào buổi sáng, Minh <span className="wave">☀️</span>
          </h1>
          <p>A fresh day to make a little progress. Let’s make it count.</p>
        </div>
        <div className="heading-actions">
          <span className="date-label">
            <CalendarDays size={16} />{" "}
            {ready
              ? new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })
              : "Monday, October 5"}
          </span>
          <button
            className="button primary"
            onClick={() => selectStudy("programming", "Practice C Arrays")}
          >
            <Play size={15} fill="currentColor" /> Start studying
          </button>
        </div>
      </div>
      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-label">
            Study time today
            <span className="stat-icon blue">
              <Clock3 size={19} />
            </span>
          </div>
          <div className="stat-number">
            {duration(155 + added)}
            <span className="tiny-chart">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          </div>
          <p>
            <span className="positive">
              <TrendingUp size={13} /> +25%
            </span>{" "}
            vs. yesterday · sample baseline
          </p>
        </article>
        <article className="stat-card">
          <div className="stat-label">
            Weekly study time
            <span className="stat-icon purple">
              <ChartNoAxesCombined size={19} />
            </span>
          </div>
          <div className="stat-number">
            {duration(weeklyGoal.current * 60)}
            <span className="stat-unit">/ {weeklyGoal.target}h</span>
          </div>
          <Progress
            value={(weeklyGoal.current / weeklyGoal.target) * 100}
            label="Weekly study goal"
          />
          <p>
            {Math.round((weeklyGoal.current / weeklyGoal.target) * 100)}% of
            your weekly goal
          </p>
        </article>
        <article className="stat-card">
          <div className="stat-label">
            Study streak
            <span className="stat-icon orange">
              <Flame size={19} />
            </span>
          </div>
          <div className="stat-number">
            7 <span className="stat-word">days</span>
            <span className="streak-pill">
              <Flame size={14} /> On a roll
            </span>
          </div>
          <p>
            Personal best: <strong>14 days</strong> · sample streak
          </p>
        </article>
        <article className="stat-card">
          <div className="stat-label">
            Today’s tasks
            <span className="stat-icon green">
              <CircleCheck size={19} />
            </span>
          </div>
          <div className="stat-number">
            {completed}
            <span className="stat-unit">/ {todayTasks.length}</span>
            <span
              className="completion-ring"
              style={
                {
                  "--value": `${todayTasks.length ? (completed / todayTasks.length) * 360 : 0}deg`,
                } as React.CSSProperties
              }
            />
          </div>
          <p>
            <span className="positive">
              {todayTasks.length
                ? Math.round((completed / todayTasks.length) * 100)
                : 0}
              % complete
            </span>{" "}
            — one step closer
          </p>
        </article>
      </div>
      <div className="dashboard-main-grid">
        <div>
          <section className="panel study-plan">
            <SectionHeading
              title="Today’s study plan"
              sub="Small steps today. Big progress tomorrow."
            >
              <button
                className="text-button"
                onClick={() => setAdding(!adding)}
              >
                <Plus size={16} /> Add task
              </button>
            </SectionHeading>
            {adding && <AddTask onClose={() => setAdding(false)} />}
            {lastRemovedTask && (
              <div className="task-removal-notice">
                <p role="status">Removed “{lastRemovedTask.title}”.</p>
                <button
                  type="button"
                  className="undo-task-button"
                  onClick={undoRemoveTask}
                >
                  <Undo2 size={15} aria-hidden="true" /> Undo
                </button>
              </div>
            )}
            <div className="plan-list">
              {todayTasks.length === 0 && (
                <div className="empty-state">
                  No tasks scheduled for today. You’re all caught up — review
                  one of your subjects.
                </div>
              )}
              {todayTasks.map((task) => {
                const subject = subjects.find((s) => s.id === task.subjectId)!;
                return (
                  <article
                    key={task.id}
                    className={`plan-row ${task.status === "Completed" ? "complete" : ""}`}
                  >
                    <button
                      className="task-check"
                      aria-label={`${task.status === "Completed" ? "Reopen" : "Complete"} ${task.title}`}
                      aria-pressed={task.status === "Completed"}
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.status === "Completed" && <CircleCheck size={22} />}
                    </button>
                    <SubjectIcon id={task.subjectId} />
                    <div className="task-info">
                      <span className={`subject-label ${subject.color}`}>
                        {subject.name}
                      </span>
                      <h3>{task.title}</h3>
                      <div className="task-meta">
                        <span>
                          <Clock3 size={12} />
                          {task.minutes} min
                        </span>
                        <span
                          className={`priority ${task.priority.toLowerCase()}`}
                        >
                          {task.priority} priority
                        </span>
                      </div>
                    </div>
                    <div className="task-right">
                      <span
                        className={`badge ${task.status === "Completed" ? "green" : task.status === "In progress" ? "blue" : "neutral"}`}
                      >
                        {task.status}
                      </span>
                      <button
                        className="task-action"
                        onClick={() => selectStudy(task.subjectId, task.title)}
                      >
                        {task.status === "Completed"
                          ? "Review"
                          : task.status === "In progress"
                            ? "Continue"
                            : "Start session"}
                        {task.status !== "Completed" && <Play size={12} />}
                      </button>
                      <button
                        type="button"
                        className="remove-task-button"
                        aria-label={`Remove ${task.title}`}
                        disabled={!ready}
                        onClick={() => removeTask(task.id)}
                      >
                        <Trash2 size={14} aria-hidden="true" /> Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="plan-footer">
              <span>
                <CircleCheck size={15} />
                {completed} of {todayTasks.length} tasks completed
              </span>
              <span>You’re showing up. That matters.</span>
            </div>
          </section>
          <div className="insight-banner">
            <span className="insight-icon">
              <Sparkles size={23} />
            </span>
            <div>
              <strong>A little balance goes a long way</strong>
              <p>
                Calculus could use some love. Try a 25-minute session today.
              </p>
            </div>
            <button
              className="text-button"
              onClick={() => selectStudy("calculus", "Review derivatives")}
            >
              Let’s do it
            </button>
          </div>
          <WeeklyActivity compact />
        </div>
        <StudyTimer />
      </div>
    </>
  );
}
export function AddTask({ onClose }: { onClose: () => void }) {
  const { addTask, ready, state } = useStudy();
  const [subjectId, setSubjectId] = useState(
    state.recentSubjectIds[0] ?? "programming",
  );
  return (
    <form
      className="add-task-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        addTask({
          title: String(data.get("title")).trim(),
          subjectId,
          minutes: Number(data.get("minutes")),
          priority: String(
            data.get("priority"),
          ) as import("@/types").Task["priority"],
          due: "today",
        });
        onClose();
      }}
    >
      <label>
        What will you study?
        <input
          name="title"
          placeholder="e.g. Review database normalization"
          required
          maxLength={100}
          pattern=".*\S.*"
          autoFocus
        />
      </label>
      <div className="form-grid">
        <SubjectSelector value={subjectId} onChange={setSubjectId} />
        <label>
          Minutes
          <input
            type="number"
            name="minutes"
            min="1"
            max="480"
            defaultValue="25"
            required
          />
        </label>
        <label>
          Priority
          <select name="priority">
            <option>Medium</option>
            <option>High</option>
            <option>Low</option>
          </select>
        </label>
      </div>
      <div className="form-actions">
        <button type="button" className="button secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="button primary" type="submit" disabled={!ready}>
          Add to today
        </button>
      </div>
    </form>
  );
}
export function WeeklyActivity({ compact = false }: { compact?: boolean }) {
  const { state } = useStudy();
  const [period, setPeriod] = useState("This week");
  const extra = state.sessions.filter(
    (s) => !initialSessions.some((i) => i.id === s.id),
  );
  const base =
    period === "This week"
      ? [150, 90, 180, 120, 170, 60, 90]
      : [90, 110, 140, 80, 150, 50, 70];
  const values = [...base];
  if (period === "This week")
    extra.forEach((s) => {
      const day = (new Date(`${s.date}T12:00:00`).getDay() + 6) % 7;
      values[day] += s.minutes;
    });
  const total = values.reduce((a, b) => a + b, 0);
  const max = Math.max(240, ...values);
  return (
    <section className={`panel weekly-activity ${compact ? "compact" : ""}`}>
      <SectionHeading title="Weekly study activity">
        <select
          aria-label="Activity period"
          className="period-select"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option>This week</option>
          <option>Last week</option>
        </select>
      </SectionHeading>
      <div className="chart-legend">
        <span>
          <i className="legend-dot" /> Study time
        </span>
        <span>
          <i className="legend-dash" /> Daily goal · 3h
        </span>
      </div>
      <div
        className="bar-chart"
        aria-label={`Weekly study activity: ${duration(total)} total`}
      >
        <div className="chart-axis">
          {[max, max * 0.75, max * 0.5, max * 0.25, 0].map((v, i) => (
            <span key={i}>{(v / 60).toFixed(v % 60 ? 1 : 0)}h</span>
          ))}
        </div>
        <div className="plot">
          <div className="grid-lines">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div
            className="goal-line"
            style={{ bottom: `${(180 / max) * 100}%` }}
          />
          <div className="bars">
            {values.map((v, i) => (
              <div className="bar-column" key={i}>
                <div
                  className={`chart-bar ${i === 2 ? "highlight" : ""}`}
                  style={{ height: `${(v / max) * 100}%` }}
                  tabIndex={0}
                  aria-label={`${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i]}: ${duration(v)}`}
                >
                  <span className="bar-tooltip">{duration(v)}</span>
                </div>
                <span className="day-label">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="chart-summary">
        <div>
          <span>Total study time</span>
          <strong>{duration(total)}</strong>
        </div>
        <div>
          <span>Daily average</span>
          <strong>{duration(total / 7)}</strong>
        </div>
        <div>
          <span>Most studied</span>
          <strong>
            Programming <span className="subject-dot" />
          </strong>
        </div>
      </div>
      {!compact && (
        <p className="sample-note">
          Sample weekly baseline, plus sessions you record in this workspace.
        </p>
      )}
    </section>
  );
}
