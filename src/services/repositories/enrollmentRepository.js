import { studentEnrollments, enrollmentByStudentAndCourse } from "src/data/studentAcademic";
import { progressByStudentAndCourse } from "src/data/studentProgress";

let supplementalEnrollments = [];
let nextSupplementalEnrollmentId =
  studentEnrollments.reduce((max, e) => Math.max(max, Number(e.id) || 0), 0) + 1;

function deriveEnrollmentStatus(progressRecords) {
  if (!progressRecords || progressRecords.length === 0) return "Not Started";
  const completedNonPreview = progressRecords.filter(
    (r) => r.status === "completed" && !isPreviewLesson(r.lessonId)
  ).length;
  const nonPreviewTotal = progressRecords.filter((r) => !isPreviewLesson(r.lessonId)).length;
  if (nonPreviewTotal > 0 && completedNonPreview === nonPreviewTotal) return "Completed";
  if (completedNonPreview === 0) return "Not Started";
  return "In Progress";
}

function isPreviewLesson(lessonId) {
  if (!lessonId) return false;
  const match = lessonId.match(/^(\d+)-s(\d+)-l(\d+)$/);
  if (!match) return false;
  // This would need course curriculum to check preview status
  // For now, assume no preview lessons in progress data
  return false;
}

function countCompletedLessons(progressRecords) {
  return progressRecords?.filter((r) => r.status === "completed").length ?? 0;
}

export function findByStudent(studentId) {
  const base = studentEnrollments.filter((e) => e.studentId === studentId);
  const supplemental = supplementalEnrollments.filter((e) => e.studentId === studentId);
  return [...base, ...supplemental].map((enrollment) => {
    const progress = progressByStudentAndCourse(studentId, enrollment.courseId);
    return {
      ...enrollment,
      enrollmentStatus: deriveEnrollmentStatus(progress),
      completedLessons: countCompletedLessons(progress),
    };
  });
}

export function findByStudentAndCourse(studentId, courseId) {
  const key = `${studentId}:${courseId}`;
  const enrollment = enrollmentByStudentAndCourse[key];
  if (enrollment) {
    const progress = progressByStudentAndCourse(studentId, courseId);
    return {
      ...enrollment,
      enrollmentStatus: deriveEnrollmentStatus(progress),
      completedLessons: countCompletedLessons(progress),
    };
  }
  const supplemental = supplementalEnrollments.find(
    (e) => e.studentId === studentId && e.courseId === Number(courseId)
  );
  if (supplemental) {
    const progress = progressByStudentAndCourse(studentId, courseId);
    return {
      ...supplemental,
      enrollmentStatus: deriveEnrollmentStatus(progress),
      completedLessons: countCompletedLessons(progress),
    };
  }
  return null;
}

export function findAll() {
  return [...studentEnrollments, ...supplementalEnrollments];
}

export function create(studentId, courseId) {
  const existing = findByStudentAndCourse(studentId, courseId);
  if (existing) return { success: false, reason: "already-enrolled" };

  const now = new Date().toISOString();
  const enrollment = {
    id: nextSupplementalEnrollmentId++,
    studentId,
    courseId: Number(courseId),
    enrolledAt: now,
    lastAccessed: now,
    dueDate: null,
    createdAt: now,
    updatedAt: now,
  };
  supplementalEnrollments.push(enrollment);
  return { success: true, enrollment };
}

export function updateLastAccessed(studentId, courseId, timestamp) {
  const key = `${studentId}:${courseId}`;
  if (enrollmentByStudentAndCourse[key]) {
    enrollmentByStudentAndCourse[key].lastAccessed = timestamp;
    enrollmentByStudentAndCourse[key].updatedAt = timestamp;
    return true;
  }
  const idx = supplementalEnrollments.findIndex(
    (e) => e.studentId === studentId && e.courseId === Number(courseId)
  );
  if (idx !== -1) {
    supplementalEnrollments[idx].lastAccessed = timestamp;
    supplementalEnrollments[idx].updatedAt = timestamp;
    return true;
  }
  return false;
}

export function getEnrolledCourseIds(studentId) {
  return findByStudent(studentId).map((e) => e.courseId);
}