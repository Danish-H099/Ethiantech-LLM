// Private persistence adapter for per-lesson progress.
//
// UI never touches localStorage directly — every read/write goes through
// studentRepository, which composes this module with the catalog. The shape is
// intentionally simple and backend-shaped so a future API client can replace
// the localStorage calls without changing the repository's public signatures.
//
// Stored shape (one entry per course id):
// {
//   [courseId]: {
//     lessons: {
//       [lessonId]: {
//         status: "completed" | "in-progress",
//         videoProgress?: { currentTime: number, percentage: number },
//         completedAt?: string (ISO),
//         quiz?: {
//           attempts: QuizAttempt[],    // immutable snapshots (capped at MAX_ATTEMPTS)
//           lastAnswers: Answers|null   // draft answers, cleared on submit
//         },
//         submission?: {
//           attempt: SubmissionAttempt|null,  // immutable snapshot of last submission
//           draft: SubmissionDraft|null,      // unsaved editable draft
//           submittedAt: string|null          // ISO timestamp of submission
//         }
//       }
//     },
//     lastAccessedLessonId: string | null
//   }
// }

const STORAGE_KEY = "ethiantech-lesson-progress";

// In-memory mirror so repeated reads in one session don't re-parse localStorage.
let memoryStore = null;

function readStore() {
  if (memoryStore) return memoryStore;
  let parsed = {};
  try {
    const raw =
      typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) parsed = JSON.parse(raw);
  } catch {
    // Corrupt JSON — start clean rather than throwing.
    parsed = {};
  }
  // Reject anything that isn't a plain object (e.g. an array or string) so a
  // malformed top-level value can't poison downstream reads.
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
    // Quota exceeded or privacy mode — degrade to in-memory only.
  }
}

/**
 * Per-course progress model, or null when nothing has been stored yet — or when
 * the stored entry is malformed (missing the `lessons` object). Returning null
 * lets callers fall back to a fresh seed instead of crashing on a corrupt model.
 */
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

/** Persist a full progress model for a course. */
export function saveCourseModel(courseId, model) {
  const store = readStore();
  store[String(courseId)] = model;
  writeStore(store);
}

/** Remove all stored progress for a course (used for reset/testing). */
export function clearStoredProgress(courseId) {
  const store = readStore();
  delete store[String(courseId)];
  writeStore(store);
}

/**
 * Build a fresh, non-persisted progress model by marking the first `seedCount`
 * lessons (in syllabus order) completed. Mirrors the legacy sequential
 * derivation so the existing enrollment counts stay the single source of truth
 * until the learner actually interacts with a lesson.
 *
 * @param {{lessonId:string, isPreview:boolean}[]} flatLessons
 * @param {number} seedCount
 */
export function buildSeedModel(flatLessons, seedCount) {
  const lessons = {};
  const count = Math.max(0, Math.min(seedCount || 0, flatLessons.length));
  flatLessons.forEach((fl, i) => {
    if (i < count) {
      lessons[fl.lessonId] = { status: "completed", completedAt: null };
    }
  });
  return { lessons, lastAccessedLessonId: null };
}

/**
 * Bounded history cap for quiz attempts stored per lesson. Keeps the prototype's
 * localStorage footprint predictable while preserving recent history. A backend
 * would return this from the server instead; the quiz record shape is unchanged.
 */
export const MAX_ATTEMPTS = 20;

/**
 * Per-lesson storage budget for submission attachments (image previews, code
 * snippets). 5 MB keeps localStorage well below browser limits while allowing a
 * reasonable set of small screenshots or pasted code.
 */
export const MAX_SUBMISSION_STORAGE = 5 * 1024 * 1024;

/**
 * Read the opaque quiz sub-record for a lesson. Returns a fresh object each
 * call so callers can't mutate the stored reference.
 *
 * @returns {{attempts: any[], lastAnswers: (object|null)} | null}
 */
export function getQuizRecord(courseId, lessonId) {
  const model = getCourseModel(courseId);
  if (!model) return null;
  const record = model.lessons[String(lessonId)];
  const quiz = record?.quiz;
  if (!quiz || typeof quiz !== "object" || Array.isArray(quiz)) return null;
  return {
    attempts: Array.isArray(quiz.attempts) ? [...quiz.attempts] : [],
    lastAnswers: quiz.lastAnswers ?? null,
  };
}

/** Persist a partial patch to a lesson's quiz sub-record (mutates the model). */
export function patchQuizRecord(courseId, lessonId, patch) {
  const model = getCourseModel(courseId);
  if (!model) return null;
  const id = String(lessonId);
  const existing = model.lessons[id] || { status: "in-progress" };
  const prevQuiz =
    existing.quiz && typeof existing.quiz === "object" && !Array.isArray(existing.quiz)
      ? existing.quiz
      : {};
  model.lessons[id] = {
    ...existing,
    status: existing.status || "in-progress",
    quiz: {
      attempts: Array.isArray(prevQuiz.attempts) ? prevQuiz.attempts : [],
      lastAnswers: prevQuiz.lastAnswers ?? null,
      ...patch,
    },
  };
  saveCourseModel(courseId, model);
  return model.lessons[id];
}

/**
 * Append one attempt, capping stored history at MAX_ATTEMPTS (oldest evicted
 * first). Each call creates exactly one attempt — the caller decides the
 * timing; the adapter never deduplicates by answer content.
 */
export function appendQuizAttempt(courseId, lessonId, attempt) {
  const model = getCourseModel(courseId);
  if (!model) return null;
  const id = String(lessonId);
  const existing = model.lessons[id] || { status: "in-progress" };
  const prevQuiz =
    existing.quiz && typeof existing.quiz === "object" && !Array.isArray(existing.quiz)
      ? existing.quiz
      : {};
  const prior = Array.isArray(prevQuiz.attempts) ? prevQuiz.attempts : [];
  const attempts = [...prior, attempt].slice(-MAX_ATTEMPTS);
  model.lessons[id] = {
    ...existing,
    status: existing.status || "in-progress",
    quiz: {
      attempts,
      lastAnswers: null,
    },
  };
  saveCourseModel(courseId, model);
  return model.lessons[id];
}

/**
 * Read the opaque submission sub-record for a lesson. Returns a fresh object
 * each call so callers can't mutate the stored reference.
 *
 * @returns {{attempt: object|null, draft: object|null, submittedAt: string|null} | null}
 */
export function getSubmissionRecord(courseId, lessonId) {
  const model = getCourseModel(courseId);
  if (!model) return null;
  const record = model.lessons[String(lessonId)];
  const sub = record?.submission;
  if (!sub || typeof sub !== "object" || Array.isArray(sub)) return null;
  return {
    attempt: sub.attempt ?? null,
    draft: sub.draft ?? null,
    submittedAt: sub.submittedAt ?? null,
  };
}

/** Persist (overwrite) the editable submission draft. */
export function saveSubmissionDraft(courseId, lessonId, draft) {
  const model = getCourseModel(courseId);
  if (!model) return null;
  const id = String(lessonId);
  const existing = model.lessons[id] || { status: "in-progress" };
  const prevSub =
    existing.submission &&
    typeof existing.submission === "object" &&
    !Array.isArray(existing.submission)
      ? existing.submission
      : {};
  model.lessons[id] = {
    ...existing,
    status: existing.status || "in-progress",
    submission: {
      attempt: prevSub.attempt ?? null,
      submittedAt: prevSub.submittedAt ?? null,
      draft: draft ?? null,
    },
  };
  saveCourseModel(courseId, model);
  return model.lessons[id];
}

/** Remove a saved submission draft without touching any recorded attempt. */
export function clearSubmissionDraft(courseId, lessonId) {
  const model = getCourseModel(courseId);
  if (!model) return null;
  const id = String(lessonId);
  const existing = model.lessons[id] || { status: "in-progress" };
  const prevSub =
    existing.submission &&
    typeof existing.submission === "object" &&
    !Array.isArray(existing.submission)
      ? existing.submission
      : {};
  model.lessons[id] = {
    ...existing,
    status: existing.status || "in-progress",
    submission: {
      attempt: prevSub.attempt ?? null,
      submittedAt: prevSub.submittedAt ?? null,
      draft: null,
    },
  };
  saveCourseModel(courseId, model);
  return model.lessons[id];
}

/**
 * Record an immutable submission attempt (the canonical snapshot). Clears the
 * draft and stamps the submission time. Each call overwrites the previous
 * attempt — re-submission requires a reset first (see resetSubmission).
 */
export function setSubmissionAttempt(courseId, lessonId, attempt) {
  const model = getCourseModel(courseId);
  if (!model) return null;
  const id = String(lessonId);
  const existing = model.lessons[id] || { status: "in-progress" };
  model.lessons[id] = {
    ...existing,
    status: existing.status || "in-progress",
    submission: {
      attempt,
      draft: null,
      submittedAt: new Date().toISOString(),
    },
  };
  saveCourseModel(courseId, model);
  return model.lessons[id];
}

/**
 * Remove the recorded attempt so the learner can re-draft. The lesson status
 * reverts to "in-progress" (it is still reachable; completion is removed so the
 * progress model recalculates). Does not touch draft state.
 */
export function clearSubmissionAttempt(courseId, lessonId) {
  const model = getCourseModel(courseId);
  if (!model) return null;
  const id = String(lessonId);
  const existing = model.lessons[id] || { status: "in-progress" };
  const prevSub =
    existing.submission &&
    typeof existing.submission === "object" &&
    !Array.isArray(existing.submission)
      ? existing.submission
      : {};
  model.lessons[id] = {
    ...existing,
    status: existing.status === "completed" && !prevSub.attempt ? "completed" : "in-progress",
    completedAt:
      existing.status === "completed" && !prevSub.attempt ? existing.completedAt : null,
    submission: {
      attempt: null,
      draft: prevSub.draft ?? null,
      submittedAt: null,
    },
  };
  saveCourseModel(courseId, model);
  return model.lessons[id];
}
