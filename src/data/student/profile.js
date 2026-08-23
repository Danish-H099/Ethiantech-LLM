// Student profile — the learner's identity for personalized dashboard/UI.
//
// Prototype-only mock identity. A future backend replaces this with the real
// authenticated user. Keep every student-identity field here so pages stay
// presentation-only and there is a single source of truth for "who is this".
//
// Avatar uses a production-quality placeholder photo from randomuser.me's
// portrait CDN (readymade internet resource — no hand-made local assets).
// See DECISIONS.md → Architecture & data → Placeholder assets.

export const studentProfile = {
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
};

/** Read the current learner's profile. Single read path for all UI. */
export function getStudentProfile() {
  return studentProfile;
}
