import { TUTOR_STATUS } from "src/services/stores/tutorOnboarding";

/**
 * Admin review decisions for seeded instructor applications.
 *
 * The live application for this browser's tutor session is decided directly in
 * tutorOnboarding.js (its status IS the decision). Seeded queue entries in
 * src/services/adminData.js have no status field of their own, so their
 * decisions are recorded here — keyed by seed id — to survive reloads.
 *
 * @typedef {"approved"|"rejected"} ApplicationDecisionStatus
 * @typedef {Object} ApplicationDecision
 * @property {ApplicationDecisionStatus} status
 * @property {string} reviewNote Applicant-facing reason, when rejected.
 * @property {string} reviewedAt ISO timestamp of the decision.
 */

const STORAGE_KEY = "ethiantech-application-decisions";

const VALID_STATUSES = [TUTOR_STATUS.APPROVED, TUTOR_STATUS.REJECTED];

let memoryStore = null;

function defaultState() {
  return { decisions: {} };
}

function normalize(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const decisions = {};
  if (parsed.decisions && typeof parsed.decisions === "object" && !Array.isArray(parsed.decisions)) {
    for (const [id, entry] of Object.entries(parsed.decisions)) {
      if (
        entry &&
        typeof entry === "object" &&
        VALID_STATUSES.includes(entry.status)
      ) {
        decisions[id] = {
          status: entry.status,
          reviewNote: typeof entry.reviewNote === "string" ? entry.reviewNote : "",
          reviewedAt: typeof entry.reviewedAt === "string" ? entry.reviewedAt : null,
        };
      }
    }
  }
  return { decisions };
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
  memoryStore = normalize(parsed) || defaultState();
  return memoryStore;
}

function writeStore(store) {
  memoryStore = store;
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }
  } catch {
    // Storage unavailable — in-memory copy serves this visit.
  }
}

/** Decision recorded for a seeded application id, or null if undecided. */
export function getApplicationDecision(id) {
  const entry = readStore().decisions[String(id)];
  return entry ? { ...entry } : null;
}

/** Record (or overwrite) the admin decision for a seeded application id. */
export function recordApplicationDecision(id, status, reviewNote = "") {
  if (!VALID_STATUSES.includes(status)) return null;
  const store = readStore();
  const decision = {
    status,
    reviewNote: typeof reviewNote === "string" ? reviewNote.trim() : "",
    reviewedAt: new Date().toISOString(),
  };
  store.decisions[String(id)] = decision;
  writeStore(store);
  return { ...decision };
}
