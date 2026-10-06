"use client";
import Link from "next/link";
import { BookOpen, Clock3, Search, Play } from "lucide-react";
import { useState } from "react";
import { subjects, initialSessions } from "@/data/mockData";
import { duration } from "@/utils/format";
import {
  Progress,
  SubjectIcon,
  SectionHeading,
} from "@/components/ui/primitives";
import { useStudy } from "./study-provider";
import { StudyTimer } from "./study-timer";
export function Subjects({ preview = false }: { preview?: boolean }) {
  const [query, setQuery] = useState("");
  const { state, selectStudy } = useStudy();
  const filtered = subjects.filter((s) =>
    `${s.name} ${s.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <section className="subjects-section">
        <SectionHeading
          title="My subjects"
          sub="A little curiosity. A world of possibilities."
        >
          {preview ? (
            <Link href="/subjects" className="text-button">
              View all subjects
            </Link>
          ) : (
            <label className="search-field">
              <Search size={17} />
              <input
                placeholder="Find a subject…"
                aria-label="Find a subject"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          )}
        </SectionHeading>
        <div className="subjects-grid">
          {filtered.map((subject) => {
            const extra = state.sessions
              .filter(
                (s) =>
                  s.subjectId === subject.id &&
                  !initialSessions.some((i) => i.id === s.id),
              )
              .reduce((a, s) => a + s.minutes, 0);
            return (
              <article className="subject-card" key={subject.id}>
                <div className="subject-card-top">
                  <SubjectIcon id={subject.id} />
                  <span className="badge neutral">{subject.level}</span>
                </div>
                <h3>{subject.name}</h3>
                <p>{subject.description}</p>
                <div className="subject-progress-label">
                  <span>Learning progress</span>
                  <strong>{subject.progress}%</strong>
                </div>
                <Progress
                  value={subject.progress}
                  color={subject.color}
                  label={`${subject.name} learning progress`}
                />
                <div className="subject-card-meta">
                  <span>
                    <Clock3 size={13} />
                    {duration(subject.minutes + extra)}
                  </span>
                  <span>
                    <BookOpen size={13} />
                    {subject.lessons}/{subject.totalLessons} lessons
                  </span>
                </div>
                {preview ? (
                  <Link className="subject-continue" href="/subjects">
                    Continue learning <Play size={12} />
                  </Link>
                ) : (
                  <button
                    className="subject-continue"
                    onClick={() =>
                      selectStudy(
                        subject.id,
                        subject.id === "programming"
                          ? "Practice C Arrays"
                          : subject.id === "database"
                            ? "SQL JOIN Exercises"
                            : subject.id === "calculus"
                              ? "Review derivatives"
                              : "Stacks & queues",
                      )
                    }
                  >
                    Continue learning <Play size={12} />
                  </button>
                )}
              </article>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            No matching subjects. Try “SQL”, “Calculus”, or “Programming”.
          </div>
        )}
      </section>
      {!preview && (
        <div className="subjects-focus">
          <div>
            <span className="eyebrow">FIND YOUR NEXT SMALL WIN</span>
            <h2>You don’t have to finish everything today.</h2>
            <p>
              Choose a subject, give it your attention, and let one focused
              session move you forward.
            </p>
            <div className="subject-guidance">
              <BookOpen size={22} />
              <p>
                Lesson progress reflects your sample curriculum. Recorded focus
                sessions add to your study time.
              </p>
            </div>
          </div>
          <StudyTimer />
        </div>
      )}
    </>
  );
}
