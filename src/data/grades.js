/**
 * Learner grades & performance. Distinct from enrollment records; these
 * describe assessed scores, not lesson completion.
 *
 * @typedef {Object} CategoryScore
 * @property {string} category
 * @property {number} score 0–100.
 *
 * @typedef {Object} ScorePoint
 * @property {string} month
 * @property {number} score 0–100.
 *
 * @typedef {Object} CourseGrade
 * @property {string} course Catalog course title.
 * @property {number} score 0–100.
 * @property {string} grade Letter grade ("A", "B+", "-").
 * @property {"Completed"|"In Progress"|"Not Started"} status
 */

/** @type {CategoryScore[]} */
export const performanceByCategory = [
  { category: "Web Dev", score: 88 },
  { category: "AI & ML", score: 75 },
  { category: "Design", score: 82 },
  { category: "Data Science", score: 70 },
  { category: "Mobile", score: 65 },
  { category: "Business", score: 0 },
];

/** @type {ScorePoint[]} */
export const scoreTrend = [
  { month: "Jul", score: 68 },
  { month: "Aug", score: 72 },
  { month: "Sep", score: 76 },
  { month: "Oct", score: 74 },
  { month: "Nov", score: 82 },
  { month: "Dec", score: 85 },
];

/** @type {CourseGrade[]} */
export const courseScores = [
  { course: "Build Text to Image SaaS App in React JS", score: 92, grade: "A", status: "Completed" },
  { course: "Build AI BG Removal SaaS App in React JS", score: 88, grade: "A-", status: "Completed" },
  { course: "React Router Complete Course in One Video", score: 82, grade: "B+", status: "In Progress" },
  { course: "Python for Data Science & Machine Learning", score: 75, grade: "B", status: "In Progress" },
  { course: "UI/UX Design Masterclass 2024", score: 80, grade: "B+", status: "In Progress" },
  { course: "Digital Marketing Strategy & Analytics", score: 0, grade: "-", status: "Not Started" },
];
