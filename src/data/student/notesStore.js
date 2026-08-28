// Private persistence adapter for learner-authored course notes.
//
// UI never touches localStorage directly — every read/write goes through
// studentRepository, which composes this module with the catalog. The shape is
// intentionally simple and backend-shaped so a future API client can replace the
// localStorage calls without changing the repository's public signatures.
//
// Stored shape:
// {
//   notes: Note[],          // { id, courseId, courseName, title, content, date }
//   nextId: number
// }

import { courseNotes } from "src/data/student/notes";

const STORAGE_KEY = "ethiantech-student-notes";

// In-memory mirror so repeated reads in one session don't re-parse localStorage.
let memoryStore = null;

function seedStore() {
  const notes = courseNotes.map((n) => ({ ...n }));
  const nextId = notes.reduce((max, n) => Math.max(max, Number(n.id) || 0), 0) + 1;
  return { notes, nextId };
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
  // Reject anything that isn't a plain object with a notes array so a malformed
  // top-level value can't poison downstream reads.
  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed) ||
    !Array.isArray(parsed.notes)
  ) {
    parsed = seedStore();
  }
  if (typeof parsed.nextId !== "number") {
    parsed.nextId = parsed.notes.reduce(
      (max, n) => Math.max(max, Number(n.id) || 0),
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

function formatNoteDate() {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** All notes, in stored order. */
export function getAllNotes() {
  return readStore().notes.slice();
}

/** Notes for one course (lookup by stable courseId, not courseName). */
export function getNotesForCourse(courseId) {
  const numericId = Number(courseId);
  return readStore().notes.filter((n) => Number(n.courseId) === numericId);
}

/** Create a note. Returns the created Note. */
export function addNote(courseId, courseName, title, content) {
  const store = readStore();
  const note = {
    id: store.nextId,
    courseId: Number(courseId),
    courseName,
    title,
    content,
    date: formatNoteDate(),
  };
  store.notes = [note, ...store.notes];
  store.nextId = store.nextId + 1;
  writeStore(store);
  return note;
}

/** Update a note's title/content. Returns the updated Note, or null when not found. */
export function updateNote(noteId, title, content) {
  const store = readStore();
  const idx = store.notes.findIndex((n) => n.id === noteId);
  if (idx === -1) return null;
  store.notes[idx] = { ...store.notes[idx], title, content };
  writeStore(store);
  return store.notes[idx];
}

/** Delete a note. Returns true when something was removed. */
export function deleteNote(noteId) {
  const store = readStore();
  const next = store.notes.filter((n) => n.id !== noteId);
  if (next.length === store.notes.length) return false;
  store.notes = next;
  writeStore(store);
  return true;
}

/**
 * Notes scoped to a single lesson within a course. Looks up by the stable
 * courseId + opaque lessonId; course-level notes (no lessonId) are excluded.
 *
 * @param {string|number} courseId
 * @param {string} lessonId
 * @returns {Note[]}
 */
export function getNotesForLesson(courseId, lessonId) {
  const numericId = Number(courseId);
  const lid = String(lessonId);
  return readStore().notes.filter(
    (n) => Number(n.courseId) === numericId && n.lessonId === lid
  );
}

/**
 * Create a per-lesson note. Returns the created Note. `lessonId`/`lessonTitle`
 * are optional so the same store backs both course- and lesson-level notes.
 *
 * @param {string|number} courseId
 * @param {string} courseName
 * @param {string} lessonId
 * @param {string} lessonTitle
 * @param {string} title
 * @param {string} content
 * @returns {Note}
 */
export function addLessonNote(courseId, courseName, lessonId, lessonTitle, title, content) {
  const store = readStore();
  const note = {
    id: store.nextId,
    courseId: Number(courseId),
    courseName,
    lessonId: String(lessonId),
    lessonTitle,
    title,
    content,
    date: formatNoteDate(),
  };
  store.notes = [note, ...store.notes];
  store.nextId = store.nextId + 1;
  writeStore(store);
  return note;
}

/**
 * Most recent N notes by date descending, shaped for dashboard summary cards:
 * { id, courseId, courseName, preview, date }. Presentation-only fields
 * (e.g. course thumbnails) are composed downstream by studentRepository.
 */
export function getRecentNotes(limit = 5) {
  const notes = readStore().notes.slice();
  notes.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  return notes.slice(0, limit).map((n) => ({
    id: n.id,
    courseId: n.courseId,
    courseName: n.courseName,
    preview: n.content.length > 90 ? `${n.content.slice(0, 90)}…` : n.content,
    date: n.date,
  }));
}
