"use client";
import Link from "next/link";
import {
  Flame,
  Timer,
  BookOpen,
  Trophy,
  Sparkles,
  LockKeyhole,
} from "lucide-react";
import { achievements } from "@/data/mockData";
import {
  SectionHeading,
  Progress,
  SubjectIcon,
} from "@/components/ui/primitives";
import { useStudy } from "./study-provider";
export function ProgressOverview() {
  const { activeSubjects: subjects } = useStudy();
  return (
    <section className="panel learning-progress">
      <SectionHeading title="Learning progress">
        <Link href="/subjects" className="text-button">
          All subjects
        </Link>
      </SectionHeading>
      <div className="progress-list">
        {subjects.map((s) => (
          <div key={s.id} className="progress-subject">
            <SubjectIcon id={s.id} size={17} />
            <div>
              <div className="progress-subject-label">
                <span>{s.name}</span>
                <strong>{s.progress}%</strong>
              </div>
              <Progress value={s.progress} color={s.color} label={s.name} />
            </div>
          </div>
        ))}
      </div>
      <p className="progress-note">
        <Sparkles size={16} /> You’re making great progress in Programming.
      </p>
    </section>
  );
}
export function Achievements() {
  const { state } = useStudy();
  const goal = state.goals.find((g) => g.id === "hours");
  const icons = [Flame, Timer, BookOpen, Trophy];
  return (
    <section className="achievements-section">
      <SectionHeading
        title="Little milestones, lasting habits"
        sub="Every bit of consistency deserves a moment."
      />
      <div className="achievements-grid">
        {achievements.map((a, i) => {
          const Icon = icons[i];
          const unlocked =
            a.unlocked ||
            (a.id === "weekly" && !!goal && goal.current >= goal.target);
          return (
            <article
              key={a.id}
              className={`achievement ${unlocked ? "unlocked" : "locked"}`}
            >
              <span className={`achievement-icon achievement-${i}`}>
                <Icon size={24} />
              </span>
              <div>
                <h3>
                  {a.title}
                  {!unlocked && <LockKeyhole size={11} />}
                </h3>
                <p>{a.description}</p>
                <span className="achievement-status">
                  {unlocked ? "ACHIEVED" : "IN PROGRESS"}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
