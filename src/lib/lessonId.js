export function buildLessonId(courseId, sectionIndex, lessonIndex) {
  return `${courseId}-s${sectionIndex}-l${lessonIndex}`;
}
