import { getCourseById } from "src/services/courses";
import { buildLessonId } from "src/lib/lesson";
import * as activityRepository from "src/services/repositories/activityRepository";
import * as enrollmentRepository from "src/services/repositories/enrollmentRepository";
import * as progressRepository from "src/services/repositories/progressRepository";
import * as quizRepository from "src/services/repositories/quizRepository";
import {
  getStreak as getStreakLib,
  getStudyActivity as getStudyActivityLib,
  getLearningActivity as getLearningActivityLib,
  getScoreTrend as getScoreTrendLib,
  getSkillMastery as getSkillMasteryLib,
  getLearningPace as getLearningPaceLib,
  getQuizMastery as getQuizMasteryLib,
} from "src/lib/analyticsLib";
import { DEFAULT_STUDENT_ID } from "src/data/students";

export function getLearningActivity(studentId = DEFAULT_STUDENT_ID) {
  const events = activityRepository.getEvents(studentId);
  return getLearningActivityLib(events);
}

export function getStreak(nowMs = Date.now(), studentId = DEFAULT_STUDENT_ID) {
  const events = activityRepository.getEvents(studentId);
  return getStreakLib(events, nowMs);
}

export function getStudyActivity(nowMs = Date.now(), studentId = DEFAULT_STUDENT_ID) {
  const events = activityRepository.getEvents(studentId);
  return getStudyActivityLib(events, nowMs);
}

export function getQuizMastery(studentId = DEFAULT_STUDENT_ID) {
  return getQuizMasteryLib(
    studentId,
    enrollmentRepository.findByStudent.bind(null, studentId),
    getCourseById,
    quizRepository.getQuizAttempts,
    quizRepository.getQuizData,
    buildLessonId
  );
}

export function getScoreTrend(nowMs = Date.now(), studentId = DEFAULT_STUDENT_ID) {
  return getScoreTrendLib(
    studentId,
    enrollmentRepository.findByStudent.bind(null, studentId),
    getCourseById,
    quizRepository.getQuizAttempts,
    quizRepository.getQuizData,
    buildLessonId,
    nowMs
  );
}

export function getSkillMastery(studentId = DEFAULT_STUDENT_ID) {
  return getSkillMasteryLib(
    studentId,
    enrollmentRepository.findByStudent.bind(null, studentId),
    getCourseById,
    (sid, courseId) => progressRepository.getCourseProgress(sid, courseId, enrollmentRepository)
  );
}

export function getLearningPace(nowMs = Date.now(), studentId = DEFAULT_STUDENT_ID) {
  return getLearningPaceLib(
    studentId,
    enrollmentRepository.findByStudent.bind(null, studentId),
    getCourseById,
    (sid, courseId) => progressRepository.getCourseProgress(sid, courseId, enrollmentRepository),
    (sid) => getLearningActivity(sid),
    nowMs
  );
}