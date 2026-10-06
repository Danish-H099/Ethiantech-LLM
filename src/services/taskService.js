import { getCourseById } from "src/services/courses";
import * as enrollmentRepository from "src/services/repositories/enrollmentRepository";
import * as progressRepository from "src/services/repositories/progressRepository";
import * as exerciseRepository from "src/services/repositories/exerciseRepository";
import { LESSON_STATUS, TASK_STATUS } from "src/lib/statuses";
import { buildLessonId } from "src/lib/lesson";
import { formatDueLabel } from "src/lib/format";
import exercises from "src/data/exercises";
import { DEFAULT_STUDENT_ID } from "src/data/students";

const TASK_META = {
  "1-s1-l3": { estimatedEffort: "20 min" },
  "1-s3-l4": { estimatedEffort: "45 min" },
  "3-s2-l1": { estimatedEffort: "1 hr" },
  "3-s2-l5": { estimatedEffort: "3-4 hrs" },
  "5-s0-l4": { estimatedEffort: "30 min" },
  "5-s4-l2": { estimatedEffort: "End of course" },
  "6-s0-l3": { estimatedEffort: "1 hr" },
  "6-s4-l2": { estimatedEffort: "Portfolio" },
};

const TASK_LESSON_TYPES = ["exercise", "project"];

function isTaskDone(task) {
  return (
    task.status === TASK_STATUS.COMPLETED || task.status === TASK_STATUS.SUBMITTED
  );
}

function collectTaskLessonDefs(course) {
  const defs = [];
  (course.curriculum ?? []).forEach((section, sectionIndex) => {
    (section.lessons || []).forEach((lesson, lessonIndex) => {
      if (TASK_LESSON_TYPES.includes(lesson.type)) {
        defs.push({
          lessonId: lesson.id || buildLessonId(course.id, sectionIndex, lessonIndex),
          title: lesson.title,
          type: lesson.type,
          sectionTitle: section.title,
        });
      }
    });
  });
  return defs;
}

function deriveTaskStatus(courseId, lessonId, lessonRecord, submission) {
  if (lessonRecord?.status === TASK_STATUS.COMPLETED) {
    return {
      status: TASK_STATUS.COMPLETED,
      submittedAt: submission?.submittedAt ?? null,
      completedAt: lessonRecord?.completedAt ?? null,
    };
  }
  if (submission && submission.attempt && submission.submittedAt) {
    return { status: TASK_STATUS.SUBMITTED, submittedAt: submission.submittedAt, completedAt: null };
  }
  if (
    submission &&
    submission.draft &&
    typeof submission.draft.content === "string" &&
    submission.draft.content.trim().length > 0
  ) {
    return { status: TASK_STATUS.DRAFTING, submittedAt: null, completedAt: null };
  }
  return { status: TASK_STATUS.NOT_STARTED, submittedAt: null, completedAt: null };
}

function taskDueState(task, nowMs) {
  if (!task.dueDate) return null;
  const { overdue } = formatDueLabel(task.dueDate, nowMs);
  return { overdue };
}

function taskRank(task, nowMs) {
  if (isTaskDone(task)) return 3;
  const due = taskDueState(task, nowMs);
  if (!due) return 2;
  return due.overdue ? 1 : 0;
}

const dueTime = (task) => (task.dueDate ? new Date(task.dueDate).getTime() : Infinity);

function byDueAsc(a, b) {
  return dueTime(a) - dueTime(b);
}

function byRecencyDesc(a, b) {
  const ta = new Date(b.completedAt || b.submittedAt || 0).getTime();
  const tb = new Date(a.completedAt || a.submittedAt || 0).getTime();
  return ta - tb;
}

function applyTaskFilter(tasks, filter, nowMs) {
  let filtered;
  if (filter === "upcoming") {
    filtered = tasks.filter((t) => {
      const due = taskDueState(t, nowMs);
      return !isTaskDone(t) && due && !due.overdue;
    });
  } else if (filter === "overdue") {
    filtered = tasks.filter((t) => {
      const due = taskDueState(t, nowMs);
      return !isTaskDone(t) && due && due.overdue;
    });
  } else if (filter === LESSON_STATUS.COMPLETED) {
    filtered = tasks.filter(isTaskDone);
  } else {
    filtered = tasks.slice();
  }

  if (filter === LESSON_STATUS.COMPLETED) return filtered.slice().sort(byRecencyDesc);
  if (filter === "upcoming" || filter === "overdue") return filtered.slice().sort(byDueAsc);
  return filtered.slice().sort((a, b) => {
    const ra = taskRank(a, nowMs);
    const rb = taskRank(b, nowMs);
    if (ra !== rb) return ra - rb;
    return ra === 3 ? byRecencyDesc(a, b) : byDueAsc(a, b);
  });
}

export function getTasks(studentId = DEFAULT_STUDENT_ID, filter = "all") {
  const nowMs = Date.now();
  const tasks = [];

  const enrollments = enrollmentRepository.findByStudent(studentId);

  enrollments.forEach((enrollment) => {
    const course = getCourseById(enrollment.courseId);
    if (!course) return;
    const progress = progressRepository.getLessonProgressAll(studentId, enrollment.courseId);
    const defs = collectTaskLessonDefs(course);

    defs.forEach((def) => {
      const lessonRecord = progress.find((p) => p.lessonId === def.lessonId) || null;
      const submission = exerciseRepository.getSubmissionRecord(studentId, enrollment.courseId, def.lessonId);
      const { status, submittedAt, completedAt } = deriveTaskStatus(
        enrollment.courseId,
        def.lessonId,
        lessonRecord,
        submission
      );
      const meta = TASK_META[String(def.lessonId)] || {};

      tasks.push({
        taskId: def.lessonId,
        courseId: course.id,
        courseTitle: course.title,
        courseImage: course.image,
        instructorName: course.instructors?.[0]?.name || "Instructor",
        title: exercises[String(def.lessonId)]?.title || def.title,
        type: def.type,
        sectionTitle: def.sectionTitle,
        dueDate: enrollment.dueDate ?? null,
        status,
        submittedAt,
        completedAt,
        resumeUrl: `/student/course/${course.id}/play?lessonId=${def.lessonId}`,
        estimatedEffort: meta.estimatedEffort ?? null,
      });
    });
  });

  return applyTaskFilter(tasks, filter, nowMs);
}

export function getUpcomingDeadlines(studentId = DEFAULT_STUDENT_ID, limit = 5) {
  const due = getTasks(studentId, "all").filter((t) => !isTaskDone(t) && t.dueDate);
  due.sort(byDueAsc);
  return due.slice(0, limit);
}