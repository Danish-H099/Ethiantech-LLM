import { notes } from "src/data/notes";

const STORAGE_KEY = "ethiantech-student-notes";

let memoryStore = null;

function seedStore() {
  const seed = notes.map((n) => ({ ...n }));
  const nextId = seed.reduce((max, n) => Math.max(max, Number(n.id) || 0), 0) + 1;
  return { notes: seed, nextId };
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
    return;
  }
}

function formatNoteDate() {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getAllNotes() {
  return readStore().notes.slice();
}

export function getNotesForCourse(courseId) {
  const numericId = Number(courseId);
  return readStore().notes.filter((n) => Number(n.courseId) === numericId);
}

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

export function updateNote(noteId, title, content) {
  const store = readStore();
  const idx = store.notes.findIndex((n) => n.id === noteId);
  if (idx === -1) return null;
  store.notes[idx] = { ...store.notes[idx], title, content };
  writeStore(store);
  return store.notes[idx];
}

export function deleteNote(noteId) {
  const store = readStore();
  const next = store.notes.filter((n) => n.id !== noteId);
  if (next.length === store.notes.length) return false;
  store.notes = next;
  writeStore(store);
  return true;
}

export function getNotesForLesson(courseId, lessonId) {
  const numericId = Number(courseId);
  const lid = String(lessonId);
  return readStore().notes.filter(
    (n) => Number(n.courseId) === numericId && n.lessonId === lid
  );
}

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
