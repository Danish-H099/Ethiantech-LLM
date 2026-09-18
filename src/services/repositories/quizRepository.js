import quizzes from "src/data/quizzes";
import {
  getQuizRecord,
  patchQuizRecord,
  appendQuizAttempt as appendQuizAttemptStore,
} from "src/services/stores/lessonProgressStore";
import { scoreAnswers } from "src/lib/quizScoringLib";

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

export function getQuizAttempts(studentId, courseId, lessonId) {
  const record = getQuizRecord(courseId, lessonId);
  return record ? record.attempts : [];
}

export function getQuizDraftAnswers(studentId, courseId, lessonId) {
  const record = getQuizRecord(courseId, lessonId);
  return record ? record.lastAnswers : null;
}

export function saveQuizDraftAnswers(studentId, courseId, lessonId, answers) {
  return patchQuizRecord(courseId, lessonId, { lastAnswers: answers || null });
}

export function clearQuizDraftAnswers(studentId, courseId, lessonId) {
  return patchQuizRecord(courseId, lessonId, { lastAnswers: null });
}

export function hasRemainingAttempts(studentId, courseId, lessonId) {
  const spec = getQuizData(lessonId);
  if (!spec) return false;
  if (spec.maxAttempts === 0) return false;
  if (spec.maxAttempts === null) return true;
  const attempts = getQuizAttempts(studentId, courseId, lessonId);
  return attempts.length < spec.maxAttempts;
}

export function getQuizBestScore(studentId, courseId, lessonId) {
  const attempts = getQuizAttempts(studentId, courseId, lessonId);
  if (attempts.length === 0) return null;
  return Math.max(...attempts.map((a) => a.score));
}

export function appendQuizAttempt(studentId, courseId, lessonId, attempt) {
  return appendQuizAttemptStore(courseId, lessonId, attempt);
}

export function submitQuizAttempt(studentId, courseId, lessonId, answers) {
  const spec = getQuizData(lessonId);
  if (!spec) return null;

  const { score, correctCount, totalCount, passed } = scoreAnswers(spec, answers);
  const attempt = Object.freeze({
    answers: scoreAnswers(spec, answers).score === 100 ? answers : answers, // normalizeAnswers would be needed here
    score,
    correctCount,
    totalCount,
    submittedAt: new Date().toISOString(),
  });

  appendQuizAttemptStore(courseId, lessonId, attempt);

  return { attempt, passed, score, correctCount, totalCount };
}