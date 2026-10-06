import * as progressRepository from "src/services/repositories/progressRepository";
import * as activityRepository from "src/services/repositories/activityRepository";
import * as enrollmentRepository from "src/services/repositories/enrollmentRepository";
import { lessonDurationHours } from "src/lib/studentProgressLib";
import { DEFAULT_STUDENT_ID } from "src/data/students";

export function getLessonProgress(studentId = DEFAULT_STUDENT_ID, courseId, lessonId) {
  return progressRepository.getLessonProgress(studentId, courseId, lessonId, enrollmentRepository);
}

export function updateLessonProgress(studentId = DEFAULT_STUDENT_ID, courseId, lessonId, patch) {
  return progressRepository.upsertLessonProgress(studentId, courseId, lessonId, patch, enrollmentRepository);
}

export function completeLesson(studentId = DEFAULT_STUDENT_ID, courseId, lessonId) {
  const result = progressRepository.completeLesson(studentId, courseId, lessonId, enrollmentRepository);

  if (result.nextLessonId || result.courseCompleted) {
    activityRepository.appendEvent(studentId, {
      courseId,
      lessonId,
      eventType: "completion",
      estimatedHours: lessonDurationHours(lessonId),
    });
  }

  return result;
}

export function recordLessonAccess(studentId = DEFAULT_STUDENT_ID, courseId, lessonId) {
  progressRepository.recordLessonAccess(studentId, courseId, lessonId, enrollmentRepository);

  activityRepository.appendEvent(studentId, {
    courseId,
    lessonId,
    eventType: "access",
    estimatedHours: 0.25,
  });
}

export function getCourseProgress(studentId = DEFAULT_STUDENT_ID, courseId) {
  return progressRepository.getCourseProgress(studentId, courseId, enrollmentRepository);
}

export function getResumeLesson(studentId = DEFAULT_STUDENT_ID, courseId) {
  return progressRepository.getResumeLesson(studentId, courseId, enrollmentRepository);
}

export function clearCourseProgress(courseId) {
  progressRepository.clearCourseProgress(courseId);
}

export function getEnrolledCourseView(studentId = DEFAULT_STUDENT_ID, courseId) {
  return progressRepository.getEnrolledCourseView(studentId, courseId, enrollmentRepository);
}

export function getAllLessonProgress(studentId = DEFAULT_STUDENT_ID, courseId) {
  return progressRepository.getLessonProgressAll(studentId, courseId);
}