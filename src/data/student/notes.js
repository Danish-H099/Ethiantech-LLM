// Learner-authored notes. `courseId` / `courseName` reference the catalog id
// space (see src/data/courses). Distinct from enrollment and grades.

export const courseNotes = [
  { id: 1, courseId: 1, courseName: "Build Text to Image SaaS App in React JS", title: "API Key Setup", content: "Remember to use environment variables for the API key. Never hardcode secrets in the frontend.", date: "Dec 10, 2024" },
  { id: 2, courseId: 1, courseName: "Build Text to Image SaaS App in React JS", title: "Component Structure", content: "Follow the container/presentational pattern. Keep UI components pure and lift state up.", date: "Dec 12, 2024" },
  { id: 3, courseId: 1, courseName: "Build Text to Image SaaS App in React JS", title: "Deployment Checklist", content: "1. Build production bundle. 2. Set env vars on hosting. 3. Configure CORS. 4. Test all endpoints.", date: "Dec 15, 2024" },
  { id: 4, courseId: 3, courseName: "React Router Complete Course in One Video", title: "Nested Routes", content: "Use Outlet for nested routing. Always define a parent route with element containing Outlet.", date: "Dec 18, 2024" },
  { id: 5, courseId: 3, courseName: "React Router Complete Course in One Video", title: "Dynamic Routes", content: "Use useParams hook to access route parameters. Remember to type-cast if using TypeScript.", date: "Dec 20, 2024" },
  { id: 6, courseId: 5, courseName: "Python for Data Science & Machine Learning", title: "Pandas Quick Reference", content: "df.describe() for summary stats. df.groupby() for aggregation. Use .loc[] for label-based indexing.", date: "Dec 22, 2024" },
  { id: 7, courseId: 5, courseName: "Python for Data Science & Machine Learning", title: "Model Evaluation", content: "Always split data into train/test sets. Use cross-validation for small datasets. Track accuracy, precision, recall.", date: "Dec 24, 2024" },
  { id: 8, courseId: 6, courseName: "UI/UX Design Masterclass 2024", title: "Color Theory Notes", content: "Use 60-30-10 rule: 60% dominant, 30% secondary, 10% accent. Brand pink #D62A91 as accent.", date: "Dec 26, 2024" },
];
