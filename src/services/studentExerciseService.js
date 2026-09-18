import * as exerciseRepository from "src/services/repositories/exerciseRepository";
import * as progressRepository from "src/services/repositories/progressRepository";
import * as activityRepository from "src/services/repositories/activityRepository";
import * as enrollmentRepository from "src/services/repositories/enrollmentRepository";
import { lessonDurationHours } from "src/lib/studentProgressLib";
import { DEFAULT_STUDENT_ID } from "src/data/students";

export function getExerciseData(lessonId) {
  return exerciseRepository.getExerciseData(lessonId);
}

export function getSubmissionRecord(studentId = DEFAULT_STUDENT_ID, courseId, lessonId) {
  return exerciseRepository.getSubmissionRecord(studentId, courseId, lessonId);
}

export function getSubmissionDraft(studentId = DEFAULT_STUDENT_ID, courseId, lessonId) {
  return exerciseRepository.getSubmissionDraft(studentId, courseId, lessonId);
}

export function saveSubmissionDraft(studentId = DEFAULT_STUDENT_ID, courseId, lessonId, draft) {
  return exerciseRepository.saveSubmissionDraft(studentId, courseId, lessonId, draft);
}

export function clearSubmissionDraft(studentId = DEFAULT_STUDENT_ID, courseId, lessonId) {
  return exerciseRepository.clearSubmissionDraft(studentId, courseId, lessonId);
}

export function submitAssignmentAttempt(studentId = DEFAULT_STUDENT_ID, courseId, lessonId, draft) {
  const spec = exerciseRepository.getExerciseData(lessonId);
  if (!spec) return null;

  const content = draft?.content ?? "";
  if (typeof content !== "string" || content.trim().length === 0) {
    return { error: "Submission cannot be empty." };
  }

  const attempt = Object.freeze({
    content,
    attachments: Array.isArray(draft?.attachments) ? [...draft.attachments] : [],
    submittedAt: new Date().toISOString(),
  });

  exerciseRepository.submitAssignmentAttempt(studentId, courseId, lessonId, draft);

  activityRepository.appendEvent(studentId, {
    courseId,
    lessonId: String(lessonId),
    eventType: "submission",
    estimatedHours: lessonDurationHours(String(lessonId)),
  });

  const result = progressRepository.completeLesson(studentId, courseId, lessonId, enrollmentRepository);
  return {
    attempt,
    courseCompleted: result.courseCompleted,
    nextLessonId: result.nextLessonId,
  };
}

export function resetSubmission(studentId = DEFAULT_STUDENT_ID, courseId, lessonId) {
  exerciseRepository.resetSubmission(studentId, courseId, lessonId);
  return progressRepository.getCourseProgress(studentId, courseId, enrollmentRepository);
}