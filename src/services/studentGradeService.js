import { getCourseById } from "src/services/courses";
import * as gradeRepository from "src/services/repositories/gradeRepository";
import * as progressRepository from "src/services/repositories/progressRepository";
import * as enrollmentRepository from "src/services/repositories/enrollmentRepository";
import * as quizRepository from "src/services/repositories/quizRepository";
import * as exerciseRepository from "src/services/repositories/exerciseRepository";
import { getGrades as getGradesLib, getGradeDetail as getGradeDetailLib, getPerformanceByCategory as getPerformanceByCategoryLib } from "src/lib/gradeCalculationLib";
import { DEFAULT_STUDENT_ID } from "src/data/students";

export function getGrades(studentId = DEFAULT_STUDENT_ID, filter = "all") {
  const grades = getGradesLib(
    studentId,
    enrollmentRepository.findByStudent.bind(null, studentId),
    gradeRepository.findByStudent(studentId),
    (sid, courseId) => progressRepository.getCourseProgress(sid, courseId, enrollmentRepository)
  );

  if (filter === "Completed") return grades.filter((g) => g.status === "Completed");
  if (filter === "In Progress") return grades.filter((g) => g.status === "In Progress");
  return grades;
}

export function getGradeDetail(studentId = DEFAULT_STUDENT_ID, courseId) {
  return getGradeDetailLib(
    studentId,
    courseId,
    enrollmentRepository.findByStudent.bind(null, studentId),
    gradeRepository.findByStudent(studentId),
    (sid, cid) => progressRepository.getCourseProgress(sid, cid, enrollmentRepository),
    (sid, cid, lessonId) => progressRepository.getLessonProgress(sid, cid, lessonId, enrollmentRepository),
    quizRepository.getQuizAttempts,
    quizRepository.getQuizData,
    exerciseRepository.getSubmissionRecord
  );
}

export function getPerformanceByCategory(studentId = DEFAULT_STUDENT_ID) {
  return getPerformanceByCategoryLib(studentId, gradeRepository.getCourseScores(studentId), getCourseById);
}

export function getCourseScores(studentId = DEFAULT_STUDENT_ID) {
  return gradeRepository.getCourseScores(studentId);
}