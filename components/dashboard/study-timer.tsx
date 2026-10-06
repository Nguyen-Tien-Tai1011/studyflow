"use client";
import {
  Play,
  Pause,
  RotateCcw,
  Headphones,
  Check,
  ChevronDown,
} from "lucide-react";
import { useStudy } from "./study-provider";
import type { SubjectId } from "@/types";
import { modes } from "./use-focus-timer";
export function StudyTimer() {
  const { focus, activeSubjects: subjects } = useStudy();
  const {
    mode,
    remaining,
    running,
    subject,
    topic,
    elapsed,
    changeMode,
    toggle,
    finish,
    setSubject,
    setTopic,
  } = focus;
  return (
    <section id="focus" className="focus-card">
      <div className="focus-heading">
        <h2>
          <Headphones size={19} /> Focus Session
        </h2>
        <span className="focus-tag">YOUR TIME TO FOCUS</span>
      </div>
      <div className="timer-tabs" role="tablist" aria-label="Timer mode">
        {modes.map((m, i) => (
          <button
            key={m.label}
            role="tab"
            aria-selected={mode === i}
            className={mode === i ? "selected" : ""}
            onClick={() => changeMode(i)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div
        className="timer-circle"
        style={
          {
            "--timer-progress": `${(remaining / modes[mode].seconds) * 360}deg`,
          } as React.CSSProperties
        }
      >
        <div>
          <span
            className="timer-digits"
            role="timer"
            aria-label="Time remaining"
          >
            {String(Math.floor(remaining / 60)).padStart(2, "0")}
            <span>:</span>
            {String(remaining % 60).padStart(2, "0")}
          </span>
          <span className="timer-caption">
            {running
              ? "IN THE FLOW"
              : remaining === 0
                ? "SESSION COMPLETE"
                : "MAKE EVERY MINUTE COUNT"}
          </span>
        </div>
      </div>
      <p className="focus-quote">Stay focused. You’ve got this.</p>
      <label className="focus-label" htmlFor="focus-subject">
        Studying
      </label>
      <div className="focus-select">
        <select
          id="focus-subject"
          value={subject}
          disabled={running || elapsed > 0}
          onChange={(e) => setSubject(e.target.value as SubjectId)}
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <ChevronDown size={15} />
      </div>
      <label className="sr-only" htmlFor="focus-topic">
        Current task
      </label>
      <input
        id="focus-topic"
        className="focus-topic"
        value={topic}
        maxLength={100}
        disabled={running || elapsed > 0}
        onChange={(e) => setTopic(e.target.value)}
      />
      <div className="timer-actions">
        <button className="focus-start" onClick={toggle}>
          {running ? (
            <Pause size={17} />
          ) : (
            <Play size={17} fill="currentColor" />
          )}
          {running
            ? "Pause session"
            : remaining < modes[mode].seconds && remaining > 0
              ? "Resume session"
              : "Start session"}
        </button>
        <button
          className="reset-button"
          aria-label="Reset timer"
          onClick={() => changeMode(mode)}
        >
          <RotateCcw size={18} />
        </button>
      </div>
      {mode === 0 && elapsed >= 60 && remaining > 0 && (
        <button className="finish-session" onClick={finish}>
          <Check size={15} /> Finish & save {Math.floor(elapsed / 60)} min
        </button>
      )}
      <div className="focus-footer">
        <span className={running ? "live-dot running" : "live-dot"} />
        {running
          ? "One thing at a time. You’re doing great."
          : "A little focus goes a long way."}
      </div>
    </section>
  );
}
