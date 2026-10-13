// Single source of truth for mock auth state
const AUTH_KEY = 'ethiantech_student_auth';
const TUTOR_AUTH_KEY = 'ethiantech_tutor_auth';

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

export function clearMockAuth() {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(TUTOR_AUTH_KEY);
}
