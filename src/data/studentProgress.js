/**
 * Lesson-level progress for every student-course pair.
 *
 * Each row tracks one lesson: its status, completion time, and any
 * quiz/submission data attached to it. Records are keyed by the composite
 * (studentId, courseId, lessonId) — one row per lesson per enrollment.
 *
 * `lessonId` uses the opaque `"<courseId>-s<N>-l<M>"` format from the
 * curriculum (see src/data/curriculum.js).
 *
 * For completed courses every lesson has status "completed". For in-progress
 * courses the first N lessons are completed, the next is "in-progress", and
 * the rest are "locked" (omitted from seed data — the service layer derives
 * lock state at runtime).
 *
 * @typedef {"not-started"|"in-progress"|"completed"|"locked"} LessonStatus
 *
 * @typedef {Object} QuizAttempt
 * @property {number} score 0–100.
 * @property {number} correctCount
 * @property {number} totalCount
 * @property {string} submittedAt ISO timestamp.
 *
 * @typedef {Object} SubmissionAttempt
 * @property {string} content Submitted text content.
 * @property {Array} attachments Submitted file attachments.
 * @property {string} submittedAt ISO timestamp.
 *
 * @typedef {Object} StudentLessonProgress
 * @property {string} studentId FK → students.id.
 * @property {number} courseId FK → courses.id.
 * @property {string} lessonId Opaque lesson id (e.g. "3-s2-l0").
 * @property {LessonStatus} status
 * @property {string|null} completedAt ISO timestamp (only when status === "completed").
 * @property {Object} [quiz] Quiz-specific state.
 * @property {QuizAttempt[]} quiz.attempts Ordered attempts (oldest first).
 * @property {Object|null} quiz.lastAnswers Draft answers (pending submit).
 * @property {Object} [submission] Exercise/project submission state.
 * @property {SubmissionAttempt|null} submission.attempt Submitted content.
 * @property {Object|null} submission.draft Draft content (not yet submitted).
 * @property {string|null} submission.submittedAt ISO timestamp.
 * @property {string} createdAt ISO timestamp.
 * @property {string} updatedAt ISO timestamp.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const NOW = Date.now();
const hoursAgo = (h) => new Date(NOW - h * HOUR_MS).toISOString();
const daysAgo = (d) => new Date(NOW - d * DAY_MS).toISOString();

// ─── Compact seed generator ──────────────────────────────────────────────────
// Produces flat lesson-progress rows from (lessonIds, completedCount, enrolledAt,
// lastAccessed). Timestamps are distributed evenly across the enrollment span.

function buildSeedRecords(studentId, courseId, lessonIds, completedCount, enrolledAt, lastAccessed) {
  const startMs = new Date(enrolledAt).getTime();
  const endMs = new Date(lastAccessed).getTime();
  const spanMs = Math.max(endMs - startMs, DAY_MS);

  return lessonIds.map((lessonId, i) => {
    const isCompleted = i < completedCount;
    const t = completedCount > 1 ? Math.min(i / (completedCount - 1), 1) : 0;
    const ts = new Date(startMs + spanMs * t).toISOString();
    return {
      studentId,
      courseId,
      lessonId,
      status: isCompleted ? "completed" : "not-started",
      completedAt: isCompleted ? ts : null,
      createdAt: ts,
      updatedAt: ts,
    };
  });
}

// ─── Lesson ID lists per enrolled course (mirrors curriculum.js) ─────────────

const COURSE_1_LESSONS = [
  "1-s0-l0","1-s0-l1","1-s0-l2",
  "1-s1-l0","1-s1-l1","1-s1-l2","1-s1-l3",
  "1-s2-l0","1-s2-l1","1-s2-l2",
  "1-s3-l0","1-s3-l1","1-s3-l2","1-s3-l3","1-s3-l4",
  "1-s4-l0","1-s4-l1","1-s4-l2","1-s4-l3",
  "1-s5-l0","1-s5-l1","1-s5-l2",
  "1-s6-l0","1-s6-l1","1-s6-l2",
];

const COURSE_2_LESSONS = [
  "2-s0-l0","2-s0-l1","2-s0-l2",
  "2-s1-l0","2-s1-l1","2-s1-l2","2-s1-l3",
  "2-s2-l0","2-s2-l1","2-s2-l2","2-s2-l3",
  "2-s3-l0","2-s3-l1","2-s3-l2","2-s3-l3","2-s3-l4",
  "2-s4-l0","2-s4-l1","2-s4-l2","2-s4-l3",
  "2-s5-l0","2-s5-l1",
];

const COURSE_3_LESSONS = [
  "3-s0-l0","3-s0-l1","3-s0-l2","3-s0-l3","3-s0-l4","3-s0-l5",
  "3-s1-l0","3-s1-l1","3-s1-l2","3-s1-l3","3-s1-l4","3-s1-l5",
  "3-s2-l0","3-s2-l1","3-s2-l2","3-s2-l3","3-s2-l4","3-s2-l5",
];

const COURSE_5_LESSONS = [
  "5-s0-l0","5-s0-l1","5-s0-l2","5-s0-l3","5-s0-l4","5-s0-l5","5-s0-l6",
  "5-s1-l0","5-s1-l1","5-s1-l2","5-s1-l3","5-s1-l4","5-s1-l5","5-s1-l6",
  "5-s2-l0","5-s2-l1","5-s2-l2","5-s2-l3","5-s2-l4",
  "5-s3-l0","5-s3-l1","5-s3-l2","5-s3-l3","5-s3-l4","5-s3-l5",
  "5-s4-l0","5-s4-l1","5-s4-l2","5-s4-l3","5-s4-l4",
];

const COURSE_6_LESSONS = [
  "6-s0-l0","6-s0-l1","6-s0-l2","6-s0-l3",
  "6-s1-l0","6-s1-l1","6-s1-l2","6-s1-l3",
  "6-s2-l0","6-s2-l1","6-s2-l2","6-s2-l3",
  "6-s3-l0","6-s3-l1","6-s3-l2","6-s3-l3","6-s3-l4",
  "6-s4-l0","6-s4-l1","6-s4-l2",
];

// ─── Generate base records for each enrolled course ──────────────────────────

const course1 = buildSeedRecords("u-alex", 1, COURSE_1_LESSONS, 25, daysAgo(120), daysAgo(7));
const course2 = buildSeedRecords("u-alex", 2, COURSE_2_LESSONS, 22, daysAgo(100), daysAgo(15));
const course3 = buildSeedRecords("u-alex", 3, COURSE_3_LESSONS, 12, daysAgo(30), hoursAgo(3));
const course5 = buildSeedRecords("u-alex", 5, COURSE_5_LESSONS, 13, daysAgo(20), daysAgo(2));
const course6 = buildSeedRecords("u-alex", 6, COURSE_6_LESSONS, 6, daysAgo(15), daysAgo(5));

// ─── Patch special records (quiz attempts, submissions) ──────────────────────

function patchRecord(records, lessonId, patch) {
  const idx = records.findIndex((r) => r.lessonId === lessonId);
  if (idx === -1) return;
  Object.assign(records[idx], patch, { updatedAt: patch.updatedAt || records[idx].updatedAt });
}

// Course 1 — exercise submissions (all 25 lessons completed)
patchRecord(course1, "1-s1-l3", {
  status: "completed",
  completedAt: daysAgo(106),
  submission: {
    attempt: {
      content: "Commit hash: a3f8c2d\n\nInitialized the project with a clean folder structure:\n- src/\n- public/\n- .gitignore (with node_modules/)\n- package.json",
      attachments: [],
      submittedAt: daysAgo(106),
    },
    draft: null,
    submittedAt: daysAgo(106),
  },
});
patchRecord(course1, "1-s3-l4", {
  status: "completed",
  completedAt: daysAgo(49),
  submission: {
    attempt: {
      content: "Test file: App.test.jsx\n\nTests render correctly with mock data.\n\nErrorBoundary component:\nclass ErrorBoundary extends React.Component {\n  static getDerivedStateFromError(error) { return { hasError: true }; }\n  render() { return this.state.hasError ? <Fallback /> : this.props.children; }\n}",
      attachments: [],
      submittedAt: daysAgo(49),
    },
    draft: null,
    submittedAt: daysAgo(49),
  },
});

// Course 3 — first 12 lessons completed (3-s0-l0 … 3-s1-l5). The current
// lesson is the quiz at 3-s2-l0; one failed attempt is on record (score 40
// < passing 60), so the lesson stays in-progress and keeps completedLessons
// at 12.
patchRecord(course3, "3-s2-l0", {
  status: "in-progress",
  completedAt: null,
  quiz: {
    attempts: [
      {
        score: 40,
        correctCount: 2,
        totalCount: 5,
        submittedAt: hoursAgo(4),
      },
    ],
    lastAnswers: null,
  },
});

// Course 5 — first 13 lessons completed (5-s0-l0 … 5-s1-l5). The current
// lesson is 5-s1-l6.
patchRecord(course5, "5-s1-l6", {
  status: "in-progress",
  completedAt: null,
});

// Course 6 — first 6 lessons completed (6-s0-l0 … 6-s1-l1). The current
// lesson is 6-s1-l2.
patchRecord(course6, "6-s1-l2", {
  status: "in-progress",
  completedAt: null,
});

// ─── Assemble all progress records ───────────────────────────────────────────

/** @type {StudentLessonProgress[]} */
export const studentLessonProgress = [
  ...course1,
  ...course2,
  ...course3,
  ...course5,
  ...course6,
];

// ─── Indexes ─────────────────────────────────────────────────────────────────

/** All progress rows for a student + course. */
export const progressByStudentAndCourse = (studentId, courseId) => {
  const numericId = Number(courseId);
  return studentLessonProgress.filter(
    (r) => r.studentId === studentId && r.courseId === numericId
  );
};

/** Single lesson progress row. */
export const lessonProgressByComposite = (studentId, courseId, lessonId) => {
  const numericId = Number(courseId);
  return (
    studentLessonProgress.find(
      (r) =>
        r.studentId === studentId &&
        r.courseId === numericId &&
        r.lessonId === lessonId
    ) || null
  );
};
