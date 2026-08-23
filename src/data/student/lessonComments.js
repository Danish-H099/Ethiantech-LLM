// Private persistence adapter for per-lesson learner comments.
//
// UI never touches localStorage directly — every read/write goes through
// studentRepository, which composes this module with the catalog. The shape is
// intentionally simple and backend-shaped so a future API client can replace the
// localStorage calls without changing the repository's public signatures.
//
// Stored shape:
// {
//   comments: Comment[],   // { id, courseId, lessonId, author, text, date }
//   nextId: number
// }

const STORAGE_KEY = "ethiantech-student-comments";

// In-memory mirror so repeated reads in one session don't re-parse localStorage.
let memoryStore = null;

function seedStore() {
  return { comments: [], nextId: 1 };
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
  // Reject anything that isn't a plain object with a comments array so a
  // malformed top-level value can't poison downstream reads.
  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed) ||
    !Array.isArray(parsed.comments)
  ) {
    parsed = seedStore();
  }
  if (typeof parsed.nextId !== "number") {
    parsed.nextId = parsed.comments.reduce(
      (max, c) => Math.max(max, Number(c.id) || 0),
      0
    ) + 1;
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

function formatCommentDate() {
  // ISO so chronological sorting is stable; rendered via formatRelativeTime.
  return new Date().toISOString();
}

/**
 * Comments for one lesson, oldest first (chronological discussion order).
 *
 * @param {string|number} courseId
 * @param {string} lessonId
 * @returns {object[]}
 */
export function getCommentsForLesson(courseId, lessonId) {
  const numericId = Number(courseId);
  const lid = String(lessonId);
  return readStore()
    .comments.filter((c) => Number(c.courseId) === numericId && c.lessonId === lid)
    .slice()
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
}

/**
 * Post a comment. Returns the created Comment.
 *
 * @param {string|number} courseId
 * @param {string} lessonId
 * @param {string} author
 * @param {string} text
 * @returns {object}
 */
export function addComment(courseId, lessonId, author, text) {
  const store = readStore();
  const comment = {
    id: store.nextId,
    courseId: Number(courseId),
    lessonId: String(lessonId),
    author,
    text,
    date: formatCommentDate(),
  };
  store.comments = [...store.comments, comment];
  store.nextId = store.nextId + 1;
  writeStore(store);
  return comment;
}
