import * as studentRepository from "src/services/repositories/studentRepository";

export function getProfile(studentId) {
  return studentRepository.getProfile(studentId);
}

export function updateProfile(studentId, updates) {
  return studentRepository.updateProfile(studentId, updates);
}

export function updatePreferences(studentId, prefs) {
  return studentRepository.updatePreferences(studentId, prefs);
}

export function resetPreferences(studentId) {
  return studentRepository.resetPreferences(studentId);
}

export function getAllStudents() {
  return studentRepository.getAllStudents();
}

export function getStudentById(studentId) {
  return studentRepository.getStudentById(studentId);
}