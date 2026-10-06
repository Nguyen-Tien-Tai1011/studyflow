"use client";
import Link from "next/link";
import { useState } from "react";
import { CircleCheck, Play, Search, Timer } from "lucide-react";
import { useStudy } from "./study-provider";
import { subjects } from "@/data/mockData";
import { dateLabel, duration } from "@/utils/format";
import { SectionHeading, SubjectIcon } from "@/components/ui/primitives";
export function RecentSessions({ full = false }: { full?: boolean }) {
  const { state } = useStudy();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const rows = state.sessions.filter(
    (s) =>
      (subject === "all" || s.subjectId === subject) &&
      `${s.topic} ${subjects.find((x) => x.id === s.subjectId)?.name}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <section className="panel recent-sessions">
      <SectionHeading
        title={full ? "Your study history" : "Recent study sessions"}
        sub={
          full ? "A record of the time you’ve invested in yourself." : undefined
        }
      >
        {!full && (
          <Link className="text-button" href="/sessions">
            View all sessions
          </Link>
        )}
      </SectionHeading>
      {full && (
        <div className="session-filters">
          <label className="search-field">
            <Search size={17} />
            <input
              placeholder="Search your sessions…"
              aria-label="Search sessions"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select
            aria-label="Filter sessions by subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="all">All subjects</option>
            {subjects.map((s) => (
              <option value={s.id} key={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <span>
            {rows.length} sessions ·{" "}
            {duration(rows.reduce((a, s) => a + s.minutes, 0))}
          </span>
        </div>
      )}
      {rows.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Topic</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, full ? undefined : 4).map((s) => (
                <tr key={s.id}>
                  <td>
                    <span className="session-subject">
                      <SubjectIcon id={s.subjectId} size={15} />
                      {subjects.find((x) => x.id === s.subjectId)?.name}
                    </span>
                  </td>
                  <td>{s.topic}</td>
                  <td>{dateLabel(s.date)}</td>
                  <td>{duration(s.minutes)}</td>
                  <td>
                    <span className="badge green">
                      <CircleCheck size={11} /> Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <Timer size={30} />
          <h3>
            {query || subject !== "all"
              ? "No matching sessions"
              : "No study sessions yet"}
          </h3>
          <p>
            {query || subject !== "all"
              ? "Try another subject or search term."
              : "Your next small step starts with a little focus."}
          </p>
          <Link className="button primary" href="/#focus">
            <Play size={14} /> Start your first session
          </Link>
        </div>
      )}
    </section>
  );
}
