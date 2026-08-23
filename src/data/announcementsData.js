/**
 * Mock course announcements for the student course overview.
 *
 * Keyed by catalog course id with a `default` fallback so every enrolled
 * course renders something even when no course-specific seed exists. Dates are
 * generated relative to "now" so the demo always shows a believable recency
 * mix. Replace this whole module with a real `GET /courses/:id/announcements`
 * response without touching the page or presentation components.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (d) => new Date(Date.now() - d * DAY_MS).toISOString();

const SEED = {
  3: [
    {
      id: "c3-a1",
      title: "New section: Nested Routes deep dive",
      body: "We just added a bonus walkthrough on nested layouts and pathless routes. Pick it up after you finish the core lesson.",
      date: daysAgo(1),
      author: "Richard James",
      pinned: true,
    },
    {
      id: "c3-a2",
      title: "Live Q&A this Thursday",
      body: "Bring your routing questions — we'll debug real project structures together at 4pm UTC.",
      date: daysAgo(4),
      author: "Richard James",
    },
    {
      id: "c3-a3",
      title: "Cheatsheet updated for v6",
      body: "The routing cheatsheet now covers the latest createBrowserRouter API. The resource is in the Resources tab.",
      date: daysAgo(9),
      author: "Course Team",
    },
  ],
  default: [
    {
      id: "default-a1",
      title: "Welcome to the course",
      body: "Work through the lessons in order and use the Resume button to pick up right where you left off.",
      date: daysAgo(2),
      author: "Course Team",
    },
    {
      id: "default-a2",
      title: "Need help? Start a discussion",
      body: "Stuck on a concept? Drop a note in the community and the teaching team will follow up.",
      date: daysAgo(6),
      author: "Course Team",
    },
  ],
};

/** Returns announcements for a course, newest first. */
export const getCourseAnnouncements = (courseId) =>
  [...(SEED[courseId] ?? SEED.default)].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
