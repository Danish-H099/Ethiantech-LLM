/**
 * Exercise & project task specs keyed by opaque lesson ID (e.g. "3-s2-l1").
 *
 * This is the prototype data source. UI components never import this file
 * directly — they obtain an ExerciseSpec through
 * studentRepository.getExerciseData(), so swapping this for a backend
 * (`GET /api/exercises/:lessonId`) is a repository-only change with no
 * presentation impact.
 *
 * @typedef {object} AttachmentSpec
 * @property {boolean} allow     Whether file upload is enabled for this lesson.
 * @property {number} max        Max number of attachments.
 * @property {number} maxSize    Per-file size cap in bytes.
 *
 * @typedef {object} ExerciseSpec
 * @property {string} title           Display title (mirrors curriculum).
 * @property {string} instructions    Task description / prompt (plain text, \\n preserved).
 * @property {string} deliverable     What the learner should submit (short guidance).
 * @property {"text"|"code"|"link"} [primaryInput="text"]  Primary input mode.
 *   - "text": long-form textarea
 *   - "code": code editor textarea with language hint
 *   - "link": URL input field (e.g. CodePen / GitHub link)
 * @property {string} [language]      For code input: e.g. "javascript", "html", "bash".
 * @property {AttachmentSpec} [attachments]  File attachment configuration.
 * @property {string[]} [hints]       Optional step-by-step hints shown collapsed.
 */

const exercises = {
  // Course 1 — Build Text-to-Image SaaS App in React JS
  "1-s1-l3": {
    title: "Initial Git Repository Setup",
    instructions:
      "Initialize a local Git repository in your project folder and make your\nfirst commit with the generated starter files.\n\n1. Run `git init` in your project root.\n2. Add a `.gitignore` file with `node_modules/` as the first entry.\n3. Stage all files and make an initial commit with a descriptive message.\n\nOnce complete, copy the commit hash from `git log` into your submission.",
    deliverable: "Submit the initial commit hash and a brief description of your folder structure.",
    primaryInput: "code",
    language: "bash",
    attachments: { allow: true, max: 2, maxSize: 524288 },
    hints: ["Run `git init` first.", "Use `git add .` before committing."],
  },

  "1-s3-l4": {
    title: "Testing & Error Handling",
    instructions:
      "Add a unit test for one component and implement an error boundary in\nyour app.\n\n1. Write a test that verifies a component renders correctly with mock data.\n2. Create an `ErrorBoundary` class component that catches render errors and\n   displays a fallback UI.\n3. Wrap your root app (or a major section) with the error boundary.\n\nSubmit your test file and error boundary implementation.",
    deliverable:
      "Paste the error boundary code and describe what your test covers.",
    primaryInput: "code",
    language: "javascript",
    attachments: { allow: true, max: 3, maxSize: 524288 },
    hints: [
      "Jest + React Testing Library is already configured in this project.",
      "Error boundaries use `static getDerivedStateFromError` and `componentDidCatch`.",
    ],
  },

  // Course 3 — React Router Complete Course
  "3-s2-l1": {
    title: "Build a Nested Layout Challenge",
    instructions:
      "Build a nested layout for the course dashboard. You'll create a parent\nroute with an `<Outlet />` and shared sidebar navigation.\n\n1. Create a `DashboardLayout` component with a persistent sidebar.\n2. Set up a nested route structure so child routes render inside the\n   `<Outlet />`.\n3. Ensure the sidebar navigation links use `<NavLink>` with active styling.\n\nSubmit your layout component code and the route configuration.",
    deliverable: "Paste your DashboardLayout component and route definitions.",
    primaryInput: "code",
    language: "jsx",
    attachments: { allow: false },
  },

  "3-s2-l2": {
    title: "Dynamic Routes Lab",
    instructions:
      "Implement a dynamic route that loads a course by its ID. You'll wire up\na route with a URL parameter and fetch data based on that param.\n\n1. Create a `/courses/:courseId` route.\n2. Read the `courseId` param with `useParams()`.\n3. Render a fallback while loading and handle the not-found case.\n\nSubmit your component code and a brief explanation of how the param is\nresolved.",
    deliverable: "Paste your dynamic route component code.",
    primaryInput: "code",
    language: "jsx",
    attachments: { allow: false },
  },

  "3-s2-l3": {
    title: "Protected Routes Challenge",
    instructions:
      "Create a `RequireAuth` wrapper component that guards routes behind\nauthentication. Your solution should redirect unauthenticated users to the\nlogin page while preserving the intended destination.\n\n1. Create a component that checks auth status.\n2. If unauthenticated, redirect to `/login` with the current path stored in\n   `location.state`.\n3. If authenticated, render the child `<Outlet />`.\n\nSubmit your `RequireAuth` component code.",
    deliverable: "Paste your RequireAuth component code.",
    primaryInput: "code",
    language: "jsx",
    attachments: { allow: false },
  },

  "3-s2-l5": {
    title: "Course Project: Mini Router App",
    instructions:
      "Build a mini-router application that demonstrates all the React Router\npatterns covered in this course. Your project should include:\n\n1. Public routes (home, about, contact).\n2. A protected dashboard route with nested child routes.\n3. A dynamic route for viewing an item by ID.\n4. A 404 fallback route.\n5. Navigation that uses both `<Link>` and programmatic `useNavigate`.\n6. At least one route loader (or client-side fetch) with a loading state.\n\nSubmit your implementation. You may paste code or share a link to a deployed\napp / GitHub repo. If sharing a link, describe the key patterns you used.\n\nRequirements:\n- Must compile and run without errors.\n- Must demonstrate all six routing patterns listed above.\n- Code should be readable and well-structured.",
    deliverable:
      "Share a link to your deployed app or GitHub repo, OR paste your route\n      configuration and key component code.",
    primaryInput: "text",
    attachments: { allow: true, max: 5, maxSize: 1048576 },
    hints: [
      "Start with the route configuration before building individual components.",
      "Use a layout route for the dashboard sidebar.",
      "Test all routes by navigating manually — don't rely on only one working.",
    ],
  },

  // Course 5 — Python for Data Science & Machine Learning
  "5-s0-l4": {
    title: "Python Fundamentals Exercises",
    instructions:
      "Complete the following Python exercises in a single `.py` file. Use\ntype hints where appropriate.\n\n1. Write a function `calculate_mean(numbers: list[float]) -> float` that\n   returns the arithmetic mean of a list of numbers.\n2. Write a function `filter_even(numbers: list[int]) -> list[int]` that\n   returns only the even numbers from the input.\n3. Write a function `merge_dictionaries(dicts: list[dict]) -> dict` that\n   merges a list of dictionaries into one.\n\nSubmit your completed file or paste the code below.",
    deliverable: "Paste or upload your completed Python exercises.",
    primaryInput: "code",
    language: "python",
    attachments: { allow: true, max: 2, maxSize: 524288 },
  },

  "5-s4-l2": {
    title: "Final Project — End-to-End Analysis",
    instructions:
      "Complete an end-to-end data science analysis on a dataset of your choice.\nYour analysis should include:\n\n1. Data loading and cleaning (handle missing values, outliers, duplicates).\n2. Exploratory data analysis with at least 2 visualizations.\n3. A simple machine learning model (classification or regression).\n4. A written summary of your findings (2-3 paragraphs).\n\nYou may use a Jupyter notebook, a `.py` script, or a Markdown/RMarkdown file.\nSubmit your analysis file and a brief written summary.",
    deliverable:
      "Upload your analysis file and write a short summary of your findings.",
    primaryInput: "text",
    attachments: { allow: true, max: 3, maxSize: 2097152 },
    hints: [
      "The California Housing dataset is a good option if you need suggestions.",
      "A simple linear regression or logistic regression is sufficient.",
    ],
  },

  // Course 6 — UI/UX Design Masterclass
  "6-s0-l3": {
    title: "Design Critique Exercise",
    instructions:
      "Critique the attached mobile app screen using the Gestalt principles\nand heuristic evaluation framework.\n\nReview the screen for:\n1. Visual hierarchy issues (contrast, sizing, spacing).\n2. Usability problems (ambiguous icons, unclear affordances).\n3. Gestalt principle violations (proximity, alignment, continuity).\n4. Any accessibility concerns.\n\nWrite a structured critique: summarize the app's purpose, then list 3-5\nspecific issues with suggested improvements for each.",
    deliverable:
      "Write your design critique below (3-5 issues with suggestions).",
    primaryInput: "text",
    attachments: { allow: true, max: 1, maxSize: 2097152 },
    hints: [
      "Upload a screenshot of the screen you're critiquing if you have one.",
      "Use the 'Issues / Suggestions' format for clarity.",
    ],
  },

  "6-s4-l2": {
    title: "Final Case Study Project",
    instructions:
      "Complete a comprehensive UI/UX case study for a redesign of an\nexisting product or service.\n\nYour case study should include:\n1. Problem statement and goals.\n2. User research (personas, user journeys) — real or synthesized.\n3. Competitive analysis (2-3 comparable products).\n4. Ideation and sketching (wireframes or rough concepts).\n5. Prototyping (interactive or static mockups).\n6. Testing and validation approach.\n7. Reflection on what you'd iterate next.\n\nSubmit your case study as a Figma link, Miro board, PDF, or written document.\nInclude visual artifacts where possible.",
    deliverable:
      "Submit your case study — a link is preferred, but file upload is also\n      accepted.",
    primaryInput: "link",
    attachments: { allow: true, max: 5, maxSize: 5242880 },
    hints: [
      "Figma's built-in prototype mode is a great way to add interactivity.",
      "Even 3-4 quick wireframe screens are enough for the ideation section.",
      "A portfolio-ready case study tells a clear story — prioritize narrative.",
    ],
  },
};

export default exercises;
