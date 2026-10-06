import { studentCourseGrades, gradeByStudentAndCourse } from "src/data/studentAcademic";

export function findByStudent(studentId) {
  return studentCourseGrades.filter((g) => g.studentId === studentId);
}

export function findByStudentAndCourse(studentId, courseId) {
  return gradeByStudentAndCourse[`${studentId}:${courseId}`] || null;
}

export function getCourseScores(studentId) {
  return studentCourseGrades.filter((g) => g.studentId === studentId);
}