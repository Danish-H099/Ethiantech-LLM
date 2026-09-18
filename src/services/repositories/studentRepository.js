import { students, studentById } from "src/data/students";

const STORAGE_KEY = "ethiantech-student-profile";

const DEFAULT_PROFILE = {
  id: "student-001",
  firstName: "Alex",
  lastName: "Chen",
  fullName: "Alex Chen",
  email: "alex.chen@example.edu",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  role: "Learner",
  joinedAt: new Date(Date.now() - 142 * 24 * 60 * 60 * 1000).toISOString(),
  timezone: "America/New_York",
  goal: "Complete the Full-Stack Web Development track by December",
  bio: "Full-stack web development student passionate about React and backend systems. I enjoy building clean, accessible interfaces and contributing to open-source projects in my spare time.",
  socialLinks: {
    linkedin: "",
    github: "",
    website: "",
  },
  preferences: {
    fontSize: 100,
    reducedMotion: "auto",
    emailNotifications: {
      announcements: true,
      deadlines: true,
      completions: true,
    },
  },
};

let memoryProfile = null;

function loadProfile() {
  if (memoryProfile) return memoryProfile;
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        memoryProfile = { ...DEFAULT_PROFILE, ...parsed };
        return memoryProfile;
      }
    }
  } catch {
    // Corrupt JSON — start clean.
  }
  memoryProfile = { ...DEFAULT_PROFILE };
  return memoryProfile;
}

function saveProfile(profile) {
  memoryProfile = profile;
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  } catch {
    // Quota exceeded or privacy mode — degrade to in-memory only.
  }
}

export function getProfile(studentId) {
  const profile = loadProfile();
  if (studentId && profile.id !== studentId) {
    const student = studentById[studentId];
    if (student) return { ...DEFAULT_PROFILE, ...student };
  }
  return profile;
}

export function updateProfile(studentId, updates) {
  const current = loadProfile();
  const next = { ...current, ...updates };
  if (updates.firstName || updates.lastName) {
    next.fullName = `${next.firstName} ${next.lastName}`.trim();
  }
  saveProfile(next);
  return next;
}

export function updatePreferences(studentId, prefs) {
  const current = loadProfile();
  const next = {
    ...current,
    preferences: { ...current.preferences, ...prefs },
  };
  saveProfile(next);
  return next;
}

export function resetPreferences() {
  const current = loadProfile();
  const next = {
    ...current,
    preferences: { ...DEFAULT_PROFILE.preferences },
  };
  saveProfile(next);
  return next;
}

export function getAllStudents() {
  return students;
}

export function getStudentById(studentId) {
  return studentById[studentId] || null;
}