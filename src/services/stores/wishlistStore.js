/**
 * Wishlist — course ids the learner has bookmarked from the catalog.
 * In-memory only: resets to empty on every page load. Presentation fields are
 * resolved from the catalog by the repository (see src/services/studentRepository.js).
 */

let courseIds = [];

export function getWishlistIds() {
  return courseIds.slice();
}

export function addToWishlist(courseId) {
  const numericId = Number(courseId);
  if (!courseIds.includes(numericId)) {
    courseIds = [...courseIds, numericId];
  }
}

export function removeFromWishlist(courseId) {
  const numericId = Number(courseId);
  courseIds = courseIds.filter((id) => id !== numericId);
}

export function isInWishlist(courseId) {
  return courseIds.includes(Number(courseId));
}
