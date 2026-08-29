import { wishlist } from "src/data/wishlist";

const STORAGE_KEY = "ethiantech-student-wishlist";

let memoryStore = null;

function seedStore() {
  return { courseIds: wishlist.slice() };
}

function readStore() {
  if (memoryStore) return memoryStore;
  let parsed = null;
  try {
    const raw =
      typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) parsed = JSON.parse(raw);
  } catch {

    parsed = null;
  }

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
    return;
  }
}

export function getWishlistIds() {
  return readStore().courseIds.slice();
}

export function addToWishlist(courseId) {
  const numericId = Number(courseId);
  const store = readStore();
  if (!store.courseIds.includes(numericId)) {
    store.courseIds = [...store.courseIds, numericId];
    writeStore(store);
  }
}

export function removeFromWishlist(courseId) {
  const numericId = Number(courseId);
  const store = readStore();
  const next = store.courseIds.filter((id) => id !== numericId);
  if (next.length !== store.courseIds.length) {
    store.courseIds = next;
    writeStore(store);
  }
}

export function isInWishlist(courseId) {
  return readStore().courseIds.includes(Number(courseId));
}
