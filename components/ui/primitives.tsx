import {
  BookOpen,
  Code2,
  Database,
  FunctionSquare,
  Network,
} from "lucide-react";
import type { SubjectId } from "@/types";
export function Logo() {
  return (
    <span className="logo">
      <span className="logo-mark">
        <BookOpen size={23} strokeWidth={1.8} />
      </span>
      Study<span className="logo-flow">Flow</span>
    </span>
  );
}
export function SubjectIcon({
  id,
  size = 21,
}: {
  id: SubjectId;
  size?: number;
}) {
  const Icon = {
    programming: Code2,
    database: Database,
    calculus: FunctionSquare,
    dsa: Network,
  }[id];
  return (
    <span className={`subject-icon ${id}`}>
      <Icon size={size} />
    </span>
  );
}
export function Progress({
  value,
  color = "blue",
  label,
}: {
  value: number;
  color?: string;
  label: string;
}) {
  return (
    <div
      className={`progress-track ${color}`}
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(Math.max(0, Math.min(100, value)))}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
export function SectionHeading({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {children}
    </div>
  );
}
