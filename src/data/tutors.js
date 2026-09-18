/**
 * Canonical tutor/instructor profiles teaching courses.
 * Courses reference these by id via `tutorIds` in `courses.js`.
 *
 * @typedef {Object} Tutor
 * @property {string} id Stable slug id referenced by courses.
 * @property {string} name
 * @property {string} photo Avatar image URL.
 * @property {string} title Professional role/title.
 * @property {string} bio Short biography.
 * @property {number} rating Overall instructor rating (1–5).
 * @property {number} students Total learners taught.
 * @property {number} courses Number of published courses.
 * @property {string} createdAt ISO timestamp.
 * @property {string} updatedAt ISO timestamp.
 */

export const tutors = [
  {
    id: "richard-james", createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z",
    name: "Richard James",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    title: "Senior Full Stack Engineer",
    bio: "Richard has spent a decade shipping production React apps and now teaches engineers how to turn product ideas into profitable SaaS products.",
    rating: 4.5,
    students: 5880,
    courses: 5,
  },
  {
    id: "sarah-chen", createdAt: "2024-01-02T00:00:00.000Z", updatedAt: "2024-01-02T00:00:00.000Z",
    name: "Sarah Chen",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    title: "Data Scientist & ML Educator",
    bio: "Sarah leads analytics teams at a global fintech and has taught data science to over 30,000 learners across universities and bootcamps.",
    rating: 4.8,
    students: 3200,
    courses: 4,
  },
  {
    id: "emily-parker", createdAt: "2024-01-03T00:00:00.000Z", updatedAt: "2024-01-03T00:00:00.000Z",
    name: "Emily Parker",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    title: "Product Design Lead",
    bio: "Emily has led product design at consumer-tech companies and loves teaching the research and craft behind interfaces people actually enjoy.",
    rating: 4.7,
    students: 1890,
    courses: 1,
  },
  {
    id: "michael-torres", createdAt: "2024-01-04T00:00:00.000Z", updatedAt: "2024-01-04T00:00:00.000Z",
    name: "Michael Torres",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
    title: "Growth Marketing Consultant",
    bio: "Michael has scaled marketing programs for startups and agencies, specializing in data-driven campaigns and measurable growth.",
    rating: 4.3,
    students: 1450,
    courses: 1,
  },
  {
    id: "david-kim", createdAt: "2024-01-05T00:00:00.000Z", updatedAt: "2024-01-05T00:00:00.000Z",
    name: "David Kim",
    photo: "https://randomuser.me/api/portraits/men/52.jpg",
    title: "Backend Architect",
    bio: "David designs resilient backend systems for high-traffic products and has mentored engineering teams across three continents.",
    rating: 4.6,
    students: 1120,
    courses: 2,
  },
  {
    id: "anna-kowalski", createdAt: "2024-01-06T00:00:00.000Z", updatedAt: "2024-01-06T00:00:00.000Z",
    name: "Anna Kowalski",
    photo: "https://randomuser.me/api/portraits/women/79.jpg",
    title: "Mobile Engineer & Flutter Trainer",
    bio: "Anna ships Flutter apps for startups and enterprises, and has trained mobile teams in Europe and Southeast Asia.",
    rating: 4.4,
    students: 1750,
    courses: 1,
  },
  {
    id: "james-wilson", createdAt: "2024-01-07T00:00:00.000Z", updatedAt: "2024-01-07T00:00:00.000Z",
    name: "James Wilson",
    photo: "https://randomuser.me/api/portraits/men/41.jpg",
    title: "Cloud Solutions Architect",
    bio: "James designs and automates cloud infrastructure for enterprise clients and holds multiple AWS and Kubernetes certifications.",
    rating: 4.9,
    students: 890,
    courses: 2,
  },
  {
    id: "lisa-grant", createdAt: "2024-01-08T00:00:00.000Z", updatedAt: "2024-01-08T00:00:00.000Z",
    name: "Lisa Grant",
    photo: "https://randomuser.me/api/portraits/women/56.jpg",
    title: "Leadership Coach",
    bio: "Lisa coaches managers and emerging leaders at global companies, with a focus on clear communication and psychological safety.",
    rating: 4.2,
    students: 920,
    courses: 2,
  },
  {
    id: "alex-nguyen", createdAt: "2024-01-09T00:00:00.000Z", updatedAt: "2024-01-09T00:00:00.000Z",
    name: "Alex Nguyen",
    photo: "https://randomuser.me/api/portraits/men/64.jpg",
    title: "Blockchain Engineer",
    bio: "Alex builds and audits smart contracts for web3 protocols and enjoys demystifying blockchain for traditional developers.",
    rating: 4.7,
    students: 760,
    courses: 1,
  },
  {
    id: "priya-sharma", createdAt: "2024-01-10T00:00:00.000Z", updatedAt: "2024-01-10T00:00:00.000Z",
    name: "Priya Sharma",
    photo: "https://randomuser.me/api/portraits/women/33.jpg",
    title: "Frontend Mentor",
    bio: "Priya has taught web development to absolute beginners for six years and designs lessons that make the fundamentals click.",
    rating: 4.4,
    students: 5400,
    courses: 1,
  },
];

export const tutorById = Object.fromEntries(tutors.map((item) => [item.id, item]));
