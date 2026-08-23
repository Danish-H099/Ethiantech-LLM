/**
 * Mock downloadable resources for the student course overview.
 *
 * The prototype intentionally does NOT serve real files. `available: false` is
 * the honest signal the UI renders as a "unavailable in prototype" notice; the
 * `items` list shows what a production build would expose so the tab conveys
 * intent without pretending to download. Swap this module for a real
 * `GET /courses/:id/resources` payload later — the shape is already UI-ready.
 */

const SEED = {
  3: [
    { id: "c3-r1", title: "React Router Slides", type: "PDF", size: "2.4 MB" },
    { id: "c3-r2", title: "Starter Project Repository", type: "ZIP", size: "18 MB" },
    { id: "c3-r3", title: "Routing Cheatsheet", type: "PDF", size: "0.8 MB" },
  ],
  default: [
    { id: "default-r1", title: "Lecture Slides", type: "PDF", size: "3.1 MB" },
    { id: "default-r2", title: "Source Code", type: "ZIP", size: "22 MB" },
    { id: "default-r3", title: "Course Cheatsheet", type: "PDF", size: "1.0 MB" },
  ],
};

/**
 * @returns {{ available: boolean, message: string, items: Array }}
 */
export const getCourseResources = (courseId) => ({
  available: false,
  message:
    "Downloadable resources aren't available in this prototype. They'll be enabled in a later build.",
  items: SEED[courseId] ?? SEED.default,
});
