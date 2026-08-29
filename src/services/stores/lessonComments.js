const STORAGE_KEY = "ethiantech-student-comments";

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

    parsed = null;
  }

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
    return;
  }
}

function formatCommentDate() {
  return new Date().toISOString();
}

export function getCommentsForLesson(courseId, lessonId) {
  const numericId = Number(courseId);
  const lid = String(lessonId);
  return readStore()
    .comments.filter((c) => Number(c.courseId) === numericId && c.lessonId === lid)
    .slice()
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
}

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
