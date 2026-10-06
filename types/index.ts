export type SubjectId = string;
export interface User {
  id: string;
  name: string;
  firstName: string;
}
export interface Subject {
  id: SubjectId;
  name: string;
  description: string;
  category: string;
  isCustom: boolean;
  createdAt?: string;
  progress: number;
  level: "Beginner" | "Intermediate";
  minutes: number;
  lessons: number;
  totalLessons: number;
  color: string;
}
export interface Task {
  id: string;
  subjectId: SubjectId;
  title: string;
  minutes: number;
  status: "Not started" | "In progress" | "Completed";
  priority: "High" | "Medium" | "Low";
  due: string;
}
export interface StudySession {
  id: string;
  subjectId: SubjectId;
  topic: string;
  date: string;
  minutes: number;
}
export interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
}
export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}
export interface StudyState {
  subjects: Subject[];
  recentSubjectIds: SubjectId[];
  tasks: Task[];
  sessions: StudySession[];
  goals: Goal[];
}
