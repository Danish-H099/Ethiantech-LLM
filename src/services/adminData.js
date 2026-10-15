import {
  getTutorOnboardingState,
  approveTutorOnboarding,
  rejectTutorOnboarding,
  TUTOR_STATUS,
} from "src/services/stores/tutorOnboarding";
import {
  getApplicationDecision,
  recordApplicationDecision,
} from "src/services/stores/applicationDecisions";

export const statCards = [
  { label: "Total Revenue", value: "$128,430", change: "+12.5%", up: true, iconName: "TrendingUp" },
  { label: "Total Students", value: "18,750", change: "+8.2%", up: true, iconName: "Users" },
  { label: "Active Courses", value: "12", change: "+2", up: true, iconName: "BookOpen" },
  { label: "New Enrollments", value: "342", change: "+15.3%", up: true, iconName: "UserPlus" },
];

export const monthlyRevenue = [
  { month: "Jan", revenue: 6200 },
  { month: "Feb", revenue: 7800 },
  { month: "Mar", revenue: 8400 },
  { month: "Apr", revenue: 9100 },
  { month: "May", revenue: 11200 },
  { month: "Jun", revenue: 12500 },
  { month: "Jul", revenue: 10800 },
  { month: "Aug", revenue: 13400 },
  { month: "Sep", revenue: 14200 },
  { month: "Oct", revenue: 12900 },
  { month: "Nov", revenue: 15600 },
  { month: "Dec", revenue: 16330 },
];

export const revenueByCategory = [
  { category: "Web Dev", revenue: 45200 },
  { category: "AI & ML", revenue: 28900 },
  { category: "Design", revenue: 18700 },
  { category: "Business", revenue: 12400 },
  { category: "Mobile", revenue: 14100 },
  { category: "Cloud", revenue: 9130 },
];

export const regionStudents = [
  { name: "North America", value: 6560, color: "#D62A91" },
  { name: "Europe", value: 4690, color: "#5F6FFF" },
  { name: "Asia", value: 4130, color: "#2563EB" },
  { name: "South America", value: 1870, color: "#F59E0B" },
  { name: "Africa", value: 940, color: "#10B981" },
  { name: "Oceania", value: 560, color: "#8B5CF6" },
];

export const instructors = [
  { id: 1, name: "Richard James", courses: 4, students: 5880, rating: 4.5, earnings: 48200 },
  { id: 2, name: "Sarah Chen", courses: 1, students: 3200, rating: 4.8, earnings: 22400 },
  { id: 3, name: "Emily Parker", courses: 1, students: 1890, rating: 4.7, earnings: 14700 },
  { id: 4, name: "Michael Torres", courses: 1, students: 1450, rating: 4.3, earnings: 8900 },
  { id: 5, name: "David Kim", courses: 1, students: 1120, rating: 4.6, earnings: 11200 },
  { id: 6, name: "Anna Kowalski", courses: 1, students: 1750, rating: 4.4, earnings: 11900 },
  { id: 7, name: "James Wilson", courses: 1, students: 890, rating: 4.9, earnings: 10900 },
  { id: 8, name: "Lisa Grant", courses: 1, students: 920, rating: 4.2, earnings: 5200 },
  { id: 9, name: "Alex Nguyen", courses: 1, students: 760, rating: 4.7, earnings: 7000 },
];

export const allCourses = [
  { id: 1, title: "Build Text to Image SaaS App in React JS", instructor: "Richard James", students: 1240, status: "Live", earnings: 12400, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop" },
  { id: 2, title: "Build AI BG Removal SaaS App in React JS", instructor: "Richard James", students: 980, status: "Live", earnings: 9800, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop" },
  { id: 3, title: "React Router Complete Course in One Video", instructor: "Richard James", students: 2100, status: "Live", earnings: 21000, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop" },
  { id: 4, title: "Build Full Stack E-Commerce App in React JS", instructor: "Richard James", students: 1560, status: "Live", earnings: 15600, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" },
  { id: 5, title: "Python for Data Science & Machine Learning", instructor: "Sarah Chen", students: 3200, status: "Live", earnings: 22400, image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop" },
  { id: 6, title: "UI/UX Design Masterclass 2024", instructor: "Emily Parker", students: 1890, status: "Live", earnings: 14700, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop" },
  { id: 7, title: "Digital Marketing Strategy & Analytics", instructor: "Michael Torres", students: 1450, status: "Draft", earnings: 8900, image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop" },
  { id: 8, title: "Advanced Node.js & Express APIs", instructor: "David Kim", students: 1120, status: "Live", earnings: 11200, image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1200&auto=format&fit=crop" },
  { id: 9, title: "Flutter Mobile App Development", instructor: "Anna Kowalski", students: 1750, status: "Live", earnings: 14100, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop" },
  { id: 10, title: "AWS Cloud Architecture & DevOps", instructor: "James Wilson", students: 890, status: "Live", earnings: 10900, image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=1200&auto=format&fit=crop" },
  { id: 11, title: "Business Communication & Leadership", instructor: "Lisa Grant", students: 920, status: "Draft", earnings: 5200, image: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1200&auto=format&fit=crop" },
  { id: 12, title: "Blockchain Development with Solidity", instructor: "Alex Nguyen", students: 760, status: "Live", earnings: 7000, image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop" },
];

export const allUsers = [
  { id: 1, name: "Richard James", email: "richard@ethiantech.com", role: "Instructor", joined: "Jan 15, 2024", status: "Active" },
  { id: 2, name: "Sarah Chen", email: "sarah@ethiantech.com", role: "Instructor", joined: "Feb 3, 2024", status: "Active" },
  { id: 3, name: "Emily Parker", email: "emily@ethiantech.com", role: "Instructor", joined: "Mar 12, 2024", status: "Active" },
  { id: 4, name: "Michael Torres", email: "michael@ethiantech.com", role: "Instructor", joined: "Apr 8, 2024", status: "Active" },
  { id: 5, name: "David Kim", email: "david@ethiantech.com", role: "Instructor", joined: "May 20, 2024", status: "Active" },
  { id: 6, name: "Anna Kowalski", email: "anna@ethiantech.com", role: "Instructor", joined: "Jun 1, 2024", status: "Active" },
  { id: 7, name: "James Wilson", email: "james@ethiantech.com", role: "Instructor", joined: "Jul 14, 2024", status: "Active" },
  { id: 8, name: "Lisa Grant", email: "lisa@ethiantech.com", role: "Instructor", joined: "Aug 22, 2024", status: "Inactive" },
  { id: 9, name: "Alex Nguyen", email: "alex@ethiantech.com", role: "Instructor", joined: "Sep 5, 2024", status: "Active" },
  { id: 10, name: "John Smith", email: "john@student.com", role: "Student", joined: "Jan 20, 2024", status: "Active" },
  { id: 11, name: "Maria Garcia", email: "maria@student.com", role: "Student", joined: "Feb 14, 2024", status: "Active" },
  { id: 12, name: "Wei Zhang", email: "wei@student.com", role: "Student", joined: "Mar 28, 2024", status: "Active" },
  { id: 13, name: "Aisha Patel", email: "aisha@student.com", role: "Student", joined: "Apr 11, 2024", status: "Active" },
  { id: 14, name: "Lucas Silva", email: "lucas@student.com", role: "Student", joined: "May 6, 2024", status: "Inactive" },
  { id: 15, name: "Emma Brown", email: "emma@student.com", role: "Student", joined: "Jun 19, 2024", status: "Active" },
];

/* ------------------------------------------------------------------
   Instructor application review queue.
   Seeded applicants (one per tier) wait alongside this browser's own
   tutor application once it is submitted. Decisions on the live
   application write straight to tutorOnboarding.js — the store the
   TutorRouteGuard reads — while seed decisions persist in
   src/services/stores/applicationDecisions.js.
*/
export const LIVE_APPLICATION_ID = "live";

/** Queue ids that represent this browser's own tutor application. */
export function isLiveApplicationId(id) {
  return id === LIVE_APPLICATION_ID;
}

// Seed records mirror the shape produced by the onboarding wizard:
// { tier, submittedAt, profile, verification }.
const pendingApplications = [
  {
    id: "seed-amara",
    tier: "standard",
    submittedAt: "2026-10-11T08:24:00.000Z",
    profile: {
      fullName: "Amara Okafor",
      headline: "Frontend developer teaching React from scratch",
      bio: "Self-taught developer turned bootcamp mentor. I teach React and modern CSS through project-based lessons.",
      subjects: ["Web Development", "Design"],
      experienceYears: "5",
      cvName: "",
    },
    verification: { notes: "" },
  },
  {
    id: "seed-leyla",
    tier: "verified",
    submittedAt: "2026-10-11T14:05:00.000Z",
    profile: {
      fullName: "Dr. Leyla Demir",
      headline: "Board-certified internal medicine physician & medical educator",
      bio: "Practicing physician of 12 years creating evidence-based clinical skills courses for junior doctors and medical students.",
      subjects: ["Healthcare", "Education"],
      experienceYears: "12",
      cvName: "leyla-demir-cv.pdf",
    },
    verification: {
      idType: "passport",
      idFileName: "demir-passport.jpg",
      degrees: [
        { institution: "Hacettepe University", qualification: "MD, Medicine", year: "2013", fileName: "md-diploma.pdf" },
      ],
      certifications: [
        { name: "Board Certification — Internal Medicine", issuer: "Turkish Medical Association", licenseNumber: "TIM-88214", expiry: "2028-12-31", fileName: "board-cert.pdf" },
      ],
      notes: "",
    },
  },
  {
    id: "seed-mensah",
    tier: "institutional",
    submittedAt: "2026-10-12T06:47:00.000Z",
    profile: {
      fullName: "Prof. Samuel Mensah",
      headline: "Dean of Computing, Kigali Institute of Technology",
      bio: "Leading our university's first online degree track. Our faculty will publish cloud and data engineering courses.",
      subjects: ["Cloud Computing", "Data Science"],
      experienceYears: "18",
      cvName: "mensah-faculty-bio.pdf",
    },
    verification: {
      idType: "national_id",
      idFileName: "mensah-nid.jpg",
      degrees: [
        { institution: "Carnegie Mellon University", qualification: "PhD, Computer Science", year: "2009", fileName: "phd-diploma.pdf" },
      ],
      certifications: [],
      organization: {
        name: "Kigali Institute of Technology",
        website: "https://kit.ac.rw",
        email: "partnerships@kit.ac.rw",
        authFileName: "kit-authorization-letter.pdf",
      },
      notes: "Publishing under our accredited computing faculty.",
    },
  },
];

/** Human-readable list of what each applicant submitted, for review cards. */
function summarizeDocuments(app) {
  const docs = [];
  const verification = app.verification ?? {};
  const profile = app.profile ?? {};
  if (verification.idType) {
    const typeLabels = { passport: "Passport", national_id: "National ID card", drivers_license: "Driver's license" };
    docs.push(`${typeLabels[verification.idType] ?? "Government ID"} (${verification.idFileName})`);
  }
  if (profile.cvName) docs.push(`CV / résumé (${profile.cvName})`);
  (verification.degrees ?? []).forEach((d) =>
    docs.push(`Degree — ${d.qualification}, ${d.institution}`)
  );
  (verification.certifications ?? []).forEach((c) =>
    docs.push(`Certification — ${c.name}, ${c.issuer}`)
  );
  if (verification.organization?.authFileName) {
    docs.push(`Authorization letter (${verification.organization.authFileName})`);
  }
  if (docs.length === 0) docs.push("No documents required for this track");
  return docs;
}

function toQueueRecord(app, { isLive = false } = {}) {
  return {
    id: isLive ? LIVE_APPLICATION_ID : app.id,
    isLive,
    tier: app.tier,
    submittedAt: app.submittedAt,
    name: app.profile?.fullName ?? "Unnamed applicant",
    headline: app.profile?.headline ?? "",
    subjects: app.profile?.subjects ?? [],
    organization: app.verification?.organization?.name ?? null,
    documents: summarizeDocuments(app),
  };
}

function toInstructorStat(id, name) {
  return { id, name, courses: 0, students: 0, rating: 0, earnings: 0 };
}

/** Applications waiting for review: seeds (undecided) + this browser's own. */
export function getPendingApplications() {
  const live = getTutorOnboardingState();
  const records = pendingApplications
    .filter((app) => !getApplicationDecision(app.id))
    .map((app) => toQueueRecord(app));
  if (live.status === TUTOR_STATUS.SUBMITTED) {
    records.unshift(toQueueRecord(live, { isLive: true }));
  }
  records.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  return records;
}

export function getPendingApplicationCount() {
  return getPendingApplications().length;
}

/** Approve an application — live or seeded — clearing it from the queue. */
export function approveApplication(id) {
  if (isLiveApplicationId(id)) return approveTutorOnboarding();
  return recordApplicationDecision(id, TUTOR_STATUS.APPROVED);
}

/** Reject an application with an applicant-facing note. */
export function rejectApplication(id, reviewNote = "") {
  if (isLiveApplicationId(id)) return rejectTutorOnboarding(reviewNote);
  return recordApplicationDecision(id, TUTOR_STATUS.REJECTED, reviewNote);
}

export function getAdminStats() {
  return statCards;
}
export function getMonthlyRevenue() {
  return monthlyRevenue;
}
export function getRevenueByCategory() {
  return revenueByCategory;
}
export function getRegionStudents() {
  return regionStudents;
}
export function getInstructors() {
  // Approved applicants (this browser's tutor, plus any seeded applicants an
  // admin cleared) are provisioned into the roster with zeroed stats.
  const approved = [];
  const live = getTutorOnboardingState();
  if (live.status === TUTOR_STATUS.APPROVED) {
    approved.push(toInstructorStat(LIVE_APPLICATION_ID, live.profile?.fullName ?? "New instructor"));
  }
  pendingApplications.forEach((app) => {
    const decision = getApplicationDecision(app.id);
    if (decision?.status === TUTOR_STATUS.APPROVED) {
      approved.push(toInstructorStat(app.id, app.profile?.fullName ?? "New instructor"));
    }
  });
  return [...instructors, ...approved];
}
export function getAllCourses() {
  return allCourses;
}
export function getAllUsers() {
  return allUsers;
}
