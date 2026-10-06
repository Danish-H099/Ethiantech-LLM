/**
 * Learning activity event store (append-only log).
 *
 * Persisted to localStorage under `ethiantech-student-activity`. This is the
 * single source of truth for every learner interaction that feeds analytics —
 * heatmap, streak, weekly study time, and pace. Each event is an immutable row
 * with a timestamp; consumers aggregate on read.
 *
 * Events are recorded by the service layer (see studentRepository) whenever a
 * learner accesses, completes, or submits a lesson. Seed hydration backfills
 * realistic history on first run (see src/data/studentEngagement.js).
 *
 * @typedef {"access"|"completion"|"submission"|"quiz"} ActivityEventType
 *
 * @typedef {Object} ActivityEvent
 * @property {number} id
 * @property {string} userId Owning user id.
 * @property {number} courseId Catalog course id.
 * @property {string} lessonId Full lesson id ("3-s2-l0").
 * @property {ActivityEventType} eventType
 * @property {string} timestamp ISO timestamp of the event.
 * @property {number} estimatedHours Hours contributed to study-time analytics.
 */

const STORAGE_KEY = "ethiantech-student-activity";

let memoryStore = null;

function seedStore() {
  return { events: [], nextId: 1 };
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
    !Array.isArray(parsed.events)
  ) {
    parsed = seedStore();
  }
  if (typeof parsed.nextId !== "number") {
    let max = 0;
    parsed.events.forEach((e) => {
      if (Number(e.id) > max) max = Number(e.id);
    });
    parsed.nextId = max + 1;
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

export function recordEvent(event) {
  const store = readStore();
  const nextId = store.nextId;
  const record = {
    id: nextId,
    userId: event.userId || null,
    courseId: Number(event.courseId) || null,
    lessonId: event.lessonId || null,
    eventType: event.eventType,
    timestamp: event.timestamp || new Date().toISOString(),
    estimatedHours: Number(event.estimatedHours) || 0,
  };
  store.events.push(record);
  store.nextId = nextId + 1;
  writeStore(store);
  return record;
}

export function recordEvents(events) {
  const created = [];
  events.forEach((event) => created.push(recordEvent(event)));
  return created;
}

export function getActivityEvents() {
  const store = readStore();
  return store.events.slice();
}

export function getActivityEventsForUser(userId) {
  const store = readStore();
  return store.events.filter((e) => e.userId === userId);
}

export function getActivityEventsForCourse(courseId) {
  const numericId = Number(courseId);
  const store = readStore();
  return store.events.filter((e) => e.courseId === numericId);
}

export function clearActivityEvents() {
  writeStore(seedStore());
}

export function countActivityEvents() {
  return readStore().events.length;
}
