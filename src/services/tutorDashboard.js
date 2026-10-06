import { studentRoster } from "src/data/roster";

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

export function getTutorStats() {
  return tutorStats;
}
export function getEarningsOverTime() {
  return earningsOverTime;
}
export function getStudentsOverTime() {
  return studentsOverTime;
}

/** Tutor-facing roster of enrolled learners across the tutor's courses. */
export function getStudentRoster() {
  return studentRoster;
}
