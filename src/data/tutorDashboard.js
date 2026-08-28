/**
 * Dashboard metrics for the logged-in tutor.
 * Exported as named values so tutor pages can import only what they need.
 */

export const tutorStats = [
  { label: "Total Earnings", value: "$62,025", change: "+12.5%", up: true, iconName: "DollarSign" },
  { label: "Total Students", value: "2,820", change: "+8.2%", up: true, iconName: "Users" },
  { label: "Active Courses", value: "5", change: "+1", up: true, iconName: "BookOpen" },
  { label: "Avg Rating", value: "4.5", change: "+0.2", up: true, iconName: "Star" },
];

export const earningsOverTime = [
  { month: "Jul", earnings: 4200 },
  { month: "Aug", earnings: 5800 },
  { month: "Sep", earnings: 7100 },
  { month: "Oct", earnings: 8400 },
  { month: "Nov", earnings: 10200 },
  { month: "Dec", earnings: 12565 },
];

export const studentsOverTime = [
  { month: "Jul", students: 320 },
  { month: "Aug", students: 480 },
  { month: "Sep", students: 540 },
  { month: "Oct", students: 610 },
  { month: "Nov", students: 720 },
  { month: "Dec", students: 565 },
];

// Function wrappers — pages should call these instead of importing arrays directly.
export function getTutorStats() {
  return tutorStats;
}
export function getEarningsOverTime() {
  return earningsOverTime;
}
export function getStudentsOverTime() {
  return studentsOverTime;
}