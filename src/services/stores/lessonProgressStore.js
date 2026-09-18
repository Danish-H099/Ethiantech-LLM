import { LESSON_STATUS } from "src/lib/statuses";
import { studentLessonProgress } from "src/data/studentProgress";

const STORAGE_KEY = "ethiantech-lesson-progress";

let memoryStore = null;

function readStore() {
  if (memoryStore) return memoryStore;
  let parsed = {};
  try {
    const raw =
      typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) parsed = JSON.parse(raw);
  } catch {

    parsed = {};
  }

  memoryStore =
    parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  return memoryStore;
}

function writeStore(store) {
  memoryStore = store;
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }
  } catch {
    return;
  }
}

export function getCourseModel(courseId) {
  const store = readStore();
  const model = store[String(courseId)];
  if (
    !model ||
    typeof model !== "object" ||
    Array.isArray(model) ||
    typeof model.lessons !== "object" ||
    model.lessons === null
  ) {
    return null;
  }
  return model;
}

export function saveCourseModel(courseId, model) {
  const store = readStore();
  store[String(courseId)] = model;
  writeStore(store);
}

export function clearStoredProgress(courseId) {
  const store = readStore();
  delete store[String(courseId)];
  writeStore(store);
}

export function buildSeedModel(flatLessons, seedCount) {
  const lessons = {};
  const count = Math.max(0, Math.min(seedCount || 0, flatLessons.length));
  flatLessons.forEach((fl, i) => {
    if (i < count) {
      lessons[fl.lessonId] = { status: LESSON_STATUS.COMPLETED, completedAt: null };
    }
  });
  return { lessons, lastAccessedLessonId: null };
}

/**
 * Builds the seed progress model from the canonical lesson-progress table
 * (src/data/studentProgress.js). Only rows whose status matters for the
 * learner are carried in: completed lessons (plus any quiz/submission state)
 * and explicitly in-progress lessons. Absent rows mean "not-started".
 */
export function buildSeedModelFromRows(courseId, flatLessons) {
  const numericId = Number(courseId);
  const expected = new Set(flatLessons.map((fl) => fl.lessonId));
  const lessons = {};
  studentLessonProgress
    .filter(
      (r) =>
        r.courseId === numericId &&
        r.status !== LESSON_STATUS.NOT_STARTED &&
        expected.has(r.lessonId)
    )
    .forEach((r) => {
      const entry = { status: r.status, completedAt: r.completedAt ?? null };
      if (r.quiz) entry.quiz = r.quiz;
      if (r.submission) entry.submission = r.submission;
      lessons[r.lessonId] = entry;
    });
  return { lessons, lastAccessedLessonId: null };
}

export const MAX_ATTEMPTS = 20;

export const MAX_SUBMISSION_STORAGE = 5 * 1024 * 1024;

/** Row lookup helper — falls back to the canonical data table when nothing is stored. */
function seedLessonRow(courseId, lessonId) {
  const numericId = Number(courseId);
  const lid = String(lessonId);
  return (
    studentLessonProgress.find(
      (r) => r.courseId === numericId && r.lessonId === lid
    ) || null
  );
}

export function getQuizRecord(courseId, lessonId) {
  const model = getCourseModel(courseId);
  if (model) {
    const record = model.lessons[String(lessonId)];
    const quiz = record?.quiz;
    if (quiz && typeof quiz === "object" && !Array.isArray(quiz)) {
      return {
        attempts: Array.isArray(quiz.attempts) ? [...quiz.attempts] : [],
        lastAnswers: quiz.lastAnswers ?? null,
      };
    }
    return null;
  }
  const seedQuiz = seedLessonRow(courseId, lessonId)?.quiz;
  if (!seedQuiz || typeof seedQuiz !== "object" || Array.isArray(seedQuiz)) {
    return null;
  }
  return {
    attempts: Array.isArray(seedQuiz.attempts) ? [...seedQuiz.attempts] : [],
    lastAnswers: seedQuiz.lastAnswers ?? null,
  };
}

export function patchQuizRecord(courseId, lessonId, patch) {
  const model = getCourseModel(courseId);
  if (!model) return null;
  const id = String(lessonId);
  const existing = model.lessons[id] || { status: LESSON_STATUS.IN_PROGRESS };
  const prevQuiz =
    existing.quiz && typeof existing.quiz === "object" && !Array.isArray(existing.quiz)
      ? existing.quiz
      : {};
  model.lessons[id] = {
    ...existing,
    status: existing.status || LESSON_STATUS.IN_PROGRESS,
    quiz: {
      attempts: Array.isArray(prevQuiz.attempts) ? prevQuiz.attempts : [],
      lastAnswers: prevQuiz.lastAnswers ?? null,
      ...patch,
    },
  };
  saveCourseModel(courseId, model);
  return model.lessons[id];
}

export function appendQuizAttempt(courseId, lessonId, attempt) {
  const model = getCourseModel(courseId);
  if (!model) return null;
  const id = String(lessonId);
  const existing = model.lessons[id] || { status: LESSON_STATUS.IN_PROGRESS };
  const prevQuiz =
    existing.quiz && typeof existing.quiz === "object" && !Array.isArray(existing.quiz)
      ? existing.quiz
      : {};
  const prior = Array.isArray(prevQuiz.attempts) ? prevQuiz.attempts : [];
  const attempts = [...prior, attempt].slice(-MAX_ATTEMPTS);
  model.lessons[id] = {
    ...existing,
    status: existing.status || LESSON_STATUS.IN_PROGRESS,
    quiz: {
      attempts,
      lastAnswers: null,
    },
  };
  saveCourseModel(courseId, model);
  return model.lessons[id];
}

export function getSubmissionRecord(courseId, lessonId) {
  const model = getCourseModel(courseId);
  if (model) {
    const record = model.lessons[String(lessonId)];
    const sub = record?.submission;
    if (sub && typeof sub === "object" && !Array.isArray(sub)) {
      return {
        attempt: sub.attempt ?? null,
        draft: sub.draft ?? null,
        submittedAt: sub.submittedAt ?? null,
      };
    }
    return null;
  }
  const seedSub = seedLessonRow(courseId, lessonId)?.submission;
  if (!seedSub || typeof seedSub !== "object" || Array.isArray(seedSub)) {
    return null;
  }
  return {
    attempt: seedSub.attempt ?? null,
    draft: seedSub.draft ?? null,
    submittedAt: seedSub.submittedAt ?? null,
  };
}

export function saveSubmissionDraft(courseId, lessonId, draft) {
  const model = getCourseModel(courseId);
  if (!model) return null;
  const id = String(lessonId);
  const existing = model.lessons[id] || { status: LESSON_STATUS.IN_PROGRESS };
  const prevSub =
    existing.submission &&
    typeof existing.submission === "object" &&
    !Array.isArray(existing.submission)
      ? existing.submission
      : {};
  model.lessons[id] = {
    ...existing,
    status: existing.status || LESSON_STATUS.IN_PROGRESS,
    submission: {
      attempt: prevSub.attempt ?? null,
      submittedAt: prevSub.submittedAt ?? null,
      draft: draft ?? null,
    },
  };
  saveCourseModel(courseId, model);
  return model.lessons[id];
}

export function clearSubmissionDraft(courseId, lessonId) {
  const model = getCourseModel(courseId);
  if (!model) return null;
  const id = String(lessonId);
  const existing = model.lessons[id] || { status: LESSON_STATUS.IN_PROGRESS };
  const prevSub =
    existing.submission &&
    typeof existing.submission === "object" &&
    !Array.isArray(existing.submission)
      ? existing.submission
      : {};
  model.lessons[id] = {
    ...existing,
    status: existing.status || LESSON_STATUS.IN_PROGRESS,
    submission: {
      attempt: prevSub.attempt ?? null,
      submittedAt: prevSub.submittedAt ?? null,
      draft: null,
    },
  };
  saveCourseModel(courseId, model);
  return model.lessons[id];
}

export function setSubmissionAttempt(courseId, lessonId, attempt) {
  const model = getCourseModel(courseId);
  if (!model) return null;
  const id = String(lessonId);
  const existing = model.lessons[id] || { status: LESSON_STATUS.IN_PROGRESS };
  model.lessons[id] = {
    ...existing,
    status: existing.status || LESSON_STATUS.IN_PROGRESS,
    submission: {
      attempt,
      draft: null,
      submittedAt: new Date().toISOString(),
    },
  };
  saveCourseModel(courseId, model);
  return model.lessons[id];
}

export function clearSubmissionAttempt(courseId, lessonId) {
  const model = getCourseModel(courseId);
  if (!model) return null;
  const id = String(lessonId);
  const existing = model.lessons[id] || { status: LESSON_STATUS.IN_PROGRESS };
  const prevSub =
    existing.submission &&
    typeof existing.submission === "object" &&
    !Array.isArray(existing.submission)
      ? existing.submission
      : {};
  model.lessons[id] = {
    ...existing,
    status: existing.status === LESSON_STATUS.COMPLETED && !prevSub.attempt ? LESSON_STATUS.COMPLETED : LESSON_STATUS.IN_PROGRESS,
    completedAt:
      existing.status === LESSON_STATUS.COMPLETED && !prevSub.attempt ? existing.completedAt : null,
    submission: {
      attempt: null,
      draft: prevSub.draft ?? null,
      submittedAt: null,
    },
  };
  saveCourseModel(courseId, model);
  return model.lessons[id];
}
