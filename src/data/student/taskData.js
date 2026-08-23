/**
 * Per-task enrichment metadata — prototype fixture.
 *
 * The repository's `getTasks()` derives the authoritative Task fields from the
 * syllabus + lessonProgress store, then merges any entry here as optional,
 * presentation-only metadata. This file is the clean replacement point for a
 * future backend that returns per-task priority / effort without changing the
 * derived model.
 *
 * Keys are opaque lesson IDs — the same namespace used by `exerciseData` and
 * `lessonProgress` (e.g. "3-s2-l5").
 *
 * `COURSE_CATEGORY_MAP` enriches the Grades detail view by linking an enrolled
 * course to its `performanceByCategory` entry. Kept here (not inside the grade
 * math) so the category mapping stays a single, editable lookup.
 */

export const TASK_META = {
  "1-s1-l3": { estimatedEffort: "20 min" },
  "1-s3-l4": { estimatedEffort: "45 min" },
  "3-s2-l1": { estimatedEffort: "1 hr" },
  "3-s2-l5": { estimatedEffort: "3–4 hrs" },
  "5-s0-l4": { estimatedEffort: "30 min" },
  "5-s4-l2": { estimatedEffort: "End of course" },
  "6-s0-l3": { estimatedEffort: "1 hr" },
  "6-s4-l2": { estimatedEffort: "Portfolio" },
};

// Maps enrolled course ids to a `performanceByCategory` label.
export const COURSE_CATEGORY_MAP = {
  1: "Web Dev",
  2: "AI & ML",
  3: "Web Dev",
  5: "Data Science",
  6: "Design",
  7: "Business",
};
