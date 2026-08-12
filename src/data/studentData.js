export const studentStats = [
  { label: "Enrolled Courses", value: "6", change: "+2 this month", up: true, iconName: "BookOpen" },
  { label: "Completed", value: "2", change: "33% rate", up: true, iconName: "CheckCircle" },
  { label: "Hours Learned", value: "47.5", change: "+5.2 this week", up: true, iconName: "Clock" },
  { label: "Notes Written", value: "24", change: "+8 this week", up: true, iconName: "StickyNote" },
];

export const learningActivity = [
  { week: "W1", hours: 3.5 },
  { week: "W2", hours: 5.2 },
  { week: "W3", hours: 4.1 },
  { week: "W4", hours: 6.8 },
  { week: "W5", hours: 3.9 },
  { week: "W6", hours: 5.5 },
  { week: "W7", hours: 7.2 },
  { week: "W8", hours: 4.6 },
  { week: "W9", hours: 6.1 },
  { week: "W10", hours: 5.8 },
  { week: "W11", hours: 7.5 },
  { week: "W12", hours: 4.3 },
];

export const completionStatus = [
  { name: "Completed", value: 2, color: "#10B981" },
  { name: "In Progress", value: 3, color: "#D62A91" },
  { name: "Not Started", value: 1, color: "#CBD6E4" },
];

export const enrolledCourses = [
  {
    id: 1,
    title: "Build Text to Image SaaS App in React JS",
    instructor: "Richard James",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop",
    progress: 100,
    status: "Completed",
    totalLessons: 25,
    completedLessons: 25,
  },
  {
    id: 2,
    title: "Build AI BG Removal SaaS App in React JS",
    instructor: "Richard James",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&auto=format&fit=crop",
    progress: 100,
    status: "Completed",
    totalLessons: 22,
    completedLessons: 22,
  },
  {
    id: 3,
    title: "React Router Complete Course in One Video",
    instructor: "Richard James",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400&auto=format&fit=crop",
    progress: 65,
    status: "In Progress",
    totalLessons: 18,
    completedLessons: 12,
  },
  {
    id: 4,
    title: "Python for Data Science & Machine Learning",
    instructor: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop",
    progress: 42,
    status: "In Progress",
    totalLessons: 30,
    completedLessons: 13,
  },
  {
    id: 5,
    title: "UI/UX Design Masterclass 2024",
    instructor: "Emily Parker",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=400&auto=format&fit=crop",
    progress: 28,
    status: "In Progress",
    totalLessons: 20,
    completedLessons: 6,
  },
  {
    id: 6,
    title: "Digital Marketing Strategy & Analytics",
    instructor: "Michael Torres",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=400&auto=format&fit=crop",
    progress: 0,
    status: "Not Started",
    totalLessons: 16,
    completedLessons: 0,
  },
];

export const wishlistedCourses = [
  {
    id: 7,
    title: "Advanced Node.js & Express APIs",
    instructor: "David Kim",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=400&auto=format&fit=crop",
    price: "$15.99",
    rating: 4.6,
  },
  {
    id: 8,
    title: "Flutter Mobile App Development",
    instructor: "Anna Kowalski",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=400&auto=format&fit=crop",
    price: "$11.99",
    rating: 4.4,
  },
  {
    id: 9,
    title: "AWS Cloud Architecture & DevOps",
    instructor: "James Wilson",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=400&auto=format&fit=crop",
    price: "$19.99",
    rating: 4.9,
  },
];

export const courseNotes = [
  { id: 1, courseId: 1, courseName: "Build Text to Image SaaS App in React JS", title: "API Key Setup", content: "Remember to use environment variables for the API key. Never hardcode secrets in the frontend.", date: "Dec 10, 2024" },
  { id: 2, courseId: 1, courseName: "Build Text to Image SaaS App in React JS", title: "Component Structure", content: "Follow the container/presentational pattern. Keep UI components pure and lift state up.", date: "Dec 12, 2024" },
  { id: 3, courseId: 1, courseName: "Build Text to Image SaaS App in React JS", title: "Deployment Checklist", content: "1. Build production bundle. 2. Set env vars on hosting. 3. Configure CORS. 4. Test all endpoints.", date: "Dec 15, 2024" },
  { id: 4, courseId: 3, courseName: "React Router Complete Course in One Video", title: "Nested Routes", content: "Use Outlet for nested routing. Always define a parent route with element containing Outlet.", date: "Dec 18, 2024" },
  { id: 5, courseId: 3, courseName: "React Router Complete Course in One Video", title: "Dynamic Routes", content: "Use useParams hook to access route parameters. Remember to type-cast if using TypeScript.", date: "Dec 20, 2024" },
  { id: 6, courseId: 4, courseName: "Python for Data Science & Machine Learning", title: "Pandas Quick Reference", content: "df.describe() for summary stats. df.groupby() for aggregation. Use .loc[] for label-based indexing.", date: "Dec 22, 2024" },
  { id: 7, courseId: 4, courseName: "Python for Data Science & Machine Learning", title: "Model Evaluation", content: "Always split data into train/test sets. Use cross-validation for small datasets. Track accuracy, precision, recall.", date: "Dec 24, 2024" },
  { id: 8, courseId: 5, courseName: "UI/UX Design Masterclass 2024", title: "Color Theory Notes", content: "Use 60-30-10 rule: 60% dominant, 30% secondary, 10% accent. Brand pink #D62A91 as accent.", date: "Dec 26, 2024" },
];

export const performanceByCategory = [
  { category: "Web Dev", score: 88 },
  { category: "AI & ML", score: 75 },
  { category: "Design", score: 82 },
  { category: "Data Science", score: 70 },
  { category: "Mobile", score: 65 },
  { category: "Business", score: 0 },
];

export const scoreTrend = [
  { month: "Jul", score: 68 },
  { month: "Aug", score: 72 },
  { month: "Sep", score: 76 },
  { month: "Oct", score: 74 },
  { month: "Nov", score: 82 },
  { month: "Dec", score: 85 },
];

export const courseScores = [
  { course: "Build Text to Image SaaS App in React JS", score: 92, grade: "A", status: "Completed" },
  { course: "Build AI BG Removal SaaS App in React JS", score: 88, grade: "A-", status: "Completed" },
  { course: "React Router Complete Course in One Video", score: 82, grade: "B+", status: "In Progress" },
  { course: "Python for Data Science & Machine Learning", score: 75, grade: "B", status: "In Progress" },
  { course: "UI/UX Design Masterclass 2024", score: 80, grade: "B+", status: "In Progress" },
  { course: "Digital Marketing Strategy & Analytics", score: 0, grade: "-", status: "Not Started" },
];

export const recentNotes = [
  { id: 8, courseName: "UI/UX Design Masterclass 2024", preview: "Use 60-30-10 rule: 60% dominant, 30% secondary, 10% accent...", date: "Dec 26, 2024" },
  { id: 7, courseName: "Python for Data Science & Machine Learning", preview: "Always split data into train/test sets. Use cross-validation...", date: "Dec 24, 2024" },
  { id: 6, courseName: "Python for Data Science & Machine Learning", preview: "df.describe() for summary stats. df.groupby() for aggregation...", date: "Dec 22, 2024" },
  { id: 5, courseName: "React Router Complete Course in One Video", preview: "Use useParams hook to access route parameters...", date: "Dec 20, 2024" },
  { id: 4, courseName: "React Router Complete Course in One Video", preview: "Use Outlet for nested routing. Always define a parent route...", date: "Dec 18, 2024" },
];

/**
 * Roster of students enrolled across courses. Consumed by tutor-facing
 * pages (dashboard "Recent Enrollments" and the full "Students Enrolled"
 * table). Distinct from the current learner's personal data above.
 *
 * @typedef {Object} EnrolledStudent
 * @property {number} id
 * @property {string} name
 * @property {string} course Course title enrolled in.
 * @property {string} date Enrollment date label.
 */

export const studentRoster = [
  { id: 1, name: "Richard Sanford", course: "React Router Complete Course in One Video", date: "22 Aug, 2024" },
  { id: 2, name: "Alison Powell", course: "Build AI BG Removal SaaS App in React JS", date: "22 Aug, 2024" },
  { id: 3, name: "Alison Powell", course: "React Router Complete Course in One Video", date: "25 Sep, 2024" },
  { id: 4, name: "Richard Sanford", course: "Build Full Stack E-Commerce App in React JS", date: "15 Oct, 2024" },
  { id: 5, name: "Enrique Murphy", course: "Build AI BG Removal SaaS App in React JS", date: "22 Aug, 2024" },
  { id: 6, name: "Richard Sanford", course: "Build Text to Image SaaS App in React JS", date: "25 Sep, 2024" },
];
