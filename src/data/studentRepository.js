/**
 * Student data repository — the ONLY module that composes the catalog
 * (src/data/courses) with the learner's enrollment (src/data/student) and
 * derives progress/status/resume state from the real syllabus.
 *
 * UI components and pages must never import mock data directly; they call
 * these helpers and receive presentation-ready records via props.
 */

import courses, { getCourseById } from "src/data/courses";
import { enrolledCourses } from "src/data/student/enrollment";
import { getStudentProfile } from "src/data/student/profile";
import { buildLessonId } from "src/lib/lessonId";
import { formatRelativeTime, formatDueLabel } from "src/lib/format";
import { getCourseAnnouncements } from "src/data/announcementsData";
import { getCourseResources } from "src/data/resourcesData";
import { getLessonMedia } from "src/data/lessonMedia";
import quizData from "src/data/quizData";
import exerciseData from "src/data/student/exerciseData";
import {
  getAllNotes,
  getNotesForCourse,
  addNote,
  updateNote,
  deleteNote,
  getRecentNotes as getRecentNotesFromStore,
  getNotesForLesson,
  addLessonNote,
} from "src/data/student/notesStore";
import {
  getCommentsForLesson,
  addComment,
} from "src/data/student/lessonComments";
import {
  getWishlistIds,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "src/data/student/wishlistStore";
import {
  courseScores,
  performanceByCategory,
  scoreTrend,
} from "src/data/student/grades";
import { learningActivity } from "src/data/fixtures/dashboardData";
import { TASK_META, COURSE_CATEGORY_MAP } from "src/data/student/taskData";
import {
  getCourseModel,
  saveCourseModel,
  clearStoredProgress,
  buildSeedModel,
  getQuizRecord,
  patchQuizRecord,
  appendQuizAttempt,
  getSubmissionRecord as getSubmissionRecordFromStore,
  saveSubmissionDraft as saveSubmissionDraftToStore,
  clearSubmissionDraft as clearSubmissionDraftFromStore,
  setSubmissionAttempt as setSubmissionAttemptToStore,
  clearSubmissionAttempt as clearSubmissionAttemptFromStore,
} from "src/data/student/lessonProgress";

// ---- Enrollment extension (Phase 9) ----
//
// Prototype-only supplemental enrollments (e.g. enrolled from the wishlist).
// This array resets on page reload — it is NOT persisted. All enrollment reads
// go through `allEnrollments()` so there is a single source of truth and no
// data disagreement between pages. A future backend replaces this with the
// real read path.
const supplementalEnrollments = [];

function allEnrollments() {
  return [...enrolledCourses, ...supplementalEnrollments];
}

/**
 * Flat, syllabus-ordered lesson list carrying the opaque id + preview flag.
 * Built in the same iteration order the syllabus renders, so an index into this
 * array lines up 1:1 with the lesson at `sections[si].lessons[li]`.
 */
function buildFlatLessons(courseId, sectionsWithLessons) {
  const flat = [];
  sectionsWithLessons.forEach((section, sectionIndex) => {
    (section.lessons || []).forEach((lesson, lessonIndex) => {
      flat.push({
        lessonId: buildLessonId(courseId, sectionIndex, lessonIndex),
        isPreview: Boolean(lesson.preview),
        sectionIndex,
        lessonIndex,
      });
    });
  });
  return flat;
}

/**
 * Derive per-lesson statuses + the first open lesson from a progress model.
 *
 * Unlock rule: a lesson is locked only while an earlier *non-preview* lesson is
 * still incomplete. Previews are always accessible; completed lessons stay
 * completed regardless of position. This keeps the legacy "first N lessons done"
 * seeding behaviour while supporting out-of-order completion.
 */
function deriveStatuses(flatLessons, model) {
  const statuses = new Array(flatLessons.length);
  let prevNonPreviewIncomplete = false;
  let firstOpen = -1;
  for (let i = 0; i < flatLessons.length; i += 1) {
    const fl = flatLessons[i];
    const isCompleted = model.lessons[fl.lessonId]?.status === "completed";
    if (isCompleted) {
      statuses[i] = "completed";
    } else if (fl.isPreview) {
      statuses[i] = "not-started";
    } else if (!prevNonPreviewIncomplete) {
      statuses[i] = "in-progress";
      if (firstOpen === -1) firstOpen = i;
      prevNonPreviewIncomplete = true;
    } else {
      statuses[i] = "locked";
    }
  }
  return { statuses, firstOpen };
}

/**
 * Resolve the resume target: strictly the first incomplete, not-locked lesson
 * in syllabus order. We deliberately ignore `lastAccessedLessonId` so the
 * "Pick Up Next" pointer always starts at the earliest outstanding lesson
 * (Lesson 1) rather than jumping to a later one. When every lesson is done we
 * return the first lesson so learners can review.
 */
function resolveResumeTarget(flatLessons, statuses) {
  const firstIncomplete = statuses.findIndex(
    (s) => s !== "completed" && s !== "locked"
  );
  if (firstIncomplete !== -1) return firstIncomplete;
  if (statuses.length > 0) return 0;
  return -1;
}

// Compose a single presentation-ready view of one enrolled course.
// Returns a status discriminator ("ready" | "not-found" | "not-enrolled")
// so callers can branch without throwing.
function buildEnrolledCourseView(courseId) {
  const numericId = Number(courseId);
  const enrollment = allEnrollments().find((e) => e.id === numericId);
  if (!enrollment) {
    return { status: "not-enrolled", courseId: numericId };
  }

  const course = getCourseById(numericId);
  if (!course) {
    return { status: "not-found", courseId: numericId };
  }

  const rawSections = course.curriculum ?? [];
  const sectionsWithLessons = rawSections.map((section) => ({
    ...section,
    lessons: (section.lessons || []).map((lesson) => ({ ...lesson })),
  }));

  // Single source of truth: read the learner's per-lesson progress model, falling
  // back to a sequential seed derived from the legacy enrollment count.
  const flatLessons = buildFlatLessons(numericId, sectionsWithLessons);
  const model =
    getCourseModel(numericId) || buildSeedModel(flatLessons, enrollment.completedLessons);
  const { statuses } = deriveStatuses(flatLessons, model);

  const totalLessons = flatLessons.length;
  const completedCount = statuses.filter((s) => s === "completed").length;
  const completedNonPreview = flatLessons.filter(
    (fl, i) => statuses[i] === "completed" && !fl.isPreview
  ).length;
  const nonPreviewTotal = flatLessons.filter((fl) => !fl.isPreview).length;
  const courseCompleted =
    nonPreviewTotal > 0 && completedNonPreview === nonPreviewTotal;
  const progress =
    totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
  const derivedStatus = courseCompleted
    ? "Completed"
    : completedNonPreview === 0
      ? "Not Started"
      : "In Progress";

  let cursor = 0;
  const sections = sectionsWithLessons.map((section, sectionIndex) => {
    const lessons = section.lessons.map((lesson) => {
      const status = statuses[cursor] || "locked";
      const lessonId = flatLessons[cursor].lessonId;
      cursor += 1;
      return { ...lesson, status, lessonId };
    });
    const completedCountSection = lessons.filter((l) => l.status === "completed").length;
    return { ...section, sectionIndex, lessons, completedCount: completedCountSection };
  });

  const resumeIndex = resolveResumeTarget(flatLessons, statuses);
  const resumeTarget =
    resumeIndex !== -1
      ? {
          sectionIndex: flatLessons[resumeIndex].sectionIndex,
          lessonIndex: flatLessons[resumeIndex].lessonIndex,
          lessonId: flatLessons[resumeIndex].lessonId,
          title:
            sections[flatLessons[resumeIndex].sectionIndex].lessons[
              flatLessons[resumeIndex].lessonIndex
            ].title,
          type:
            sections[flatLessons[resumeIndex].sectionIndex].lessons[
              flatLessons[resumeIndex].lessonIndex
            ].type,
        }
      : null;

  return {
    status: "ready",
    courseId: numericId,
    course,
    id: course.id,
    title: course.title,
    image: course.image,
    instructorName: course.instructors?.[0]?.name || "Instructor",
    hours: course.hours ?? 0,
    category: course.category ?? null,
    enrollmentStatus: enrollment.enrollmentStatus,
    completedLessons: completedCount,
    totalLessons,
    progress,
    derivedStatus,
    courseCompleted,
    lastAccessed: enrollment.lastAccessed,
    dueDate: enrollment.dueDate ?? null,
    sections,
    resumeTarget,
    resumeSectionIndex: resumeTarget ? resumeTarget.sectionIndex : -1,
    lastAccessedLabel: formatRelativeTime(enrollment.lastAccessed),
  };
}

// GET /student/courses — every enrolled course as a summary view.
export function getEnrolledCourses() {
  return allEnrollments()
    .map((enrollment) => {
      const view = buildEnrolledCourseView(enrollment.id);
      if (view.status !== "ready") return null;
      return {
        id: view.id,
        title: view.title,
        image: view.image,
        instructorName: view.instructorName,
        hours: view.hours,
        category: view.category,
        status: view.derivedStatus,
        enrollmentStatus: view.enrollmentStatus,
        progress: view.progress,
        completedLessons: view.completedLessons,
        totalLessons: view.totalLessons,
        lastAccessed: view.lastAccessed,
        dueDate: view.dueDate,
        resumeTitle: view.resumeTarget ? view.resumeTarget.title : null,
        resumeType: view.resumeTarget ? view.resumeTarget.type : null,
        resumeLessonId: view.resumeTarget ? view.resumeTarget.lessonId : null,
      };
    })
    .filter(Boolean);
}

// GET /student/courses/:id — full detail view, including the syllabus with
// per-lesson statuses and the resume target.
export function getEnrolledCourseData(courseId) {
  return buildEnrolledCourseView(courseId);
}

// Dashboard-only mock telemetry that isn't derived from the learner's
// enrollment. Exposed through the repository so the page never imports the
// fixture directly (single data-flow contract).
export function getLearningActivity() {
  return learningActivity;
}

/** The current learner's identity — re-exported so pages call one module. */
export { getStudentProfile };

const DAY_MS = 24 * 60 * 60 * 1000;

/** Local-calendar midnight for a timestamp, so "same day" compares by date. */
function dayKey(ms) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * Learning streak: consecutive days with at least one real learning activity.
 *
 * Activity sources are strictly timestamped events — lesson completions,
 * assignment submissions, quiz attempts, and course access. The weekly
 * `learningActivity` fixture is deliberately NOT used: it only carries weekly
 * aggregates, and expanding those into days would fabricate history.
 *
 * @param {number} [nowMs=Date.now()]
 * @returns {{ current: number, longest: number } | null} null when there is no
 *   timestamped activity at all (callers should hide the streak, never show 0).
 */
export function getStreak(nowMs = Date.now()) {
  const activityDays = new Set();
  const recordDay = (iso) => {
    if (!iso) return;
    const ms = new Date(iso).getTime();
    if (!Number.isFinite(ms)) return;
    activityDays.add(dayKey(ms));
  };

  allEnrollments().forEach((enrollment) => {
    recordDay(enrollment.lastAccessed);
    const m = materializeModel(enrollment.id);
    if (!m) return;
    Object.values(m.model.lessons).forEach((record) => {
      recordDay(record.completedAt);
      recordDay(record.submission?.submittedAt);
      (record.quiz?.attempts || []).forEach((attempt) =>
        recordDay(attempt.submittedAt)
      );
    });
  });

  if (activityDays.size === 0) return null;

  // Convert back to comparable midnight timestamps, ascending.
  const parseDayKey = (key) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m, d).getTime();
  };
  const days = [...activityDays].map(parseDayKey).sort((a, b) => a - b);

  // Longest run of consecutive days anywhere in the history.
  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i += 1) {
    run = days[i] - days[i - 1] === DAY_MS ? run + 1 : 1;
    if (run > longest) longest = run;
  }

  // Current streak: consecutive days ending today or yesterday (an active
  // yesterday keeps today's streak alive until the day ends).
  const today = parseDayKey(dayKey(nowMs));
  const last = days[days.length - 1];
  let current = 0;
  if (last === today || last === today - DAY_MS) {
    current = 1;
    for (let i = days.length - 1; i > 0; i -= 1) {
      if (days[i] - days[i - 1] !== DAY_MS) break;
      current += 1;
    }
  }

  return { current, longest };
}

/**
 * Personalized catalog picks: courses sharing a category with any of the
 * learner's enrollments, excluding already-enrolled ones. Ranked by how many
 * enrolled categories they match, then by rating. Cold start (no category
 * signal) falls back to top-rated catalog courses.
 *
 * @param {number} [limit=4]
 * @returns {Array<{id:number,title:string,image:string,instructorName:string,rating:number,price:string,category:string}>}
 */
export function getRecommendedCourses(limit = 4) {
  const enrolledIds = new Set(allEnrollments().map((e) => e.id));
  const enrolledCategories = new Set(
    allEnrollments()
      .map((e) => getCourseById(e.id)?.category)
      .filter(Boolean)
  );

  const candidates = courses
    .filter((c) => !enrolledIds.has(c.id))
    .map((course) => ({
      id: course.id,
      title: course.title,
      image: course.image,
      instructorName: course.instructors?.[0]?.name || "Instructor",
      rating: course.rating ?? 0,
      price: course.price,
      category: course.category,
      matchCount: enrolledCategories.has(course.category) ? 1 : 0,
    }));

  const ranked =
    enrolledCategories.size === 0
      ? candidates.sort((a, b) => b.rating - a.rating)
      : candidates.sort(
          (a, b) => b.matchCount - a.matchCount || b.rating - a.rating
        );

  return ranked.slice(0, limit).map((candidate) => ({
    id: candidate.id,
    title: candidate.title,
    image: candidate.image,
    instructorName: candidate.instructorName,
    rating: candidate.rating,
    price: candidate.price,
    category: candidate.category,
  }));
}

// ---- Per-lesson progress API (Phase 5) ----
//
// These are the ONLY functions UI should call for progress. They compose the
// catalog with the per-lesson model held by lessonProgress.js and never let
// components touch localStorage directly.

// Materialize the progress model for a course: seed it from the legacy
// enrollment count when nothing has been stored yet, otherwise return the
// stored model. Returns null for unknown courses.
function materializeModel(courseId) {
  const numericId = Number(courseId);
  const course = getCourseById(numericId);
  if (!course) return null;
  const sectionsWithLessons = (course.curriculum ?? []).map((s) => ({
    ...s,
    lessons: (s.lessons || []).map((l) => ({ ...l })),
  }));
  const flat = buildFlatLessons(numericId, sectionsWithLessons);
  const enrollment = allEnrollments().find((e) => e.id === numericId);
  const seedCount = enrollment ? enrollment.completedLessons : 0;
  const stored = getCourseModel(numericId);
  return { model: stored || buildSeedModel(flat, seedCount), flat, courseId: numericId };
}

/** Progress for a single lesson, or null when untouched. */
export function getLessonProgress(courseId, lessonId) {
  const m = materializeModel(courseId);
  if (!m) return null;
  return m.model.lessons[String(lessonId)] || null;
}

/**
 * Persist a partial update for a lesson (e.g. video progress or a manual
 * completion). Returns the updated lesson record.
 */
export function updateLessonProgress(courseId, lessonId, patch) {
  const m = materializeModel(courseId);
  if (!m) return null;
  const id = String(lessonId);
  const existing = m.model.lessons[id] || { status: "in-progress" };
  m.model.lessons[id] = {
    ...existing,
    ...patch,
    status: patch.status || existing.status || "in-progress",
  };
  saveCourseModel(m.courseId, m.model);
  return m.model.lessons[id];
}

/**
 * Mark a lesson completed and advance the resume pointer to the next unlocked
 * lesson. Returns `{ nextLessonId, courseCompleted }`.
 */
export function completeLesson(courseId, lessonId) {
  const m = materializeModel(courseId);
  if (!m) return { nextLessonId: null, courseCompleted: false };
  const id = String(lessonId);
  m.model.lessons[id] = {
    ...(m.model.lessons[id] || {}),
    status: "completed",
    completedAt: new Date().toISOString(),
  };

  const { statuses } = deriveStatuses(m.flat, m.model);
  const idx = m.flat.findIndex((f) => f.lessonId === id);
  let nextIdx = -1;
  for (let i = idx + 1; i < m.flat.length; i += 1) {
    if (statuses[i] !== "locked") {
      nextIdx = i;
      break;
    }
  }
  const nextLessonId = nextIdx !== -1 ? m.flat[nextIdx].lessonId : null;
  m.model.lastAccessedLessonId = nextLessonId || id;

  const completedNonPreview = m.flat.filter(
    (fl, i) => statuses[i] === "completed" && !fl.isPreview
  ).length;
  const nonPreviewTotal = m.flat.filter((fl) => !fl.isPreview).length;
  const courseCompleted = nonPreviewTotal > 0 && completedNonPreview === nonPreviewTotal;
  saveCourseModel(m.courseId, m.model);
  return { nextLessonId, courseCompleted };
}

/** Record that a lesson was opened, so resume points back to it. */
export function recordLessonAccess(courseId, lessonId) {
  const m = materializeModel(courseId);
  if (!m) return;
  m.model.lastAccessedLessonId = String(lessonId);
  saveCourseModel(m.courseId, m.model);
}

/** Derived progress summary for a course. */
export function getCourseProgress(courseId) {
  const m = materializeModel(courseId);
  if (!m) {
    return {
      completedCount: 0,
      totalLessons: 0,
      progress: 0,
      lastAccessedLessonId: null,
      courseCompleted: false,
    };
  }
  const { statuses } = deriveStatuses(m.flat, m.model);
  const totalLessons = m.flat.length;
  const completedCount = statuses.filter((s) => s === "completed").length;
  const completedNonPreview = m.flat.filter(
    (fl, i) => statuses[i] === "completed" && !fl.isPreview
  ).length;
  const nonPreviewTotal = m.flat.filter((fl) => !fl.isPreview).length;
  const courseCompleted = nonPreviewTotal > 0 && completedNonPreview === nonPreviewTotal;
  const progress = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
  return {
    completedCount,
    totalLessons,
    progress,
    lastAccessedLessonId: m.model.lastAccessedLessonId || null,
    courseCompleted,
  };
}

/** Thin wrapper over the resume target for callers that only need the lesson. */
export function getResumeLesson(courseId) {
  const view = buildEnrolledCourseView(courseId);
  return view.status === "ready" ? view.resumeTarget : null;
}

/** Remove all stored progress for a course (dev/reset helper). */
export function clearCourseProgress(courseId) {
  clearStoredProgress(courseId);
}

// Resolve a lesson by the opaque composite id used in the URL
// (format: `${courseId}-s${section}-l${lesson}`). The player receives a
// lesson descriptor and never parses the id itself.
export function resolveLesson(courseId, lessonId) {
  if (!lessonId || typeof lessonId !== "string") return null;
  const match = lessonId.match(/^(\d+)-s(\d+)-l(\d+)$/);
  if (!match) return null;

  const course = getCourseById(courseId);
  if (!course) return null;

  const sectionIndex = Number(match[2]);
  const lessonIndex = Number(match[3]);
  const sections = course.curriculum ?? [];
  const section = sections[sectionIndex];
  if (!section) return null;
  const lesson = section.lessons?.[lessonIndex];
  if (!lesson) return null;

  return {
    courseId: Number(courseId),
    sectionIndex,
    lessonIndex,
    lessonId,
    title: lesson.title,
    type: lesson.type,
    duration: lesson.duration,
    isPreview: lesson.preview || false,
    sectionTitle: section.title,
  };
}

// Media (video/captions) for a lesson, or null when the prototype has no real
// asset. The player only renders a native <video> when this returns a source —
// it never invents hosting conventions.
export function getLessonMediaFor(lessonId) {
  return getLessonMedia(lessonId);
}

export function getCourseAnnouncementsFor(courseId) {
  return getCourseAnnouncements(courseId);
}

export function getCourseResourcesFor(courseId) {
  return getCourseResources(courseId);
}

// ---- Quiz engine API (Phase 6) ----
//
// All quiz UI goes through these helpers and never imports quizData.js
// directly. The repository owns the validity check (a QuizSpec is returned
// only when the data is well-formed) and the single source of truth for
// scoring/completion, so a backend swaps in by replacing these bodies.

const MAX_STORED_ATTEMPTS = 20;

/**
 * Validate a raw quiz bank and return a normalized QuizSpec, or null when the
 * data is structurally invalid (empty question list, or passingScore outside
 * the 0–100 range). Absence of a key also returns null.
 *
 * @param {string} lessonId
 * @returns {object|null}
 */
export function getQuizData(lessonId) {
  const raw = quizData[String(lessonId)];
  if (!raw || !raw.questions || raw.questions.length === 0) return null;
  const passingScore = typeof raw.passingScore === "number" ? raw.passingScore : 0;
  if (passingScore < 0 || passingScore > 100) return null;
  const maxAttempts = raw.maxAttempts === null || raw.maxAttempts === undefined
    ? null
    : Number(raw.maxAttempts);
  if (Number.isNaN(maxAttempts) || (maxAttempts !== null && maxAttempts < 0)) return null;
  return {
    passingScore,
    maxAttempts,
    questions: raw.questions,
  };
}

/** Answers for one attempt: { [questionId]: string | string[] }. */

/**
 * Normalize a set of answers against the question bank before scoring.
 *
 * - Multiple choice: unknown option ids are discarded, duplicates removed,
 *   then sorted so reordering never changes the score.
 * - Single / true-false: kept as-is (or discarded when unknown/missing).
 *
 * @param {object} spec QuizSpec
 * @param {Record<string, string|string[]>} answers
 * @returns {Record<string, string|string[]>}
 */
function normalizeAnswers(spec, answers) {
  const out = {};
  if (!answers || typeof answers !== "object") return out;
  const optionsById = new Map();
  spec.questions.forEach((q) => {
    const set = new Set();
    q.options.forEach((o) => set.add(o.id));
    optionsById.set(q.id, set);
  });
  spec.questions.forEach((q) => {
    const known = optionsById.get(q.id);
    const val = answers[q.id];
    if (q.type === "multiple") {
      const arr = Array.isArray(val) ? val : val == null ? [] : [val];
      const unique = [...new Set(arr.filter((v) => typeof v === "string" && known.has(v)))];
      out[q.id] = unique.sort();
    } else {
      const scalar = Array.isArray(val) ? val[0] : val;
      if (typeof scalar === "string" && known.has(scalar)) out[q.id] = scalar;
    }
  });
  return out;
}

/** Compare a normalized answer to the question's correct answer. */
function isQuestionCorrect(question, answer) {
  if (answer === undefined) return false;
  if (question.type === "multiple") {
    const expected = Array.isArray(question.correctAnswer)
      ? [...question.correctAnswer].sort()
      : [String(question.correctAnswer)].sort();
    const actual = Array.isArray(answer) ? [...answer].sort() : [String(answer)].sort();
    if (expected.length === 0 || actual.length !== expected.length) return false;
    return expected.every((v, i) => v === actual[i]);
  }
  // single / true-false
  const expected = question.correctAnswer;
  return answer === expected;
}

/**
 * Score a set of answers against the authoritative question list.
 *
 * @param {object} spec QuizSpec
 * @param {Record<string, string|string[]>} answers
 * @returns {{score:number, correctCount:number, totalCount:number, passed:boolean}}
 */
function scoreAnswers(spec, answers) {
  const normalized = normalizeAnswers(spec, answers);
  let correctCount = 0;
  const total = spec.questions.length;
  spec.questions.forEach((q) => {
    if (isQuestionCorrect(q, normalized[q.id])) correctCount += 1;
  });
  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  const passed = score >= spec.passingScore;
  return { score, correctCount, totalCount: total, passed };
}

/**
 * All attempts for a lesson. Always returns an array (never null); missing or
 * malformed quiz records degrade to an empty list.
 *
 * @param {string|number} courseId
 * @param {string} lessonId
 * @returns {object[]}
 */
export function getQuizAttempts(courseId, lessonId) {
  const record = getQuizRecord(courseId, lessonId);
  return record ? record.attempts : [];
}

/** Draft answers for a lesson, or null when none exist. */
export function getQuizDraftAnswers(courseId, lessonId) {
  const record = getQuizRecord(courseId, lessonId);
  return record ? record.lastAnswers : null;
}

/** Persist draft answers (overwrites any previous draft). */
export function saveQuizDraftAnswers(courseId, lessonId, answers) {
  patchQuizRecord(courseId, lessonId, { lastAnswers: answers || null });
}

/** Remove saved draft answers without touching attempt history. */
export function clearQuizDraftAnswers(courseId, lessonId) {
  patchQuizRecord(courseId, lessonId, { lastAnswers: null });
}

/**
 * Whether the learner has at least one attempt remaining.
 *
 * @param {string|number} courseId
 * @param {string} lessonId
 * @returns {boolean}
 */
export function hasRemainingAttempts(courseId, lessonId) {
  const spec = getQuizData(lessonId);
  if (!spec) return false;
  if (spec.maxAttempts === 0) return false;
  if (spec.maxAttempts === null) return true;
  const attempts = getQuizAttempts(courseId, lessonId);
  return attempts.length < spec.maxAttempts;
}

/** Best numeric score across all attempts, or null when never attempted. */
export function getQuizBestScore(courseId, lessonId) {
  const attempts = getQuizAttempts(courseId, lessonId);
  if (attempts.length === 0) return null;
  return Math.max(...attempts.map((a) => a.score));
}

/**
 * Submit a quiz attempt. This is the SOLE place where a passed quiz triggers
 * lesson completion, so double-completion cannot occur. Each call records one
 * attempt (the repository never deduplicates identical answers). On a pass it
 * delegates to completeLesson() to drive the Phase 5 progress/resume model.
 *
 * @param {string|number} courseId
 * @param {string} lessonId
 * @param {Record<string, string|string[]>} answers
 * @returns {{attempt:object, passed:boolean, courseCompleted:boolean, nextLessonId:string|null} | null}
 */
export function submitQuizAttempt(courseId, lessonId, answers) {
  const spec = getQuizData(lessonId);
  if (!spec) return null;

  const { score, correctCount, totalCount, passed } = scoreAnswers(spec, answers);
  const attempt = Object.freeze({
    answers: normalizeAnswers(spec, answers),
    score,
    correctCount,
    totalCount,
    submittedAt: new Date().toISOString(),
  });

  appendQuizAttempt(courseId, lessonId, attempt);
  if (passed) {
    const result = completeLesson(courseId, lessonId);
    return { attempt, passed, courseCompleted: result.courseCompleted, nextLessonId: result.nextLessonId };
  }
  return { attempt, passed: false, courseCompleted: false, nextLessonId: null };
}

// ---- Assignment submission API (Phase 7) ----
//
// All submission UI goes through these helpers and never imports
// exerciseData.js directly. The repository owns the validity check (an
// ExerciseSpec is returned only when the data is well-formed) and the single
// completion path, so a backend swaps in by replacing these bodies.

/**
 * Validate a raw exercise spec and return a normalized ExerciseSpec, or null
 * when the data is structurally invalid (empty instructions).
 *
 * @param {string} lessonId
 * @returns {object|null}
 */
export function getExerciseData(lessonId) {
  const raw = exerciseData[String(lessonId)];
  if (!raw || !raw.instructions || raw.instructions.trim().length === 0) return null;
  return {
    title: raw.title || "",
    instructions: raw.instructions,
    deliverable: raw.deliverable || "",
    primaryInput: raw.primaryInput || "text",
    language: raw.language || null,
    hints: Array.isArray(raw.hints) ? raw.hints : [],
    attachments: {
      allow: raw.attachments?.allow ?? true,
      max: raw.attachments?.max ?? 3,
      maxSize: raw.attachments?.maxSize ?? 1048576,
    },
  };
}

/**
 * Read the opaque submission sub-record for a lesson.
 * @returns {{attempt: object|null, draft: object|null, submittedAt: string|null} | null}
 */
export function getSubmissionRecord(courseId, lessonId) {
  return getSubmissionRecordImpl(courseId, lessonId);
}

/** Thin wrapper; resolves through the persistence adapter. */
export function getSubmissionDraft(courseId, lessonId) {
  const record = getSubmissionRecordImpl(courseId, lessonId);
  return record ? record.draft : null;
}

/** Persist (overwrite) the submission draft. */
export function saveSubmissionDraft(courseId, lessonId, draft) {
  saveSubmissionDraftImpl(courseId, lessonId, draft);
}

/** Remove a saved submission draft without touching any recorded attempt. */
export function clearSubmissionDraft(courseId, lessonId) {
  clearSubmissionDraftImpl(courseId, lessonId);
}

/**
 * Submit the current draft as the canonical attempt. Validates that content is
 * non-empty (after trimming), records an immutable attempt snapshot, clears the
 * draft, and calls completeLesson() to drive the Phase 5 progress model.
 *
 * Returns null if no spec exists for the lesson, or { error: string } if
 * validation fails (e.g. empty content).
 *
 * On success returns:
 * { attempt, nextLessonId, courseCompleted }
 * — identical shape to submitQuizAttempt for consistent page-level handling.
 */
export function submitAssignmentAttempt(courseId, lessonId, draft) {
  const spec = getExerciseData(lessonId);
  if (!spec) return null;

  const content = draft?.content ?? "";
  if (typeof content !== "string" || content.trim().length === 0) {
    return { error: "Submission cannot be empty." };
  }

  const attempt = Object.freeze({
    content: content,
    attachments: Array.isArray(draft?.attachments) ? [...draft.attachments] : [],
    submittedAt: new Date().toISOString(),
  });

  setSubmissionAttemptImpl(courseId, lessonId, attempt);
  const result = completeLesson(courseId, lessonId);
  return {
    attempt,
    courseCompleted: result.courseCompleted,
    nextLessonId: result.nextLessonId,
  };
}

/**
 * Clear a recorded submission attempt so the learner can re-draft.
 * Returns { nextLessonId, courseCompleted } by recomputing from the current
 * model state (the attempt was cleared and status reverted to "in-progress"
 * by clearSubmissionAttempt in the store).
 */
export function resetSubmission(courseId, lessonId) {
  clearSubmissionAttemptFromStore(courseId, lessonId);
  return recomputeAfterReset(courseId, lessonId);
}

// --- Private implementations that delegate to the persistence adapter ---

function getSubmissionRecordImpl(courseId, lessonId) {
  return getSubmissionRecordFromStore(courseId, lessonId);
}

function saveSubmissionDraftImpl(courseId, lessonId, draft) {
  saveSubmissionDraftToStore(courseId, lessonId, draft);
}

function clearSubmissionDraftImpl(courseId, lessonId) {
  clearSubmissionDraftFromStore(courseId, lessonId);
}

function setSubmissionAttemptImpl(courseId, lessonId, attempt) {
  setSubmissionAttemptToStore(courseId, lessonId, attempt);
}

/**
 * After resetting a submission, recompute the next lesson + course-completed
 * state without forcing completion (the attempt was cleared, status reverted
 * to "in-progress" by clearSubmissionAttempt).
 */
function recomputeAfterReset(courseId, lessonId) {
  const m = materializeModel(courseId);
  if (!m) return { nextLessonId: null, courseCompleted: false };
  const { statuses } = deriveStatuses(m.flat, m.model);
  const idx = m.flat.findIndex((f) => f.lessonId === String(lessonId));
  let nextIdx = -1;
  for (let i = idx + 1; i < m.flat.length; i += 1) {
    if (statuses[i] !== "locked") {
      nextIdx = i;
      break;
    }
  }
  const nextLessonId = nextIdx !== -1 ? m.flat[nextIdx].lessonId : null;
  const completedNonPreview = m.flat.filter(
    (fl, i) => statuses[i] === "completed" && !fl.isPreview
  ).length;
  const nonPreviewTotal = m.flat.filter((fl) => !fl.isPreview).length;
  const courseCompleted =
    nonPreviewTotal > 0 && completedNonPreview === nonPreviewTotal;
  return { nextLessonId, courseCompleted };
}

// ---- Tasks & Deadlines API (Phase 8) ----
//
// A Task is a derived entity: an exercise/project lesson in an enrolled course,
// enriched with its submission/completion status, the course-level due date, and
// a resume URL into the player. The repository composes it from the syllabus,
// lessonProgress, enrollment, and the optional taskData fixture — never from a
// separate task store. This keeps a single source of truth and a clean backend
// replacement point.

/** Lesson types that produce a Task. */
const TASK_LESSON_TYPES = ["exercise", "project"];

/**
 * Collect the exercise/project lesson definitions for one course, each with its
 * opaque lessonId, title, type, and section title (in syllabus order).
 *
 * @param {object} course Catalog course (from getCourseById).
 */
function collectTaskLessonDefs(course) {
  const defs = [];
  (course.curriculum ?? []).forEach((section, sectionIndex) => {
    (section.lessons || []).forEach((lesson, lessonIndex) => {
      if (TASK_LESSON_TYPES.includes(lesson.type)) {
        defs.push({
          lessonId: buildLessonId(course.id, sectionIndex, lessonIndex),
          title: lesson.title,
          type: lesson.type,
          sectionTitle: section.title,
        });
      }
    });
  });
  return defs;
}

/**
 * Derive a Task's status from the lesson's progress record + submission record.
 *
 * @returns {{status:string, submittedAt:string|null, completedAt:string|null}}
 */
function deriveTaskStatus(courseId, lessonId, lessonRecord, submission) {
  if (lessonRecord?.status === TASK_STATUS.COMPLETED) {
    return {
      status: TASK_STATUS.COMPLETED,
      submittedAt: submission?.submittedAt ?? null,
      completedAt: lessonRecord?.completedAt ?? null,
    };
  }
  if (submission && submission.attempt && submission.submittedAt) {
    return { status: TASK_STATUS.SUBMITTED, submittedAt: submission.submittedAt, completedAt: null };
  }
  if (
    submission &&
    submission.draft &&
    typeof submission.draft.content === "string" &&
    submission.draft.content.trim().length > 0
  ) {
    return { status: TASK_STATUS.DRAFTING, submittedAt: null, completedAt: null };
  }
  return { status: TASK_STATUS.NOT_STARTED, submittedAt: null, completedAt: null };
}

/** Due-date clock state for a task (null when no due date). */
function taskDueState(task, nowMs) {
  if (!task.dueDate) return null;
  const { overdue } = formatDueLabel(task.dueDate, nowMs);
  return { overdue };
}

/** Sort rank for the "All" tab: upcoming → overdue → no-due → completed. */
function taskRank(task, nowMs) {
  if (task.status === TASK_STATUS.COMPLETED) return 3;
  const due = taskDueState(task, nowMs);
  if (!due) return 2;
  return due.overdue ? 1 : 0;
}

const dueTime = (task) => (task.dueDate ? new Date(task.dueDate).getTime() : Infinity);

function byDueAsc(a, b) {
  return dueTime(a) - dueTime(b);
}

function byRecencyDesc(a, b) {
  const ta = new Date(b.completedAt || b.submittedAt || 0).getTime();
  const tb = new Date(a.completedAt || a.submittedAt || 0).getTime();
  return ta - tb;
}

/**
 * Filter + sort a flat Task list for one of the page's filter tabs.
 *
 * @param {Task[]} tasks
 * @param {"all"|"upcoming"|"overdue"|"completed"} filter
 * @param {number} nowMs
 * @returns {Task[]}
 */
function applyTaskFilter(tasks, filter, nowMs) {
  let filtered;
  if (filter === "upcoming") {
    filtered = tasks.filter((t) => {
      const due = taskDueState(t, nowMs);
      return t.status !== TASK_STATUS.COMPLETED && due && !due.overdue;
    });
  } else if (filter === "overdue") {
    filtered = tasks.filter((t) => {
      const due = taskDueState(t, nowMs);
      return t.status !== TASK_STATUS.COMPLETED && due && due.overdue;
    });
  } else if (filter === "completed") {
    filtered = tasks.filter(
      (t) => t.status === TASK_STATUS.COMPLETED || t.status === TASK_STATUS.SUBMITTED
    );
  } else {
    filtered = tasks.slice();
  }

  if (filter === "completed") return filtered.slice().sort(byRecencyDesc);
  if (filter === "upcoming" || filter === "overdue") return filtered.slice().sort(byDueAsc);
  return filtered.slice().sort((a, b) => {
    const ra = taskRank(a, nowMs);
    const rb = taskRank(b, nowMs);
    if (ra !== rb) return ra - rb;
    return ra === 3 ? byRecencyDesc(a, b) : byDueAsc(a, b);
  });
}

/**
 * All exercise/project lessons across enrolled courses, each enriched with
 * submission status, due date, and a resume URL.
 *
 * @param {"all"|"upcoming"|"overdue"|"completed"} [filter="all"]
 * @returns {Task[]}
 */
export function getTasks(filter = "all") {
  const nowMs = Date.now();
  const tasks = [];

  allEnrollments().forEach((enrollment) => {
    const course = getCourseById(enrollment.id);
    if (!course) return;
    const { model } = materializeModel(enrollment.id);
    const defs = collectTaskLessonDefs(course);

    defs.forEach((def) => {
      const lessonRecord = model.lessons[String(def.lessonId)] || null;
      const submission = getSubmissionRecord(enrollment.id, def.lessonId);
      const { status, submittedAt, completedAt } = deriveTaskStatus(
        enrollment.id,
        def.lessonId,
        lessonRecord,
        submission
      );
      const meta = TASK_META[String(def.lessonId)] || {};

      tasks.push({
        taskId: def.lessonId,
        courseId: course.id,
        courseTitle: course.title,
        courseImage: course.image,
        instructorName: course.instructors?.[0]?.name || "Instructor",
        title: exerciseData[String(def.lessonId)]?.title || def.title,
        type: def.type,
        sectionTitle: def.sectionTitle,
        dueDate: enrollment.dueDate ?? null,
        status,
        submittedAt,
        completedAt,
        resumeUrl: `/student/course/${course.id}/play?lessonId=${def.lessonId}`,
        estimatedEffort: meta.estimatedEffort ?? null,
      });
    });
  });

  return applyTaskFilter(tasks, filter, nowMs);
}

/**
 * Upcoming deadlines: tasks with a due date (not completed), sorted soonest
 * first. Used by the dashboard's "Upcoming Deadlines" section. This is a strict
 * superset of the old course-level derivation — it also carries per-task status.
 *
 * @param {number} [limit=5]
 * @returns {Task[]}
 */
export function getUpcomingDeadlines(limit = 5) {
  const due = getTasks("all").filter((t) => t.status !== TASK_STATUS.COMPLETED && t.dueDate);
  due.sort(byDueAsc);
  return due.slice(0, limit);
}

// Pure task-status enum — the single set of task lifecycle values. No
// presentation (labels/colors/CTA text) lives here; labels are keyed by these
// values in TASK_STATUS_LABEL / TASK_ACTION_LABEL and badge styling lives in
// index.css (.badge-status-*).
export const TASK_STATUS = {
  NOT_STARTED: "not-started",
  DRAFTING: "drafting",
  SUBMITTED: "submitted",
  COMPLETED: "completed",
};

// Presentation only — status badge label text, keyed by TASK_STATUS. The
// badge styling itself lives in index.css (.badge-status-*), not here.
export const TASK_STATUS_LABEL = {
  [TASK_STATUS.NOT_STARTED]: "Not started",
  [TASK_STATUS.DRAFTING]: "Draft in progress",
  [TASK_STATUS.SUBMITTED]: "Submitted",
  [TASK_STATUS.COMPLETED]: "Completed",
};

// Presentation only — CTA text per task status, keyed by TASK_STATUS.
// "Revisit" is used for already-completed content (retake/review).
export const TASK_ACTION_LABEL = {
  [TASK_STATUS.NOT_STARTED]: "Start",
  [TASK_STATUS.DRAFTING]: "Continue Draft",
  [TASK_STATUS.SUBMITTED]: "View Submission",
  [TASK_STATUS.COMPLETED]: "Revisit",
};

// ---- Grades & Feedback API (Phase 8) ----
//
// A Grade is a course-level summary composed from the static courseScores, the
// learner's quiz attempts, and submission counts — all read through the existing
// repository helpers so a backend swaps in by replacing these bodies only.

export const getPerformanceByCategory = () => performanceByCategory;

export const getScoreTrend = () => scoreTrend;

export const getCourseScores = () => courseScores;

/**
 * Course-level grade summaries.
 *
 * @param {"all"|"completed"|"in-progress"} [filter="all"]
 * @returns {Grade[]}
 */
export function getGrades(filter = "all") {
  const grades = [];

  allEnrollments().forEach((enrollment) => {
    const course = getCourseById(enrollment.id);
    if (!course) return;
    const view = buildEnrolledCourseView(enrollment.id);
    const scoreEntry = courseScores.find((s) => s.course === course.title);
    const { model } = materializeModel(enrollment.id);

    let quizCount = 0;
    let quizAttempted = 0;
    let submissionCount = 0;
    let submissionSubmitted = 0;

    (course.curriculum ?? []).forEach((section, sectionIndex) => {
      (section.lessons || []).forEach((lesson, lessonIndex) => {
        const lessonId = buildLessonId(course.id, sectionIndex, lessonIndex);
        if (lesson.type === "quiz") {
          quizCount += 1;
          if (getQuizAttempts(enrollment.id, lessonId).length > 0) quizAttempted += 1;
        } else if (TASK_LESSON_TYPES.includes(lesson.type)) {
          submissionCount += 1;
          const rec = model.lessons[String(lessonId)] || null;
          const sub = getSubmissionRecord(enrollment.id, lessonId);
          if (rec?.status === "completed" || (sub && sub.attempt && sub.submittedAt)) {
            submissionSubmitted += 1;
          }
        }
      });
    });

    grades.push({
      courseId: course.id,
      courseTitle: course.title,
      courseImage: course.image,
      instructorName: course.instructors?.[0]?.name || "Instructor",
      score: scoreEntry?.score ?? null,
      grade: scoreEntry?.grade ?? null,
      status: view.derivedStatus,
      quizCount,
      quizAttempted,
      submissionCount,
      submissionSubmitted,
    });
  });

  if (filter === "completed") return grades.filter((g) => g.status === "Completed");
  if (filter === "in-progress") return grades.filter((g) => g.status === "In Progress");
  return grades;
}

/**
 * Detailed grade for a single course: quiz scores, submission statuses, and the
 * overall score/grade.
 *
 * @param {number} courseId
 * @returns {GradeDetail | null}
 */
export function getGradeDetail(courseId) {
  const numericId = Number(courseId);
  const course = getCourseById(numericId);
  if (!course) return null;
  const grade = getGrades("all").find((g) => g.courseId === numericId);
  if (!grade) return null;

  const { model } = materializeModel(numericId);
  const quizzes = [];
  const submissions = [];

  (course.curriculum ?? []).forEach((section, sectionIndex) => {
    (section.lessons || []).forEach((lesson, lessonIndex) => {
      const lessonId = buildLessonId(numericId, sectionIndex, lessonIndex);
      if (lesson.type === "quiz") {
        const spec = getQuizData(lessonId);
        const attempts = getQuizAttempts(numericId, lessonId);
        const bestScore = attempts.length
          ? Math.max(...attempts.map((a) => a.score))
          : null;
        const passing = spec ? spec.passingScore : 0;
        quizzes.push({
          lessonId,
          title: lesson.title,
          bestScore,
          passed: bestScore !== null && bestScore >= passing,
          attemptCount: attempts.length,
          lastAttemptedAt: attempts.length
            ? attempts[attempts.length - 1].submittedAt
            : null,
        });
      } else if (TASK_LESSON_TYPES.includes(lesson.type)) {
        const rec = model.lessons[String(lessonId)] || null;
        const sub = getSubmissionRecord(numericId, lessonId);
        let subStatus;
        if (rec?.status === "completed") subStatus = "completed";
        else if (sub && sub.attempt && sub.submittedAt) subStatus = "submitted";
        else subStatus = "not-submitted";
        submissions.push({
          lessonId,
          title: lesson.title,
          type: lesson.type,
          status: subStatus,
          submittedAt: sub?.submittedAt ?? null,
        });
      }
    });
  });

  const performanceCategory = COURSE_CATEGORY_MAP[numericId] ?? null;
  const categoryScore = performanceCategory
    ? performanceByCategory.find((p) => p.category === performanceCategory)?.score ?? null
    : null;

  return { ...grade, quizzes, submissions, performanceCategory, categoryScore };
}

// ---- Notes API (Phase 9) ----
//
// All note UI goes through these helpers and never imports notesStore.js
// directly. The repository composes the catalog with the learner's notes, so a
// backend swaps in by replacing these bodies only. The store functions already
// carry the planned public signatures, so they are re-exported as-is.

export {
  getAllNotes as getNotes,
  getNotesForCourse,
  addNote,
  updateNote,
  deleteNote,
  getNotesForLesson,
  addLessonNote,
};

/**
 * Most recent notes enriched with the course thumbnail (composed from the
 * catalog) so dashboard summary cards never import course data directly.
 *
 * @param {number} [limit=5]
 * @returns {Array<{id:number,courseId:number,courseName:string,preview:string,date:string,courseImage:string|null}>}
 */
export function getRecentNotes(limit = 5) {
  return getRecentNotesFromStore(limit).map((note) => {
    const course = getCourseById(note.courseId);
    return { ...note, courseImage: course?.image ?? null };
  });
}

// ---- Lesson comments API ----
//
// All comment UI goes through these helpers and never imports lessonComments.js
// directly. Comments are per-lesson (courseId + lessonId) and persist locally,
// mirroring the notes pattern so a backend swaps in by replacing these bodies.

export { getCommentsForLesson, addComment };

// ---- Wishlist API (Phase 9) ----
//
// All wishlist UI goes through these helpers and never imports wishlistStore.js
// directly. Only course IDs are stored; full courses are composed from the
// catalog so there is a single source of truth for presentation fields.

/**
 * Wishlisted courses, composed from the catalog. Unresolvable IDs are silently
 * skipped. Returns { id, title, image, instructor, rating, price }.
 *
 * @returns {Array<{id:number,title:string,image:string,instructor:string,rating:number,price:string}>}
 */
export function getWishlistedCourses() {
  return getWishlistIds()
    .map((id) => {
      const course = getCourseById(id);
      if (!course) return null;
      return {
        id: course.id,
        title: course.title,
        image: course.image,
        instructor: course.instructors?.[0]?.name || "Instructor",
        rating: course.rating,
        price: course.price,
      };
    })
    .filter(Boolean);
}

/**
 * Toggle a course's wishlist membership. Returns { added: boolean }.
 *
 * @param {number|string} courseId
 * @returns {{ added: boolean }}
 */
export function toggleWishlist(courseId) {
  const numericId = Number(courseId);
  if (isInWishlist(numericId)) {
    removeFromWishlist(numericId);
    return { added: false };
  }
  addToWishlist(numericId);
  return { added: true };
}

/** Whether a course is wishlisted. */
export function isCourseWishlisted(courseId) {
  return isInWishlist(courseId);
}

/**
 * Enroll a wishlisted course. Pushes a supplemental enrollment and removes the
 * course from the wishlist. Prototype-only — the enrollment resets on reload.
 *
 * @param {number|string} courseId
 * @returns {{ success: true, courseId: number }
 *         | { success: false, reason: "already-enrolled" | "course-unavailable" }}
 */
export function enrollFromWishlist(courseId) {
  const result = enrollInCourse(courseId);
  if (result.success) removeFromWishlist(result.courseId);
  return result;
}

/**
 * Enroll directly (dashboard recommendations). Pushes a supplemental
 * enrollment. Prototype-only — the enrollment resets on reload.
 *
 * @param {number|string} courseId
 * @returns {{ success: true, courseId: number }
 *         | { success: false, reason: "already-enrolled" | "course-unavailable" }}
 */
export function enrollInCourse(courseId) {
  const numericId = Number(courseId);
  const course = getCourseById(numericId);
  if (!course) return { success: false, reason: "course-unavailable" };
  if (allEnrollments().some((e) => e.id === numericId)) {
    return { success: false, reason: "already-enrolled" };
  }
  supplementalEnrollments.push({
    id: numericId,
    enrollmentStatus: "Not Started",
    completedLessons: 0,
    lastAccessed: new Date().toISOString(),
  });
  return { success: true, courseId: numericId };
}
