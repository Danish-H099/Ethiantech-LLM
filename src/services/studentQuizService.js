import { normalizeAnswers, scoreAnswers } from "src/lib/quizScoringLib";
import * as quizRepository from "src/services/repositories/quizRepository";
import * as progressRepository from "src/services/repositories/progressRepository";
import * as activityRepository from "src/services/repositories/activityRepository";
import * as enrollmentRepository from "src/services/repositories/enrollmentRepository";
import { DEFAULT_STUDENT_ID } from "src/data/students";

export function getQuizData(lessonId) {
  return quizRepository.getQuizData(lessonId);
}

export function getQuizAttempts(studentId = DEFAULT_STUDENT_ID, courseId, lessonId) {
  return quizRepository.getQuizAttempts(studentId, courseId, lessonId);
}

export function getQuizDraftAnswers(studentId = DEFAULT_STUDENT_ID, courseId, lessonId) {
  return quizRepository.getQuizDraftAnswers(studentId, courseId, lessonId);
}

export function saveQuizDraftAnswers(studentId = DEFAULT_STUDENT_ID, courseId, lessonId, answers) {
  return quizRepository.saveQuizDraftAnswers(studentId, courseId, lessonId, answers);
}

export function clearQuizDraftAnswers(studentId = DEFAULT_STUDENT_ID, courseId, lessonId) {
  return quizRepository.clearQuizDraftAnswers(studentId, courseId, lessonId);
}

export function hasRemainingAttempts(studentId = DEFAULT_STUDENT_ID, courseId, lessonId) {
  return quizRepository.hasRemainingAttempts(studentId, courseId, lessonId);
}

export function getQuizBestScore(studentId = DEFAULT_STUDENT_ID, courseId, lessonId) {
  return quizRepository.getQuizBestScore(studentId, courseId, lessonId);
}

export function submitQuizAttempt(studentId = DEFAULT_STUDENT_ID, courseId, lessonId, answers) {
  const spec = quizRepository.getQuizData(lessonId);
  if (!spec) return null;

  const { score, correctCount, totalCount, passed } = scoreAnswers(spec, answers);
  const attempt = Object.freeze({
    answers: normalizeAnswers(spec, answers),
    score,
    correctCount,
    totalCount,
    submittedAt: new Date().toISOString(),
  });

  quizRepository.appendQuizAttempt(studentId, courseId, lessonId, attempt);

  activityRepository.appendEvent(studentId, {
    courseId,
    lessonId: String(lessonId),
    eventType: "quiz",
    estimatedHours: 0.25,
  });

  if (passed) {
    const result = progressRepository.completeLesson(studentId, courseId, lessonId, enrollmentRepository);
    return { attempt, passed, courseCompleted: result.courseCompleted, nextLessonId: result.nextLessonId };
  }
  return { attempt, passed: false, courseCompleted: false, nextLessonId: null };
}