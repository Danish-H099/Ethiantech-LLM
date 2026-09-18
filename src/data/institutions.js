/**
 * Canonical institution/provider profiles backing courses.
 * Courses reference these by id via `institutionId` in `courses.js`.
 *
 * Institutions are fictional, so real logos cannot be used. Marks come from
 * the DiceBear API ("shapes" style — abstract professional marks, no initials),
 * seeded per institution for stable, distinct identities. See
 * DECISIONS.md → Architecture & data → Placeholder assets.
 *
 * @typedef {Object} Institution
 * @property {string} id Stable slug id referenced by courses.
 * @property {string} name Institution or provider name.
 * @property {string} logo Logo image URL.
 * @property {string} tagline Short marketing line.
 * @property {string} about Longer description shown on course pages.
 * @property {string} location Headquarter location.
 * @property {number} founded Year established.
 * @property {string} createdAt ISO timestamp.
 * @property {string} updatedAt ISO timestamp.
 */

export const institutions = [
  {
    id: "northbridge-university",
    name: "Northbridge University",
    logo: "https://api.dicebear.com/9.x/shapes/svg?seed=northbridge-university",
    tagline: "A research university advancing data-driven careers",
    about:
      "Northbridge University is a research-led institution preparing learners for data-driven careers in analytics, AI, and machine learning through rigorous, practice-based programs.",
    location: "Boston, Massachusetts",
    founded: 1964,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "cloudpath-academy",
    name: "CloudPath Academy",
    logo: "https://api.dicebear.com/9.x/shapes/svg?seed=cloudpath-academy",
    tagline: "Hands-on cloud, DevOps, and infrastructure training",
    about:
      "CloudPath Academy trains engineers in cloud architecture, DevOps, and platform engineering with hands-on labs, real infrastructure, and certification-aligned curricula.",
    location: "Toronto, Canada (remote-first)",
    founded: 2019,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

export const institutionById = Object.fromEntries(
  institutions.map((item) => [item.id, item])
);
