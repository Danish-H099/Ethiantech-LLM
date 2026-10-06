import { studentActivityEvents, activityByStudent } from "src/data/studentEngagement";
import { recordEvent, recordEvents } from "src/services/stores/activityStore";

export function getEvents(studentId) {
  return activityByStudent(studentId);
}

export function getEventsForCourse(studentId, courseId) {
  const numericId = Number(courseId);
  return studentActivityEvents.filter(
    (e) => e.studentId === studentId && e.courseId === numericId
  );
}

export function appendEvent(studentId, event) {
  return recordEvent({
    ...event,
    studentId,
    courseId: Number(event.courseId),
    timestamp: event.timestamp || new Date().toISOString(),
    estimatedHours: Number(event.estimatedHours) || 0,
  });
}

export function appendEvents(studentId, events) {
  return recordEvents(events.map((e) => ({ ...e, studentId })));
}