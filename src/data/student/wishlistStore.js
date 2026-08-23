// Private persistence adapter for the learner's wishlist.
//
// UI never touches localStorage directly — every read/write goes through
// studentRepository, which composes these IDs with the catalog. Only course IDs
// are stored; full course data is fetched from the catalog so there is a single
// source of truth for presentation fields (title, image, instructor, rating,
// price). The shape is intentionally simple and backend-shaped so a future API
// client can replace the localStorage calls without changing the repository's
// public signatures.
//
// Stored shape:
// { courseIds: number[] }

import { wishlistedCourses } from "src/data/student/wishlist";

const STORAGE_KEY = "ethiantech-student-wishlist";

// In-memory mirror so repeated reads in one session don't re-parse localStorage.
let memoryStore = null;

function seedStore() {
  return { courseIds: wishlistedCourses.map((c) => c.id) };
}

function readStore() {
  if (memoryStore) return memoryStore;
  let parsed = null;
  try {
    const raw =
      typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) parsed = JSON.parse(raw);
  } catch {
    // Corrupt JSON — start clean rather than throwing.
    parsed = null;
  }
  // Reject anything that isn't a plain object with a numeric courseIds array so
  // a malformed top-level value can't poison downstream reads.
  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed) ||
    !Array.isArray(parsed.courseIds)
  ) {
    parsed = seedStore();
  }
  memoryStore = parsed;
  return memoryStore;
}

function writeStore(store) {
  memoryStore = store;
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }
  } catch {
    // Quota exceeded or privacy mode — degrade to in-memory only.
  }
}

/** All wishlisted course IDs. */
export function getWishlistIds() {
  return readStore().courseIds.slice();
}

/** Add a course to the wishlist (idempotent). */
export function addToWishlist(courseId) {
  const numericId = Number(courseId);
  const store = readStore();
  if (!store.courseIds.includes(numericId)) {
    store.courseIds = [...store.courseIds, numericId];
    writeStore(store);
  }
}

/** Remove a course from the wishlist. */
export function removeFromWishlist(courseId) {
  const numericId = Number(courseId);
  const store = readStore();
  const next = store.courseIds.filter((id) => id !== numericId);
  if (next.length !== store.courseIds.length) {
    store.courseIds = next;
    writeStore(store);
  }
}

/** Whether a course is wishlisted. */
export function isInWishlist(courseId) {
  return readStore().courseIds.includes(Number(courseId));
}
