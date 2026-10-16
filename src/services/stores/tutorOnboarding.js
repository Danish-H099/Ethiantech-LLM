import { isTutorAuthed } from "src/utils/authMock";

/**
 * Instructor (tutor) onboarding application store.
 *
 * Single localStorage-backed record shared by the route guard, the tutor
 * layout sandbox banner, the onboarding wizard and (later) the admin review
 * queue. The "signed in as a tutor" session flag lives in src/utils/authMock.js.
 *
 * Status flow: not_started -> in_progress -> submitted -> approved | rejected.
 *
 * @typedef {"not_started"|"in_progress"|"submitted"|"approved"|"rejected"} TutorOnboardingStatus
 * @typedef {"standard"|"verified"|"institutional"} TutorTier
 * @typedef {Object} TutorOnboardingState
 * @property {TutorOnboardingStatus} status
 * @property {TutorTier|null} tier Selected teaching track.
 * @property {Object} profile Step 2 — photo, headline, bio, subjects, CV.
 * @property {Object} verification Step 3 — identity document, degrees, licenses, organization.
 * @property {boolean} declarationsAccepted Step 4 — declaration checkboxes accepted.
 * @property {string|null} submittedAt ISO timestamp of the latest submission.
 * @property {string|null} reviewedAt ISO timestamp of the admin decision.
 * @property {string} reviewNote Admin "request changes" note, if any.
 */

const STORAGE_KEY = "ethiantech-tutor-onboarding";

export const TUTOR_STATUS = Object.freeze({
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  REJECTED: "rejected",
});

export const TUTOR_TIERS = Object.freeze({
  STANDARD: "standard",
  VERIFIED: "verified",
  INSTITUTIONAL: "institutional",
});

const VALID_STATUSES = Object.values(TUTOR_STATUS);
const VALID_TIERS = Object.values(TUTOR_TIERS);

function defaultState() {
  return {
    status: TUTOR_STATUS.NOT_STARTED,
    tier: null,
    profile: {},
    verification: {},
    declarationsAccepted: false,
    submittedAt: null,
    reviewedAt: null,
    reviewNote: "",
  };
}

function normalize(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  return {
    ...defaultState(),
    ...parsed,
    status: VALID_STATUSES.includes(parsed.status)
      ? parsed.status
      : TUTOR_STATUS.NOT_STARTED,
    tier: VALID_TIERS.includes(parsed.tier) ? parsed.tier : null,
    profile:
      parsed.profile && typeof parsed.profile === "object" && !Array.isArray(parsed.profile)
        ? parsed.profile
        : {},
    verification:
      parsed.verification &&
      typeof parsed.verification === "object" &&
      !Array.isArray(parsed.verification)
        ? parsed.verification
        : {},
    declarationsAccepted: parsed.declarationsAccepted === true,
    reviewNote: typeof parsed.reviewNote === "string" ? parsed.reviewNote : "",
  };
}

let memoryStore = null;

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
    // Storage unavailable (private mode / quota) — the in-memory copy still
    // serves this visit, mirroring the other stores in src/services/stores/.
  }
}

/** Immutable snapshot of the current application record. */
export function getTutorOnboardingState() {
  return { ...readStore() };
}

/**
 * Merge a partial update (typically one wizard step) into the record.
 * Any edit moves a not_started or rejected application back to in_progress.
 */
export function saveTutorOnboardingStep(patch) {
  const store = readStore();
  Object.assign(store, patch);
  if (
    store.status === TUTOR_STATUS.NOT_STARTED ||
    store.status === TUTOR_STATUS.REJECTED
  ) {
    store.status = TUTOR_STATUS.IN_PROGRESS;
  }
  writeStore(store);
  return { ...store };
}

/** Mark the application as submitted and queue it for admin review. */
export function submitTutorOnboarding(payload = {}) {
  const store = readStore();
  Object.assign(store, payload);
  store.status = TUTOR_STATUS.SUBMITTED;
  store.submittedAt = new Date().toISOString();
  store.reviewedAt = null;
  store.reviewNote = "";
  writeStore(store);
  return { ...store };
}

/**
 * Admin decision: clear the application for full tutor access.
 * Only a submitted application can be decided on; anything else is a no-op.
 */
export function approveTutorOnboarding() {
  const store = readStore();
  if (store.status !== TUTOR_STATUS.SUBMITTED) return { ...store };
  store.status = TUTOR_STATUS.APPROVED;
  store.reviewedAt = new Date().toISOString();
  store.reviewNote = "";
  writeStore(store);
  return { ...store };
}

/**
 * Admin decision: send the application back with a note explaining what to
 * fix. Only a submitted application can be decided on. The note resurfaces on
 * the tutor's status hub (see TutorOnboardingStatusPage) until the applicant
 * edits the wizard again — saving a step clears it via submitTutorOnboarding.
 */
export function rejectTutorOnboarding(reviewNote = "") {
  const store = readStore();
  if (store.status !== TUTOR_STATUS.SUBMITTED) return { ...store };
  store.status = TUTOR_STATUS.REJECTED;
  store.reviewedAt = new Date().toISOString();
  store.reviewNote = typeof reviewNote === "string" ? reviewNote.trim() : "";
  writeStore(store);
  return { ...store };
}

/**
 * Where a "Teach on EthianTech" entry point should land for the current
 * visitor: the tutor area for signed-in instructors, or null when the visitor
 * still needs to sign up through the instructor arm of the signup popup.
 */
export function getTutorEntryPath() {
  if (!isTutorAuthed()) return null;
  const { status } = readStore();
  if (status === TUTOR_STATUS.APPROVED) return "/tutor/dashboard";
  if (status === TUTOR_STATUS.SUBMITTED) return "/tutor/onboarding/status";
  return "/tutor/onboarding";
}
