import * as wishlistRepository from "src/services/repositories/wishlistRepository";
import * as enrollmentRepository from "src/services/repositories/enrollmentRepository";
import { DEFAULT_STUDENT_ID } from "src/data/students";

export function getWishlistedCourses(studentId = DEFAULT_STUDENT_ID) {
  return wishlistRepository.getWishlistedCourses(studentId);
}

export function toggleWishlist(studentId = DEFAULT_STUDENT_ID, courseId) {
  return wishlistRepository.toggleWishlist(studentId, courseId);
}

export function isCourseWishlisted(studentId = DEFAULT_STUDENT_ID, courseId) {
  return wishlistRepository.isCourseWishlisted(studentId, courseId);
}

export function addCourseToWishlist(studentId = DEFAULT_STUDENT_ID, courseId) {
  return wishlistRepository.addToWishlist(studentId, courseId);
}

export function enrollFromWishlist(studentId = DEFAULT_STUDENT_ID, courseId) {
  return wishlistRepository.enrollFromWishlist(studentId, courseId, enrollmentRepository);
}