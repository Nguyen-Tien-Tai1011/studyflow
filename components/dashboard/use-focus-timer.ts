"use client";
import { useEffect, useRef, useState } from "react";
import type { SubjectId } from "@/types";
export const modes = [
  { label: "Pomodoro", seconds: 1500 },
  { label: "Short break", seconds: 300 },
  { label: "Long break", seconds: 900 },
  { label: "Custom", seconds: 1500 },
];
export const CUSTOM_MODE = 3;
export const MAX_FOCUS_MINUTES = 180;
/** Lives in the workspace provider so navigation never interrupts a session. */
export function useFocusTimer(
  logSession: (subject: SubjectId, topic: string, minutes: number) => void,
  notify: (message: string) => void,
) {
  const [mode, setMode] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [remaining, setRemaining] = useState(1500);
  const [running, setRunning] = useState(false);
  const [subject, setSubject] = useState<SubjectId>("programming");
  const [topic, setTopic] = useState("Practice C Arrays");
  const deadline = useRef(0);
  const logged = useRef(false);
  const duration =
    mode === CUSTOM_MODE ? customMinutes * 60 : modes[mode].seconds;
  const isStudyMode = mode === 0 || mode === CUSTOM_MODE;
  const elapsed = duration - remaining;
  const durationLocked = running || (elapsed > 0 && remaining > 0);
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
          if (isStudyMode) logSession(subject, topic, duration / 60);
          else notify("Break complete. Ready for a fresh start?");
        }
      }
    }, 250);
    return () => clearInterval(interval);
  }, [running, isStudyMode, duration, subject, topic, logSession, notify]);
  const changeMode = (index: number) => {
    if (!modes[index]) return;
    setMode(index);
    setRunning(false);
    setRemaining(
      index === CUSTOM_MODE ? customMinutes * 60 : modes[index].seconds,
    );
    logged.current = false;
  };
  const applyCustomMinutes = (minutes: number) => {
    if (
      mode !== CUSTOM_MODE ||
      durationLocked ||
      !Number.isInteger(minutes) ||
      minutes < 1 ||
      minutes > MAX_FOCUS_MINUTES
    )
      return;
    setCustomMinutes(minutes);
    setRemaining(minutes * 60);
    logged.current = false;
  };
  const toggle = () => {
    if (running) {
      setRemaining(
        Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)),
      );
      setRunning(false);
    } else {
      const seconds = remaining || duration;
      setRemaining(seconds);
      logged.current = false;
      deadline.current = Date.now() + seconds * 1000;
      setRunning(true);
    }
  };
  const finish = () => {
    if (!isStudyMode || elapsed < 60 || logged.current) return;
    logged.current = true;
    logSession(subject, topic, Math.floor(elapsed / 60));
    setRunning(false);
    setRemaining(duration);
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
    duration,
    customMinutes,
    isStudyMode,
    durationLocked,
    applyCustomMinutes,
    changeMode,
    toggle,
    finish,
    select,
    setSubject,
    setTopic,
  };
}
