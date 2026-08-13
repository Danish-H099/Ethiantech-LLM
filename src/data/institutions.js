/**
 * Canonical institution/provider profiles backing courses.
 * Courses reference these by id via `institutionId` in `courses.js`.
 *
 * @typedef {Object} Institution
 * @property {string} id Stable slug id referenced by courses.
 * @property {string} name Institution or provider name.
 * @property {string} logo Logo image URL.
 * @property {string} tagline Short marketing line.
 * @property {string} about Longer description shown on course pages.
 * @property {string} location Headquarter location.
 * @property {string} founded Year established.
 */

export const institutions = [
  {
    id: "northbridge-university",
    name: "Northbridge University",
    logo: "https://ui-avatars.com/api/?name=Northbridge+University&background=D62A91&color=FFFFFF&size=96&format=png&bold=true",
    tagline: "A research university advancing data-driven careers",
    about:
      "Northbridge University is a research-led institution preparing learners for data-driven careers in analytics, AI, and machine learning through rigorous, practice-based programs.",
    location: "Boston, Massachusetts",
    founded: "1964",
  },
  {
    id: "cloudpath-academy",
    name: "CloudPath Academy",
    logo: "https://ui-avatars.com/api/?name=CloudPath+Academy&background=5F6FFF&color=FFFFFF&size=96&format=png&bold=true",
    tagline: "Hands-on cloud, DevOps, and infrastructure training",
    about:
      "CloudPath Academy trains engineers in cloud architecture, DevOps, and platform engineering with hands-on labs, real infrastructure, and certification-aligned curricula.",
    location: "Toronto, Canada (remote-first)",
    founded: "2019",
  },
];

export const institutionById = Object.fromEntries(
  institutions.map((item) => [item.id, item])
);
