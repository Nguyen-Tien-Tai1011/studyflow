"use client";
import { useEffect, useRef, useState } from "react";
import type { SubjectId } from "@/types";
export const modes = [
  { label: "Pomodoro", seconds: 1500 },
  { label: "Short break", seconds: 300 },
  { label: "Long break", seconds: 900 },
];
/** Lives in the workspace provider so navigation never interrupts a session. */
export function useFocusTimer(
  logSession: (subject: SubjectId, topic: string, minutes: number) => void,
  notify: (message: string) => void,
) {
  const [mode, setMode] = useState(0);
  const [remaining, setRemaining] = useState(1500);
  const [running, setRunning] = useState(false);
  const [subject, setSubject] = useState<SubjectId>("programming");
  const [topic, setTopic] = useState("Practice C Arrays");
  const deadline = useRef(0);
  const logged = useRef(false);
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const left = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setRemaining(left);
      if (left === 0) {
        setRunning(false);
        if (!logged.current) {
          logged.current = true;
          if (mode === 0) logSession(subject, topic, 25);
          else notify("Break complete. Ready for a fresh start?");
        }
      }
    }, 250);
    return () => clearInterval(interval);
  }, [running, mode, subject, topic, logSession, notify]);
  const changeMode = (index: number) => {
    if (!modes[index]) return;
    setMode(index);
    setRunning(false);
    setRemaining(modes[index].seconds);
    logged.current = false;
  };
  const toggle = () => {
    if (running) {
      setRemaining(
        Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)),
      );
      setRunning(false);
    } else {
      const seconds = remaining || modes[mode].seconds;
      setRemaining(seconds);
      logged.current = false;
      deadline.current = Date.now() + seconds * 1000;
      setRunning(true);
    }
  };
  const elapsed = modes[mode].seconds - remaining;
  const finish = () => {
    if (mode !== 0 || elapsed < 60 || logged.current) return;
    logged.current = true;
    logSession(subject, topic, Math.floor(elapsed / 60));
    setRunning(false);
    setRemaining(1500);
  };
  const select = (id: SubjectId, nextTopic: string) => {
    setSubject(id);
    setTopic(nextTopic);
    changeMode(0);
  };
  return {
    mode,
    remaining,
    running,
    subject,
    topic,
    elapsed,
    changeMode,
    toggle,
    finish,
    select,
    setSubject,
    setTopic,
  };
}
