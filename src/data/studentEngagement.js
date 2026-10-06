/**
 * Learner engagement records: wishlist bookmarks and the activity event log
 * that feeds heatmap/streak analytics.
 *
 * `studentId` is the FK into `students.id`; `courseId`/`lessonId` reference
 * the catalog/curriculum id spaces.
 *
 * Activity events are an append-only log of learner interactions. Seed rows
 * backfill realistic history distributed across each enrollment span (see the
 * generator at the bottom of this file).
 *
 * @typedef {Object} StudentWishlistItem
 * @property {number} id
 * @property {string} studentId FK → students.id.
 * @property {number} courseId FK → courses.id.
 * @property {string} addedAt ISO timestamp.
 *
 * @typedef {"access"|"completion"|"submission"|"quiz"} ActivityEventType
 *
 * @typedef {Object} StudentActivityEvent
 * @property {number} id
 * @property {string} studentId FK → students.id.
 * @property {number} courseId FK → courses.id.
 * @property {string} lessonId Full lesson id ("3-s2-l0").
 * @property {ActivityEventType} eventType
 * @property {string} timestamp ISO timestamp.
 * @property {number} estimatedHours Hours contributed to study-time analytics.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const NOW = Date.now();
const hoursAgo = (h) => new Date(NOW - h * HOUR_MS).toISOString();
const daysAgo = (d) => new Date(NOW - d * DAY_MS).toISOString();

// ─── Wishlist ────────────────────────────────────────────────────────────────

/** @type {StudentWishlistItem[]} */
export const studentWishlist = [
  { id: 1, studentId: "u-alex", courseId: 4, addedAt: daysAgo(31) },
  { id: 2, studentId: "u-alex", courseId: 8, addedAt: daysAgo(28) },
];

// ─── Activity events ─────────────────────────────────────────────────────────

/** Lesson-definition tuples for each enrolled course (id, durationHours). */
const COURSE_LESSON_DEFS = {
  1: [
    ["1-s0-l0", 10 / 60], ["1-s0-l1", 8 / 60], ["1-s0-l2", 12 / 60],
    ["1-s1-l0", 15 / 60], ["1-s1-l1", 20 / 60], ["1-s1-l2", 25 / 60], ["1-s1-l3", 20 / 60],
    ["1-s2-l0", 15 / 60], ["1-s2-l1", 25 / 60], ["1-s2-l2", 15 / 60],
    ["1-s3-l0", 20 / 60], ["1-s3-l1", 45 / 60], ["1-s3-l2", 35 / 60], ["1-s3-l3", 50 / 60], ["1-s3-l4", 40 / 60],
    ["1-s4-l0", 30 / 60], ["1-s4-l1", 45 / 60], ["1-s4-l2", 50 / 60], ["1-s4-l3", 40 / 60],
    ["1-s5-l0", 25 / 60], ["1-s5-l1", 35 / 60], ["1-s5-l2", 30 / 60],
    ["1-s6-l0", 20 / 60], ["1-s6-l1", 30 / 60], ["1-s6-l2", 25 / 60],
  ],
  2: [
    ["2-s0-l0", 10 / 60], ["2-s0-l1", 8 / 60], ["2-s0-l2", 12 / 60],
    ["2-s1-l0", 15 / 60], ["2-s1-l1", 20 / 60], ["2-s1-l2", 25 / 60], ["2-s1-l3", 20 / 60],
    ["2-s2-l0", 15 / 60], ["2-s2-l1", 25 / 60], ["2-s2-l2", 15 / 60], ["2-s2-l3", 20 / 60],
    ["2-s3-l0", 20 / 60], ["2-s3-l1", 45 / 60], ["2-s3-l2", 35 / 60], ["2-s3-l3", 50 / 60], ["2-s3-l4", 40 / 60],
    ["2-s4-l0", 30 / 60], ["2-s4-l1", 45 / 60], ["2-s4-l2", 50 / 60], ["2-s4-l3", 40 / 60],
    ["2-s5-l0", 25 / 60], ["2-s5-l1", 35 / 60],
  ],
  3: [
    ["3-s0-l0", 10 / 60], ["3-s0-l1", 8 / 60], ["3-s0-l2", 12 / 60], ["3-s0-l3", 15 / 60], ["3-s0-l4", 18 / 60], ["3-s0-l5", 20 / 60],
    ["3-s1-l0", 15 / 60], ["3-s1-l1", 20 / 60], ["3-s1-l2", 25 / 60], ["3-s1-l3", 20 / 60], ["3-s1-l4", 30 / 60], ["3-s1-l5", 15 / 60],
    ["3-s2-l0", 15 / 60], ["3-s2-l1", 25 / 60], ["3-s2-l2", 15 / 60], ["3-s2-l3", 20 / 60], ["3-s2-l4", 16 / 60], ["3-s2-l5", 25 / 60],
  ],
  5: [
    ["5-s0-l0", 10 / 60], ["5-s0-l1", 8 / 60], ["5-s0-l2", 12 / 60], ["5-s0-l3", 15 / 60], ["5-s0-l4", 18 / 60], ["5-s0-l5", 20 / 60], ["5-s0-l6", 25 / 60],
    ["5-s1-l0", 15 / 60], ["5-s1-l1", 20 / 60], ["5-s1-l2", 25 / 60], ["5-s1-l3", 20 / 60], ["5-s1-l4", 30 / 60], ["5-s1-l5", 15 / 60], ["5-s1-l6", 25 / 60],
    ["5-s2-l0", 15 / 60], ["5-s2-l1", 25 / 60], ["5-s2-l2", 15 / 60], ["5-s2-l3", 20 / 60], ["5-s2-l4", 20 / 60],
    ["5-s3-l0", 20 / 60], ["5-s3-l1", 30 / 60], ["5-s3-l2", 25 / 60], ["5-s3-l3", 20 / 60], ["5-s3-l4", 16 / 60], ["5-s3-l5", 25 / 60],
    ["5-s4-l0", 25 / 60], ["5-s4-l1", 30 / 60], ["5-s4-l2", 25 / 60], ["5-s4-l3", 20 / 60], ["5-s4-l4", 25 / 60],
  ],
  6: [
    ["6-s0-l0", 10 / 60], ["6-s0-l1", 8 / 60], ["6-s0-l2", 12 / 60], ["6-s0-l3", 15 / 60],
    ["6-s1-l0", 15 / 60], ["6-s1-l1", 20 / 60], ["6-s1-l2", 25 / 60], ["6-s1-l3", 20 / 60],
    ["6-s2-l0", 15 / 60], ["6-s2-l1", 25 / 60], ["6-s2-l2", 15 / 60], ["6-s2-l3", 20 / 60],
    ["6-s3-l0", 20 / 60], ["6-s3-l1", 30 / 60], ["6-s3-l2", 25 / 60], ["6-s3-l3", 20 / 60], ["6-s3-l4", 16 / 60],
    ["6-s4-l0", 25 / 60], ["6-s4-l1", 30 / 60], ["6-s4-l2", 25 / 60],
  ],
};

/**
 * Builds the seed activity log for an enrollment: one "access" event at the
 * last-accessed time, plus a "completion" event for each completed lesson
 * distributed evenly across the enrollment span.
 *
 * @param {string} studentId
 * @param {number} courseId
 * @param {number} completedLessons
 * @param {string} enrolledAt ISO timestamp.
 * @param {string} lastAccessed ISO timestamp.
 * @param {string[][]} lessonDefs `[lessonId, durationHours]` tuples.
 * @param {number} idStart First id to assign.
 * @param {string} baseTimestamp ISO baseline for the log (stable across seeds).
 * @returns {StudentActivityEvent[]}
 */
function buildCourseActivity(studentId, courseId, completedLessons, enrolledAt, lastAccessed, lessonDefs, idStart) {
  const events = [];

  if (lastAccessed && lessonDefs[0]) {
    events.push({
      id: idStart++,
      studentId,
      courseId,
      lessonId: lessonDefs[0][0],
      eventType: "access",
      timestamp: lastAccessed,
      estimatedHours: 0.25,
    });
  }

  const completedCount = Math.max(0, Math.min(completedLessons || 0, lessonDefs.length));
  if (completedCount === 0) return events;

  const startMs = new Date(enrolledAt).getTime();
  const endMs = new Date(lastAccessed).getTime();
  const spanMs = Math.max(endMs - startMs, DAY_MS);

  for (let i = 0; i < completedCount; i += 1) {
    const t = i / Math.max(completedCount - 1, 1);
    events.push({
      id: idStart++,
      studentId,
      courseId,
      lessonId: lessonDefs[i][0],
      eventType: "completion",
      timestamp: new Date(startMs + spanMs * t).toISOString(),
      estimatedHours: lessonDefs[i][1],
    });
  }

  return events;
}

let activityId = 1;
const COURSE_ACTIVITIES = [
  { studentId: "u-alex", courseId: 1, completedLessons: 25, enrolledAt: daysAgo(120), lastAccessed: daysAgo(7), defs: COURSE_LESSON_DEFS["1"] },
  { studentId: "u-alex", courseId: 2, completedLessons: 22, enrolledAt: daysAgo(100), lastAccessed: daysAgo(15), defs: COURSE_LESSON_DEFS["2"] },
  { studentId: "u-alex", courseId: 3, completedLessons: 12, enrolledAt: daysAgo(30), lastAccessed: hoursAgo(3), defs: COURSE_LESSON_DEFS["3"] },
  { studentId: "u-alex", courseId: 5, completedLessons: 13, enrolledAt: daysAgo(20), lastAccessed: daysAgo(2), defs: COURSE_LESSON_DEFS["5"] },
  { studentId: "u-alex", courseId: 6, completedLessons: 6, enrolledAt: daysAgo(15), lastAccessed: daysAgo(5), defs: COURSE_LESSON_DEFS["6"] },
].flatMap((c) => {
  const events = buildCourseActivity(
    c.studentId,
    c.courseId,
    c.completedLessons,
    c.enrolledAt,
    c.lastAccessed,
    c.defs,
    activityId
  );
  activityId += events.length;
  return events;
});

/** @type {StudentActivityEvent[]} */
export const studentActivityEvents = COURSE_ACTIVITIES;

// ─── Index ───────────────────────────────────────────────────────────────────

/** All activity events for a student, sorted newest first. */
export const activityByStudent = (studentId) =>
  studentActivityEvents
    .filter((e) => e.studentId === studentId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
