import { getCourseById } from "src/services/courses";
import * as enrollmentRepository from "src/services/repositories/enrollmentRepository";
import { getTasks } from "src/services/taskService";
import {
  ENROLLMENT_STATUS,
  TASK_STATUS,
} from "src/lib/statuses";
import { formatDueLabel } from "src/lib/format";
import { announcements } from "src/data/announcements";
import {
  isNotificationRead,
  markNotificationRead as markNotificationReadInStore,
  markAllRead as markAllReadInStore,
  countUnread as countUnreadInStore,
} from "src/services/stores/notificationsStore";
import { DEFAULT_STUDENT_ID } from "src/data/students";

export function getNotifications(studentId = DEFAULT_STUDENT_ID, filter = "all") {
  const nowMs = Date.now();
  const items = [];

  const enrollments = enrollmentRepository.findByStudent(studentId);

  enrollments.forEach((enrollment) => {
    const course = getCourseById(enrollment.courseId);
    if (!course) return;
    const courseAnnouncements = announcements[enrollment.courseId] ?? announcements.default;
    courseAnnouncements.forEach((a) => {
      items.push({
        id: a.id,
        type: "announcement",
        title: a.title,
        body: a.body,
        date: a.date,
        courseId: enrollment.courseId,
        courseTitle: course.title,
        read: isNotificationRead(a.id),
      });
    });
  });

  const tasks = getTasks(studentId, "all");
  tasks.forEach((task) => {
    if (task.status === TASK_STATUS.COMPLETED) return;
    if (!task.dueDate) return;
    const due = formatDueLabel(task.dueDate, nowMs);
    items.push({
      id: `deadline-${task.taskId}`,
      type: "deadline",
      title: due.overdue ? `Overdue: ${task.title}` : `Due soon: ${task.title}`,
      body: `${task.courseTitle} — ${due.text}`,
      date: task.dueDate,
      courseId: task.courseId,
      courseTitle: task.courseTitle,
      read: isNotificationRead(`deadline-${task.taskId}`),
    });
  });

  enrollments.forEach((enrollment) => {
    if (enrollment.enrollmentStatus !== ENROLLMENT_STATUS.COMPLETED) return;
    const course = getCourseById(enrollment.courseId);
    if (!course) return;
    const completionId = `completion-${enrollment.courseId}`;
    items.push({
      id: completionId,
      type: "completion",
      title: `Course completed: ${course.title}`,
      body: "Congratulations! You've finished this course. Download your certificate from your profile.",
      date: enrollment.lastAccessed,
      courseId: enrollment.courseId,
      courseTitle: course.title,
      read: isNotificationRead(completionId),
    });
  });

  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (filter === "all") return items;
  return items.filter((item) => item.type === filter);
}

export function markNotificationRead(id) {
  markNotificationReadInStore(id);
}

export function markAllNotificationsRead(studentId = DEFAULT_STUDENT_ID) {
  const ids = getNotifications(studentId, "all").map((n) => n.id);
  markAllReadInStore(ids);
}

export function getUnreadCount(studentId = DEFAULT_STUDENT_ID) {
  const ids = getNotifications(studentId, "all").map((n) => n.id);
  return countUnreadInStore(ids);
}