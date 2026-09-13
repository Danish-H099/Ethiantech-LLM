export const LESSON_STATUS = Object.freeze({
  COMPLETED: "completed",
  IN_PROGRESS: "in-progress",
  NOT_STARTED: "not-started",
  LOCKED: "locked",
});

export const ENROLLMENT_STATUS = Object.freeze({
  COMPLETED: "Completed",
  IN_PROGRESS: "In Progress",
  NOT_STARTED: "Not Started",
  ENROLLED: "Enrolled",
});

export const TASK_STATUS = Object.freeze({
  NOT_STARTED: "not-started",
  DRAFTING: "drafting",
  SUBMITTED: "submitted",
  COMPLETED: "completed",
});

export const TASK_STATUS_LABEL = Object.freeze({
  [TASK_STATUS.NOT_STARTED]: "Not started",
  [TASK_STATUS.DRAFTING]: "Draft in progress",
  [TASK_STATUS.SUBMITTED]: "Submitted",
  [TASK_STATUS.COMPLETED]: "Completed",
});

export const TASK_ACTION_LABEL = Object.freeze({
  [TASK_STATUS.NOT_STARTED]: "Start",
  [TASK_STATUS.DRAFTING]: "Continue Draft",
  [TASK_STATUS.SUBMITTED]: "View Submission",
  [TASK_STATUS.COMPLETED]: "Revisit",
});

export const COURSE_PUBLISH_STATUS = Object.freeze({
  LIVE: "Live",
  DRAFT: "Draft",
});

export const USER_ACCOUNT_STATUS = Object.freeze({
  ACTIVE: "Active",
  INACTIVE: "Inactive",
});