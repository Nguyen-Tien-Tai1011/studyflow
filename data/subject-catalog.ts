import type { Subject } from "@/types";
import { subjects as learningSubjects } from "./mockData";

// Suggestions are a starting point, never a restriction on custom subjects.
export const subjectCategories = [
  {
    id: "technology",
    name: "Programming & Technology",
    examples: [
      "C Programming",
      "C++",
      "Python",
      "Java",
      "JavaScript",
      "Web Development",
      "Mobile Development",
      "Database",
      "Cybersecurity",
      "Cloud Computing",
      "Artificial Intelligence",
    ],
  },
  {
    id: "mathematics",
    name: "Mathematics",
    examples: [
      "Basic Mathematics",
      "Algebra",
      "Calculus",
      "Discrete Mathematics",
      "Statistics",
      "Linear Algebra",
    ],
  },
  {
    id: "languages",
    name: "Languages",
    examples: [
      "English",
      "Japanese",
      "Korean",
      "Chinese",
      "Spanish",
      "French",
      "Other Languages",
    ],
  },
  {
    id: "science",
    name: "Science",
    examples: ["Physics", "Chemistry", "Biology", "Astronomy"],
  },
  {
    id: "business",
    name: "Business & Finance",
    examples: [
      "Accounting",
      "Marketing",
      "Economics",
      "Finance",
      "Entrepreneurship",
      "Management",
    ],
  },
  {
    id: "data",
    name: "Data & Analytics",
    examples: [
      "SQL",
      "Data Analysis",
      "Data Engineering",
      "Data Science",
      "Machine Learning",
      "Statistics",
      "Business Intelligence",
    ],
  },
  {
    id: "design",
    name: "Design & Creativity",
    examples: [
      "UI/UX Design",
      "Graphic Design",
      "Drawing",
      "Photography",
      "Video Editing",
    ],
  },
  {
    id: "humanities",
    name: "Humanities & Social Sciences",
    examples: ["History", "Psychology", "Philosophy", "Sociology"],
  },
  {
    id: "health",
    name: "Health & Medicine",
    examples: ["Anatomy", "Nutrition", "Nursing", "Public Health"],
  },
  {
    id: "engineering",
    name: "Engineering",
    examples: [
      "Mechanical Engineering",
      "Electrical Engineering",
      "Civil Engineering",
    ],
  },
  {
    id: "communication",
    name: "Communication",
    examples: ["Public Speaking", "Writing", "Negotiation"],
  },
  {
    id: "career",
    name: "Career & Professional Skills",
    examples: [
      "Project Management",
      "Leadership",
      "Interview Preparation",
      "Communication",
      "Presentation Skills",
      "Resume/CV Preparation",
    ],
  },
  {
    id: "exams",
    name: "Exam Preparation",
    examples: [
      "IELTS",
      "TOEIC",
      "SAT",
      "University Exams",
      "Professional Certifications",
    ],
  },
  {
    id: "personal",
    name: "Personal Development",
    examples: [
      "Time Management",
      "Productivity",
      "Critical Thinking",
      "Problem Solving",
      "Note Taking",
    ],
  },
  {
    id: "arts",
    name: "Arts & Music",
    examples: ["Guitar", "Piano", "Music Theory", "Painting"],
  },
  {
    id: "reading",
    name: "Reading & Research",
    examples: ["Literature", "Research Methods", "Academic Reading"],
  },
  { id: "other", name: "Other", examples: [] },
] as const;

export function cleanSubjectName(name: string) {
  return name.normalize("NFKC").trim().replace(/\s+/gu, " ");
}
export function subjectNameKey(name: string) {
  return cleanSubjectName(name).toLocaleLowerCase("en-US");
}
export function newSubject(
  id: string,
  name: string,
  category: string,
  isCustom: boolean,
): Subject {
  return {
    id,
    name: cleanSubjectName(name),
    category,
    isCustom,
    description: category,
    progress: 0,
    level: "Beginner",
    minutes: 0,
    lessons: 0,
    totalLessons: 0,
    color: "blue",
  };
}

// Keep existing IDs intact so saved tasks and sessions retain their relationships.
export const defaultSubjects: Subject[] = [...learningSubjects];
for (const category of subjectCategories) {
  for (const [index, name] of [category.name, ...category.examples].entries()) {
    if (
      !defaultSubjects.some(
        (subject) => subjectNameKey(subject.name) === subjectNameKey(name),
      )
    ) {
      defaultSubjects.push(
        newSubject(
          index === 0
            ? `category-${category.id}`
            : `suggested-${category.id}-${index}`,
          name,
          category.name,
          false,
        ),
      );
    }
  }
}
export const categorySubjectIds = new Set(
  defaultSubjects
    .filter((s) => subjectCategories.some((c) => c.name === s.name))
    .map((s) => s.id),
);
export const initialSubjectIds = new Set(learningSubjects.map((s) => s.id));

export function recentSubjectsAfterUse(ids: string[], subjectId: string) {
  return [subjectId, ...ids.filter((id) => id !== subjectId)].slice(0, 5);
}

export function activeSubjects(subjects: Subject[], usedIds: string[]) {
  const used = new Set(usedIds);
  return subjects.filter(
    (s) => initialSubjectIds.has(s.id) || s.isCustom || used.has(s.id),
  );
}
