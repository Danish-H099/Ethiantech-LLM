/**
 * Mock learner reviews. Each review references its course via `courseId`;
 * the course query layer (src/services/courses.js) filters this list the same
 * way a `/reviews?courseId=` query would.
 *
 * Avatars are production-quality placeholder portraits from randomuser.me
 * (readymade internet resource — see DECISIONS.md → Architecture & data →
 * Placeholder assets). Reviewers appearing more than once share one photo;
 * a missing avatar falls back to the standard placeholder asset
 * (`src/assets/avatar-placeholder.png`).
 *
 * @typedef {Object} CourseReview
 * @property {number} id
 * @property {number} courseId
 * @property {string} author
 * @property {string} avatar Portrait image URL.
 * @property {string} role Reviewer's professional context.
 * @property {number} rating 1–5.
 * @property {string} date Recency label.
 * @property {string} createdAt ISO timestamp.
 * @property {string} text
 */

/** @type {CourseReview[]} */
export const reviews = [
  { id: 1, courseId: 1, author: "Marcus Webber", avatar: "https://randomuser.me/api/portraits/men/1.jpg", role: "Freelance Developer", rating: 5, date: "Jul 2026", createdAt: "2026-07-01T12:00:00.000Z", text: "Built and shipped my own SaaS in under six weeks — the API integration section finally made async flows click." },
  { id: 2, courseId: 1, author: "Priya Nair", avatar: "https://randomuser.me/api/portraits/women/1.jpg", role: "Frontend Engineer", rating: 4, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "Great project-based pacing. I'd have liked a bit more on testing, but the deployment walkthrough is gold." },
  { id: 3, courseId: 1, author: "Daniel Osei", avatar: "https://randomuser.me/api/portraits/men/3.jpg", role: "Bootcamp Graduate", rating: 5, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "Went from React basics to a working product. The auth and usage-limit module alone is worth the price." },

  { id: 4, courseId: 2, author: "Sofia Marín", avatar: "https://randomuser.me/api/portraits/women/5.jpg", role: "Product Engineer", rating: 5, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "The webhook and queue setup is the clearest explanation I've found anywhere." },
  { id: 5, courseId: 2, author: "James Whitfield", avatar: "https://randomuser.me/api/portraits/men/4.jpg", role: "Indie Hacker", rating: 4, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "Strong on billing and scaling. Some provider-specific code to adapt, but the swap is well explained." },
  { id: 6, courseId: 2, author: "Amara Diallo", avatar: "https://randomuser.me/api/portraits/women/9.jpg", role: "Software Engineer", rating: 5, date: "Apr 2026", createdAt: "2026-04-01T12:00:00.000Z", text: "Shipped a background-removal MVP in a weekend. Super practical." },

  { id: 7, courseId: 3, author: "Leo Park", avatar: "https://randomuser.me/api/portraits/men/5.jpg", role: "CS Student", rating: 5, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "One video, zero fluff. Nested routes and lazy loading finally make sense." },
  { id: 8, courseId: 3, author: "Hana Yoshida", avatar: "https://randomuser.me/api/portraits/women/12.jpg", role: "Junior Developer", rating: 4, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "Fast-paced but complete. I paused a lot — worth it." },
  { id: 9, courseId: 3, author: "Tomás Herrera", avatar: "https://randomuser.me/api/portraits/men/7.jpg", role: "Frontend Developer", rating: 5, date: "Apr 2026", createdAt: "2026-04-01T12:00:00.000Z", text: "Best single-topic format on the platform." },

  { id: 10, courseId: 4, author: "Nadia Rahman", avatar: "https://randomuser.me/api/portraits/women/15.jpg", role: "Career Switcher", rating: 5, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "Built the whole storefront end to end. The cart and checkout flow is very clean." },
  { id: 11, courseId: 4, author: "Oliver Bennett", avatar: "https://randomuser.me/api/portraits/men/9.jpg", role: "Freelancer", rating: 4, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "Solid stack. The MongoDB schema design section was a highlight." },
  { id: 12, courseId: 4, author: "Yuki Tanaka", avatar: "https://randomuser.me/api/portraits/women/20.jpg", role: "Developer", rating: 5, date: "Mar 2026", createdAt: "2026-03-01T12:00:00.000Z", text: "Portfolio-ready project by the end — exactly what I needed." },

  { id: 13, courseId: 5, author: "Grace Mulenga", avatar: "https://randomuser.me/api/portraits/women/24.jpg", role: "Analyst", rating: 5, date: "Jul 2026", createdAt: "2026-07-01T12:00:00.000Z", text: "Zero to scikit-learn without pain. The visualization section is excellent." },
  { id: 14, courseId: 5, author: "Ravi Shankar", avatar: "https://randomuser.me/api/portraits/men/8.jpg", role: "Student", rating: 5, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "Clear, patient explanations. The final ML project boosted my confidence a lot." },
  { id: 15, courseId: 5, author: "Elif Kaya", avatar: "https://randomuser.me/api/portraits/women/27.jpg", role: "Data Analyst", rating: 4, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "Great fundamentals. Could use one more module on feature engineering." },

  { id: 16, courseId: 6, author: "Isabelle Moreau", avatar: "https://randomuser.me/api/portraits/women/30.jpg", role: "Career Switcher", rating: 5, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "The case study at the end got me my first design interview." },
  { id: 17, courseId: 6, author: "Kwame Mensah", avatar: "https://randomuser.me/api/portraits/men/12.jpg", role: "Developer", rating: 5, date: "Apr 2026", createdAt: "2026-04-01T12:00:00.000Z", text: "Finally understand design tokens and systems." },
  { id: 18, courseId: 6, author: "Alina Petrova", avatar: "https://randomuser.me/api/portraits/women/35.jpg", role: "Product Designer", rating: 4, date: "Mar 2026", createdAt: "2026-03-01T12:00:00.000Z", text: "Research chapters are top-notch; tooling moves fast, so check the updates." },

  { id: 19, courseId: 7, author: "Carlos Mendes", avatar: "https://randomuser.me/api/portraits/men/14.jpg", role: "Small Business Owner", rating: 5, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "Practical, no jargon. My campaigns finally have a structure." },
  { id: 20, courseId: 7, author: "Fatima Zahra", avatar: "https://randomuser.me/api/portraits/women/40.jpg", role: "Marketing Student", rating: 4, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "The analytics module is beginner-friendly and clear." },
  { id: 21, courseId: 7, author: "Liam O'Connor", avatar: "https://randomuser.me/api/portraits/men/15.jpg", role: "Startup Founder", rating: 4, date: "Apr 2026", createdAt: "2026-04-01T12:00:00.000Z", text: "Good breadth. I'd love more on email automation." },

  { id: 22, courseId: 8, author: "Hiro Nakamura", avatar: "https://randomuser.me/api/portraits/men/17.jpg", role: "Backend Developer", rating: 5, date: "Jul 2026", createdAt: "2026-07-01T12:00:00.000Z", text: "The security and observability chapters are production-grade." },
  { id: 23, courseId: 8, author: "Anika Desai", avatar: "https://randomuser.me/api/portraits/women/45.jpg", role: "Full-stack Engineer", rating: 5, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "Rate limiting, caching, real-time — all the senior-level topics, taught clearly." },
  { id: 24, courseId: 8, author: "Marco Rossi", avatar: "https://randomuser.me/api/portraits/men/18.jpg", role: "Developer", rating: 4, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "Dense but rewarding. The reference API is very useful." },

  { id: 25, courseId: 9, author: "Lena Fischer", avatar: "https://randomuser.me/api/portraits/women/48.jpg", role: "Web Developer", rating: 5, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "Made the leap from web to mobile painlessly." },
  { id: 26, courseId: 9, author: "Omar Haddad", avatar: "https://randomuser.me/api/portraits/men/21.jpg", role: "Mobile Developer", rating: 4, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "The Riverpod section is worth the course price alone." },
  { id: 27, courseId: 9, author: "Chloe Anderson", avatar: "https://randomuser.me/api/portraits/women/50.jpg", role: "Student", rating: 5, date: "Apr 2026", createdAt: "2026-04-01T12:00:00.000Z", text: "Published my first app to both stores!" },

  { id: 28, courseId: 10, author: "Samuel Okafor", avatar: "https://randomuser.me/api/portraits/men/22.jpg", role: "Sysadmin", rating: 5, date: "Jul 2026", createdAt: "2026-07-01T12:00:00.000Z", text: "Infrastructure as code finally clicked. The free-tier labs keep costs at zero." },
  { id: 29, courseId: 10, author: "Inês Duarte", avatar: "https://randomuser.me/api/portraits/women/60.jpg", role: "DevOps Engineer", rating: 5, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "Terraform and GitHub Actions pipelines are exactly how I'd do it in production." },
  { id: 30, courseId: 10, author: "Victor Almeida", avatar: "https://randomuser.me/api/portraits/men/25.jpg", role: "Cloud Engineer", rating: 5, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "The clearest Kubernetes intro I've taken." },

  { id: 31, courseId: 11, author: "Rebecca Hayes", avatar: "https://randomuser.me/api/portraits/women/63.jpg", role: "Team Lead", rating: 5, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "The feedback frameworks changed how I run one-on-ones." },
  { id: 32, courseId: 11, author: "Jean-Luc Fontaine", avatar: "https://randomuser.me/api/portraits/men/27.jpg", role: "Manager", rating: 4, date: "Apr 2026", createdAt: "2026-04-01T12:00:00.000Z", text: "Concise and practical. The exercises apply immediately." },
  { id: 33, courseId: 11, author: "Aisha Bello", avatar: "https://randomuser.me/api/portraits/women/65.jpg", role: "Individual Contributor", rating: 4, date: "Mar 2026", createdAt: "2026-03-01T12:00:00.000Z", text: "Great for non-managers who want to be heard." },

  { id: 34, courseId: 12, author: "Ethan Carter", avatar: "https://randomuser.me/api/portraits/men/29.jpg", role: "JavaScript Developer", rating: 5, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "The security module on common exploits is invaluable." },
  { id: 35, courseId: 12, author: "Ling Wei", avatar: "https://randomuser.me/api/portraits/women/72.jpg", role: "Engineer", rating: 5, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "Deployed a real dApp by the end. Test networks keep it free." },
  { id: 36, courseId: 12, author: "Benjamin Katz", avatar: "https://randomuser.me/api/portraits/men/33.jpg", role: "Web3 Builder", rating: 4, date: "Apr 2026", createdAt: "2026-04-01T12:00:00.000Z", text: "Gas optimization is advanced but explained clearly." },

  { id: 37, courseId: 13, author: "Miguel Santos", avatar: "https://randomuser.me/api/portraits/men/35.jpg", role: "Absolute Beginner", rating: 5, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "My first webpage was live in an hour. Perfect on-ramp." },
  { id: 38, courseId: 13, author: "Sarah O'Connor", avatar: "https://randomuser.me/api/portraits/women/74.jpg", role: "Career Switcher", rating: 5, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "Flexbox and Grid finally make sense." },
  { id: 39, courseId: 13, author: "David Njoroge", avatar: "https://randomuser.me/api/portraits/men/36.jpg", role: "Student", rating: 5, date: "Apr 2026", createdAt: "2026-04-01T12:00:00.000Z", text: "Free, structured, and genuinely beginner-friendly." },

  { id: 40, courseId: 14, author: "Tobias Fischer", avatar: "https://randomuser.me/api/portraits/men/39.jpg", role: "Bootcamp Graduate", rating: 5, date: "Jul 2026", createdAt: "2026-07-01T12:00:00.000Z", text: "Three shipped full-stack apps and weekly code reviews — the structure kept me accountable the whole way." },
  { id: 41, courseId: 14, author: "Nina Patel", avatar: "https://randomuser.me/api/portraits/women/80.jpg", role: "Junior Developer", rating: 4, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "Dense but practical. The real-time chat module was my favorite part." },
  { id: 42, courseId: 14, author: "Carlos Reyes", avatar: "https://randomuser.me/api/portraits/men/40.jpg", role: "Career Switcher", rating: 5, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "Went from zero to a deployed portfolio app. Worth every hour." },

  { id: 43, courseId: 15, author: "Wei Zhang", avatar: "https://randomuser.me/api/portraits/men/43.jpg", role: "Analyst", rating: 5, date: "Jul 2026", createdAt: "2026-07-01T12:00:00.000Z", text: "The graded assignments and capstone gave me a credential I could actually show employers." },
  { id: 44, courseId: 15, author: "Olivia Brown", avatar: "https://randomuser.me/api/portraits/women/84.jpg", role: "Student", rating: 5, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "Clear, patient teaching across the full year. The statistics refresher was gold." },
  { id: 45, courseId: 15, author: "Hassan Ali", avatar: "https://randomuser.me/api/portraits/men/47.jpg", role: "Data Enthusiast", rating: 4, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "Thorough program. I'd have liked a touch more on deployment, but overall excellent." },

  { id: 46, courseId: 16, author: "Sofia Rossi", avatar: "https://randomuser.me/api/portraits/women/88.jpg", role: "Data Professional", rating: 5, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "The thesis and advisor check-ins made this feel like a real graduate experience." },
  { id: 47, courseId: 16, author: "Daniel Kim", avatar: "https://randomuser.me/api/portraits/men/48.jpg", role: "Analyst", rating: 4, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "Strong on BI and experimentation. A genuinely rigorous program." },
  { id: 48, courseId: 16, author: "Mei Lin", avatar: "https://randomuser.me/api/portraits/women/90.jpg", role: "Career Switcher", rating: 5, date: "Apr 2026", createdAt: "2026-04-01T12:00:00.000Z", text: "Moved into analytics with confidence thanks to the capstone and case work." },

  { id: 49, courseId: 17, author: "Robert Hayes", avatar: "https://randomuser.me/api/portraits/men/50.jpg", role: "Director", rating: 5, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "The consulting engagement was directly applicable to my day job. Highly relevant." },
  { id: 50, courseId: 17, author: "Priya Nair", avatar: "https://randomuser.me/api/portraits/women/1.jpg", role: "Manager", rating: 4, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "Great balance of strategy and leadership. Monthly seminars kept me engaged." },
  { id: 51, courseId: 17, author: "Anders Holm", avatar: "https://randomuser.me/api/portraits/men/54.jpg", role: "Founder", rating: 5, date: "Apr 2026", createdAt: "2026-04-01T12:00:00.000Z", text: "The capstone solved a real problem in my own company. Exceptional value." },

  { id: 52, courseId: 18, author: "Lucas Meyer", avatar: "https://randomuser.me/api/portraits/men/58.jpg", role: "Student", rating: 5, date: "Jul 2026", createdAt: "2026-07-01T12:00:00.000Z", text: "A full undergraduate curriculum with real projects each term. Demanding but worth it." },
  { id: 53, courseId: 18, author: "Amara Okafor", avatar: "https://randomuser.me/api/portraits/women/92.jpg", role: "Career Switcher", rating: 4, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "Loved the systems and algorithms tracks. Recorded lectures made it manageable." },
  { id: 54, courseId: 18, author: "Kenji Sato", avatar: "https://randomuser.me/api/portraits/men/60.jpg", role: "Developer", rating: 5, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "The senior capstone mirrored a real engineering build. Exactly what I wanted." },

  { id: 55, courseId: 19, author: "Elena Petrova", avatar: "https://randomuser.me/api/portraits/women/95.jpg", role: "Researcher", rating: 5, date: "Jun 2026", createdAt: "2026-06-01T12:00:00.000Z", text: "The dissertation supervision and publication track were exactly what a doctoral program should be." },
  { id: 56, courseId: 19, author: "Mohammed Khan", avatar: "https://randomuser.me/api/portraits/men/62.jpg", role: "Data Scientist", rating: 5, date: "May 2026", createdAt: "2026-05-01T12:00:00.000Z", text: "Rigorous, applied research with a real defense panel. I published from my work." },
  { id: 57, courseId: 19, author: "Clara Becker", avatar: "https://randomuser.me/api/portraits/women/21.jpg", role: "PhD Candidate", rating: 4, date: "Apr 2026", createdAt: "2026-04-01T12:00:00.000Z", text: "Demanding but fair. The methods labs prepared me well for independent research." },
];
