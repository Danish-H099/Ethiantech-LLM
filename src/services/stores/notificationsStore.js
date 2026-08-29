// Private persistence adapter for notification read state.
//
// UI never touches localStorage directly — every read/write goes through
// studentRepository, which composes this module. The store holds a Set of
// notification IDs that have been read, persisted as a JSON array.

const STORAGE_KEY = "ethiantech-notifications-read";

let memorySet = null;

function loadSet() {
  if (memorySet) return memorySet;
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const arr = raw ? JSON.parse(raw) : [];
    memorySet = new Set(Array.isArray(arr) ? arr : []);
  } catch {
    memorySet = new Set();
  }
  return memorySet;
}

function saveSet(set) {
  memorySet = set;
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    }
  } catch {
    // Quota exceeded or privacy mode — degrade to in-memory only.
  }
}

/** Check if a notification ID has been read. */
export function isNotificationRead(id) {
  return loadSet().has(String(id));
}

/** Mark a single notification as read. */
export function markNotificationRead(id) {
  const set = loadSet();
  if (!set.has(String(id))) {
    set.add(String(id));
    saveSet(set);
  }
}

/** Mark all provided IDs as read. */
export function markAllRead(ids) {
  const set = loadSet();
  let changed = false;
  ids.forEach((id) => {
    const key = String(id);
    if (!set.has(key)) {
      set.add(key);
      changed = true;
    }
  });
  if (changed) saveSet(set);
}

/** Count how many of the given IDs are unread. */
export function countUnread(ids) {
  const set = loadSet();
  return ids.filter((id) => !set.has(String(id))).length;
}

/** Get the full set of read IDs (for external consumers). */
export function getReadIds() {
  return [...loadSet()];
}
