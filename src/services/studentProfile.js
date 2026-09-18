import { students } from "src/data/students";

const STORAGE_KEY = "ethiantech-student-profile";

const FALLBACK_PROFILE = {
  id: "u-alex",
  firstName: "Alex",
  lastName: "Chen",
  fullName: "Alex Chen",
  email: "alex.chen@example.edu",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  role: "Learner",
  joinedAt: "2024-08-15T00:00:00.000Z",
  timezone: "America/New_York",
  goal: "Complete the Full-Stack Web Development track by December",
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

/** Canonical seed profile sourced from the students table. */
const DEFAULT_PROFILE = students[0] ? { ...students[0] } : FALLBACK_PROFILE;

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

/** Get the current student profile. */
export function getStudentProfile() {
  return loadProfile();
}

/**
 * Update student profile fields. Merges the provided updates into the
 * existing profile and persists the result.
 */
export function updateStudentProfile(updates) {
  const current = loadProfile();
  const next = { ...current, ...updates };
  saveProfile(next);
  return next;
}

/**
 * Update profile preferences. Merges into the preferences sub-object.
 */
export function updatePreferences(prefs) {
  const current = loadProfile();
  const next = {
    ...current,
    preferences: { ...current.preferences, ...prefs },
  };
  saveProfile(next);
  return next;
}

/**
 * Reset preferences to defaults.
 */
export function resetPreferences() {
  const current = loadProfile();
  const next = {
    ...current,
    preferences: { ...DEFAULT_PROFILE.preferences },
  };
  saveProfile(next);
  return next;
}
