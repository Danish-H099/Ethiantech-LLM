// Enrollment records — the learner's enrolled courses.
//
// `id` mirrors the catalog course id (src/data/courses) so
// /student/course/:courseId resolves through getCourseById.
//
// Only enrollment-owned facts live here:
//   - enrollmentStatus: lifecycle state (enrolled / in-progress / completed)
//   - completedLessons: how far the learner has progressed (count)
//   - lastAccessed / dueDate: task-level activity timestamps
//
// Catalog facts (title, instructor, image, hours, lesson list) are read from
// the catalog via getCourseById; progress %, total lesson count, and the
// in-progress lesson are DERIVED from the syllabus in studentRepository. This
// is the single source of truth — no duplicated or contradictory fields.

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const inDays = (days) => new Date(Date.now() + days * DAY_MS).toISOString();
const hoursAgo = (hours) => new Date(Date.now() - hours * HOUR_MS).toISOString();

export const enrolledCourses = [
  {
    id: 1,
    enrollmentStatus: "Completed",
    completedLessons: 25,
    lastAccessed: hoursAgo(7 * 24),
  },
  {
    id: 2,
    enrollmentStatus: "Completed",
    completedLessons: 22,
    lastAccessed: hoursAgo(15 * 24),
  },
  {
    id: 3,
    enrollmentStatus: "In Progress",
    completedLessons: 12,
    lastAccessed: hoursAgo(3),
    dueDate: inDays(2),
  },
  {
    id: 5,
    enrollmentStatus: "In Progress",
    completedLessons: 13,
    lastAccessed: hoursAgo(2 * 24),
    dueDate: inDays(-2),
  },
  {
    id: 6,
    enrollmentStatus: "In Progress",
    completedLessons: 6,
    lastAccessed: hoursAgo(5 * 24),
    dueDate: inDays(5),
  },
  {
    id: 7,
    enrollmentStatus: "Not Started",
    completedLessons: 0,
    lastAccessed: hoursAgo(9 * 24),
    dueDate: inDays(9),
  },
];
