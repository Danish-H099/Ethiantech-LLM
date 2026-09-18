/**
 * Tutor-domain roster — learners enrolled across the tutor's courses.
 * Consumed by tutor-facing pages (dashboard "Recent Enrollments" and the
 * full "Students Enrolled" table).
 *
 * Each row references a `studentId` (identity) and a `courseId` (FK →
 * courses.id). The `name` and `course` fields are display snapshots derived
 * from the linked records; `enrolledAt` is an ISO timestamp. Students are
 * deduplicated by `studentId` — the same learner may appear across courses.
 *
 * @typedef {Object} EnrolledStudent
 * @property {number} id Row id (unique).
 * @property {string} studentId Stable student identity.
 * @property {string} name Student display name.
 * @property {number} courseId FK → courses.id.
 * @property {string} course Catalog course title (snapshot).
 * @property {string} enrolledAt ISO timestamp.
 * @property {string} date Display enrollment date label.
 */

/** @type {EnrolledStudent[]} */
export const studentRoster = [
  { id: 1, studentId: "s-richard", name: "Richard Sanford", courseId: 3, course: "React Router Complete Course in One Video", enrolledAt: "2024-08-22T00:00:00.000Z", date: "22 Aug, 2024" },
  { id: 2, studentId: "s-alison", name: "Alison Powell", courseId: 2, course: "Build AI BG Removal SaaS App in React JS", enrolledAt: "2024-08-22T00:00:00.000Z", date: "22 Aug, 2024" },
  { id: 3, studentId: "s-alison", name: "Alison Powell", courseId: 3, course: "React Router Complete Course in One Video", enrolledAt: "2024-09-25T00:00:00.000Z", date: "25 Sep, 2024" },
  { id: 4, studentId: "s-richard", name: "Richard Sanford", courseId: 4, course: "Build Full Stack E-Commerce App in React JS", enrolledAt: "2024-10-15T00:00:00.000Z", date: "15 Oct, 2024" },
  { id: 5, studentId: "s-enrique", name: "Enrique Murphy", courseId: 2, course: "Build AI BG Removal SaaS App in React JS", enrolledAt: "2024-08-22T00:00:00.000Z", date: "22 Aug, 2024" },
  { id: 6, studentId: "s-richard", name: "Richard Sanford", courseId: 1, course: "Build Text to Image SaaS App in React JS", enrolledAt: "2024-09-25T00:00:00.000Z", date: "25 Sep, 2024" },
];
