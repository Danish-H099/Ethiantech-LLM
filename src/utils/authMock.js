// Single source of truth for mock auth state
const AUTH_KEY = 'ethiantech_student_auth';

export function isStudentAuthed() {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

export function setStudentAuthed() {
  sessionStorage.setItem(AUTH_KEY, '1');
}

export function clearMockAuth() {
  sessionStorage.removeItem(AUTH_KEY);
}
