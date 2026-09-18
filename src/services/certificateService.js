import { getCourseById } from "src/services/courses";
import * as enrollmentRepository from "src/services/repositories/enrollmentRepository";
import { getGrades } from "src/services/studentGradeService";
import { DEFAULT_STUDENT_ID } from "src/data/students";

export function getStudentCertificates(studentId = DEFAULT_STUDENT_ID) {
  return getGrades(studentId, "completed")
    .filter((g) => g.status === "Completed")
    .map((g) => {
      const course = getCourseById(g.courseId);
      const enrollment = enrollmentRepository.findByStudentAndCourse(studentId, g.courseId);
      return {
        courseId: g.courseId,
        courseTitle: g.courseTitle,
        courseImage: g.courseImage,
        institutionName: course?.institution?.name ?? null,
        completedAt: enrollment?.lastAccessed ?? null,
        grade: g.grade,
        score: g.score,
      };
    });
}