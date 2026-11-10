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

// Instructor session flag. The tutor account (localStorage "tutor") holds
// the instructor identity; profile state comes from the profile API.
export function isTutorAuthed() {
  return sessionStorage.getItem(TUTOR_AUTH_KEY) === '1';
}

export function setTutorAuthed() {
  sessionStorage.setItem(TUTOR_AUTH_KEY, '1');
}

// Complete client-side logout: session flags, the stored instructor
// account object, and any pending redirect.
export function clearMockAuth() {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(TUTOR_AUTH_KEY);
  localStorage.removeItem(TUTOR_ACCOUNT_KEY);
  sessionStorage.removeItem(RETURN_TO_KEY);
}
