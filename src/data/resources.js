/**
 * Mock downloadable resources for the student course overview.
 *
 * The prototype intentionally does NOT serve real files. `available: false`
 * is the honest signal the UI renders as a "unavailable in prototype" notice;
 * the `items` list shows what a production build would expose so the tab
 * conveys intent without pretending to download.
 *
 * @typedef {Object} ResourceItem
 * @property {string} id Stable id ("c3-r1").
 * @property {string} title
 * @property {string} type File type label ("PDF").
 * @property {string} size Display size ("2.4 MB").
 */

/** @type {Object<string, ResourceItem[]>} */
export const resources = {
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
