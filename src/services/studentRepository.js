import courses, { getCourseById } from "src/services/courses";
import { enrollments } from "src/data/enrollments";
import { buildLessonId } from "src/lib/lesson";
import { formatRelativeTime, formatDueLabel } from "src/lib/format";
import {
  LESSON_STATUS,
  ENROLLMENT_STATUS,
  TASK_STATUS,
  TASK_STATUS_LABEL,
  TASK_ACTION_LABEL,
} from "src/lib/statuses";
import { getLessonMedia } from "src/services/lessonMedia";
import quizzes from "src/data/quizzes";
import exercises from "src/data/exercises";
import { announcements } from "src/data/announcements";
import { resources } from "src/data/resources";
import {
  getAllNotes,
  getNotesForCourse,
  addNote,
  updateNote,
  deleteNote,
  getRecentNotes as getRecentNotesFromStore,
  getNotesForLesson,
  addLessonNote,
} from "src/services/stores/notesStore";
import {
  getCommentsForLesson,
  addComment,
} from "src/services/stores/lessonComments";
import {
  getWishlistIds,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "src/services/stores/wishlistStore";
import {
  courseScores,
  performanceByCategory,
} from "src/data/grades";
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
} from "src/services/stores/lessonProgress";
import {
  isNotificationRead,
  markNotificationRead as markNotificationReadInStore,
  markAllRead as markAllReadInStore,
  countUnread as countUnreadInStore,
} from "src/services/stores/notificationsStore";

const learningActivity = [
  { week: "W1", hours: 3.5 },
  { week: "W2", hours: 5.2 },
  { week: "W3", hours: 4.1 },
  { week: "W4", hours: 6.8 },
  { week: "W5", hours: 3.9 },
  { week: "W6", hours: 5.5 },
  { week: "W7", hours: 7.2 },
  { week: "W8", hours: 4.6 },
  { week: "W9", hours: 6.1 },
  { week: "W10", hours: 5.8 },
  { week: "W11", hours: 7.5 },
  { week: "W12", hours: 4.3 },
];

const TASK_META = {
  "1-s1-l3": { estimatedEffort: "20 min" },
  "1-s3-l4": { estimatedEffort: "45 min" },
  "3-s2-l1": { estimatedEffort: "1 hr" },
  "3-s2-l5": { estimatedEffort: "3–4 hrs" },
  "5-s0-l4": { estimatedEffort: "30 min" },
  "5-s4-l2": { estimatedEffort: "End of course" },
  "6-s0-l3": { estimatedEffort: "1 hr" },
  "6-s4-l2": { estimatedEffort: "Portfolio" },
};

const COURSE_CATEGORY_MAP = {
  1: "Web Dev",
  2: "AI & ML",
  3: "Web Dev",
  5: "Data Science",
  6: "Design",
  7: "Business",
};

const supplementalEnrollments = [];

function allEnrollments() {
  return [...enrollments, ...supplementalEnrollments];
}

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

function deriveStatuses(flatLessons, model) {
  const statuses = new Array(flatLessons.length);
  let prevNonPreviewIncomplete = false;
  let firstOpen = -1;
  for (let i = 0; i < flatLessons.length; i += 1) {
    const fl = flatLessons[i];
    const isCompleted = model.lessons[fl.lessonId]?.status === LESSON_STATUS.COMPLETED;
    if (isCompleted) {
      statuses[i] = LESSON_STATUS.COMPLETED;
    } else if (fl.isPreview) {
      statuses[i] = LESSON_STATUS.NOT_STARTED;
    } else if (!prevNonPreviewIncomplete) {
      statuses[i] = LESSON_STATUS.IN_PROGRESS;
      if (firstOpen === -1) firstOpen = i;
      prevNonPreviewIncomplete = true;
    } else {
      statuses[i] = LESSON_STATUS.LOCKED;
    }
  }
  return { statuses, firstOpen };
}

function resolveResumeTarget(flatLessons, statuses) {
  const firstIncomplete = statuses.findIndex(
    (s) => s !== LESSON_STATUS.COMPLETED && s !== LESSON_STATUS.LOCKED
  );
  if (firstIncomplete !== -1) return firstIncomplete;
  if (statuses.length > 0) return 0;
  return -1;
}

function buildEnrolledCourseView(courseId) {
  const numericId = Number(courseId);
  const enrollment = allEnrollments().find((e) => e.id === numericId);
  if (!enrollment) {
    return { status: ENROLLMENT_STATUS.ENROLLED, courseId: numericId };
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

  const flatLessons = buildFlatLessons(numericId, sectionsWithLessons);
  const model =
    getCourseModel(numericId) || buildSeedModel(flatLessons, enrollment.completedLessons);
  const { statuses } = deriveStatuses(flatLessons, model);

  const totalLessons = flatLessons.length;
  const completedCount = statuses.filter((s) => s === LESSON_STATUS.COMPLETED).length;
  const completedNonPreview = flatLessons.filter(
    (fl, i) => statuses[i] === LESSON_STATUS.COMPLETED && !fl.isPreview
  ).length;
  const nonPreviewTotal = flatLessons.filter((fl) => !fl.isPreview).length;
  const courseCompleted =
    nonPreviewTotal > 0 && completedNonPreview === nonPreviewTotal;
  const progress =
    totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
  const derivedStatus = courseCompleted
    ? ENROLLMENT_STATUS.COMPLETED
    : completedNonPreview === 0
      ? ENROLLMENT_STATUS.NOT_STARTED
      : ENROLLMENT_STATUS.IN_PROGRESS;

  let cursor = 0;
  const sections = sectionsWithLessons.map((section, sectionIndex) => {
    const lessons = section.lessons.map((lesson) => {
      const status = statuses[cursor] || LESSON_STATUS.LOCKED;
      const lessonId = flatLessons[cursor].lessonId;
      cursor += 1;
      return { ...lesson, status, lessonId };
    });
    const completedCountSection = lessons.filter((l) => l.status === LESSON_STATUS.COMPLETED).length;
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

export function getEnrolledCourseData(courseId) {
  return buildEnrolledCourseView(courseId);
}

export function getLearningActivity() {
  return learningActivity;
}

export {
  getStudentProfile,
  updateStudentProfile,
  updatePreferences,
  resetPreferences,
} from "src/services/studentProfile";

const DAY_MS = 24 * 60 * 60 * 1000;

function dayKey(ms) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

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

  const parseDayKey = (key) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m, d).getTime();
  };
  const days = [...activityDays].map(parseDayKey).sort((a, b) => a - b);

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i += 1) {
    run = days[i] - days[i - 1] === DAY_MS ? run + 1 : 1;
    if (run > longest) longest = run;
  }

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

export function getLessonProgress(courseId, lessonId) {
  const m = materializeModel(courseId);
  if (!m) return null;
  return m.model.lessons[String(lessonId)] || null;
}

export function updateLessonProgress(courseId, lessonId, patch) {
  const m = materializeModel(courseId);
  if (!m) return null;
  const id = String(lessonId);
  const existing = m.model.lessons[id] || { status: LESSON_STATUS.IN_PROGRESS };
  m.model.lessons[id] = {
    ...existing,
    ...patch,
    status: patch.status || existing.status || LESSON_STATUS.IN_PROGRESS,
  };
  saveCourseModel(m.courseId, m.model);
  return m.model.lessons[id];
}

export function completeLesson(courseId, lessonId) {
  const m = materializeModel(courseId);
  if (!m) return { nextLessonId: null, courseCompleted: false };
  const id = String(lessonId);
  m.model.lessons[id] = {
    ...(m.model.lessons[id] || {}),
    status: LESSON_STATUS.COMPLETED,
    completedAt: new Date().toISOString(),
  };

  const { statuses } = deriveStatuses(m.flat, m.model);
  const idx = m.flat.findIndex((f) => f.lessonId === id);
  let nextIdx = -1;
  for (let i = idx + 1; i < m.flat.length; i += 1) {
    if (statuses[i] !== LESSON_STATUS.LOCKED) {
      nextIdx = i;
      break;
    }
  }
  const nextLessonId = nextIdx !== -1 ? m.flat[nextIdx].lessonId : null;
  m.model.lastAccessedLessonId = nextLessonId || id;

  const completedNonPreview = m.flat.filter(
    (fl, i) => statuses[i] === LESSON_STATUS.COMPLETED && !fl.isPreview
  ).length;
  const nonPreviewTotal = m.flat.filter((fl) => !fl.isPreview).length;
  const courseCompleted = nonPreviewTotal > 0 && completedNonPreview === nonPreviewTotal;
  saveCourseModel(m.courseId, m.model);
  return { nextLessonId, courseCompleted };
}

export function recordLessonAccess(courseId, lessonId) {
  const m = materializeModel(courseId);
  if (!m) return;
  m.model.lastAccessedLessonId = String(lessonId);
  saveCourseModel(m.courseId, m.model);
}

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
  const completedCount = statuses.filter((s) => s === LESSON_STATUS.COMPLETED).length;
  const completedNonPreview = m.flat.filter(
    (fl, i) => statuses[i] === LESSON_STATUS.COMPLETED && !fl.isPreview
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

export function getResumeLesson(courseId) {
  const view = buildEnrolledCourseView(courseId);
  return view.status === "ready" ? view.resumeTarget : null;
}

export function clearCourseProgress(courseId) {
  clearStoredProgress(courseId);
}

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

export function getLessonMediaFor(lessonId) {
  return getLessonMedia(lessonId);
}

export function getCourseAnnouncementsFor(courseId) {
  return [...(announcements[courseId] ?? announcements.default)].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getCourseResourcesFor(courseId) {
  return {
    available: false,
    message:
      "Downloadable resources aren't available in this prototype. They'll be enabled in a later build.",
    items: resources[courseId] ?? resources.default,
  };
}

const MAX_STORED_ATTEMPTS = 20;

export function getQuizData(lessonId) {
  const raw = quizzes[String(lessonId)];
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

  const expected = question.correctAnswer;
  return answer === expected;
}

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

export function getQuizAttempts(courseId, lessonId) {
  const record = getQuizRecord(courseId, lessonId);
  return record ? record.attempts : [];
}

export function getQuizDraftAnswers(courseId, lessonId) {
  const record = getQuizRecord(courseId, lessonId);
  return record ? record.lastAnswers : null;
}

export function saveQuizDraftAnswers(courseId, lessonId, answers) {
  patchQuizRecord(courseId, lessonId, { lastAnswers: answers || null });
}

export function clearQuizDraftAnswers(courseId, lessonId) {
  patchQuizRecord(courseId, lessonId, { lastAnswers: null });
}

export function hasRemainingAttempts(courseId, lessonId) {
  const spec = getQuizData(lessonId);
  if (!spec) return false;
  if (spec.maxAttempts === 0) return false;
  if (spec.maxAttempts === null) return true;
  const attempts = getQuizAttempts(courseId, lessonId);
  return attempts.length < spec.maxAttempts;
}

export function getQuizBestScore(courseId, lessonId) {
  const attempts = getQuizAttempts(courseId, lessonId);
  if (attempts.length === 0) return null;
  return Math.max(...attempts.map((a) => a.score));
}

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

export function getExerciseData(lessonId) {
  const raw = exercises[String(lessonId)];
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

export function getSubmissionRecord(courseId, lessonId) {
  return getSubmissionRecordImpl(courseId, lessonId);
}

export function getSubmissionDraft(courseId, lessonId) {
  const record = getSubmissionRecordImpl(courseId, lessonId);
  return record ? record.draft : null;
}

export function saveSubmissionDraft(courseId, lessonId, draft) {
  saveSubmissionDraftImpl(courseId, lessonId, draft);
}

export function clearSubmissionDraft(courseId, lessonId) {
  clearSubmissionDraftImpl(courseId, lessonId);
}

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

export function resetSubmission(courseId, lessonId) {
  clearSubmissionAttemptFromStore(courseId, lessonId);
  return recomputeAfterReset(courseId, lessonId);
}

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

function recomputeAfterReset(courseId, lessonId) {
  const m = materializeModel(courseId);
  if (!m) return { nextLessonId: null, courseCompleted: false };
  const { statuses } = deriveStatuses(m.flat, m.model);
  const idx = m.flat.findIndex((f) => f.lessonId === String(lessonId));
  let nextIdx = -1;
  for (let i = idx + 1; i < m.flat.length; i += 1) {
    if (statuses[i] !== LESSON_STATUS.LOCKED) {
      nextIdx = i;
      break;
    }
  }
  const nextLessonId = nextIdx !== -1 ? m.flat[nextIdx].lessonId : null;
  const completedNonPreview = m.flat.filter(
    (fl, i) => statuses[i] === LESSON_STATUS.COMPLETED && !fl.isPreview
  ).length;
  const nonPreviewTotal = m.flat.filter((fl) => !fl.isPreview).length;
  const courseCompleted =
    nonPreviewTotal > 0 && completedNonPreview === nonPreviewTotal;
  return { nextLessonId, courseCompleted };
}

const TASK_LESSON_TYPES = ["exercise", "project"];

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

function taskDueState(task, nowMs) {
  if (!task.dueDate) return null;
  const { overdue } = formatDueLabel(task.dueDate, nowMs);
  return { overdue };
}

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
  } else if (filter === LESSON_STATUS.COMPLETED) {
    filtered = tasks.filter(
      (t) => t.status === TASK_STATUS.COMPLETED || t.status === TASK_STATUS.SUBMITTED
    );
  } else {
    filtered = tasks.slice();
  }

  if (filter === LESSON_STATUS.COMPLETED) return filtered.slice().sort(byRecencyDesc);
  if (filter === "upcoming" || filter === "overdue") return filtered.slice().sort(byDueAsc);
  return filtered.slice().sort((a, b) => {
    const ra = taskRank(a, nowMs);
    const rb = taskRank(b, nowMs);
    if (ra !== rb) return ra - rb;
    return ra === 3 ? byRecencyDesc(a, b) : byDueAsc(a, b);
  });
}

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
        title: exercises[String(def.lessonId)]?.title || def.title,
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

export function getUpcomingDeadlines(limit = 5) {
  const due = getTasks("all").filter((t) => t.status !== TASK_STATUS.COMPLETED && t.dueDate);
  due.sort(byDueAsc);
  return due.slice(0, limit);
}

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
          if (rec?.status === LESSON_STATUS.COMPLETED || (sub && sub.attempt && sub.submittedAt)) {
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
      type: course.type,
      courseType: course.courseType,
      institutionName: course.institution?.name ?? null,
      certificate: course.certificate?.type ?? null,
      skills: course.skills ?? [],
      score: scoreEntry?.score ?? null,
      grade: scoreEntry?.grade ?? null,
      status: view.derivedStatus,
      progress: view.progress,
      quizCount,
      quizAttempted,
      submissionCount,
      submissionSubmitted,
    });
  });

  if (filter === LESSON_STATUS.COMPLETED) return grades.filter((g) => g.status === ENROLLMENT_STATUS.COMPLETED);
  if (filter === LESSON_STATUS.IN_PROGRESS) return grades.filter((g) => g.status === ENROLLMENT_STATUS.IN_PROGRESS);
  return grades;
}

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
          passingScore: passing,
          maxAttempts: spec?.maxAttempts ?? null,
          attemptCount: attempts.length,
          lastAttemptedAt: attempts.length
            ? attempts[attempts.length - 1].submittedAt
            : null,
        });
      } else if (TASK_LESSON_TYPES.includes(lesson.type)) {
        const rec = model.lessons[String(lessonId)] || null;
        const sub = getSubmissionRecord(numericId, lessonId);
        let subStatus;
        if (rec?.status === LESSON_STATUS.COMPLETED) subStatus = LESSON_STATUS.COMPLETED;
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

  return {
    ...grade,
    quizzes,
    submissions,
    performanceCategory,
    categoryScore,
    skills: course.skills ?? [],
    certificate: course.certificate?.type ?? null,
  };
}

function formatDayKey(ms) {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getStudyHeatmap(nowMs = Date.now()) {
  const now = new Date(nowMs);
  const year = now.getFullYear();
  const jan1 = new Date(year, 0, 1);
  const dec31 = new Date(year, 11, 31);

  const counts = new Map();

  const recordEvent = (iso) => {
    if (!iso) return;
    const ms = new Date(iso).getTime();
    if (!Number.isFinite(ms)) return;
    if (ms < jan1.getTime() || ms > dec31.getTime() + DAY_MS - 1) return;
    const key = formatDayKey(ms);
    counts.set(key, (counts.get(key) || 0) + 1);
  };

  allEnrollments().forEach((enrollment) => {
    recordEvent(enrollment.lastAccessed);
    const m = materializeModel(enrollment.id);
    if (!m) return;
    Object.values(m.model.lessons).forEach((record) => {
      recordEvent(record.completedAt);
      recordEvent(record.submission?.submittedAt);
      (record.quiz?.attempts || []).forEach((attempt) =>
        recordEvent(attempt.submittedAt)
      );
    });
  });

  if (counts.size < 5) {
    const mockSeed = [
      { daysAgo: 0, count: 3 }, { daysAgo: 1, count: 2 }, { daysAgo: 2, count: 4 },
      { daysAgo: 3, count: 1 }, { daysAgo: 5, count: 2 }, { daysAgo: 7, count: 5 },
      { daysAgo: 8, count: 1 }, { daysAgo: 10, count: 3 }, { daysAgo: 12, count: 2 },
      { daysAgo: 14, count: 4 }, { daysAgo: 16, count: 1 }, { daysAgo: 18, count: 6 },
      { daysAgo: 20, count: 2 }, { daysAgo: 22, count: 3 }, { daysAgo: 25, count: 1 },
      { daysAgo: 28, count: 2 }, { daysAgo: 30, count: 5 }, { daysAgo: 35, count: 1 },
      { daysAgo: 40, count: 2 }, { daysAgo: 45, count: 3 }, { daysAgo: 50, count: 1 },
      { daysAgo: 55, count: 2 }, { daysAgo: 60, count: 4 },
    ];
    mockSeed.forEach(({ daysAgo, count }) => {
      const ms = nowMs - daysAgo * DAY_MS;
      if (ms >= jan1.getTime() && ms <= dec31.getTime()) {
        const key = formatDayKey(ms);
        counts.set(key, (counts.get(key) || 0) + count);
      }
    });
  }

  const data = [];
  const cursor = new Date(jan1);
  while (cursor <= dec31) {
    const key = formatDayKey(cursor.getTime());
    const count = counts.get(key) || 0;
    let level = 0;
    if (count >= 7) level = 4;
    else if (count >= 5) level = 3;
    else if (count >= 3) level = 2;
    else if (count >= 1) level = 1;
    data.push({ date: key, count, level });
    cursor.setDate(cursor.getDate() + 1);
  }

  const totalDays = data.length;
  const activeDays = data.filter((d) => d.count > 0).length;
  return { data, totalDays, activeDays };
}

export function getQuizMastery() {
  const quizzes = [];

  allEnrollments().forEach((enrollment) => {
    const course = getCourseById(enrollment.id);
    if (!course) return;

    (course.curriculum ?? []).forEach((section, sectionIndex) => {
      section.lessons.forEach((lesson, lessonIndex) => {
        if (lesson.type !== "quiz") return;
        const lessonId = buildLessonId(course.id, sectionIndex, lessonIndex);
        const attempts = getQuizAttempts(enrollment.id, lessonId);
        if (attempts.length === 0) return;
        const spec = getQuizData(lessonId);
        const passing = spec ? spec.passingScore : 0;
        const first = attempts[0];
        quizzes.push({
          courseTitle: course.title,
          title: lesson.title,
          firstTryScore: first.score,
          passedFirstTry: first.score >= passing,
        });
      });
    });
  });

  const attempted = quizzes.length;
  const passedFirstTry = quizzes.filter((q) => q.passedFirstTry).length;
  const firstTryAccuracy = attempted
    ? Math.round(quizzes.reduce((sum, q) => sum + q.firstTryScore, 0) / attempted)
    : 0;

  return { attempted, passedFirstTry, firstTryAccuracy, quizzes };
}

export function getSkillMastery() {
  const skillMap = new Map();

  allEnrollments().forEach((enrollment) => {
    const course = getCourseById(enrollment.id);
    if (!course) return;
    const view = buildEnrolledCourseView(enrollment.id);
    const progress = view.progress / 100;
    (course.skills ?? []).forEach((skill) => {
      const entry = skillMap.get(skill) || { mastered: 0, total: 0 };
      entry.total += 1;
      entry.mastered += progress;
      skillMap.set(skill, entry);
    });
  });

  return [...skillMap.entries()]
    .map(([skill, { mastered, total }]) => ({
      skill,
      mastered: Math.round(mastered),
      total,
      percent: total ? Math.round((mastered / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total || a.percent - b.percent)
    .slice(0, 8);
}

export function getLearningPace(nowMs = Date.now()) {
  const activity = getLearningActivity();
  const avgWeeklyHours = activity.length
    ? Math.round((activity.reduce((sum, a) => sum + a.hours, 0) / activity.length) * 10) / 10
    : 0;

  const pace = [];

  getEnrolledCourses().forEach((c) => {
    if (c.status !== ENROLLMENT_STATUS.IN_PROGRESS) return;
    const remainingHours = (c.hours || 0) * (1 - c.progress / 100);
    const estWeeks = avgWeeklyHours > 0 ? remainingHours / avgWeeklyHours : null;
    const estCompletion = estWeeks != null ? new Date(nowMs + estWeeks * 7 * DAY_MS) : null;

    let paceStatus = "on-track";
    if (c.dueDate) {
      const startMs = c.lastAccessed ? new Date(c.lastAccessed).getTime() : nowMs;
      const totalPlannedMs = new Date(c.dueDate).getTime() - startMs;
      const elapsedMs = nowMs - startMs;
      const expectedProgress =
        totalPlannedMs > 0 ? Math.min(100, (elapsedMs / totalPlannedMs) * 100) : 0;
      if (c.progress >= expectedProgress + 5) paceStatus = "ahead";
      else if (c.progress <= expectedProgress - 5) paceStatus = "behind";
    }

    pace.push({
      courseId: c.id,
      courseTitle: c.title,
      progress: c.progress,
      remainingHours: Math.round(remainingHours * 10) / 10,
      estWeeks: estWeeks != null ? Math.round(estWeeks * 10) / 10 : null,
      estCompletion,
      paceStatus,
      dueDate: c.dueDate,
    });
  });

  return { avgWeeklyHours, pace };
}

export {
  getAllNotes as getNotes,
  getNotesForCourse,
  addNote,
  updateNote,
  deleteNote,
  getNotesForLesson,
  addLessonNote,
};

export function getRecentNotes(limit = 5) {
  return getRecentNotesFromStore(limit).map((note) => {
    const course = getCourseById(note.courseId);
    return { ...note, courseImage: course?.image ?? null };
  });
}

export { getCommentsForLesson, addComment };

export function getWishlistedCourses() {
  return getWishlistIds()
    .map((id) => getCourseById(id))
    .filter(Boolean);
}

export function toggleWishlist(courseId) {
  const numericId = Number(courseId);
  if (isInWishlist(numericId)) {
    removeFromWishlist(numericId);
    return { added: false };
  }
  addToWishlist(numericId);
  return { added: true };
}

export function isCourseWishlisted(courseId) {
  return isInWishlist(courseId);
}

export function addCourseToWishlist(courseId) {
  addToWishlist(courseId);
}

export function enrollFromWishlist(courseId) {
  const result = enrollInCourse(courseId);
  if (result.success) removeFromWishlist(result.courseId);
  return result;
}

export function getPerformanceByCategory() {
  return performanceByCategory;
}

export function getScoreTrend() {
  return courseScores.map((s) => ({ course: s.course, score: s.score }));
}

export function getCourseScores() {
  return courseScores;
}

export function enrollInCourse(courseId) {
  const numericId = Number(courseId);
  const course = getCourseById(numericId);
  if (!course) return { success: false, reason: "course-unavailable" };
  if (allEnrollments().some((e) => e.id === numericId)) {
    return { success: false, reason: "already-enrolled" };
  }
  supplementalEnrollments.push({
    id: numericId,
    enrollmentStatus: ENROLLMENT_STATUS.NOT_STARTED,
    completedLessons: 0,
    lastAccessed: new Date().toISOString(),
  });
  return { success: true, courseId: numericId };
}

// ---- Notifications API ----

/**
 * Unified notification feed. Aggregates course announcements, upcoming/overdue
 * deadlines, and course completion events into a single timeline sorted by
 * recency. Each notification carries a read/unread state from the persistence
 * store.
 */
export function getNotifications(filter = "all") {
  const nowMs = Date.now();
  const items = [];

  // 1. Course announcements
  allEnrollments().forEach((enrollment) => {
    const course = getCourseById(enrollment.id);
    if (!course) return;
    const courseAnnouncements = announcements[enrollment.id] ?? announcements.default;
    courseAnnouncements.forEach((a) => {
      items.push({
        id: a.id,
        type: "announcement",
        title: a.title,
        body: a.body,
        date: a.date,
        courseId: enrollment.id,
        courseTitle: course.title,
        read: isNotificationRead(a.id),
      });
    });
  });

  // 2. Upcoming and overdue deadlines
  const tasks = getTasks("all");
  tasks.forEach((task) => {
    if (task.status === TASK_STATUS.COMPLETED) return;
    if (!task.dueDate) return;
    const due = formatDueLabel(task.dueDate, nowMs);
    items.push({
      id: `deadline-${task.taskId}`,
      type: "deadline",
      title: due.overdue ? `Overdue: ${task.title}` : `Due soon: ${task.title}`,
      body: `${task.courseTitle} — ${due.text}`,
      date: task.dueDate,
      courseId: task.courseId,
      courseTitle: task.courseTitle,
      read: isNotificationRead(`deadline-${task.taskId}`),
    });
  });

  // 3. Course completions
  allEnrollments().forEach((enrollment) => {
    if (enrollment.enrollmentStatus !== ENROLLMENT_STATUS.COMPLETED) return;
    const course = getCourseById(enrollment.id);
    if (!course) return;
    const completionId = `completion-${enrollment.id}`;
    items.push({
      id: completionId,
      type: "completion",
      title: `Course completed: ${course.title}`,
      body: "Congratulations! You've finished this course. Download your certificate from your profile.",
      date: enrollment.lastAccessed,
      courseId: enrollment.id,
      courseTitle: course.title,
      read: isNotificationRead(completionId),
    });
  });

  // Sort by date descending (most recent first)
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (filter === "all") return items;
  return items.filter((item) => item.type === filter);
}

/**
 * Mark a single notification as read.
 */
export function markNotificationRead(id) {
  markNotificationReadInStore(id);
}

/**
 * Mark all notifications as read.
 */
export function markAllNotificationsRead() {
  const ids = getNotifications("all").map((n) => n.id);
  markAllReadInStore(ids);
}

/**
 * Count unread notifications.
 * @returns {number}
 */
export function getUnreadCount() {
  const ids = getNotifications("all").map((n) => n.id);
  return countUnreadInStore(ids);
}

// ---- Certificates API ----

/**
 * Earned certificates for completed courses. Returns presentation-ready
 * objects so the profile page never imports raw data directly.
 *
 * @returns {Array<{courseId:number, courseTitle:string, courseImage:string, institutionName:string|null, completedAt:string|null, grade:string|null, score:number|null}>}
 */
export function getStudentCertificates() {
  return getGrades("completed")
    .filter((g) => g.status === "Completed")
    .map((g) => {
      const course = getCourseById(g.courseId);
      return {
        courseId: g.courseId,
        courseTitle: g.courseTitle,
        courseImage: g.courseImage,
        institutionName: course?.institution?.name ?? null,
        completedAt: allEnrollments().find((e) => e.id === g.courseId)?.lastAccessed ?? null,
        grade: g.grade,
        score: g.score,
      };
    });
}
