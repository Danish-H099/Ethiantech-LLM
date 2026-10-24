// Single source of truth for mock auth state
const AUTH_KEY = 'ethiantech_student_auth';
const TUTOR_AUTH_KEY = 'ethiantech_tutor_auth';
// Instructor account object written by the login / Google OAuth flows —
// embeds the JWT, so it must not outlive the session.
const TUTOR_ACCOUNT_KEY = 'tutor';
// Pending post-login redirect target (set by WishlistHeartButton).
const RETURN_TO_KEY = 'ethiantech_login_return_to';

export function isStudentAuthed() {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

export function setStudentAuthed() {
  sessionStorage.setItem(AUTH_KEY, '1');
}

// Instructor session flag. The application itself (tier, documents, review
// status) lives in src/services/stores/tutorOnboarding.js — this only records
// that the visitor signed up through the instructor arm of the signup popup.
export function isTutorAuthed() {
  return sessionStorage.getItem(TUTOR_AUTH_KEY) === '1';
}

export function setTutorAuthed() {
  sessionStorage.setItem(TUTOR_AUTH_KEY, '1');
}

// Complete client-side logout: both session flags, the stored instructor
// account object (it embeds the JWT), and any pending post-login redirect.
//
// Account *content* is deliberately left in place — the tutor onboarding
// application (src/services/stores/tutorOnboarding.js) and the student
// profile/stores are persisted records, not session state, and this app has
// no server copy to restore them from.
export function clearMockAuth() {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(TUTOR_AUTH_KEY);
  localStorage.removeItem(TUTOR_ACCOUNT_KEY);
  sessionStorage.removeItem(RETURN_TO_KEY);
}
