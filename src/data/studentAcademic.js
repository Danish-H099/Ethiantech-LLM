/**
 * Academic records linking students to courses: enrollments and course grades.
 *
 * `studentId` is the FK into `students.id`. `courseId` is the FK into
 * `courses.id` (the catalog id space).
 *
 * Catalog facts (title, instructor, image, hours) are read from the
 * catalog via `getCourseById` — never duplicated here. Progress %, total
 * lesson count, and in-progress lesson are derived at runtime from
 * `studentLessonProgress`.
 *
 * Timestamps are fixed ISO strings so the demo is stable across reloads.
 *
 * @typedef {Object} StudentEnrollment
 * @property {number} id Row id (unique).
 * @property {string} studentId FK → students.id.
 * @property {number} courseId FK → courses.id.
 * @property {string} enrolledAt ISO timestamp when the learner joined.
 * @property {string} lastAccessed ISO timestamp of most recent interaction.
 * @property {string} [dueDate] ISO timestamp (optional deadline).
 * @property {string} createdAt ISO timestamp.
 * @property {string} updatedAt ISO timestamp.
 *   enrollmentStatus and completedLessons are DERIVED at runtime from
 *   studentLessonProgress — not stored.
 *
 * @typedef {Object} StudentCourseGrade
 * @property {number} id Row id (unique).
 * @property {string} studentId FK → students.id.
 * @property {number} courseId FK → courses.id.
 * @property {number} score 0–100.
 * @property {string} grade Letter grade ("A", "B+", "-").
 * @property {"Completed"|"In Progress"|"Not Started"} status Mirrors enrollment.
 * @property {string} createdAt ISO timestamp.
 * @property {string} updatedAt ISO timestamp.
 *   Category performance is DERIVED at runtime from studentCourseGrades
 *   + courses catalog — not stored.
 */

// ─── Enrollments ─────────────────────────────────────────────────────────────

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const NOW = Date.now();
const hoursAgo = (h) => new Date(NOW - h * HOUR_MS).toISOString();
const daysAgo = (d) => new Date(NOW - d * DAY_MS).toISOString();
const daysFromNow = (d) => new Date(NOW + d * DAY_MS).toISOString();

/** @type {StudentEnrollment[]} */
export const studentEnrollments = [
  {
    id: 1,
    studentId: "u-alex",
    courseId: 1,
    enrolledAt: daysAgo(120),
    lastAccessed: daysAgo(7),
    dueDate: null,
    createdAt: daysAgo(120),
    updatedAt: daysAgo(7),
  },
  {
    id: 2,
    studentId: "u-alex",
    courseId: 2,
    enrolledAt: daysAgo(100),
    lastAccessed: daysAgo(15),
    dueDate: null,
    createdAt: daysAgo(100),
    updatedAt: daysAgo(15),
  },
  {
    id: 3,
    studentId: "u-alex",
    courseId: 3,
    enrolledAt: daysAgo(30),
    lastAccessed: hoursAgo(3),
    dueDate: daysFromNow(2),
    createdAt: daysAgo(30),
    updatedAt: hoursAgo(3),
  },
  {
    id: 4,
    studentId: "u-alex",
    courseId: 5,
    enrolledAt: daysAgo(20),
    lastAccessed: daysAgo(2),
    dueDate: daysAgo(2),
    createdAt: daysAgo(20),
    updatedAt: daysAgo(2),
  },
  {
    id: 5,
    studentId: "u-alex",
    courseId: 6,
    enrolledAt: daysAgo(15),
    lastAccessed: daysAgo(5),
    dueDate: daysFromNow(5),
    createdAt: daysAgo(15),
    updatedAt: daysAgo(5),
  },
  {
    id: 6,
    studentId: "u-alex",
    courseId: 7,
    enrolledAt: daysAgo(10),
    lastAccessed: daysAgo(9),
    dueDate: daysFromNow(9),
    createdAt: daysAgo(10),
    updatedAt: daysAgo(9),
  },
];

/** Index: enrollment by student + course (O(1) lookup). */
export const enrollmentByStudentAndCourse = Object.fromEntries(
  studentEnrollments.map((e) => [`${e.studentId}:${e.courseId}`, e])
);

// ─── Course Grades ───────────────────────────────────────────────────────────

/** @type {StudentCourseGrade[]} */
export const studentCourseGrades = [
  { id: 4, studentId: "u-alex", courseId: 5, score: 75, grade: "B", status: "In Progress", createdAt: daysAgo(20), updatedAt: daysAgo(2) },
];

/** Index: grade by student + course. */
export const gradeByStudentAndCourse = Object.fromEntries(
  studentCourseGrades.map((g) => [`${g.studentId}:${g.courseId}`, g])
);
