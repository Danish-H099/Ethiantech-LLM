import { getCourseById, getCourses } from "src/services/courses";
import { formatRelativeTime } from "src/lib/format";
import * as enrollmentRepository from "src/services/repositories/enrollmentRepository";
import * as progressRepository from "src/services/repositories/progressRepository";
import { DEFAULT_STUDENT_ID } from "src/data/students";

export function getEnrolledCourses(studentId = DEFAULT_STUDENT_ID) {
  const enrollments = enrollmentRepository.findByStudent(studentId);
  return enrollments.map((enrollment) => {
    const course = getCourseById(enrollment.courseId);
    if (!course) return null;
    const progress = progressRepository.getCourseProgress(studentId, enrollment.courseId, enrollmentRepository);
    return {
      id: course.id,
      title: course.title,
      image: course.image,
      instructorName: course.instructors?.[0]?.name || "Instructor",
      hours: course.hours ?? 0,
      category: course.category ?? null,
      status: progress.derivedStatus,
      enrollmentStatus: enrollment.enrollmentStatus,
      progress: progress.progress,
      completedLessons: progress.completedCount,
      totalLessons: progress.totalLessons,
      lastAccessed: enrollment.lastAccessed,
      dueDate: enrollment.dueDate ?? null,
      resumeTitle: null,
      resumeType: null,
      resumeLessonId: null,
      lastAccessedLabel: formatRelativeTime(enrollment.lastAccessed),
    };
  }).filter(Boolean);
}

export function getEnrolledCourseData(studentId = DEFAULT_STUDENT_ID, courseId) {
  return progressRepository.getEnrolledCourseView(studentId, courseId, enrollmentRepository);
}

export function enrollInCourse(studentId = DEFAULT_STUDENT_ID, courseId) {
  return enrollmentRepository.create(studentId, courseId);
}

export function getEnrolledCourseIds(studentId = DEFAULT_STUDENT_ID) {
  return enrollmentRepository.getEnrolledCourseIds(studentId);
}

export function updateLastAccessed(studentId = DEFAULT_STUDENT_ID, courseId) {
  const now = new Date().toISOString();
  enrollmentRepository.updateLastAccessed(studentId, courseId, now);
}

export function getRecommendedCourses(studentId = DEFAULT_STUDENT_ID, limit = 4) {
  const enrollments = enrollmentRepository.findByStudent(studentId);
  const enrolledIds = new Set(enrollments.map((e) => e.courseId));
  const enrolledCategories = new Set(
    enrollments
      .map((e) => getCourseById(e.courseId)?.category)
      .filter(Boolean)
  );

  const candidates = getCourses()
    .filter((c) => !enrolledIds.has(c.id))
    .map((course) => ({
      id: course.id,
      title: course.title,
      image: course.image,
      instructorName: course.instructors?.[0]?.name || "Instructor",
      rating: course.rating ?? 0,
      price: course.price,
      category: course.category,
      matchCount: enrolledCategories.has(course.category) ? 1 : 0,
    }));

  const ranked =
    enrolledCategories.size === 0
      ? candidates.sort((a, b) => b.rating - a.rating)
      : candidates.sort(
          (a, b) => b.matchCount - a.matchCount || b.rating - a.rating
        );

  return ranked.slice(0, limit).map((c) => getCourseById(c.id)).filter(Boolean);
}