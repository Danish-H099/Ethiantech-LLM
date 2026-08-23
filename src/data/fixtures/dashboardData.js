// Dashboard fixtures — mock activity/stat data that is not personally tied to
// the learner's enrollment. `learningActivity` powers the activity chart.
// `studentStats` is legacy dashboard copy (kept for compatibility).

export const studentStats = [
  { label: "Enrolled Courses", value: "6", change: "+2 this month", up: true, iconName: "BookOpen" },
  { label: "Completed", value: "2", change: "33% rate", up: true, iconName: "CheckCircle" },
  { label: "Hours Learned", value: "47.5", change: "+5.2 this week", up: true, iconName: "Clock" },
  { label: "Notes Written", value: "24", change: "+8 this week", up: true, iconName: "StickyNote" },
];

export const learningActivity = [
  { week: "W1", hours: 3.5 },
  { week: "W2", hours: 5.2 },
  { week: "W3", hours: 4.1 },
  { week: "W4", hours: 6.8 },
  { week: "W5", hours: 3.9 },
  { week: "W6", hours: 5.5 },
  { week: "W7", hours: 7.2 },
  { week: "W8", hours: 4.6 },
  { week: "W9", hours: 6.1 },
  { week: "W10", hours: 5.8 },
  { week: "W11", hours: 7.5 },
  { week: "W12", hours: 4.3 },
];
