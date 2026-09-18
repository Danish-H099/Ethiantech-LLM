// Raw course records as persisted by the LMS backend.
// Related entities (institution, tutors, curriculum) are referenced by id and
// resolved server-side in src/services/courses.js.

/**
 * Canonical course catalog.
 * Single-course model (no specializations / nested courses yet).
 * Institutions and tutors live in their own files; courses reference them
 * by id and the default export resolves them into `institution` and
 * `instructors` objects.
 *
 * @typedef {Object} Institution
 * @property {string} id Stable slug id referenced by courses.
 * @property {string} name Institution or provider name.
 * @property {string} logo Logo image URL.
 * @property {string} tagline Short marketing line.
 * @property {string} about Longer description shown on course pages.
 * @property {string} location Headquarter location.
 * @property {number} founded Year established.
 *
 * @typedef {Object} Instructor
 * @property {string} id Stable slug id referenced by courses.
 * @property {string} name
 * @property {string} photo Avatar image URL.
 * @property {string} title Professional role/title.
 * @property {string} bio Short biography.
 * @property {number} rating Overall instructor rating (1â€“5).
 * @property {number} students Total learners taught.
 * @property {number} courses Number of published courses.
 *
 * @typedef {Object} FaqItem
 * @property {string} question
 * @property {string} answer
 *
 * @typedef {Object} Certificate
 * @property {string} type Credential type label.
 * @property {string} description What the learner earns.
 *
 * @typedef {Object} CurriculumLesson
 * @property {string} title
 * @property {string} duration
 * @property {"video"|"article"|"quiz"|"exercise"|"project"|"resource"} [type]
 * @property {boolean} [preview] Free-preview lesson (watchable before enrollment).
 *
 * @typedef {Object} CurriculumSection
 * @property {string} title
 * @property {number} lectures
 * @property {string} duration
 * @property {CurriculumLesson[]} lessons
 *
 * @typedef {Object} Course
 * @property {number} id
 * @property {string} title
 * @property {string} author
 * @property {number} rating
 * @property {number} reviews
 * @property {string} price
 * @property {string} [originalPrice] Strikethrough list price (paid courses only).
 * @property {string} promise Hero value proposition sentence.
 * @property {string[]} description Long-form description paragraphs.
 * @property {string[]} projects Portfolio projects built in the course.
 * @property {string} image
 * @property {string} tag
 * @property {string} category Top-level market/topic label (also used for related courses).
 * @property {string[]} topics Broad topic tags; a course may span several.
 * @property {string[]} subcategories Specific sub-category tags; a course may belong to several.
 * @property {"Professional Course"|"Bootcamp"|"University Course"} courseType Delivery/provider type.
 * @property {string} level
 * @property {string} duration
 * @property {number} hours
 * @property {boolean} isFree
 * @property {number} students
 * @property {string|null} institutionId Backing provider/university id, if any.
 * @property {Institution|null} institution Resolved provider (default export only).
 * @property {string[]} tutorIds Instructor ids for this course.
 * @property {Instructor[]} instructors Resolved instructors (default export only).
 * @property {string[]} learningOutcomes
 * @property {string[]} skills
 * @property {string[]} [tools] Tools taught (technical courses only).
 * @property {string[]} requirements
 * @property {string[]} targetAudience
 * @property {string} language Primary teaching language.
 * @property {string[]} languages Available languages/subtitles.
 * @property {string} lastUpdated Recency label.
 * @property {Certificate} certificate
 * @property {string[]} highlights Sidebar benefit list.
 * @property {FaqItem[]} faq
 * @property {CurriculumSection[]} [curriculum] Per-course curriculum (default export only).
 */


const DEFAULT_HIGHLIGHTS = [
  "Lifetime access with free updates",
  "Step-by-step project guidance",
  "Downloadable resources and source code",
  "Quizzes to test your knowledge",
  "Certificate of completion",
];

/** @type {Course[]} */
export const courses = [
  {
    id: 1,
    title: "Build Text to Image SaaS App in React JS",
    author: "Richard James",
    rating: 4.5,
    reviews: 122,
    price: "$10.99",
    originalPrice: "$44.99",
    promise:
      "Build and launch a working AI image-generation SaaS â€” from React frontend to billing to production deployment.",
    description: [
      "This project-based course takes you from a blank React app to a fully deployed text-to-image SaaS. You'll wire up an AI image-generation API, build an async job flow so users can generate images without blocking, and design a monetization loop with authentication and usage limits.",
      "Along the way you'll make the same decisions a production team makes: structuring components, handling errors, choosing where state lives, and monitoring what happens after you ship. By the end you'll have a real product on the internet â€” not just code in a repo.",
    ],
    projects: [
      "Text-to-image SaaS app with auth and usage limits",
      "Async job queue for image generation",
      "Deployed app with monitoring and error tracking",
    ],
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    tag: "FULL STACK",
    category: "Web Development",
    courseType: "Professional Course",
    topics: ["Web Development", "Data Science & AI"],
    subcategories: ["Full Stack", "React", "AI Applications", "API Development"],
    level: "Intermediate",
    duration: "8 weeks",
    hours: 12,
    isFree: false,
    students: 1240,
    institutionId: null,
    tutorIds: ["richard-james"],
    learningOutcomes: [
      "Build a production-ready text-to-image SaaS application with React",
      "Integrate AI image-generation APIs and handle async job queues",
      "Design a monetization flow with authentication and usage limits",
      "Deploy a full stack app with real users and error monitoring",
    ],
    skills: ["React JS", "API Integration", "Authentication", "SaaS Architecture", "Deployment"],
    tools: ["React", "Vite", "Node.js", "Tailwind CSS", "Vercel"],
    requirements: [
      "Basic knowledge of HTML, CSS, and JavaScript",
      "A computer with Node.js and a code editor installed",
    ],
    targetAudience: [
      "Frontend developers who want to build their first SaaS",
      "Developers curious about integrating AI APIs",
      "Junior engineers preparing for full-stack roles",
    ],
    language: "English",
    languages: ["English", "Spanish", "Hindi", "Portuguese"],
    lastUpdated: "Jun 2026",
    certificate: {
      type: "Certificate of Completion",
      description: "Earn a shareable certificate to add to your LinkedIn profile.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "Do I need experience with AI to take this course?",
        answer:
          "No. You'll learn how to call image-generation APIs step by step; basic JavaScript knowledge is all that's required.",
      },
      {
        question: "Will I build a deployable project?",
        answer:
          "Yes. You'll build and deploy a working text-to-image SaaS app that you can show on your portfolio.",
      },
      {
        question: "How long do I have access to the material?",
        answer:
          "Lifetime access, including all future updates to the course content.",
      },
    ],
  },
  {
    id: 2,
    title: "Build AI BG Removal SaaS App in React JS",
    author: "Richard James",
    rating: 4.5,
    reviews: 98,
    price: "$10.99",
    originalPrice: "$44.99",
    promise:
      "Ship an AI background-removal SaaS powered by a vision API â€” with queues, webhooks, subscriptions, and per-user limits.",
    description: [
      "You'll build a complete AI background-removal product: an upload experience that validates and optimizes images, a worker that processes them through a vision API, and webhook callbacks that keep the client in sync.",
      "Then you'll make it a business â€” subscription billing with Stripe, usage limits per user, and the failure recovery that keeps a paid product reliable. The course ends with a production deployment and a launch checklist.",
    ],
    projects: [
      "AI background-removal web app with image upload",
      "Batch processing pipeline with webhooks",
      "Stripe subscription billing with usage tracking",
    ],
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    tag: "FULL STACK",
    category: "AI & ML",
    courseType: "Professional Course",
    topics: ["Web Development", "Data Science & AI"],
    subcategories: ["Full Stack", "React", "Computer Vision", "Product Engineering"],
    level: "Advanced",
    duration: "10 weeks",
    hours: 18,
    isFree: false,
    students: 980,
    institutionId: null,
    tutorIds: ["richard-james"],
    learningOutcomes: [
      "Build an AI background-removal SaaS app using React and a vision API",
      "Implement batch processing, queues, and webhook callbacks",
      "Add subscription billing and per-user usage tracking",
      "Optimize image uploads and processing for performance at scale",
    ],
    skills: ["React JS", "Computer Vision APIs", "Webhooks", "Subscription Billing", "Scaling"],
    tools: ["React", "Node.js", "Stripe", "Redis", "AWS S3"],
    requirements: [
      "Solid React fundamentals",
      "Familiarity with Node.js and REST APIs",
      "Comfort with async flows and state management",
    ],
    targetAudience: [
      "Experienced frontend developers moving into AI products",
      "SaaS builders who want to add AI features to their stack",
      "Developers preparing for senior full-stack interviews",
    ],
    language: "English",
    languages: ["English", "German", "French", "Spanish"],
    lastUpdated: "May 2026",
    certificate: {
      type: "Certificate of Completion",
      description: "Earn a shareable certificate to add to your LinkedIn profile.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "Which AI service does the course use?",
        answer:
          "The course works with a popular vision API and shows you how to swap providers with minimal code changes.",
      },
      {
        question: "Is the payment integration covered?",
        answer:
          "Yes. You'll wire up subscription billing, free tiers, and usage-based limits with Stripe.",
      },
      {
        question: "Is this course suitable for beginners?",
        answer:
          "It's aimed at developers who already know React. If you're new to React, we recommend starting with the fundamentals course first.",
      },
    ],
  },
  {
    id: 3,
    title: "React Router Complete Course in One Video",
    author: "Richard James",
    rating: 4.5,
    reviews: 210,
    price: "$10.99",
    originalPrice: "$34.99",
    promise:
      "Master React Router v7 in one fast-paced video â€” with a cheatsheet, quiz, and hands-on challenge to lock it in.",
    description: [
      "The entire core course is a single, focused video covering everything React Router v7 has to offer: setup, nested routes, layouts, dynamic segments, loaders, redirects, and lazy loading.",
      "Because it's one video, it's built to be rewatched. Pair it with the written cheatsheet, test yourself with the quiz, and cement the concepts by building a nested layout challenge.",
    ],
    projects: [
      "Nested layout challenge with dynamic routes",
      "Personal cheatsheet of routing patterns",
    ],
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    tag: "2024",
    category: "Web Development",
    courseType: "Bootcamp",
    topics: ["Web Development"],
    subcategories: ["React", "Frontend"],
    level: "Beginner",
    duration: "4 weeks",
    hours: 0.75,
    isFree: false,
    students: 2100,
    institutionId: null,
    tutorIds: ["richard-james"],
    learningOutcomes: [
      "Understand routing concepts and how React Router fits into a SPA",
      "Set up nested routes, layouts, and dynamic route parameters",
      "Handle redirects, not-found pages, and lazy-loaded routes",
      "Write accessible navigation that works with keyboard and screen readers",
    ],
    skills: ["React Router", "Client-side Routing", "Nested Routes", "Code Splitting", "SPA Architecture"],
    tools: ["React", "React Router v7"],
    requirements: [
      "Basic React knowledge (components and hooks)",
      "A code editor and Node.js installed",
    ],
    targetAudience: [
      "React beginners who want to master routing",
      "Developers migrating from multi-page to single-page apps",
      "Anyone preparing for frontend interviews on routing",
    ],
    language: "English",
    languages: ["English", "Spanish", "Arabic", "Hindi"],
    lastUpdated: "Mar 2026",
    certificate: {
      type: "Certificate of Completion",
      description: "Earn a shareable certificate to add to your LinkedIn profile.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "Is this course really taught in one video?",
        answer:
          "Yes â€” the core content is a single, fast-paced video. Supplemental quizzes and notes are included to reinforce each section.",
      },
      {
        question: "Does it cover React Router v7?",
        answer:
          "Yes, the course is built on the latest React Router release.",
      },
      {
        question: "Will I need additional courses after this?",
        answer:
          "If you're new to React itself, we recommend our React fundamentals path first. This course focuses purely on routing.",
      },
    ],
  },
  {
    id: 4,
    title: "Build Full Stack E-Commerce App in React JS",
    author: "Richard James",
    rating: 4.5,
    reviews: 156,
    price: "$10.99",
    originalPrice: "$44.99",
    promise:
      "Architect, build, and deploy a complete e-commerce platform â€” catalog, cart, checkout, payments, and admin.",
    description: [
      "This is a full stack build, end to end. You'll model the data, expose a REST API, and build a storefront with search, filtering, and pagination. From there you'll add a cart, checkout, payments, and order management.",
      "Security isn't an afterthought: authentication, role-based access, and input validation are covered before you ship. You'll finish with an admin dashboard and a production deployment of the whole stack.",
    ],
    projects: [
      "Full stack e-commerce storefront",
      "Cart, checkout & payment flow",
      "Admin dashboard for orders and analytics",
    ],
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    tag: "2024",
    category: "Web Development",
    courseType: "Professional Course",
    topics: ["Web Development"],
    subcategories: ["Full Stack", "E-commerce", "Backend", "Database Design"],
    level: "Intermediate",
    duration: "12 weeks",
    hours: 24,
    isFree: false,
    students: 1560,
    institutionId: null,
    tutorIds: ["richard-james"],
    learningOutcomes: [
      "Architect and build a full stack e-commerce application from scratch",
      "Design a product catalog with search, filters, and pagination",
      "Implement a shopping cart, checkout, and order management flow",
      "Secure the app with authentication, validation, and payment processing",
    ],
    skills: ["Full Stack Development", "E-commerce Design", "REST APIs", "Database Design", "Payments"],
    tools: ["React", "Node.js", "Express", "MongoDB", "Stripe"],
    requirements: [
      "Working knowledge of JavaScript and React basics",
      "Understanding of REST APIs and JSON",
      "A computer with Node.js and MongoDB installed",
    ],
    targetAudience: [
      "Developers who want to ship a complete storefront",
      "Freelancers building e-commerce sites for clients",
      "Job seekers looking for a portfolio-worthy full stack project",
    ],
    language: "English",
    languages: ["English", "Spanish", "French", "Portuguese"],
    lastUpdated: "Apr 2026",
    certificate: {
      type: "Certificate of Completion",
      description: "Earn a shareable certificate to add to your LinkedIn profile.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "Do I build the backend too?",
        answer:
          "Yes â€” you build the entire stack: React frontend, Express API, database schema, and payment integration.",
      },
      {
        question: "Can I deploy the final app?",
        answer:
          "Absolutely. The course ends with a production deployment and monitoring setup.",
      },
      {
        question: "What if I get stuck?",
        answer:
          "Every module ends with working code and a live Q&A section, and you have lifetime access to ask questions in the community.",
      },
    ],
  },
  {
    id: 5,
    title: "Python for Data Science & Machine Learning",
    author: "Sarah Chen",
    rating: 4.8,
    reviews: 345,
    price: "$14.99",
    originalPrice: "$74.99",
    promise:
      "Go from zero programming to a portfolio-ready machine learning project â€” Python, pandas, visualization, and scikit-learn.",
    description: [
      "Designed for absolute beginners, this course starts with Python fundamentals and moves through real data work: cleaning and wrangling with pandas, exploring with Matplotlib, Seaborn, and Plotly, and finally building and evaluating models with scikit-learn.",
      "Every skill is practiced on realistic datasets, and you finish with an end-to-end analysis project you can share with recruiters. Best practices for reproducible, versioned notebooks are woven through the whole course.",
    ],
    projects: [
      "End-to-end data analysis on a real dataset",
      "Predictive model built with scikit-learn",
      "Reusable, documented analysis notebook",
    ],
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    tag: "DATA SCIENCE",
    category: "AI & ML",
    courseType: "University Course",
    topics: ["Data Science & AI"],
    subcategories: ["Machine Learning", "Data Analysis", "Python"],
    level: "Beginner",
    duration: "6 weeks",
    hours: 15,
    isFree: false,
    students: 3200,
    institutionId: "northbridge-university",
    tutorIds: ["sarah-chen"],
    learningOutcomes: [
      "Write clean Python to clean, explore, and analyze real datasets",
      "Build and evaluate machine learning models with scikit-learn",
      "Visualize findings with Matplotlib, Seaborn, and Plotly",
      "Apply best practices for reproducible data projects",
    ],
    skills: ["Python", "Pandas", "NumPy", "Data Visualization", "Machine Learning", "scikit-learn"],
    tools: ["Python", "Pandas", "NumPy", "Matplotlib", "Jupyter"],
    requirements: [
      "No prior programming experience required",
      "A computer with internet access",
      "High-school level mathematics is helpful",
    ],
    targetAudience: [
      "Beginners starting a career in data science",
      "Analysts who want to add Python to their toolkit",
      "Students preparing for university coursework in data analytics",
    ],
    language: "English",
    languages: ["English", "Spanish", "Hindi", "German"],
    lastUpdated: "Jul 2026",
    certificate: {
      type: "Certificate of Completion",
      description: "Earn a shareable certificate to add to your LinkedIn profile.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "I've never programmed before. Can I take this?",
        answer:
          "Yes. The course assumes zero programming experience and builds Python fundamentals before moving into data tools.",
      },
      {
        question: "What projects will I complete?",
        answer:
          "You'll analyze real-world datasets and build a final machine-learning project you can include in your portfolio.",
      },
      {
        question: "Is there support for non-English speakers?",
        answer:
          "The course includes subtitles in four languages and a global community forum for questions.",
      },
    ],
  },
  {
    id: 6,
    title: "UI/UX Design Masterclass 2024",
    author: "Emily Parker",
    rating: 4.7,
    reviews: 267,
    price: "$12.99",
    originalPrice: "$64.99",
    promise:
      "Run real user research and design a polished, accessible product â€” finishing with a portfolio-ready case study.",
    description: [
      "This course teaches the full design process, not just pixels. You'll plan and synthesize user research, turn findings into personas and journeys, and move from low-fidelity wireframes to interactive prototypes in Figma.",
      "You'll also build a real design system with tokens, accessible components, and handoff documentation. The course ends with a complete case study and a portfolio review so you leave with work recruiters can actually look at.",
    ],
    projects: [
      "Complete design case study with research",
      "Design system with tokens and components",
      "Interactive prototype tested with users",
    ],
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop",
    tag: "DESIGN",
    category: "Design",
    courseType: "Professional Course",
    topics: ["Design"],
    subcategories: ["UI Design", "UX Research", "Design Systems", "Prototyping"],
    level: "Intermediate",
    duration: "8 weeks",
    hours: 10,
    isFree: false,
    students: 1890,
    institutionId: null,
    tutorIds: ["emily-parker"],
    learningOutcomes: [
      "Run user research and turn insights into design decisions",
      "Design polished, accessible interfaces using modern tools",
      "Build a design system with tokens, components, and patterns",
      "Deliver a complete case study ready for a design portfolio",
    ],
    skills: ["UX Research", "UI Design", "Wireframing", "Design Systems", "Prototyping", "Accessibility"],
    tools: ["Figma", "Framer", "Maze"],
    requirements: [
      "Interest in design â€” no prior experience required",
      "A free Figma account",
    ],
    targetAudience: [
      "Career switchers moving into product design",
      "Developers who want to improve their visual design sense",
      "Designers who want to formalize their research practice",
    ],
    language: "English",
    languages: ["English", "French", "Spanish", "German"],
    lastUpdated: "Feb 2026",
    certificate: {
      type: "Certificate of Completion",
      description: "Earn a shareable certificate to add to your LinkedIn profile.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "What tools do I need to buy?",
        answer:
          "None. We use Figma and free-tier tools throughout the entire course.",
      },
      {
        question: "Will this help me get a design job?",
        answer:
          "You'll leave with a complete case study and a working design system â€” the two artifacts recruiters most want to see.",
      },
      {
        question: "Is the content up to date for 2026?",
        answer:
          "The course covers enduring UX process and current tooling, and we refresh the material with each annual update.",
      },
    ],
  },
  {
    id: 7,
    title: "Digital Marketing Strategy & Analytics",
    author: "Michael Torres",
    rating: 4.3,
    reviews: 178,
    price: "$8.99",
    originalPrice: "$39.99",
    promise:
      "Turn a strategy into campaigns you can measure â€” paid, organic, and email â€” and learn what the numbers actually mean.",
    description: [
      "Marketing is decisions, not tricks. You'll define goals and KPIs, build personas and positioning, and plan campaigns across paid ads, organic, SEO, and email â€” using free tools and a small test budget.",
      "The second half is analytics: setting up tracking, reading dashboards, understanding attribution, and calculating ROI. You'll leave able to run experiments with A/B testing and report performance in terms that matter to a business.",
    ],
    projects: [
      "Full marketing strategy and campaign plan",
      "Analytics setup with KPI dashboard",
      "A/B testing plan with ROI calculations",
    ],
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop",
    tag: "MARKETING",
    category: "Business",
    courseType: "Professional Course",
    topics: ["Marketing"],
    subcategories: ["Digital Marketing", "Campaign Management", "Analytics", "SEO"],
    level: "Beginner",
    duration: "6 weeks",
    hours: 5,
    isFree: false,
    students: 1450,
    institutionId: null,
    tutorIds: ["michael-torres"],
    learningOutcomes: [
      "Build a marketing strategy grounded in goals and target personas",
      "Run campaigns across paid, organic, and email channels",
      "Set up analytics to track ROI and attribute results",
      "Turn data into weekly decisions that improve performance",
    ],
    skills: ["Marketing Strategy", "Campaign Management", "Analytics", "Conversion Optimization", "SEO"],
    tools: ["Google Analytics", "Meta Ads Manager", "Mailchimp"],
    requirements: [
      "No prior marketing experience needed",
      "A laptop and a curiosity about how growth works",
    ],
    targetAudience: [
      "Small business owners who market their own products",
      "Beginners starting a career in marketing",
      "Founders who want to understand their growth metrics",
    ],
    language: "English",
    languages: ["English", "Spanish", "Portuguese", "Hindi"],
    lastUpdated: "Jan 2026",
    certificate: {
      type: "Certificate of Completion",
      description: "Earn a shareable certificate to add to your LinkedIn profile.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "Does the course cover paid advertising in depth?",
        answer:
          "Yes, including campaign setup, budgeting, targeting, and how to read your ad metrics.",
      },
      {
        question: "Will I need a big budget to practice?",
        answer:
          "No. Every exercise can be completed with free tools or a tiny test budget.",
      },
      {
        question: "Is analytics hard for beginners?",
        answer:
          "We start from zero â€” explaining what each metric means before you ever touch a dashboard.",
      },
    ],
  },
  {
    id: 8,
    title: "Advanced Node.js & Express APIs",
    author: "David Kim",
    rating: 4.6,
    reviews: 134,
    price: "$15.99",
    originalPrice: "$79.99",
    promise:
      "Design, secure, and operate production-grade Node.js APIs â€” with caching, real-time features, and observability.",
    description: [
      "This is advanced content for developers who already write Node.js. You'll design versioned REST APIs, document them with OpenAPI, and harden them against real threats with authentication, rate limiting, and input validation.",
      "From there you'll add PostgreSQL data access, Redis caching, background jobs, and real-time features, then learn to test and observe the whole system. You finish by containerizing and deploying with zero-downtime releases.",
    ],
    projects: [
      "Versioned REST API with OpenAPI docs",
      "Caching and background job pipeline",
      "Containerized API with testing and monitoring",
    ],
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1200&auto=format&fit=crop",
    tag: "BACKEND",
    category: "Web Development",
    courseType: "Professional Course",
    topics: ["Web Development", "Cloud & DevOps"],
    subcategories: ["Backend", "API Development", "Node.js", "DevOps"],
    level: "Advanced",
    duration: "10 weeks",
    hours: 16,
    isFree: false,
    students: 1120,
    institutionId: "cloudpath-academy",
    tutorIds: ["david-kim"],
    learningOutcomes: [
      "Design and document scalable REST APIs with proper versioning",
      "Secure APIs with auth, rate limiting, and input validation",
      "Build background jobs, caching, and real-time features",
      "Instrument APIs with logging, metrics, and error tracking",
    ],
    skills: ["Node.js", "Express", "API Design", "Security", "Caching", "Observability"],
    tools: ["Node.js", "Express", "Redis", "PostgreSQL", "Docker"],
    requirements: [
      "Comfortable with JavaScript and basic Node.js",
      "Familiarity with SQL and relational databases",
    ],
    targetAudience: [
      "Backend developers moving to senior-level work",
      "Full-stack engineers who want stronger API skills",
      "Devs preparing for system design interviews",
    ],
    language: "English",
    languages: ["English", "German", "Japanese", "Spanish"],
    lastUpdated: "Jun 2026",
    certificate: {
      type: "Certificate of Completion",
      description: "Earn a shareable certificate to add to your LinkedIn profile.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "Is this truly advanced content?",
        answer:
          "Yes. We assume you already write Node.js and focus on architecture, security, and scale.",
      },
      {
        question: "Are there production examples?",
        answer:
          "Every chapter ships with a production-grade reference API you can deploy as-is.",
      },
      {
        question: "Does it cover testing?",
        answer:
          "Yes, including unit, integration, and contract testing strategies.",
      },
    ],
  },
  {
    id: 9,
    title: "Flutter Mobile App Development",
    author: "Anna Kowalski",
    rating: 4.4,
    reviews: 201,
    price: "$11.99",
    originalPrice: "$59.99",
    promise:
      "Build and publish a real cross-platform app with Flutter â€” widgets, state management, APIs, and store releases.",
    description: [
      "Starting from the Dart language, you'll learn the widget model, layouts, and theming before moving into modern state management with Riverpod, navigation, and async flows.",
      "The project half integrates REST APIs, local storage, and push notifications, and you'll prepare real builds for Android and iOS (Mac required for the App Store). The course closes with you publishing a production-style app.",
    ],
    projects: [
      "Cross-platform app built with Flutter",
      "State management with Riverpod and streams",
      "App published to app stores",
    ],
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
    tag: "MOBILE",
    category: "Mobile Development",
    courseType: "Professional Course",
    topics: ["Mobile Development"],
    subcategories: ["Flutter", "Cross-Platform Development", "App Publishing"],
    level: "Intermediate",
    duration: "12 weeks",
    hours: 20,
    isFree: false,
    students: 1750,
    institutionId: null,
    tutorIds: ["anna-kowalski"],
    learningOutcomes: [
      "Build cross-platform mobile apps with Flutter from scratch",
      "Master widgets, state management, and navigation patterns",
      "Integrate REST APIs, local storage, and push notifications",
      "Publish a polished app to both app stores",
    ],
    skills: ["Flutter", "Dart", "Mobile UI", "State Management", "App Store Publishing"],
    tools: ["Flutter", "Dart", "Firebase", "Riverpod"],
    requirements: [
      "Basic programming knowledge in any language",
      "A computer capable of running Android Studio or Xcode",
    ],
    targetAudience: [
      "Web developers wanting to move into mobile",
      "Freelancers who want to serve mobile clients",
      "Students building a first cross-platform app",
    ],
    language: "English",
    languages: ["English", "Spanish", "Hindi", "Arabic"],
    lastUpdated: "May 2026",
    certificate: {
      type: "Certificate of Completion",
      description: "Earn a shareable certificate to add to your LinkedIn profile.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "Do I need a Mac to publish to iOS?",
        answer:
          "You can build and test the entire app on Windows or Linux. Publishing to the App Store requires a Mac, which we cover at the end.",
      },
      {
        question: "Is Dart hard to learn?",
        answer:
          "No. Dart is very approachable, and the course teaches it as you go.",
      },
      {
        question: "Will I build a real app?",
        answer:
          "Yes â€” a complete, production-style app that you can publish to the stores.",
      },
    ],
  },
  {
    id: 10,
    title: "AWS Cloud Architecture & DevOps",
    author: "James Wilson",
    rating: 4.9,
    reviews: 312,
    price: "$19.99",
    originalPrice: "$99.99",
    promise:
      "Design secure, cost-optimized AWS architectures and automate them with Terraform, CI/CD, and Kubernetes.",
    description: [
      "You'll build cloud architecture from first principles: IAM, VPCs, compute, storage, and databases, with cost awareness baked in. Everything is practiced on the free tier.",
      "Then you'll automate it: infrastructure as code with Terraform, CI/CD with GitHub Actions, and containers with Docker and Kubernetes. The course ends with monitoring, alarming, cost control, and a full production deployment project.",
    ],
    projects: [
      "Secure VPC and compute architecture on AWS",
      "Terraform-managed infrastructure",
      "CI/CD pipeline with automated deployment",
    ],
    image:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=1200&auto=format&fit=crop",
    tag: "DEVOPS",
    category: "Cloud Computing",
    courseType: "Professional Course",
    topics: ["Cloud & DevOps"],
    subcategories: ["AWS", "DevOps", "Kubernetes", "CI/CD"],
    level: "Advanced",
    duration: "14 weeks",
    hours: 26,
    isFree: false,
    students: 890,
    institutionId: "cloudpath-academy",
    tutorIds: ["james-wilson"],
    learningOutcomes: [
      "Design secure, cost-optimized architectures on AWS",
      "Automate infrastructure with Infrastructure as Code",
      "Build CI/CD pipelines for automated testing and deployment",
      "Operate containerized workloads with Kubernetes",
    ],
    skills: ["AWS", "DevOps", "CI/CD", "Kubernetes", "Terraform", "Cloud Security"],
    tools: ["AWS", "Terraform", "Docker", "Kubernetes", "GitHub Actions"],
    requirements: [
      "Comfort with the Linux command line",
      "Basic understanding of networking and servers",
      "An AWS account (free tier is enough)",
    ],
    targetAudience: [
      "Sysadmins transitioning to cloud roles",
      "Developers who want to own their deployments",
      "Professionals preparing for AWS certification",
    ],
    language: "English",
    languages: ["English", "German", "French", "Spanish"],
    lastUpdated: "Jul 2026",
    certificate: {
      type: "Certificate of Completion",
      description: "Earn a shareable certificate to add to your LinkedIn profile.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "Is this a certification-prep course?",
        answer:
          "It aligns with the Solutions Architect associate curriculum and includes practice questions, though it is not an exam simulator.",
      },
      {
        question: "Will I spend a lot of money on AWS?",
        answer:
          "Every lab runs on the free tier, and the course teaches you to check costs before you start.",
      },
      {
        question: "Do I need prior DevOps experience?",
        answer:
          "Comfort with the terminal helps, but DevOps concepts are introduced from first principles.",
      },
    ],
  },
  {
    id: 11,
    title: "Business Communication & Leadership",
    author: "Lisa Grant",
    rating: 4.2,
    reviews: 98,
    price: "$7.99",
    originalPrice: "$29.99",
    promise:
      "Communicate with clarity, run better meetings, and give feedback people can actually act on.",
    description: [
      "Communication is the multiplier on every other skill. You'll learn frameworks for clear writing, active listening, and running meetings and one-on-ones that build trust instead of consuming time.",
      "The course then moves to the hard stuff â€” difficult conversations, feedback that lands, and psychological safety. Each module includes a real-world exercise you can apply the same week, and about 40 minutes a week is all it takes.",
    ],
    projects: [
      "Personal communication improvement plan",
      "Difficult conversation script and roleplay",
      "Meeting and feedback toolkit",
    ],
    image:
      "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1200&auto=format&fit=crop",
    tag: "BUSINESS",
    category: "Business",
    courseType: "Professional Course",
    topics: ["Business"],
    subcategories: ["Communication", "Leadership", "Management"],
    level: "Beginner",
    duration: "4 weeks",
    hours: 2.5,
    isFree: false,
    students: 920,
    institutionId: null,
    tutorIds: ["lisa-grant"],
    learningOutcomes: [
      "Communicate clearly in meetings, emails, and presentations",
      "Give and receive feedback that improves team performance",
      "Run effective one-on-ones and team rituals",
      "Lead through change and build psychological safety",
    ],
    skills: ["Communication", "Leadership", "Feedback", "Presentation Skills", "Emotional Intelligence"],
    tools: [],
    requirements: [
      "No prior experience required",
      "A willingness to practice new habits in real conversations",
    ],
    targetAudience: [
      "New managers building leadership skills",
      "Individual contributors who want to be heard",
      "Team leads who struggle with difficult conversations",
    ],
    language: "English",
    languages: ["English", "Spanish", "French", "Hindi"],
    lastUpdated: "Mar 2026",
    certificate: {
      type: "Certificate of Completion",
      description: "Earn a shareable certificate to add to your LinkedIn profile.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "Is this useful if I'm not a manager?",
        answer:
          "Yes â€” the communication and feedback frameworks apply to any professional role.",
      },
      {
        question: "Are there practical exercises?",
        answer:
          "Every module includes a real-world exercise you can apply in your next meeting or email.",
      },
      {
        question: "How long should I spend weekly?",
        answer:
          "About 40 minutes a week over four weeks keeps the material manageable alongside work.",
      },
    ],
  },
  {
    id: 12,
    title: "Blockchain Development with Solidity",
    author: "Alex Nguyen",
    rating: 4.7,
    reviews: 89,
    price: "$16.99",
    originalPrice: "$84.99",
    promise:
      "Write, test, secure, and deploy Solidity smart contracts â€” then connect them to a real dApp.",
    description: [
      "For JavaScript developers moving into web3, this course covers Solidity from data types to inheritance, with testing and deployment on testnets from the start.",
      "Security is a dedicated module: you'll study common exploits like reentrancy, learn auditing patterns, and apply gas-optimization and upgradeability techniques. You finish by building a complete token and dApp that interacts with your deployed contracts.",
    ],
    projects: [
      "Secure token contract with tests",
      "Decentralized app connected to deployed contracts",
      "Gas-optimized, upgradeable contract",
    ],
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
    tag: "BLOCKCHAIN",
    category: "Web Development",
    courseType: "Professional Course",
    topics: ["Blockchain & Web3"],
    subcategories: ["Smart Contracts", "Solidity", "dApps", "Ethereum"],
    level: "Advanced",
    duration: "10 weeks",
    hours: 14,
    isFree: false,
    students: 760,
    institutionId: null,
    tutorIds: ["alex-nguyen"],
    learningOutcomes: [
      "Write, test, and deploy Solidity smart contracts",
      "Design secure contracts and avoid common exploit patterns",
      "Build decentralized apps that talk to on-chain contracts",
      "Understand gas optimization and upgradeable contracts",
    ],
    skills: ["Solidity", "Smart Contracts", "Web3", "Ethereum", "Smart Contract Security"],
    tools: ["Solidity", "Hardhat", "Remix", "Ethers.js"],
    requirements: [
      "Solid JavaScript programming experience",
      "Basic understanding of blockchain concepts",
      "Familiarity with the command line",
    ],
    targetAudience: [
      "JavaScript developers curious about web3",
      "Engineers moving into blockchain teams",
      "Builders prototyping their own token or dApp",
    ],
    language: "English",
    languages: ["English", "Vietnamese", "Spanish", "German"],
    lastUpdated: "Feb 2026",
    certificate: {
      type: "Certificate of Completion",
      description: "Earn a shareable certificate to add to your LinkedIn profile.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "Do I need to buy cryptocurrency to practice?",
        answer:
          "No â€” all exercises run on local and test networks with no real funds required.",
      },
      {
        question: "Is security training included?",
        answer:
          "Yes, there is a dedicated module on common exploits and how to write auditable contracts.",
      },
      {
        question: "Will I deploy a dApp?",
        answer:
          "You'll build a complete dApp that interacts with your deployed contracts.",
      },
    ],
  },
  {
    id: 13,
    title: "HTML & CSS Foundations for Beginners",
    author: "Priya Sharma",
    rating: 4.4,
    reviews: 76,
    price: "$0.00",
    promise:
      "Learn semantic HTML and modern CSS from zero â€” then publish your first website for free.",
    description: [
      "A completely free, structured introduction to frontend. You'll write semantic, accessible HTML, style it with modern CSS including Flexbox and Grid, and make it responsive with mobile-first techniques.",
      "Everything is project-based: you'll build practice pages, a layout challenge, and finally a portfolio site that you publish for free. No paid tools and nothing to install to get started.",
    ],
    projects: [
      "Responsive portfolio website",
      "Card layout with Flexbox and Grid",
      "Published site with free hosting",
    ],
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200&auto=format&fit=crop",
    tag: "FRONTEND",
    category: "Web Development",
    courseType: "Bootcamp",
    topics: ["Web Development"],
    subcategories: ["HTML & CSS", "Frontend", "Responsive Design"],
    level: "Beginner",
    duration: "6 weeks",
    hours: 8,
    isFree: true,
    students: 5400,
    institutionId: null,
    tutorIds: ["priya-sharma"],
    learningOutcomes: [
      "Build semantic, accessible HTML pages from scratch",
      "Style modern layouts with CSS Flexbox and Grid",
      "Make pages responsive with mobile-first techniques",
      "Publish your first website for free",
    ],
    skills: ["HTML", "CSS", "Responsive Design", "Accessibility", "Flexbox", "Grid"],
    tools: ["HTML5", "CSS3", "VS Code"],
    requirements: [
      "No prior experience required",
      "A computer with any modern browser",
    ],
    targetAudience: [
      "Absolute beginners starting web development",
      "Career switchers exploring frontend as a path",
      "Students who want a free, structured introduction",
    ],
    language: "English",
    languages: ["English", "Spanish", "Arabic", "Portuguese"],
    lastUpdated: "Apr 2026",
    certificate: {
      type: "Certificate of Completion",
      description: "Earn a shareable certificate to add to your LinkedIn profile.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "Is this course really free?",
        answer:
          "Yes â€” the entire course is free, with no hidden fees or paid certificate required to finish.",
      },
      {
        question: "How fast can I finish it?",
        answer:
          "Most learners complete it in 4â€“6 weeks at a few hours per week, but it's fully self-paced.",
      },
      {
        question: "What do I need to install?",
        answer:
          "Nothing to start. You can write your first page in the browser, then we set up a code editor together.",
      },
    ],
  },
{
    id: 14,
    title: "Full-Stack Web Development Bootcamp",
    author: "Richard James",
    rating: 4.7,
    reviews: 412,
    price: "$29.99",
    originalPrice: "$199.99",
    promise:
      "Ship three production full-stack apps in six months â€” React, Node, databases, auth, and deployment, with weekly code reviews.",
    description: [
      "A structured, intensive track that takes you from working frontend skills to confident full-stack development. Each month pairs guided projects with code reviews, so you write real features every week rather than just following along.",
      "You'll master React, Node.js and Express, relational and document databases, authentication and payments, and end by deploying three production apps with CI/CD. Weekly cohort sessions keep you accountable and unstuck.",
    ],
    projects: [
      "Full-stack job-board app with auth and payments",
      "Real-time chat application with WebSockets",
      "Dockerized e-commerce API with a CI/CD pipeline",
    ],
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
    tag: "BOOTCAMP",
    category: "Web Development",
    courseType: "Bootcamp",
    topics: ["Web Development"],
    subcategories: ["Full Stack", "React", "Node.js", "JavaScript"],
    level: "Intermediate",
    duration: "6 months",
    hours: 320,
    isFree: false,
    students: 2300,
    institutionId: null,
    tutorIds: ["richard-james"],
    learningOutcomes: [
      "Build complete full-stack applications with React and Node.js",
      "Model relational and document databases for real products",
      "Add authentication, role-based access, and payments",
      "Deploy production apps with containerization and CI/CD",
    ],
    skills: ["Full Stack Development", "React JS", "Node.js", "Database Design", "Deployment"],
    tools: ["React", "Node.js", "Express", "PostgreSQL", "Docker"],
    requirements: [
      "Working knowledge of HTML, CSS, and basic JavaScript",
      "A computer with Node.js installed",
      "10â€“15 hours per week to dedicate to the track",
    ],
    targetAudience: [
      "Junior developers preparing for full-stack roles",
      "Career switchers with some coding foundations",
      "Freelancers who want to build complete products",
    ],
    language: "English",
    languages: ["English", "Spanish", "Hindi"],
    lastUpdated: "Jul 2026",
    certificate: {
      type: "Certificate of Completion",
      description: "Earn a shareable certificate to add to your LinkedIn profile.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "How much time do I need each week?",
        answer:
          "Plan for 10â€“15 hours per week across six months, including the weekly code reviews.",
      },
      {
        question: "Do I need backend experience?",
        answer:
          "No â€” the track assumes frontend basics and teaches the backend from the ground up.",
      },
    ],
  },
  {
    id: 15,
    title: "Data Science & Machine Learning Diploma",
    author: "Sarah Chen",
    rating: 4.9,
    reviews: 588,
    price: "$149.00",
    originalPrice: "$499.00",
    promise:
      "A year-long, university-governed diploma covering the full data science lifecycle, with graded assignments and a capstone portfolio.",
    description: [
      "This Northbridge University diploma moves through statistics, Python, data wrangling, machine learning, and deployment in structured twelve-month terms, with graded assignments and a final capstone project.",
      "You'll work on real datasets each term, sit assessments that mirror industry hiring screens, and finish with a peer-reviewed capstone and a certificate transcript from the university.",
    ],
    projects: [
      "End-to-end predictive modeling capstone project",
      "Graded statistics and probability assessments",
      "Deliverable data-analysis portfolio",
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    tag: "DIPLOMA",
    category: "AI & ML",
    courseType: "University Course",
    topics: ["Data Science & AI"],
    subcategories: ["Machine Learning", "Data Analysis", "Python", "Statistics"],
    level: "Beginner",
    duration: "1 year",
    hours: 260,
    isFree: false,
    students: 1850,
    institutionId: "northbridge-university",
    tutorIds: ["sarah-chen"],
    learningOutcomes: [
      "Apply the full data science workflow from framing to deployment",
      "Build and evaluate machine learning models with Python and scikit-learn",
      "Use statistics to make defensible data decisions",
      "Produce a graded capstone project for your portfolio",
    ],
    skills: ["Python", "Statistics", "Machine Learning", "Data Visualization", "Data Wrangling"],
    tools: ["Python", "Pandas", "scikit-learn", "Jupyter", "Tableau"],
    requirements: [
      "High-school level mathematics",
      "Comfort using a computer and installing software",
      "Commitment of about 5 hours per week over 12 months",
    ],
    targetAudience: [
      "Career switchers seeking a structured data science credential",
      "Analysts who want formal statistical foundations",
      "Learners planning to progress to graduate programs",
    ],
    language: "English",
    languages: ["English", "Spanish", "Hindi", "German"],
    lastUpdated: "Jun 2026",
    certificate: {
      type: "University Certificate",
      description: "Earn a verifiable diploma certificate from Northbridge University.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "Is this a university-issued credential?",
        answer:
          "Yes â€” it is a diploma certificate issued by Northbridge University with a verifiable transcript.",
      },
      {
        question: "Can I take it part-time?",
        answer:
          "Yes. The 12-month term is self-paced with monthly grading deadlines and live office hours.",
      },
    ],
  },
  {
    id: 16,
    title: "Professional Master's in Data Analytics",
    author: "Sarah Chen",
    rating: 4.8,
    reviews: 220,
    price: "$1299.00",
    originalPrice: "$2499.00",
    promise:
      "An 18-month graduate-level program in data analytics â€” advanced modeling, business intelligence, and a supervised research thesis.",
    description: [
      "Built for working professionals, this Northbridge graduate program pairs advanced statistical modeling with business intelligence dashboards and a supervised research thesis over three six-month terms.",
      "You'll progress through machine learning pipelines, experimentation and causal inference, and data storytelling, ending with a thesis and a defended final presentation you can show employers.",
    ],
    projects: [
      "Advanced machine learning model deployment",
      "Business intelligence dashboard for a real dataset",
      "Supervised research thesis with a final defense",
    ],
    image:
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=1200&auto=format&fit=crop",
    tag: "MASTER'S",
    category: "AI & ML",
    courseType: "University Course",
    topics: ["Data Science & AI", "Business"],
    subcategories: ["Data Analysis", "Machine Learning", "Statistics", "Business Intelligence"],
    level: "Intermediate",
    duration: "1.5 years",
    hours: 420,
    isFree: false,
    students: 760,
    institutionId: "northbridge-university",
    tutorIds: ["sarah-chen"],
    learningOutcomes: [
      "Design and deploy advanced machine learning pipelines",
      "Run experiments with causal inference methods",
      "Build business intelligence dashboards that drive decisions",
      "Defend a research thesis to a graduate panel",
    ],
    skills: ["Machine Learning", "Statistics", "Business Intelligence", "Experimentation", "Data Storytelling"],
    tools: ["Python", "SQL", "scikit-learn", "Tableau", "MLflow"],
    requirements: [
      "A bachelor's degree or equivalent relevant experience",
      "Foundational statistics and Python",
    ],
    targetAudience: [
      "Analysts pursuing a graduate credential",
      "Data professionals preparing for senior roles",
    ],
    language: "English",
    languages: ["English", "Spanish", "French"],
    lastUpdated: "Jul 2026",
    certificate: {
      type: "Graduate Certificate",
      description: "Earn a graduate certificate from Northbridge University.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "Is this recognized as a degree?",
        answer:
          "It is a graduate certificate from Northbridge University â€” a real credential, not an accredited master's degree.",
      },
      {
        question: "How structured is the schedule?",
        answer:
          "Three six-month terms with fixed milestones and a weekly live seminar.",
      },
    ],
  },
  {
    id: 17,
    title: "Executive MBA in Business Leadership",
    author: "Lisa Grant",
    rating: 4.6,
    reviews: 174,
    price: "$2499.00",
    originalPrice: "$4999.00",
    promise:
      "A three-year executive MBA covering strategy, finance, organizational behavior, and a capstone consulting project.",
    description: [
      "Designed for working managers, this Northbridge executive program blends live seminars with applied team projects across strategy, financial analysis, organizational behavior, and operations.",
      "Each year closes with a real consulting engagement, and the program ends with a capstone project tackling a strategic problem in your own organization.",
    ],
    projects: [
      "Real consulting engagement with an external client",
      "Team strategy and finance case suite",
      "Capstone project on a strategic business problem",
    ],
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    tag: "EXEC MBA",
    category: "Business",
    courseType: "University Course",
    topics: ["Business"],
    subcategories: ["Leadership", "Management", "Strategy", "Finance"],
    level: "Advanced",
    duration: "3 years",
    hours: 640,
    isFree: false,
    students: 420,
    institutionId: "northbridge-university",
    tutorIds: ["lisa-grant"],
    learningOutcomes: [
      "Develop and evaluate business strategy from first principles",
      "Read and act on financial statements and capital decisions",
      "Lead teams and change across organizational structure",
      "Deliver a strategic consulting project to stakeholders",
    ],
    skills: ["Strategy", "Financial Analysis", "Leadership", "Operations", "Negotiation"],
    tools: ["Excel", "Power BI", "Miro"],
    requirements: [
      "Five or more years of professional experience",
      "Managerial or project-lead responsibility",
    ],
    targetAudience: [
      "Mid-career managers moving into executive roles",
      "Founders seeking structured business fundamentals",
    ],
    language: "English",
    languages: ["English", "Spanish", "French"],
    lastUpdated: "May 2026",
    certificate: {
      type: "Executive Certificate",
      description: "Earn an executive certificate from Northbridge University.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "How much time does the EMBA require?",
        answer:
          "About 6â€“8 hours per week, with monthly live seminars and annual consulting engagements.",
      },
      {
        question: "Do I need an undergraduate degree?",
        answer:
          "Relevant professional experience can substitute for formal prerequisites.",
      },
    ],
  },
  {
    id: 18,
    title: "Bachelor of Science in Computer Science",
    author: "David Kim",
    rating: 4.7,
    reviews: 156,
    price: "$3499.00",
    originalPrice: "$6999.00",
    promise:
      "A four-year undergraduate computer science degree with programming foundations, systems, and a senior capstone project.",
    description: [
      "A complete undergraduate curriculum from Northbridge University: programming fundamentals, data structures and algorithms, computer systems, and software engineering across eight semesters.",
      "Coursework is grounded in delivered projects each term, with a two-semester senior capstone that mirrors a real systems build, plus elective tracks in AI, security, and full-stack development.",
    ],
    projects: [
      "Term-long software engineering build each year",
      "Systems-level projects in operating systems and networking",
      "Two-semester senior capstone product",
    ],
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
    tag: "UNDERGRAD",
    category: "Web Development",
    courseType: "University Course",
    topics: ["Web Development", "Data Science & AI"],
    subcategories: ["Computer Science", "Algorithms", "Software Engineering"],
    level: "Beginner",
    duration: "4 years",
    hours: 820,
    isFree: false,
    students: 980,
    institutionId: "northbridge-university",
    tutorIds: ["david-kim"],
    learningOutcomes: [
      "Write rigorous, maintainable software in multiple languages",
      "Apply data structures, algorithms, and complexity analysis",
      "Understand operating systems, networks, and databases",
      "Complete a senior capstone engineering project",
    ],
    skills: ["Computer Science", "Algorithms", "Software Engineering", "Systems Programming", "Databases"],
    tools: ["Python", "Java", "C", "SQL", "Linux"],
    requirements: [
      "High-school mathematics through calculus",
      "A computer with internet access",
    ],
    targetAudience: [
      "High-school graduates pursuing a CS degree",
      "Self-taught developers seeking formal foundations",
    ],
    language: "English",
    languages: ["English", "Spanish", "Arabic"],
    lastUpdated: "Jul 2026",
    certificate: {
      type: "Degree Transcript",
      description: "Earn an official bachelor's degree transcript from Northbridge University.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "Is this a credited bachelor's degree?",
        answer:
          "It follows a full undergraduate curriculum and concludes with an official degree transcript from Northbridge University.",
      },
      {
        question: "Can I work while studying?",
        answer:
          "Yes â€” lectures are recorded and assessments have weekly windows, though it is designed as a full-time load.",
      },
    ],
  },
  {
    id: 19,
    title: "Professional Doctorate in Data Science",
    author: "James Wilson",
    rating: 4.8,
    reviews: 88,
    price: "$5999.00",
    originalPrice: "$9999.00",
    promise:
      "A five-year doctoral track for working professionals â€” research methods, a supervised dissertation, and publishable scholarship.",
    description: [
      "Northbridge's professional doctorate moves from advanced research methods and literature review through supervised dissertation research over five structured years.",
      "You'll produce publishable-grade scholarship in an applied data science domain, with an annual review panel and a final dissertation defense before a university committee.",
    ],
    projects: [
      "Peer-reviewed literature review and research proposal",
      "Original data science research dissertation",
      "Final defense before a university committee",
    ],
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop",
    tag: "DOCTORATE",
    category: "AI & ML",
    courseType: "University Course",
    topics: ["Data Science & AI"],
    subcategories: ["Machine Learning", "Statistics", "Research Methodology"],
    level: "Advanced",
    duration: "5 years",
    hours: 1100,
    isFree: false,
    students: 180,
    institutionId: "northbridge-university",
    tutorIds: ["james-wilson"],
    learningOutcomes: [
      "Review literature and frame an original research question",
      "Design and execute rigorous applied research in data science",
      "Defend original scholarship before a university committee",
      "Publish and communicate results to professional audiences",
    ],
    skills: ["Research Methodology", "Statistics", "Machine Learning", "Academic Writing", "Peer Review"],
    tools: ["Python", "R", "Git", "LaTeX"],
    requirements: [
      "A master's degree or equivalent research experience",
      "A defined research domain you want to advance",
    ],
    targetAudience: [
      "Senior data scientists pursuing a doctoral credential",
      "Researchers seeking publication-grade supervision",
    ],
    language: "English",
    languages: ["English"],
    lastUpdated: "Apr 2026",
    certificate: {
      type: "Doctoral Certificate",
      description: "Earn a doctoral certificate from Northbridge University.",
    },
    highlights: DEFAULT_HIGHLIGHTS,
    faq: [
      {
        question: "Do I need a supervisor from the start?",
        answer:
          "Yes â€” you are matched with a faculty supervisor at enrollment and meet them monthly.",
      },
      {
        question: "Is a dissertation really expected?",
        answer:
          "Yes, the program centers on a supervised dissertation and a final defense.",
      },
    ],
  },
];


export default courses;


