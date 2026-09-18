/**
 * Per-course curriculum, keyed by course id (the catalog course id space).
 *
 * @typedef {Object} CurriculumLesson
 * @property {string} id Stable id (`"<courseId>-s<N>-l<M>"`, the same id space
 *   used by buildLessonId, quizzes, and exercises). Present on every lesson so
 *   lesson identity survives reordering/renaming of the file.
 * @property {string} title
 * @property {string} duration Display duration label ("10 mins").
 * @property {"video"|"article"|"quiz"|"exercise"|"project"|"resource"} [type]
 * @property {boolean} [preview] Free-preview lesson (watchable before enrollment).
 *
 * @typedef {Object} CurriculumSection
 * @property {string} title
 * @property {number} lectures
 * @property {string} duration
 * @property {CurriculumLesson[]} lessons
 *
 * @typedef {Object<string, CurriculumSection[]>} Curriculum
 */

/** @type {Curriculum} */
const curriculum = {
  "1": [
    {
      "title": "Project Introduction",
      "lectures": 3,
      "duration": "30m",
      "lessons": [
        {
          "id": "1-s0-l0",
          "title": "App Overview — Build Text-to-Image SaaS",
          "duration": "10 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "1-s0-l1",
          "title": "How This Course Works",
          "duration": "8 mins",
          "type": "video"
        },
        {
          "id": "1-s0-l2",
          "title": "Prerequisites & Setup Overview",
          "duration": "12 mins",
          "type": "resource"
        }
      ]
    },
    {
      "title": "Project Setup",
      "lectures": 4,
      "duration": "1h 20m",
      "lessons": [
        {
          "id": "1-s1-l0",
          "title": "Installing Required Tools",
          "duration": "15 mins",
          "type": "video"
        },
        {
          "id": "1-s1-l1",
          "title": "Project Scaffolding",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "1-s1-l2",
          "title": "Configuration & Environment Variables",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "1-s1-l3",
          "title": "Initial Git Repository Setup",
          "duration": "20 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Tailwind Setup",
      "lectures": 3,
      "duration": "55m",
      "lessons": [
        {
          "id": "1-s2-l0",
          "title": "Installing & Configuring Tailwind CSS",
          "duration": "15 mins",
          "type": "video"
        },
        {
          "id": "1-s2-l1",
          "title": "Building the Design System",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "1-s2-l2",
          "title": "Responsive Layout Fundamentals",
          "duration": "15 mins",
          "type": "article"
        }
      ]
    },
    {
      "title": "Frontend Project",
      "lectures": 5,
      "duration": "3h 10m",
      "lessons": [
        {
          "id": "1-s3-l0",
          "title": "Component Architecture Planning",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "1-s3-l1",
          "title": "Building the UI Components",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "1-s3-l2",
          "title": "State Management Integration",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "1-s3-l3",
          "title": "API Integration & Data Fetching",
          "duration": "50 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "1-s3-l4",
          "title": "Testing & Error Handling",
          "duration": "40 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Backend Project",
      "lectures": 4,
      "duration": "2h 45m",
      "lessons": [
        {
          "id": "1-s4-l0",
          "title": "Server Setup & Routing",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "1-s4-l1",
          "title": "Database Models & Migrations",
          "duration": "45 mins",
          "type": "article"
        },
        {
          "id": "1-s4-l2",
          "title": "Authentication & Authorization",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "1-s4-l3",
          "title": "Deploying the Backend",
          "duration": "40 mins",
          "type": "video"
        }
      ]
    },
    {
      "title": "Payment Integration",
      "lectures": 3,
      "duration": "1h 30m",
      "lessons": [
        {
          "id": "1-s5-l0",
          "title": "Payment Gateway Setup",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "1-s5-l1",
          "title": "Processing Payments Securely",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "1-s5-l2",
          "title": "Webhook Handling & Edge Cases",
          "duration": "30 mins",
          "type": "article"
        }
      ]
    },
    {
      "title": "Project Deployment",
      "lectures": 3,
      "duration": "1h 15m",
      "lessons": [
        {
          "id": "1-s6-l0",
          "title": "Preparing for Production",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "1-s6-l1",
          "title": "CI/CD Pipeline Setup",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "1-s6-l2",
          "title": "Monitoring & Analytics",
          "duration": "25 mins",
          "type": "video"
        }
      ]
    }
  ],
  "2": [
    {
      "title": "Project Introduction",
      "lectures": 3,
      "duration": "40m",
      "lessons": [
        {
          "id": "2-s0-l0",
          "title": "Course Roadmap — AI Background Removal SaaS",
          "duration": "10 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "2-s0-l1",
          "title": "How Image Segmentation Works Under the Hood",
          "duration": "18 mins",
          "type": "video"
        },
        {
          "id": "2-s0-l2",
          "title": "Tools & Accounts You'll Need",
          "duration": "12 mins",
          "type": "resource"
        }
      ]
    },
    {
      "title": "Project Setup",
      "lectures": 4,
      "duration": "1h 35m",
      "lessons": [
        {
          "id": "2-s1-l0",
          "title": "Scaffolding the React App",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "2-s1-l1",
          "title": "File Structure & Shared UI Kit",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "2-s1-l2",
          "title": "Environment & API Keys",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "2-s1-l3",
          "title": "Seed Data & Local State",
          "duration": "30 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Image Upload & Processing",
      "lectures": 4,
      "duration": "2h 20m",
      "lessons": [
        {
          "id": "2-s2-l0",
          "title": "Upload UX & Client-side Validation",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "2-s2-l1",
          "title": "Optimizing Images Before Upload",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "2-s2-l2",
          "title": "Queueing Jobs for Processing",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "2-s2-l3",
          "title": "Retrieving & Serving Processed Images",
          "duration": "30 mins",
          "type": "article"
        }
      ]
    },
    {
      "title": "Vision API Integration",
      "lectures": 5,
      "duration": "3h 5m",
      "lessons": [
        {
          "id": "2-s3-l0",
          "title": "Choosing a Vision Provider",
          "duration": "25 mins",
          "type": "article"
        },
        {
          "id": "2-s3-l1",
          "title": "Building the Segmentation Service",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "2-s3-l2",
          "title": "Handling Rate Limits & Retries",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "2-s3-l3",
          "title": "Swapping Providers with Minimal Code",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "2-s3-l4",
          "title": "Processing Pipeline Lab",
          "duration": "45 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Batch Jobs & Webhooks",
      "lectures": 4,
      "duration": "2h 35m",
      "lessons": [
        {
          "id": "2-s4-l0",
          "title": "Designing the Job Queue",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "2-s4-l1",
          "title": "Worker Implementation & Concurrency",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "2-s4-l2",
          "title": "Webhook Callbacks to the Client",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "2-s4-l3",
          "title": "Failure Recovery & Dead-letter Queues",
          "duration": "40 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Subscription Billing",
      "lectures": 2,
      "duration": "1h 10m",
      "lessons": [
        {
          "id": "2-s5-l0",
          "title": "Pricing Tiers & Free Usage Limits",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "2-s5-l1",
          "title": "Stripe Subscriptions & Checkout",
          "duration": "40 mins",
          "type": "video"
        }
      ]
    }
  ],
  "3": [
    {
      "title": "Core Lesson",
      "lectures": 6,
      "duration": "3h 15m",
      "lessons": [
        {
          "id": "3-s0-l0",
          "title": "React Router Complete Course — One Video",
          "duration": "45 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "3-s0-l1",
          "title": "Project Setup & Tooling",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "3-s0-l2",
          "title": "Router Basics: Browser vs Memory",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "3-s0-l3",
          "title": "Routes & Route Matching",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "3-s0-l4",
          "title": "Link & NavLink Components",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "3-s0-l5",
          "title": "Route Parameters Deep Dive",
          "duration": "30 mins",
          "type": "video"
        }
      ]
    },
    {
      "title": "Written Notes & Cheatsheet",
      "lectures": 6,
      "duration": "2h 20m",
      "lessons": [
        {
          "id": "3-s1-l0",
          "title": "Routing Concepts Explained in Text",
          "duration": "10 mins",
          "type": "article"
        },
        {
          "id": "3-s1-l1",
          "title": "Common Patterns Cheatsheet",
          "duration": "10 mins",
          "type": "resource"
        },
        {
          "id": "3-s1-l2",
          "title": "Layout Routes Explained",
          "duration": "30 mins",
          "type": "article"
        },
        {
          "id": "3-s1-l3",
          "title": "Outlet & Nested UI",
          "duration": "30 mins",
          "type": "article"
        },
        {
          "id": "3-s1-l4",
          "title": "Navigation & Redirects",
          "duration": "30 mins",
          "type": "resource"
        },
        {
          "id": "3-s1-l5",
          "title": "Route Guards & Auth",
          "duration": "30 mins",
          "type": "article"
        }
      ]
    },
    {
      "title": "Quiz & Practice",
      "lectures": 6,
      "duration": "2h 20m",
      "lessons": [
        {
          "id": "3-s2-l0",
          "title": "Routing Fundamentals Quiz",
          "duration": "10 mins",
          "type": "quiz"
        },
        {
          "id": "3-s2-l1",
          "title": "Build a Nested Layout Challenge",
          "duration": "10 mins",
          "type": "exercise"
        },
        {
          "id": "3-s2-l2",
          "title": "Dynamic Routes Lab",
          "duration": "30 mins",
          "type": "exercise"
        },
        {
          "id": "3-s2-l3",
          "title": "Protected Routes Challenge",
          "duration": "30 mins",
          "type": "exercise"
        },
        {
          "id": "3-s2-l4",
          "title": "Final Routing Quiz",
          "duration": "30 mins",
          "type": "quiz"
        },
        {
          "id": "3-s2-l5",
          "title": "Course Project: Mini Router App",
          "duration": "30 mins",
          "type": "project"
        }
      ]
    }
  ],
  "4": [
    {
      "title": "Foundations & Planning",
      "lectures": 4,
      "duration": "1h 50m",
      "lessons": [
        {
          "id": "4-s0-l0",
          "title": "Course Roadmap & App Overview",
          "duration": "20 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "4-s0-l1",
          "title": "Requirements & Feature Scope",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "4-s0-l2",
          "title": "Choosing the Stack",
          "duration": "30 mins",
          "type": "article"
        },
        {
          "id": "4-s0-l3",
          "title": "Data Modeling for an E-Commerce Store",
          "duration": "30 mins",
          "type": "video"
        }
      ]
    },
    {
      "title": "Product Catalog",
      "lectures": 5,
      "duration": "3h 20m",
      "lessons": [
        {
          "id": "4-s1-l0",
          "title": "REST API for Products",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "4-s1-l1",
          "title": "Catalog UI & Product Cards",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "4-s1-l2",
          "title": "Search, Filters & Sorting",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "4-s1-l3",
          "title": "Pagination & Performance",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "4-s1-l4",
          "title": "Catalog Feature Lab",
          "duration": "40 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Cart & Checkout",
      "lectures": 5,
      "duration": "3h 10m",
      "lessons": [
        {
          "id": "4-s2-l0",
          "title": "Cart State & Persistence",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "4-s2-l1",
          "title": "Checkout Flow & Form Validation",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "4-s2-l2",
          "title": "Address & Shipping Logic",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "4-s2-l3",
          "title": "Order Summary & Coupons",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "4-s2-l4",
          "title": "Checkout Lab",
          "duration": "45 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Payments & Orders",
      "lectures": 5,
      "duration": "3h 15m",
      "lessons": [
        {
          "id": "4-s3-l0",
          "title": "Payment Integration Setup",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "4-s3-l1",
          "title": "Processing Payments Securely",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "4-s3-l2",
          "title": "Order Creation & Inventory",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "4-s3-l3",
          "title": "Webhooks & Order Status",
          "duration": "40 mins",
          "type": "article"
        },
        {
          "id": "4-s3-l4",
          "title": "Payments Edge Cases",
          "duration": "40 mins",
          "type": "article"
        }
      ]
    },
    {
      "title": "Auth & Security",
      "lectures": 4,
      "duration": "2h 40m",
      "lessons": [
        {
          "id": "4-s4-l0",
          "title": "User Authentication & Sessions",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "4-s4-l1",
          "title": "Role-Based Access Control",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "4-s4-l2",
          "title": "Input Validation & Attack Prevention",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "4-s4-l3",
          "title": "Security Review Checklist",
          "duration": "35 mins",
          "type": "quiz"
        }
      ]
    },
    {
      "title": "Admin & Dashboard",
      "lectures": 4,
      "duration": "2h 30m",
      "lessons": [
        {
          "id": "4-s5-l0",
          "title": "Admin Product Management",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "4-s5-l1",
          "title": "Order Management & Fulfillment",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "4-s5-l2",
          "title": "Sales Analytics Dashboard",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "4-s5-l3",
          "title": "Admin Panel Lab",
          "duration": "30 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Deployment & Launch",
      "lectures": 4,
      "duration": "2h 20m",
      "lessons": [
        {
          "id": "4-s6-l0",
          "title": "Production Build & Environment Config",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "4-s6-l1",
          "title": "Deploying the Backend & Database",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "4-s6-l2",
          "title": "Deploying the Frontend",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "4-s6-l3",
          "title": "Going Live — Checklist & Wrap-Up",
          "duration": "35 mins",
          "type": "quiz"
        }
      ]
    }
  ],
  "5": [
    {
      "title": "Python Fundamentals",
      "lectures": 7,
      "duration": "4h 10m",
      "lessons": [
        {
          "id": "5-s0-l0",
          "title": "Setting Up Python & Jupyter",
          "duration": "25 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "5-s0-l1",
          "title": "Variables, Types & Control Flow",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "5-s0-l2",
          "title": "Functions & Modules",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "5-s0-l3",
          "title": "Working with Files",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "5-s0-l4",
          "title": "Python Fundamentals Exercises",
          "duration": "50 mins",
          "type": "exercise"
        },
        {
          "id": "5-s0-l5",
          "title": "Feature Engineering Essentials",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "5-s0-l6",
          "title": "Experiment Tracking & MLflow",
          "duration": "30 mins",
          "type": "video"
        }
      ]
    },
    {
      "title": "Data Wrangling with Pandas",
      "lectures": 7,
      "duration": "4h 40m",
      "lessons": [
        {
          "id": "5-s1-l0",
          "title": "Intro to NumPy & Arrays",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "5-s1-l1",
          "title": "DataFrames & Series",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "5-s1-l2",
          "title": "Cleaning & Missing Data",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "5-s1-l3",
          "title": "Grouping, Joining & Aggregation",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "5-s1-l4",
          "title": "Wrangling Practice Dataset",
          "duration": "40 mins",
          "type": "exercise"
        },
        {
          "id": "5-s1-l5",
          "title": "Handling Imbalanced Data",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "5-s1-l6",
          "title": "Capstone Project Kickoff",
          "duration": "30 mins",
          "type": "video"
        }
      ]
    },
    {
      "title": "Data Visualization",
      "lectures": 5,
      "duration": "3h",
      "lessons": [
        {
          "id": "5-s2-l0",
          "title": "Plotting with Matplotlib",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "5-s2-l1",
          "title": "Statistical Plots with Seaborn",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "5-s2-l2",
          "title": "Interactive Charts with Plotly",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "5-s2-l3",
          "title": "Visualization Best Practices",
          "duration": "35 mins",
          "type": "article"
        },
        {
          "id": "5-s2-l4",
          "title": "Model Deployment with FastAPI",
          "duration": "30 mins",
          "type": "video"
        }
      ]
    },
    {
      "title": "Machine Learning with scikit-learn",
      "lectures": 6,
      "duration": "3h 55m",
      "lessons": [
        {
          "id": "5-s3-l0",
          "title": "ML Concepts & Train/Test Splits",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "5-s3-l1",
          "title": "Regression Models",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "5-s3-l2",
          "title": "Classification Models",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "5-s3-l3",
          "title": "Model Evaluation & Tuning",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "5-s3-l4",
          "title": "Pipeline Quiz",
          "duration": "25 mins",
          "type": "quiz"
        },
        {
          "id": "5-s3-l5",
          "title": "Cross-Validation Strategies",
          "duration": "30 mins",
          "type": "video"
        }
      ]
    },
    {
      "title": "Project & Best Practices",
      "lectures": 5,
      "duration": "3h 5m",
      "lessons": [
        {
          "id": "5-s4-l0",
          "title": "Reproducible Data Projects",
          "duration": "35 mins",
          "type": "article"
        },
        {
          "id": "5-s4-l1",
          "title": "Version Control for Notebooks",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "5-s4-l2",
          "title": "Final Project — End-to-End Analysis",
          "duration": "60 mins",
          "type": "project"
        },
        {
          "id": "5-s4-l3",
          "title": "Course Wrap-Up & Next Steps",
          "duration": "30 mins",
          "type": "quiz"
        },
        {
          "id": "5-s4-l4",
          "title": "Hyperparameter Tuning with Optuna",
          "duration": "30 mins",
          "type": "video"
        }
      ]
    }
  ],
  "6": [
    {
      "title": "Design Foundations",
      "lectures": 4,
      "duration": "2h",
      "lessons": [
        {
          "id": "6-s0-l0",
          "title": "What Great Design Looks Like",
          "duration": "30 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "6-s0-l1",
          "title": "Typography, Color & Spacing",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "6-s0-l2",
          "title": "Visual Hierarchy & Layout",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "6-s0-l3",
          "title": "Design Critique Exercise",
          "duration": "25 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "User Research",
      "lectures": 4,
      "duration": "2h 20m",
      "lessons": [
        {
          "id": "6-s1-l0",
          "title": "Planning User Interviews",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "6-s1-l1",
          "title": "Synthesizing Research Findings",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "6-s1-l2",
          "title": "Personas & User Journeys",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "6-s1-l3",
          "title": "Research Methods Reference",
          "duration": "30 mins",
          "type": "article"
        }
      ]
    },
    {
      "title": "Wireframing & Prototyping",
      "lectures": 4,
      "duration": "2h 30m",
      "lessons": [
        {
          "id": "6-s2-l0",
          "title": "Low-Fidelity Wireframes in Figma",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "6-s2-l1",
          "title": "High-Fidelity Mockups",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "6-s2-l2",
          "title": "Interactive Prototypes",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "6-s2-l3",
          "title": "Prototype Usability Test",
          "duration": "35 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Design Systems",
      "lectures": 5,
      "duration": "3h 5m",
      "lessons": [
        {
          "id": "6-s3-l0",
          "title": "Design Tokens & Variables",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "6-s3-l1",
          "title": "Component Libraries",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "6-s3-l2",
          "title": "Accessible Components",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "6-s3-l3",
          "title": "Documentation & Handoff",
          "duration": "35 mins",
          "type": "article"
        },
        {
          "id": "6-s3-l4",
          "title": "Design System Build Lab",
          "duration": "35 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Case Study & Portfolio",
      "lectures": 3,
      "duration": "1h 55m",
      "lessons": [
        {
          "id": "6-s4-l0",
          "title": "Structuring a Case Study",
          "duration": "30 mins",
          "type": "article"
        },
        {
          "id": "6-s4-l1",
          "title": "Presenting Research & Decisions",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "6-s4-l2",
          "title": "Final Case Study Project",
          "duration": "50 mins",
          "type": "project"
        }
      ]
    }
  ],
  "7": [
    {
      "title": "Strategy Foundations",
      "lectures": 4,
      "duration": "1h 40m",
      "lessons": [
        {
          "id": "7-s0-l0",
          "title": "Marketing Strategy Fundamentals",
          "duration": "25 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "7-s0-l1",
          "title": "Defining Goals & KPIs",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "7-s0-l2",
          "title": "Target Personas & Positioning",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "7-s0-l3",
          "title": "Strategy Worksheet",
          "duration": "25 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Campaign Channels",
      "lectures": 4,
      "duration": "1h 40m",
      "lessons": [
        {
          "id": "7-s1-l0",
          "title": "Paid Ads Overview",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "7-s1-l1",
          "title": "Organic & SEO Basics",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "7-s1-l2",
          "title": "Email Marketing",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "7-s1-l3",
          "title": "Channel Planning Exercise",
          "duration": "25 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Analytics & Attribution",
      "lectures": 4,
      "duration": "1h 50m",
      "lessons": [
        {
          "id": "7-s2-l0",
          "title": "Setting Up Analytics",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "7-s2-l1",
          "title": "Reading the Dashboard",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "7-s2-l2",
          "title": "Attribution Models Explained",
          "duration": "25 mins",
          "type": "article"
        },
        {
          "id": "7-s2-l3",
          "title": "ROI Calculation Lab",
          "duration": "30 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Optimization & Growth",
      "lectures": 4,
      "duration": "1h 40m",
      "lessons": [
        {
          "id": "7-s3-l0",
          "title": "A/B Testing Fundamentals",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "7-s3-l1",
          "title": "Conversion Rate Optimization",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "7-s3-l2",
          "title": "Growth Loops & Retention",
          "duration": "25 mins",
          "type": "article"
        },
        {
          "id": "7-s3-l3",
          "title": "Optimization Strategy Quiz",
          "duration": "25 mins",
          "type": "quiz"
        }
      ]
    }
  ],
  "8": [
    {
      "title": "API Design Fundamentals",
      "lectures": 4,
      "duration": "2h 20m",
      "lessons": [
        {
          "id": "8-s0-l0",
          "title": "REST Principles & Versioning",
          "duration": "35 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "8-s0-l1",
          "title": "Designing Resource Endpoints",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "8-s0-l2",
          "title": "Validation & Error Handling",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "8-s0-l3",
          "title": "API Documentation with OpenAPI",
          "duration": "35 mins",
          "type": "article"
        }
      ]
    },
    {
      "title": "Security & Auth",
      "lectures": 5,
      "duration": "3h 15m",
      "lessons": [
        {
          "id": "8-s1-l0",
          "title": "Authentication Strategies",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "8-s1-l1",
          "title": "Authorization & Roles",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "8-s1-l2",
          "title": "Rate Limiting & Throttling",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "8-s1-l3",
          "title": "Input Sanitization & OWASP",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "8-s1-l4",
          "title": "Security Review Lab",
          "duration": "35 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Data, Caching & Background Jobs",
      "lectures": 5,
      "duration": "3h 20m",
      "lessons": [
        {
          "id": "8-s2-l0",
          "title": "PostgreSQL Integration",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "8-s2-l1",
          "title": "Query Optimization",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "8-s2-l2",
          "title": "Redis Caching Patterns",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "8-s2-l3",
          "title": "Background Jobs & Queues",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "8-s2-l4",
          "title": "Caching Lab",
          "duration": "35 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Real-Time Features",
      "lectures": 4,
      "duration": "2h 30m",
      "lessons": [
        {
          "id": "8-s3-l0",
          "title": "WebSockets & Events",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "8-s3-l1",
          "title": "Real-Time Notifications",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "8-s3-l2",
          "title": "Scaling Connections",
          "duration": "35 mins",
          "type": "article"
        },
        {
          "id": "8-s3-l3",
          "title": "Real-Time Feature Lab",
          "duration": "35 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Observability & Testing",
      "lectures": 4,
      "duration": "2h 30m",
      "lessons": [
        {
          "id": "8-s4-l0",
          "title": "Structured Logging",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "8-s4-l1",
          "title": "Metrics & Error Tracking",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "8-s4-l2",
          "title": "Unit, Integration & Contract Tests",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "8-s4-l3",
          "title": "Testing Practice Lab",
          "duration": "35 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Production Deployment",
      "lectures": 4,
      "duration": "2h 25m",
      "lessons": [
        {
          "id": "8-s5-l0",
          "title": "Containerizing with Docker",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "8-s5-l1",
          "title": "Deploying & Scaling",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "8-s5-l2",
          "title": "Zero-Downtime Releases",
          "duration": "30 mins",
          "type": "article"
        },
        {
          "id": "8-s5-l3",
          "title": "Deployment & Wrap-Up Quiz",
          "duration": "35 mins",
          "type": "quiz"
        }
      ]
    }
  ],
  "9": [
    {
      "title": "Dart & Flutter Basics",
      "lectures": 5,
      "duration": "3h 20m",
      "lessons": [
        {
          "id": "9-s0-l0",
          "title": "Course Roadmap & App Demo",
          "duration": "25 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "9-s0-l1",
          "title": "Setting Up Flutter",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "9-s0-l2",
          "title": "Dart Language Essentials",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "9-s0-l3",
          "title": "Your First Flutter App",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "9-s0-l4",
          "title": "Dart Basics Quiz",
          "duration": "35 mins",
          "type": "quiz"
        }
      ]
    },
    {
      "title": "Widgets & Layouts",
      "lectures": 5,
      "duration": "3h 15m",
      "lessons": [
        {
          "id": "9-s1-l0",
          "title": "Understanding the Widget Tree",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "9-s1-l1",
          "title": "Layout Widgets & Constraints",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "9-s1-l2",
          "title": "Styling & Themes",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "9-s1-l3",
          "title": "Forms & Input",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "9-s1-l4",
          "title": "Widget Building Lab",
          "duration": "40 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "State Management",
      "lectures": 5,
      "duration": "3h 25m",
      "lessons": [
        {
          "id": "9-s2-l0",
          "title": "State Management Concepts",
          "duration": "35 mins",
          "type": "article"
        },
        {
          "id": "9-s2-l1",
          "title": "Riverpod Fundamentals",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "9-s2-l2",
          "title": "Async State & Streams",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "9-s2-l3",
          "title": "Navigation & Routing",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "9-s2-l4",
          "title": "State Management Lab",
          "duration": "40 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Data & Networking",
      "lectures": 4,
      "duration": "2h 35m",
      "lessons": [
        {
          "id": "9-s3-l0",
          "title": "REST API Integration",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "9-s3-l1",
          "title": "JSON Parsing & Models",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "9-s3-l2",
          "title": "Local Storage & SQLite",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "9-s3-l3",
          "title": "Push Notifications",
          "duration": "40 mins",
          "type": "video"
        }
      ]
    },
    {
      "title": "Publishing",
      "lectures": 4,
      "duration": "2h 20m",
      "lessons": [
        {
          "id": "9-s4-l0",
          "title": "Preparing for Release",
          "duration": "35 mins",
          "type": "article"
        },
        {
          "id": "9-s4-l1",
          "title": "Building for Android",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "9-s4-l2",
          "title": "Building for iOS (with a Mac)",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "9-s4-l3",
          "title": "Final App Project & Wrap-Up",
          "duration": "35 mins",
          "type": "project"
        }
      ]
    }
  ],
  "10": [
    {
      "title": "Cloud & AWS Foundations",
      "lectures": 5,
      "duration": "3h 10m",
      "lessons": [
        {
          "id": "10-s0-l0",
          "title": "Cloud Computing Concepts",
          "duration": "35 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "10-s0-l1",
          "title": "AWS Account & IAM",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "10-s0-l2",
          "title": "Regions, AZs & VPC Basics",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "10-s0-l3",
          "title": "Free Tier & Cost Awareness",
          "duration": "30 mins",
          "type": "article"
        },
        {
          "id": "10-s0-l4",
          "title": "AWS Foundations Quiz",
          "duration": "45 mins",
          "type": "quiz"
        }
      ]
    },
    {
      "title": "Compute & Storage",
      "lectures": 5,
      "duration": "3h 25m",
      "lessons": [
        {
          "id": "10-s1-l0",
          "title": "EC2 & Auto Scaling",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "10-s1-l1",
          "title": "Serverless with Lambda",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "10-s1-l2",
          "title": "S3 Storage & Lifecycle",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "10-s1-l3",
          "title": "Databases — RDS & DynamoDB",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "10-s1-l4",
          "title": "Storage & Compute Lab",
          "duration": "35 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Networking & Security",
      "lectures": 5,
      "duration": "3h 15m",
      "lessons": [
        {
          "id": "10-s2-l0",
          "title": "VPC Design & Subnetting",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "10-s2-l1",
          "title": "Security Groups & Load Balancers",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "10-s2-l2",
          "title": "DNS, CDN & Edge Caching",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "10-s2-l3",
          "title": "Shared Responsibility & Compliance",
          "duration": "35 mins",
          "type": "article"
        },
        {
          "id": "10-s2-l4",
          "title": "Security Architecture Quiz",
          "duration": "40 mins",
          "type": "quiz"
        }
      ]
    },
    {
      "title": "Infrastructure as Code",
      "lectures": 5,
      "duration": "3h 20m",
      "lessons": [
        {
          "id": "10-s3-l0",
          "title": "Terraform Fundamentals",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "10-s3-l1",
          "title": "State, Modules & Remote Backends",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "10-s3-l2",
          "title": "Provisioning VPC & Compute with Code",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "10-s3-l3",
          "title": "Plan & Apply Workflows",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "10-s3-l4",
          "title": "IaC Lab",
          "duration": "35 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "CI/CD Pipelines",
      "lectures": 5,
      "duration": "3h 5m",
      "lessons": [
        {
          "id": "10-s4-l0",
          "title": "Continuous Integration Concepts",
          "duration": "35 mins",
          "type": "article"
        },
        {
          "id": "10-s4-l1",
          "title": "Building Pipelines with GitHub Actions",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "10-s4-l2",
          "title": "Automated Testing & Quality Gates",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "10-s4-l3",
          "title": "Deployments & Environments",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "10-s4-l4",
          "title": "Pipeline Build Lab",
          "duration": "35 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Containers & Kubernetes",
      "lectures": 5,
      "duration": "3h 25m",
      "lessons": [
        {
          "id": "10-s5-l0",
          "title": "Docker Fundamentals",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "10-s5-l1",
          "title": "Container Orchestration Overview",
          "duration": "35 mins",
          "type": "article"
        },
        {
          "id": "10-s5-l2",
          "title": "Kubernetes Pods, Deployments & Services",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "10-s5-l3",
          "title": "Helm & Production Clusters",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "10-s5-l4",
          "title": "Kubernetes Lab",
          "duration": "40 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Monitoring & Cost Optimization",
      "lectures": 5,
      "duration": "3h 5m",
      "lessons": [
        {
          "id": "10-s6-l0",
          "title": "Metrics, Logs & Tracing",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "10-s6-l1",
          "title": "Alarming & Incident Response",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "10-s6-l2",
          "title": "Cost Control & Budgets",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "10-s6-l3",
          "title": "Right-Sizing & Reserved Capacity",
          "duration": "35 mins",
          "type": "article"
        },
        {
          "id": "10-s6-l4",
          "title": "Final Project — Production Deployment",
          "duration": "40 mins",
          "type": "project"
        }
      ]
    }
  ],
  "11": [
    {
      "title": "Communication Fundamentals",
      "lectures": 4,
      "duration": "1h 20m",
      "lessons": [
        {
          "id": "11-s0-l0",
          "title": "Why Communication is a Leadership Skill",
          "duration": "20 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "11-s0-l1",
          "title": "Clarity & Active Listening",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "11-s0-l2",
          "title": "Writing Emails That Get Read",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "11-s0-l3",
          "title": "Communication Audit Exercise",
          "duration": "20 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Difficult Conversations",
      "lectures": 4,
      "duration": "1h 30m",
      "lessons": [
        {
          "id": "11-s1-l0",
          "title": "Preparing for the Conversation",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "11-s1-l1",
          "title": "The Feedback Sandwich, Revisited",
          "duration": "20 mins",
          "type": "article"
        },
        {
          "id": "11-s1-l2",
          "title": "Handling Pushback & Emotion",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "11-s1-l3",
          "title": "Roleplay a Difficult Conversation",
          "duration": "25 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Meetings & Presentations",
      "lectures": 4,
      "duration": "1h 30m",
      "lessons": [
        {
          "id": "11-s2-l0",
          "title": "Running Effective Meetings",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "11-s2-l1",
          "title": "One-on-Ones That Build Trust",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "11-s2-l2",
          "title": "Structuring a Presentation",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "11-s2-l3",
          "title": "Slides & Storytelling Checklist",
          "duration": "20 mins",
          "type": "resource"
        }
      ]
    },
    {
      "title": "Leadership & Feedback",
      "lectures": 4,
      "duration": "1h 30m",
      "lessons": [
        {
          "id": "11-s3-l0",
          "title": "Giving Feedback That Lands",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "11-s3-l1",
          "title": "Psychological Safety & Team Rituals",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "11-s3-l2",
          "title": "Leading Through Change",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "11-s3-l3",
          "title": "Leadership Reflection Quiz",
          "duration": "15 mins",
          "type": "quiz"
        }
      ]
    }
  ],
  "12": [
    {
      "title": "Blockchain & Solidity Basics",
      "lectures": 4,
      "duration": "2h 40m",
      "lessons": [
        {
          "id": "12-s0-l0",
          "title": "How Blockchains Work",
          "duration": "40 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "12-s0-l1",
          "title": "Ethereum & Smart Contract Fundamentals",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "12-s0-l2",
          "title": "Setting Up Remix & Hardhat",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "12-s0-l3",
          "title": "Your First Solidity Contract",
          "duration": "40 mins",
          "type": "video"
        }
      ]
    },
    {
      "title": "Smart Contract Development",
      "lectures": 5,
      "duration": "3h 10m",
      "lessons": [
        {
          "id": "12-s1-l0",
          "title": "Solidity Data Types & Functions",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "12-s1-l1",
          "title": "State Variables & Gas",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "12-s1-l2",
          "title": "Events, Modifiers & Errors",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "12-s1-l3",
          "title": "Inheritance & Interfaces",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "12-s1-l4",
          "title": "Contract Building Lab",
          "duration": "35 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Testing & Security",
      "lectures": 5,
      "duration": "3h 5m",
      "lessons": [
        {
          "id": "12-s2-l0",
          "title": "Unit Testing with Hardhat",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "12-s2-l1",
          "title": "Common Exploits — Reentrancy & More",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "12-s2-l2",
          "title": "Auditing & Safe Patterns",
          "duration": "40 mins",
          "type": "article"
        },
        {
          "id": "12-s2-l3",
          "title": "Testnet Deployment",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "12-s2-l4",
          "title": "Security Review Quiz",
          "duration": "25 mins",
          "type": "quiz"
        }
      ]
    },
    {
      "title": "DApps & Web3",
      "lectures": 4,
      "duration": "2h 35m",
      "lessons": [
        {
          "id": "12-s3-l0",
          "title": "Connecting to the Chain with Ethers.js",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "12-s3-l1",
          "title": "Wallets & Signatures",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "12-s3-l2",
          "title": "Building the DApp Frontend",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "12-s3-l3",
          "title": "DApp Integration Lab",
          "duration": "35 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Gas Optimization & Upgrades",
      "lectures": 4,
      "duration": "2h 30m",
      "lessons": [
        {
          "id": "12-s4-l0",
          "title": "Gas Optimization Techniques",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "12-s4-l1",
          "title": "Upgradeable Contracts",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "12-s4-l2",
          "title": "Final Project — Token & DApp",
          "duration": "50 mins",
          "type": "project"
        },
        {
          "id": "12-s4-l3",
          "title": "Course Wrap-Up & Resources",
          "duration": "20 mins",
          "type": "resource"
        }
      ]
    }
  ],
  "13": [
    {
      "title": "Getting Started",
      "lectures": 4,
      "duration": "1h",
      "lessons": [
        {
          "id": "13-s0-l0",
          "title": "How the Web Works",
          "duration": "15 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "13-s0-l1",
          "title": "Setting Up Your Tools",
          "duration": "15 mins",
          "type": "video"
        },
        {
          "id": "13-s0-l2",
          "title": "Writing Your First HTML Page",
          "duration": "15 mins",
          "type": "video"
        },
        {
          "id": "13-s0-l3",
          "title": "Course Setup Check",
          "duration": "15 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "HTML Fundamentals",
      "lectures": 5,
      "duration": "1h 40m",
      "lessons": [
        {
          "id": "13-s1-l0",
          "title": "Semantic HTML & Structure",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "13-s1-l1",
          "title": "Links, Images & Media",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "13-s1-l2",
          "title": "Forms & Inputs",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "13-s1-l3",
          "title": "Tables & Lists Done Right",
          "duration": "20 mins",
          "type": "article"
        },
        {
          "id": "13-s1-l4",
          "title": "HTML Practice Page",
          "duration": "20 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Styling with CSS",
      "lectures": 5,
      "duration": "1h 45m",
      "lessons": [
        {
          "id": "13-s2-l0",
          "title": "CSS Selectors & the Cascade",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "13-s2-l1",
          "title": "Colors, Fonts & Spacing",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "13-s2-l2",
          "title": "The Box Model",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "13-s2-l3",
          "title": "Custom Properties (Variables)",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "13-s2-l4",
          "title": "Styling Quiz",
          "duration": "25 mins",
          "type": "quiz"
        }
      ]
    },
    {
      "title": "Flexbox & Grid",
      "lectures": 5,
      "duration": "1h 40m",
      "lessons": [
        {
          "id": "13-s3-l0",
          "title": "Layouts with Flexbox",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "13-s3-l1",
          "title": "Layouts with CSS Grid",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "13-s3-l2",
          "title": "When to Use Which Layout",
          "duration": "15 mins",
          "type": "article"
        },
        {
          "id": "13-s3-l3",
          "title": "Card Layout Challenge",
          "duration": "25 mins",
          "type": "exercise"
        },
        {
          "id": "13-s3-l4",
          "title": "Page Layout Project",
          "duration": "20 mins",
          "type": "project"
        }
      ]
    },
    {
      "title": "Responsive & Accessibility",
      "lectures": 4,
      "duration": "1h 30m",
      "lessons": [
        {
          "id": "13-s4-l0",
          "title": "Mobile-First Responsive Design",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "13-s4-l1",
          "title": "Media Queries & Breakpoints",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "13-s4-l2",
          "title": "Accessible HTML & ARIA Basics",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "13-s4-l3",
          "title": "Accessibility Audit Exercise",
          "duration": "20 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Your First Website",
      "lectures": 4,
      "duration": "1h 30m",
      "lessons": [
        {
          "id": "13-s5-l0",
          "title": "Planning a Personal Site",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "13-s5-l1",
          "title": "Building the Portfolio Page",
          "duration": "30 mins",
          "type": "project"
        },
        {
          "id": "13-s5-l2",
          "title": "Publishing Your Site for Free",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "13-s5-l3",
          "title": "Next Steps & Wrap-Up",
          "duration": "15 mins",
          "type": "quiz"
        }
      ]
    }
  ],
  "14": [
    {
      "title": "Program Orientation",
      "lectures": 3,
      "duration": "1h",
      "lessons": [
        {
          "id": "14-s0-l0",
          "title": "Bootcamp Roadmap & Expectations",
          "duration": "15 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "14-s0-l1",
          "title": "How the Bootcamp Works",
          "duration": "20 mins",
          "type": "video"
        },
        {
          "id": "14-s0-l2",
          "title": "Setting Up Your Environment",
          "duration": "25 mins",
          "type": "resource"
        }
      ]
    },
    {
      "title": "Frontend with React",
      "lectures": 5,
      "duration": "5h",
      "lessons": [
        {
          "id": "14-s1-l0",
          "title": "HTML & CSS Foundations",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "14-s1-l1",
          "title": "Thinking in Components",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "14-s1-l2",
          "title": "State, Props & Events",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "14-s1-l3",
          "title": "Routing with React Router",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "14-s1-l4",
          "title": "UI Lab",
          "duration": "60 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Backend with Node & Express",
      "lectures": 5,
      "duration": "6h",
      "lessons": [
        {
          "id": "14-s2-l0",
          "title": "Node.js Basics",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "14-s2-l1",
          "title": "Building REST APIs",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "14-s2-l2",
          "title": "Database Integration",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "14-s2-l3",
          "title": "Authentication & Sessions",
          "duration": "45 mins",
          "type": "article"
        },
        {
          "id": "14-s2-l4",
          "title": "API Lab",
          "duration": "60 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Full-Stack Integration",
      "lectures": 5,
      "duration": "6h",
      "lessons": [
        {
          "id": "14-s3-l0",
          "title": "Connecting Frontend to API",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "14-s3-l1",
          "title": "Forms & Validation",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "14-s3-l2",
          "title": "Deployment Fundamentals",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "14-s3-l3",
          "title": "Payments & Checkout",
          "duration": "50 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "14-s3-l4",
          "title": "Capstone Kickoff",
          "duration": "55 mins",
          "type": "project"
        }
      ]
    },
    {
      "title": "Capstone Project",
      "lectures": 4,
      "duration": "8h",
      "lessons": [
        {
          "id": "14-s4-l0",
          "title": "Planning the Application",
          "duration": "90 mins",
          "type": "video"
        },
        {
          "id": "14-s4-l1",
          "title": "Building Core Features",
          "duration": "120 mins",
          "type": "exercise"
        },
        {
          "id": "14-s4-l2",
          "title": "Testing & Polish",
          "duration": "90 mins",
          "type": "exercise"
        },
        {
          "id": "14-s4-l3",
          "title": "Final Demo & Review",
          "duration": "60 mins",
          "type": "project"
        }
      ]
    },
    {
      "title": "Career & Next Steps",
      "lectures": 3,
      "duration": "2h",
      "lessons": [
        {
          "id": "14-s5-l0",
          "title": "Building Your Portfolio",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "14-s5-l1",
          "title": "Interview Preparation",
          "duration": "40 mins",
          "type": "article"
        },
        {
          "id": "14-s5-l2",
          "title": "Course Wrap-Up",
          "duration": "20 mins",
          "type": "quiz"
        }
      ]
    }
  ],
  "15": [
    {
      "title": "Term 1 — Foundations",
      "lectures": 5,
      "duration": "3h 10m",
      "lessons": [
        {
          "id": "15-s0-l0",
          "title": "Diploma Orientation",
          "duration": "20 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "15-s0-l1",
          "title": "Python & Jupyter Setup",
          "duration": "25 mins",
          "type": "video"
        },
        {
          "id": "15-s0-l2",
          "title": "Statistics Refresher",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "15-s0-l3",
          "title": "Data Wrangling with Pandas",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "15-s0-l4",
          "title": "Foundations Lab",
          "duration": "50 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Term 2 — Machine Learning",
      "lectures": 5,
      "duration": "3h 45m",
      "lessons": [
        {
          "id": "15-s1-l0",
          "title": "ML Workflow & Train/Test",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "15-s1-l1",
          "title": "Regression Models",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "15-s1-l2",
          "title": "Classification Models",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "15-s1-l3",
          "title": "Model Evaluation",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "15-s1-l4",
          "title": "Pipeline Quiz",
          "duration": "25 mins",
          "type": "quiz"
        }
      ]
    },
    {
      "title": "Term 3 — Data Visualization",
      "lectures": 4,
      "duration": "2h 30m",
      "lessons": [
        {
          "id": "15-s2-l0",
          "title": "Plotting with Matplotlib",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "15-s2-l1",
          "title": "Statistical Plots with Seaborn",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "15-s2-l2",
          "title": "Interactive Charts with Plotly",
          "duration": "35 mins",
          "type": "video"
        },
        {
          "id": "15-s2-l3",
          "title": "Visualization Best Practices",
          "duration": "35 mins",
          "type": "article"
        }
      ]
    },
    {
      "title": "Term 4 — Capstone",
      "lectures": 4,
      "duration": "3h",
      "lessons": [
        {
          "id": "15-s3-l0",
          "title": "Capstone Brief & Dataset",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "15-s3-l1",
          "title": "Analysis & Modeling",
          "duration": "90 mins",
          "type": "project"
        },
        {
          "id": "15-s3-l2",
          "title": "Writing the Report",
          "duration": "45 mins",
          "type": "article"
        },
        {
          "id": "15-s3-l3",
          "title": "Capstone Defense",
          "duration": "30 mins",
          "type": "quiz"
        }
      ]
    },
    {
      "title": "Assessments & Feedback",
      "lectures": 3,
      "duration": "2h",
      "lessons": [
        {
          "id": "15-s4-l0",
          "title": "Graded Assignment 1",
          "duration": "40 mins",
          "type": "exercise"
        },
        {
          "id": "15-s4-l1",
          "title": "Graded Assignment 2",
          "duration": "40 mins",
          "type": "exercise"
        },
        {
          "id": "15-s4-l2",
          "title": "Peer Review Workshop",
          "duration": "40 mins",
          "type": "resource"
        }
      ]
    },
    {
      "title": "Program Wrap-Up",
      "lectures": 2,
      "duration": "1h",
      "lessons": [
        {
          "id": "15-s5-l0",
          "title": "Career Pathways in Data",
          "duration": "30 mins",
          "type": "video"
        },
        {
          "id": "15-s5-l1",
          "title": "Next Steps & Alumni",
          "duration": "30 mins",
          "type": "quiz"
        }
      ]
    }
  ],
  "16": [
    {
      "title": "Term 1 — Quantitative Foundations",
      "lectures": 5,
      "duration": "4h",
      "lessons": [
        {
          "id": "16-s0-l0",
          "title": "Program Orientation",
          "duration": "20 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "16-s0-l1",
          "title": "Advanced Statistics",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "16-s0-l2",
          "title": "Probability & Distributions",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "16-s0-l3",
          "title": "Linear Algebra for Analytics",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "16-s0-l4",
          "title": "Math Lab",
          "duration": "60 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Term 2 — Data Engineering",
      "lectures": 5,
      "duration": "4h",
      "lessons": [
        {
          "id": "16-s1-l0",
          "title": "Data Pipelines",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "16-s1-l1",
          "title": "SQL & Warehousing",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "16-s1-l2",
          "title": "ETL with Python",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "16-s1-l3",
          "title": "Data Quality & Governance",
          "duration": "40 mins",
          "type": "article"
        },
        {
          "id": "16-s1-l4",
          "title": "Pipeline Lab",
          "duration": "60 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Term 3 — Machine Learning",
      "lectures": 5,
      "duration": "4h 30m",
      "lessons": [
        {
          "id": "16-s2-l0",
          "title": "Supervised Learning",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "16-s2-l1",
          "title": "Unsupervised Learning",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "16-s2-l2",
          "title": "Feature Engineering",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "16-s2-l3",
          "title": "Model Deployment",
          "duration": "50 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "16-s2-l4",
          "title": "ML Lab",
          "duration": "60 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Term 4 — Business Intelligence",
      "lectures": 4,
      "duration": "3h",
      "lessons": [
        {
          "id": "16-s3-l0",
          "title": "Dashboards with Tableau",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "16-s3-l1",
          "title": "Storytelling with Data",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "16-s3-l2",
          "title": "Experimentation & A/B Tests",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "16-s3-l3",
          "title": "BI Case Study",
          "duration": "55 mins",
          "type": "project"
        }
      ]
    },
    {
      "title": "Term 5 — Applied Research",
      "lectures": 4,
      "duration": "3h",
      "lessons": [
        {
          "id": "16-s4-l0",
          "title": "Research Methods",
          "duration": "40 mins",
          "type": "article"
        },
        {
          "id": "16-s4-l1",
          "title": "Literature Review",
          "duration": "40 mins",
          "type": "exercise"
        },
        {
          "id": "16-s4-l2",
          "title": "Thesis Proposal",
          "duration": "50 mins",
          "type": "project"
        },
        {
          "id": "16-s4-l3",
          "title": "Advisor Check-In",
          "duration": "30 mins",
          "type": "resource"
        }
      ]
    },
    {
      "title": "Term 6 — Capstone & Defense",
      "lectures": 3,
      "duration": "3h",
      "lessons": [
        {
          "id": "16-s5-l0",
          "title": "Capstone Build",
          "duration": "90 mins",
          "type": "project"
        },
        {
          "id": "16-s5-l1",
          "title": "Writing the Thesis",
          "duration": "60 mins",
          "type": "article"
        },
        {
          "id": "16-s5-l2",
          "title": "Final Defense",
          "duration": "30 mins",
          "type": "quiz"
        }
      ]
    }
  ],
  "17": [
    {
      "title": "Year 1 — Strategy & Finance",
      "lectures": 5,
      "duration": "5h",
      "lessons": [
        {
          "id": "17-s0-l0",
          "title": "Program Orientation",
          "duration": "25 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "17-s0-l1",
          "title": "Competitive Strategy",
          "duration": "60 mins",
          "type": "video"
        },
        {
          "id": "17-s0-l2",
          "title": "Financial Statements",
          "duration": "55 mins",
          "type": "video"
        },
        {
          "id": "17-s0-l3",
          "title": "Capital Allocation",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "17-s0-l4",
          "title": "Strategy Case Lab",
          "duration": "70 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Year 1 — Leadership",
      "lectures": 4,
      "duration": "4h",
      "lessons": [
        {
          "id": "17-s1-l0",
          "title": "Leading Teams",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "17-s1-l1",
          "title": "Organizational Behavior",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "17-s1-l2",
          "title": "Change Management",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "17-s1-l3",
          "title": "Leadership Reflection",
          "duration": "40 mins",
          "type": "quiz"
        }
      ]
    },
    {
      "title": "Year 2 — Operations & Marketing",
      "lectures": 5,
      "duration": "5h",
      "lessons": [
        {
          "id": "17-s2-l0",
          "title": "Operations Management",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "17-s2-l1",
          "title": "Supply Chain",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "17-s2-l2",
          "title": "Marketing Strategy",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "17-s2-l3",
          "title": "Pricing & Growth",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "17-s2-l4",
          "title": "Go-to-Market Lab",
          "duration": "70 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Year 2 — Consulting Engagement",
      "lectures": 4,
      "duration": "4h",
      "lessons": [
        {
          "id": "17-s3-l0",
          "title": "Engagement Kickoff",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "17-s3-l1",
          "title": "Diagnosing the Client",
          "duration": "50 mins",
          "type": "project"
        },
        {
          "id": "17-s3-l2",
          "title": "Delivering Recommendations",
          "duration": "45 mins",
          "type": "project"
        },
        {
          "id": "17-s3-l3",
          "title": "Client Presentation",
          "duration": "45 mins",
          "type": "resource"
        }
      ]
    },
    {
      "title": "Year 3 — Capstone",
      "lectures": 4,
      "duration": "5h",
      "lessons": [
        {
          "id": "17-s4-l0",
          "title": "Capstone Brief",
          "duration": "40 mins",
          "type": "video"
        },
        {
          "id": "17-s4-l1",
          "title": "Strategic Analysis",
          "duration": "90 mins",
          "type": "project"
        },
        {
          "id": "17-s4-l2",
          "title": "Implementation Plan",
          "duration": "60 mins",
          "type": "project"
        },
        {
          "id": "17-s4-l3",
          "title": "Capstone Defense",
          "duration": "50 mins",
          "type": "quiz"
        }
      ]
    },
    {
      "title": "Peer Learning & Network",
      "lectures": 3,
      "duration": "2h",
      "lessons": [
        {
          "id": "17-s5-l0",
          "title": "Cohort Seminar",
          "duration": "40 mins",
          "type": "resource"
        },
        {
          "id": "17-s5-l1",
          "title": "Executive Coaching",
          "duration": "40 mins",
          "type": "resource"
        },
        {
          "id": "17-s5-l2",
          "title": "Alumni Panel",
          "duration": "40 mins",
          "type": "video"
        }
      ]
    }
  ],
  "18": [
    {
      "title": "Year 1 — Programming Foundations",
      "lectures": 5,
      "duration": "5h",
      "lessons": [
        {
          "id": "18-s0-l0",
          "title": "Program Orientation",
          "duration": "20 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "18-s0-l1",
          "title": "Intro to Programming",
          "duration": "60 mins",
          "type": "video"
        },
        {
          "id": "18-s0-l2",
          "title": "Data Structures I",
          "duration": "55 mins",
          "type": "video"
        },
        {
          "id": "18-s0-l3",
          "title": "Discrete Math",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "18-s0-l4",
          "title": "Foundations Lab",
          "duration": "70 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Year 2 — Systems & Algorithms",
      "lectures": 5,
      "duration": "6h",
      "lessons": [
        {
          "id": "18-s1-l0",
          "title": "Algorithms",
          "duration": "60 mins",
          "type": "video"
        },
        {
          "id": "18-s1-l1",
          "title": "Computer Architecture",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "18-s1-l2",
          "title": "Operating Systems",
          "duration": "55 mins",
          "type": "video"
        },
        {
          "id": "18-s1-l3",
          "title": "Networks",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "18-s1-l4",
          "title": "Systems Lab",
          "duration": "70 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Year 3 — Software Engineering",
      "lectures": 5,
      "duration": "5h",
      "lessons": [
        {
          "id": "18-s2-l0",
          "title": "Software Design",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "18-s2-l1",
          "title": "Databases",
          "duration": "55 mins",
          "type": "video"
        },
        {
          "id": "18-s2-l2",
          "title": "Web Development",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "18-s2-l3",
          "title": "Testing & CI",
          "duration": "45 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "18-s2-l4",
          "title": "SE Project",
          "duration": "80 mins",
          "type": "project"
        }
      ]
    },
    {
      "title": "Year 4 — Specialization & Capstone",
      "lectures": 4,
      "duration": "6h",
      "lessons": [
        {
          "id": "18-s3-l0",
          "title": "AI Elective",
          "duration": "60 mins",
          "type": "video"
        },
        {
          "id": "18-s3-l1",
          "title": "Security Elective",
          "duration": "55 mins",
          "type": "video"
        },
        {
          "id": "18-s3-l2",
          "title": "Capstone Build",
          "duration": "120 mins",
          "type": "project"
        },
        {
          "id": "18-s3-l3",
          "title": "Senior Defense",
          "duration": "50 mins",
          "type": "quiz"
        }
      ]
    },
    {
      "title": "Math & Science Core",
      "lectures": 4,
      "duration": "4h",
      "lessons": [
        {
          "id": "18-s4-l0",
          "title": "Calculus",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "18-s4-l1",
          "title": "Linear Algebra",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "18-s4-l2",
          "title": "Physics for Computing",
          "duration": "45 mins",
          "type": "video"
        },
        {
          "id": "18-s4-l3",
          "title": "Core Lab",
          "duration": "60 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Professional Skills",
      "lectures": 3,
      "duration": "2h",
      "lessons": [
        {
          "id": "18-s5-l0",
          "title": "Technical Writing",
          "duration": "40 mins",
          "type": "article"
        },
        {
          "id": "18-s5-l1",
          "title": "Team Collaboration",
          "duration": "40 mins",
          "type": "resource"
        },
        {
          "id": "18-s5-l2",
          "title": "Career Prep",
          "duration": "40 mins",
          "type": "quiz"
        }
      ]
    }
  ],
  "19": [
    {
      "title": "Year 1 — Research Methods",
      "lectures": 5,
      "duration": "5h",
      "lessons": [
        {
          "id": "19-s0-l0",
          "title": "Program Orientation",
          "duration": "25 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "19-s0-l1",
          "title": "Research Design",
          "duration": "55 mins",
          "type": "video"
        },
        {
          "id": "19-s0-l2",
          "title": "Literature Review",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "19-s0-l3",
          "title": "Quantitative Methods",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "19-s0-l4",
          "title": "Methods Lab",
          "duration": "60 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Year 2 — Advanced Analytics",
      "lectures": 5,
      "duration": "5h",
      "lessons": [
        {
          "id": "19-s1-l0",
          "title": "Advanced ML",
          "duration": "55 mins",
          "type": "video"
        },
        {
          "id": "19-s1-l1",
          "title": "Causal Inference",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "19-s1-l2",
          "title": "Bayesian Methods",
          "duration": "50 mins",
          "type": "video"
        },
        {
          "id": "19-s1-l3",
          "title": "Big Data Systems",
          "duration": "45 mins",
          "type": "video",
          "preview": true
        },
        {
          "id": "19-s1-l4",
          "title": "Analytics Lab",
          "duration": "60 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Year 3 — Dissertation Research",
      "lectures": 4,
      "duration": "5h",
      "lessons": [
        {
          "id": "19-s2-l0",
          "title": "Proposal Defense",
          "duration": "50 mins",
          "type": "project"
        },
        {
          "id": "19-s2-l1",
          "title": "Data Collection",
          "duration": "70 mins",
          "type": "exercise"
        },
        {
          "id": "19-s2-l2",
          "title": "Modeling & Analysis",
          "duration": "80 mins",
          "type": "project"
        },
        {
          "id": "19-s2-l3",
          "title": "Annual Review",
          "duration": "40 mins",
          "type": "resource"
        }
      ]
    },
    {
      "title": "Year 4 — Scholarly Writing",
      "lectures": 4,
      "duration": "4h",
      "lessons": [
        {
          "id": "19-s3-l0",
          "title": "Academic Writing",
          "duration": "50 mins",
          "type": "article"
        },
        {
          "id": "19-s3-l1",
          "title": "Peer Review Process",
          "duration": "45 mins",
          "type": "article"
        },
        {
          "id": "19-s3-l2",
          "title": "Submitting for Publication",
          "duration": "45 mins",
          "type": "project"
        },
        {
          "id": "19-s3-l3",
          "title": "Writing Workshop",
          "duration": "40 mins",
          "type": "exercise"
        }
      ]
    },
    {
      "title": "Year 5 — Defense & Dissemination",
      "lectures": 3,
      "duration": "4h",
      "lessons": [
        {
          "id": "19-s4-l0",
          "title": "Final Dissertation",
          "duration": "120 mins",
          "type": "project"
        },
        {
          "id": "19-s4-l1",
          "title": "Public Defense",
          "duration": "60 mins",
          "type": "quiz"
        },
        {
          "id": "19-s4-l2",
          "title": "Dissemination Plan",
          "duration": "60 mins",
          "type": "resource"
        }
      ]
    },
    {
      "title": "Faculty Colloquium",
      "lectures": 3,
      "duration": "2h",
      "lessons": [
        {
          "id": "19-s5-l0",
          "title": "Monthly Seminar",
          "duration": "40 mins",
          "type": "resource"
        },
        {
          "id": "19-s5-l1",
          "title": "Research Talk",
          "duration": "40 mins",
          "type": "resource"
        },
        {
          "id": "19-s5-l2",
          "title": "Community Engagement",
          "duration": "40 mins",
          "type": "video"
        }
      ]
    }
  ]
};

export default curriculum;
