import { getCourseById } from "src/services/courses";
import { getLessonMedia } from "src/data/lessonMedia";
import { announcements } from "src/data/announcements";
import { resources } from "src/data/resources";

export function resolveLesson(courseId, lessonId) {
  if (!lessonId || typeof lessonId !== "string") return null;
  const match = lessonId.match(/^(\d+)-s(\d+)-l(\d+)$/);
  if (!match) return null;

  const course = getCourseById(courseId);
  if (!course) return null;
  if (Number(match[1]) !== Number(courseId)) return null;

  const sectionIndex = Number(match[2]);
  const lessonIndex = Number(match[3]);
  const sections = course.curriculum ?? [];
  const section = sections[sectionIndex];
  if (!section) return null;
  const lesson = section.lessons?.[lessonIndex];
  if (!lesson) return null;

  return {
    courseId: Number(courseId),
    sectionIndex,
    lessonIndex,
    lessonId,
    title: lesson.title,
    type: lesson.type,
    duration: lesson.duration,
    isPreview: lesson.preview || false,
    sectionTitle: section.title,
  };
}

export function getLessonMediaFor(lessonId) {
  return getLessonMedia(lessonId);
}

export function getCourseAnnouncementsFor(courseId) {
  return [...(announcements[courseId] ?? announcements.default)].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getCourseResourcesFor(courseId) {
  return {
    available: false,
    message:
      "Downloadable resources aren't available in this prototype. They'll be enabled in a later build.",
    items: resources[courseId] ?? resources.default,
  };
}