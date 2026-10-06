/**
 * Canonical student (learner) profiles.
 *
 * Each row is a single learner identity referenced by all other student
 * tables via `studentId`. Preferences are denormalized here (1:1) for
 * quick reads without a join.
 *
 * @typedef {Object} SocialLinks
 * @property {string} linkedin
 * @property {string} github
 * @property {string} website
 *
 * @typedef {Object} EmailNotifications
 * @property {boolean} announcements
 * @property {boolean} deadlines
 * @property {boolean} completions
 *
 * @typedef {Object} StudentPreferences
 * @property {number} fontSize - Percentage (60-200).
 * @property {"auto"|"reduced"|"standard"} reducedMotion
 * @property {EmailNotifications} emailNotifications
 *
 * @typedef {Object} Student
 * @property {string} id Stable slug id (e.g. "u-alex").
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} fullName Computed: `${firstName} ${lastName}`.
 * @property {string} email
 * @property {string} avatar Image URL.
 * @property {"Learner"|"Admin"|"Tutor"} role
 * @property {string} joinedAt ISO timestamp.
 * @property {string} timezone IANA timezone.
 * @property {string} goal Free-text learning goal.
 * @property {string} bio Free-text learner biography.
 * @property {SocialLinks} socialLinks
 * @property {StudentPreferences} preferences
 * @property {string} createdAt ISO timestamp.
 * @property {string} updatedAt ISO timestamp.
 */

/** @type {Student[]} */
export const students = [
  {
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
    bio: "Full-stack web development student passionate about React and backend systems. I enjoy building clean, accessible interfaces and contributing to open-source projects in my spare time.",
    socialLinks: { linkedin: "", github: "", website: "" },
    preferences: {
      fontSize: 100,
      reducedMotion: "auto",
      emailNotifications: {
        announcements: true,
        deadlines: true,
        completions: true,
      },
    },
    createdAt: "2024-08-15T00:00:00.000Z",
    updatedAt: "2024-08-15T00:00:00.000Z",
  },
];

/** Index by student id for O(1) lookup. */
export const studentById = Object.fromEntries(students.map((s) => [s.id, s]));

/** Default student id for single-user demo mode. */
export const DEFAULT_STUDENT_ID = students[0]?.id ?? "u-alex";
