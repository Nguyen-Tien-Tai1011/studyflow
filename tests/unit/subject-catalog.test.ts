import { expect, it } from "vitest";
import {
  cleanSubjectName,
  defaultSubjects,
  recentSubjectsAfterUse,
  subjectCategories,
  subjectNameKey,
} from "@/data/subject-catalog";

it("normalizes case, Unicode and extra whitespace while retaining a clean display name", () => {
  expect(cleanSubjectName("  Japanese   N3  ")).toBe("Japanese N3");
  expect(subjectNameKey("  ＰＹＴＨＯＮ  ")).toBe(subjectNameKey("Python"));
});
it("provides 17 categories and unique reusable subjects", () => {
  expect(subjectCategories).toHaveLength(17);
  expect(new Set(defaultSubjects.map((s) => s.id)).size).toBe(
    defaultSubjects.length,
  );
  expect(new Set(defaultSubjects.map((s) => subjectNameKey(s.name))).size).toBe(
    defaultSubjects.length,
  );
  for (const category of subjectCategories)
    expect(defaultSubjects.some((s) => s.name === category.name)).toBe(true);
});
it("keeps only five recent subjects, moving repeat use to the front", () => {
  expect(recentSubjectsAfterUse(["a", "b", "c", "d", "e"], "c")).toEqual([
    "c",
    "a",
    "b",
    "d",
    "e",
  ]);
  expect(recentSubjectsAfterUse(["a", "b", "c", "d", "e"], "f")).toEqual([
    "f",
    "a",
    "b",
    "c",
    "d",
  ]);
});
