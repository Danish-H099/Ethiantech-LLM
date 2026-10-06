import { getCourseById } from "src/services/courses";
import { lessonProgressByComposite, progressByStudentAndCourse } from "src/data/studentProgress";
import {
  getCourseModel,
  saveCourseModel,
  clearStoredProgress,
  buildSeedModel,
  getQuizRecord as getQuizRecordFromStore,
  patchQuizRecord as patchQuizRecordFromStore,
  appendQuizAttempt as appendQuizAttemptFromStore,
  getSubmissionRecord as getSubmissionRecordFromStore,
  saveSubmissionDraft as saveSubmissionDraftToStore,
  clearSubmissionDraft as clearSubmissionDraftFromStore,
  setSubmissionAttempt as setSubmissionAttemptToStore,
  clearSubmissionAttempt as clearSubmissionAttemptFromStore,
} from "src/services/stores/lessonProgressStore";
import {
  buildFlatLessons,
  deriveStatuses,
  buildEnrolledCourseView,
} from "src/lib/studentProgressLib";
import { LESSON_STATUS, ENROLLMENT_STATUS } from "src/lib/statuses";

function findEnrollment(studentId, courseId, enrollmentRepository) {
  return enrollmentRepository.findByStudentAndCourse(studentId, courseId);
}

export function getLessonProgress(studentId, courseId, lessonId, enrollmentRepository) {
  const enrollment = findEnrollment(studentId, courseId, enrollmentRepository);
  if (!enrollment) return null;

  const stored = getCourseModel(courseId);
  if (stored && stored.lessons[String(lessonId)]) {
    return { ...stored.lessons[String(lessonId)], studentId, courseId, lessonId };
  }

  const seed = lessonProgressByComposite(studentId, courseId, lessonId);
  return seed ? { ...seed, status: seed.status } : null;
}

export function upsertLessonProgress(studentId, courseId, lessonId, patch, enrollmentRepository) {
  const enrollment = findEnrollment(studentId, courseId, enrollmentRepository);
  if (!enrollment) return null;

  const course = getCourseById(courseId);
  if (!course) return null;

  const sectionsWithLessons = (course.curriculum ?? []).map((s) => ({
    ...s,
    lessons: (s.lessons || []).map((l) => ({ ...l })),
  }));
  const flat = buildFlatLessons(courseId, sectionsWithLessons);
  const model = getCourseModel(courseId) || buildSeedModel(flat, enrollment.completedLessons || 0);

  const id = String(lessonId);
  const existing = model.lessons[id] || { status: LESSON_STATUS.IN_PROGRESS };
  model.lessons[id] = {
    ...existing,
    ...patch,
    status: patch.status || existing.status || LESSON_STATUS.IN_PROGRESS,
  };
  saveCourseModel(courseId, model);
  return { ...model.lessons[id], studentId, courseId, lessonId };
}

export function completeLesson(studentId, courseId, lessonId, enrollmentRepository) {
  const enrollment = findEnrollment(studentId, courseId, enrollmentRepository);
  if (!enrollment) return { nextLessonId: null, courseCompleted: false };

  const course = getCourseById(courseId);
  if (!course) return { nextLessonId: null, courseCompleted: false };

  const sectionsWithLessons = (course.curriculum ?? []).map((s) => ({
    ...s,
    lessons: (s.lessons || []).map((l) => ({ ...l })),
  }));
  const flat = buildFlatLessons(courseId, sectionsWithLessons);
  const model = getCourseModel(courseId) || buildSeedModel(flat, enrollment.completedLessons || 0);

  const id = String(lessonId);
  model.lessons[id] = {
    ...(model.lessons[id] || {}),
    status: LESSON_STATUS.COMPLETED,
    completedAt: new Date().toISOString(),
  };

  const { statuses } = deriveStatuses(flat, model);
  const idx = flat.findIndex((f) => f.lessonId === id);
  let nextIdx = -1;
  for (let i = idx + 1; i < flat.length; i += 1) {
    if (statuses[i] !== LESSON_STATUS.LOCKED) {
      nextIdx = i;
      break;
    }
  }
  const nextLessonId = nextIdx !== -1 ? flat[nextIdx].lessonId : null;
  model.lastAccessedLessonId = nextLessonId || id;

  const completedNonPreview = flat.filter(
    (fl, i) => statuses[i] === LESSON_STATUS.COMPLETED && !fl.isPreview
  ).length;
  const nonPreviewTotal = flat.filter((fl) => !fl.isPreview).length;
  const courseCompleted = nonPreviewTotal > 0 && completedNonPreview === nonPreviewTotal;
  saveCourseModel(courseId, model);

  return { nextLessonId, courseCompleted };
}

export function recordLessonAccess(studentId, courseId, lessonId, enrollmentRepository) {
  const enrollment = findEnrollment(studentId, courseId, enrollmentRepository);
  if (!enrollment) return;

  const course = getCourseById(courseId);
  if (!course) return;

  const sectionsWithLessons = (course.curriculum ?? []).map((s) => ({
    ...s,
    lessons: (s.lessons || []).map((l) => ({ ...l })),
  }));
  const flat = buildFlatLessons(courseId, sectionsWithLessons);
  const model = getCourseModel(courseId) || buildSeedModel(flat, enrollment.completedLessons || 0);
  model.lastAccessedLessonId = String(lessonId);
  saveCourseModel(courseId, model);
}

export function getCourseProgress(studentId, courseId, enrollmentRepository) {
  const enrollment = findEnrollment(studentId, courseId, enrollmentRepository);
  if (!enrollment) {
    return {
      completedCount: 0,
      totalLessons: 0,
      progress: 0,
      lastAccessedLessonId: null,
      courseCompleted: false,
      derivedStatus: ENROLLMENT_STATUS.NOT_STARTED,
    };
  }

  const course = getCourseById(courseId);
  if (!course) {
    return {
      completedCount: 0,
      totalLessons: 0,
      progress: 0,
      lastAccessedLessonId: null,
      courseCompleted: false,
      derivedStatus: ENROLLMENT_STATUS.NOT_STARTED,
    };
  }

  const sectionsWithLessons = (course.curriculum ?? []).map((s) => ({
    ...s,
    lessons: (s.lessons || []).map((l) => ({ ...l })),
  }));
  const flat = buildFlatLessons(courseId, sectionsWithLessons);
  const model = getCourseModel(courseId) || buildSeedModel(flat, enrollment.completedLessons || 0);
  const { statuses } = deriveStatuses(flat, model);

  const totalLessons = flat.length;
  const completedCount = statuses.filter((s) => s === LESSON_STATUS.COMPLETED).length;
  const completedNonPreview = flat.filter(
    (fl, i) => statuses[i] === LESSON_STATUS.COMPLETED && !fl.isPreview
  ).length;
  const nonPreviewTotal = flat.filter((fl) => !fl.isPreview).length;
  const courseCompleted = nonPreviewTotal > 0 && completedNonPreview === nonPreviewTotal;
  const progress = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
  const derivedStatus = courseCompleted
    ? ENROLLMENT_STATUS.COMPLETED
    : completedNonPreview === 0
      ? ENROLLMENT_STATUS.NOT_STARTED
      : ENROLLMENT_STATUS.IN_PROGRESS;

  return {
    completedCount,
    totalLessons,
    progress,
    lastAccessedLessonId: model.lastAccessedLessonId || null,
    courseCompleted,
    derivedStatus,
  };
}

export function getResumeLesson(studentId, courseId, enrollmentRepository) {
  const enrollment = findEnrollment(studentId, courseId, enrollmentRepository);
  if (!enrollment) return null;

  const course = getCourseById(courseId);
  if (!course) return null;

  const sectionsWithLessons = (course.curriculum ?? []).map((s) => ({
    ...s,
    lessons: (s.lessons || []).map((l) => ({ ...l })),
  }));
  const flat = buildFlatLessons(courseId, sectionsWithLessons);
  const model = getCourseModel(courseId) || buildSeedModel(flat, enrollment.completedLessons || 0);
  const { statuses } = deriveStatuses(flat, model);

  const firstIncomplete = statuses.findIndex(
    (s) => s !== LESSON_STATUS.COMPLETED && s !== LESSON_STATUS.LOCKED
  );
  if (firstIncomplete === -1) return null;

  return {
    sectionIndex: flat[firstIncomplete].sectionIndex,
    lessonIndex: flat[firstIncomplete].lessonIndex,
    lessonId: flat[firstIncomplete].lessonId,
    title: sectionsWithLessons[flat[firstIncomplete].sectionIndex].lessons[flat[firstIncomplete].lessonIndex].title,
    type: sectionsWithLessons[flat[firstIncomplete].sectionIndex].lessons[flat[firstIncomplete].lessonIndex].type,
  };
}

export function clearCourseProgress(courseId) {
  clearStoredProgress(courseId);
}

export function getLessonProgressAll(studentId, courseId) {
  return progressByStudentAndCourse(studentId, courseId);
}

// Quiz related
export function getQuizRecord(studentId, courseId, lessonId) {
  return getQuizRecordFromStore(courseId, lessonId);
}

export function patchQuizRecord(studentId, courseId, lessonId, patch) {
  return patchQuizRecordFromStore(courseId, lessonId, patch);
}

export function appendQuizAttempt(studentId, courseId, lessonId, attempt) {
  return appendQuizAttemptFromStore(courseId, lessonId, attempt);
}

// Submission related
export function getSubmissionRecord(studentId, courseId, lessonId) {
  return getSubmissionRecordFromStore(courseId, lessonId);
}

export function saveSubmissionDraft(studentId, courseId, lessonId, draft) {
  return saveSubmissionDraftToStore(courseId, lessonId, draft);
}

export function clearSubmissionDraft(studentId, courseId, lessonId) {
  return clearSubmissionDraftFromStore(courseId, lessonId);
}

export function setSubmissionAttempt(studentId, courseId, lessonId, attempt) {
  return setSubmissionAttemptToStore(courseId, lessonId, attempt);
}

export function clearSubmissionAttempt(studentId, courseId, lessonId) {
  return clearSubmissionAttemptFromStore(courseId, lessonId);
}

export function getEnrolledCourseView(studentId, courseId, enrollmentRepository) {
  const enrollment = findEnrollment(studentId, courseId, enrollmentRepository);
  const course = getCourseById(courseId);
  return buildEnrolledCourseView(studentId, courseId, enrollment, course, getCourseModel, buildSeedModel);
}