import { studentWishlist } from "src/data/studentEngagement";
import { getCourseById } from "src/services/courses";

const STORAGE_KEY = "ethiantech-student-wishlist";

function readStore() {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

function writeStore(ids) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
  } catch {
    // ignore
  }
}

export function getWishlistIds(studentId) {
  const stored = readStore();
  const dataIds = studentWishlist.filter((w) => w.studentId === studentId).map((w) => w.courseId);
  const combined = [...new Set([...stored, ...dataIds])];
  return combined;
}

export function getWishlistedCourses(studentId) {
  return getWishlistIds(studentId)
    .map((id) => getCourseById(id))
    .filter(Boolean);
}

export function addToWishlist(studentId, courseId) {
  const numericId = Number(courseId);
  const ids = getWishlistIds(studentId);
  if (!ids.includes(numericId)) {
    writeStore([...ids, numericId]);
  }
  return { added: true };
}

export function removeFromWishlist(studentId, courseId) {
  const numericId = Number(courseId);
  const ids = getWishlistIds(studentId).filter((id) => id !== numericId);
  writeStore(ids);
  return { added: false };
}

export function toggleWishlist(studentId, courseId) {
  const numericId = Number(courseId);
  const ids = getWishlistIds(studentId);
  if (ids.includes(numericId)) {
    return removeFromWishlist(studentId, numericId);
  }
  return addToWishlist(studentId, numericId);
}

export function isCourseWishlisted(studentId, courseId) {
  return getWishlistIds(studentId).includes(Number(courseId));
}

export function enrollFromWishlist(studentId, courseId, enrollmentRepository) {
  const result = enrollmentRepository.create(studentId, courseId);
  if (result.success) {
    removeFromWishlist(studentId, courseId);
  }
  return result;
}