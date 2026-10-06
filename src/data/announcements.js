/**
 * Mock course announcements for the student course overview.
 *
 * Keyed by catalog course id with a `default` fallback so every enrolled
 * course renders something even when no specific course record exists. Dates
 * are fixed ISO timestamps so the feed is stable across reloads (unlike
 * module-load-relative timestamps which regenerated on every refresh).
 * Consumed only via studentRepository.getCourseAnnouncementsFor.
 *
 * @typedef {Object} Announcement
 * @property {string} id Stable id ("c3-a1").
 * @property {string} title
 * @property {string} body
 * @property {string} date ISO timestamp.
 * @property {string} author
 * @property {boolean} [pinned]
 */

/** @type {Object<string, Announcement[]>} */
export const announcements = {
  3: [
    {
      id: "c3-a1",
      title: "New section: Nested Routes deep dive",
      body: "We just added a bonus walkthrough on nested layouts and pathless routes. Pick it up after you finish the core lesson.",
      date: "2026-09-03T12:00:00.000Z",
      author: "Richard James",
      pinned: true,
    },
    {
      id: "c3-a2",
      title: "Live Q&A this Thursday",
      body: "Bring your routing questions — we'll debug real project structures together at 4pm UTC.",
      date: "2026-08-31T12:00:00.000Z",
      author: "Richard James",
    },
    {
      id: "c3-a3",
      title: "Cheatsheet updated for v6",
      body: "The routing cheatsheet now covers the latest createBrowserRouter API. The resource is in the Resources tab.",
      date: "2026-08-26T12:00:00.000Z",
      author: "Course Team",
    },
  ],
  default: [
    {
      id: "default-a1",
      title: "Welcome to the course",
      body: "Work through the lessons in order and use the Resume button to pick up right where you left off.",
      date: "2026-09-02T12:00:00.000Z",
      author: "Course Team",
    },
    {
      id: "default-a2",
      title: "Need help? Start a discussion",
      body: "Stuck on a concept? Drop a note in the community and the teaching team will follow up.",
      date: "2026-08-29T12:00:00.000Z",
      author: "Course Team",
    },
  ],
};
