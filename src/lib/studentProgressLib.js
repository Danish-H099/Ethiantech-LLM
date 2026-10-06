import { getCourseById } from "src/services/courses";
import { buildLessonId } from "src/lib/lesson";
import { LESSON_STATUS, ENROLLMENT_STATUS } from "src/lib/statuses";

export function lessonDurationHours(lessonId) {
  if (!lessonId || typeof lessonId !== "string") return 0.25;
  const match = lessonId.match(/^(\d+)-s(\d+)-l(\d+)$/);
  if (!match) return 0.25;
  const course = getCourseById(Number(match[1]));
  const lesson =
    course?.curriculum?.[Number(match[2])]?.lessons?.[Number(match[3])];
  const raw = lesson?.duration;
  if (!raw || typeof raw !== "string") return 0.25;
  const m = raw.match(/^(\d+)\s*mins?$/i);
  return m ? parseInt(m[1], 10) / 60 : 0.25;
}

export function buildFlatLessons(courseId, sectionsWithLessons) {
  const flat = [];
  sectionsWithLessons.forEach((section, sectionIndex) => {
    (section.lessons || []).forEach((lesson, lessonIndex) => {
      flat.push({
        lessonId: lesson.id || buildLessonId(courseId, sectionIndex, lessonIndex),
        isPreview: Boolean(lesson.preview),
        sectionIndex,
        lessonIndex,
      });
    });
  });
  return flat;
}

export function deriveStatuses(flatLessons, model) {
  const statuses = new Array(flatLessons.length);
  let prevNonPreviewIncomplete = false;
  let firstOpen = -1;
  for (let i = 0; i < flatLessons.length; i += 1) {
    const fl = flatLessons[i];
    const isCompleted = model.lessons[fl.lessonId]?.status === LESSON_STATUS.COMPLETED;
    if (isCompleted) {
      statuses[i] = LESSON_STATUS.COMPLETED;
    } else if (fl.isPreview) {
      statuses[i] = LESSON_STATUS.NOT_STARTED;
    } else if (!prevNonPreviewIncomplete) {
      statuses[i] = LESSON_STATUS.IN_PROGRESS;
      if (firstOpen === -1) firstOpen = i;
      prevNonPreviewIncomplete = true;
    } else {
      statuses[i] = LESSON_STATUS.LOCKED;
    }
  }
  return { statuses, firstOpen };
}

function resolveResumeTarget(flatLessons, statuses) {
  const firstIncomplete = statuses.findIndex(
    (s) => s !== LESSON_STATUS.COMPLETED && s !== LESSON_STATUS.LOCKED
  );
  if (firstIncomplete !== -1) return firstIncomplete;
  if (statuses.length > 0) return 0;
  return -1;
}

export function buildEnrolledCourseView(studentId, courseId, enrollment, course, getCourseModel, buildSeedModel) {
  const numericId = Number(courseId);

  if (!course) {
    return { status: "not-found", courseId: numericId };
  }

  if (!enrollment) {
    return { status: "not-enrolled", courseId: numericId };
  }

  const rawSections = course.curriculum ?? [];
  const sectionsWithLessons = rawSections.map((section) => ({
    ...section,
    lessons: (section.lessons || []).map((lesson) => ({ ...lesson })),
  }));

  const flatLessons = buildFlatLessons(numericId, sectionsWithLessons);
  const model =
    getCourseModel(numericId) || buildSeedModel(flatLessons, enrollment.completedLessons);
  const { statuses } = deriveStatuses(flatLessons, model);

  const totalLessons = flatLessons.length;
  const completedCount = statuses.filter((s) => s === LESSON_STATUS.COMPLETED).length;
  const completedNonPreview = flatLessons.filter(
    (fl, i) => statuses[i] === LESSON_STATUS.COMPLETED && !fl.isPreview
  ).length;
  const nonPreviewTotal = flatLessons.filter((fl) => !fl.isPreview).length;
  const courseCompleted =
    nonPreviewTotal > 0 && completedNonPreview === nonPreviewTotal;
  const progress =
    totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
  const derivedStatus = courseCompleted
    ? ENROLLMENT_STATUS.COMPLETED
    : completedNonPreview === 0
      ? ENROLLMENT_STATUS.NOT_STARTED
      : ENROLLMENT_STATUS.IN_PROGRESS;

  let cursor = 0;
  const sections = sectionsWithLessons.map((section, sectionIndex) => {
    const lessons = section.lessons.map((lesson) => {
      const status = statuses[cursor] || LESSON_STATUS.LOCKED;
      const lessonId = flatLessons[cursor].lessonId;
      cursor += 1;
      return { ...lesson, status, lessonId };
    });
    const completedCountSection = lessons.filter((l) => l.status === LESSON_STATUS.COMPLETED).length;
    return { ...section, sectionIndex, lessons, completedCount: completedCountSection };
  });

  const resumeIndex = resolveResumeTarget(flatLessons, statuses);
  const resumeTarget =
    resumeIndex !== -1
      ? {
          sectionIndex: flatLessons[resumeIndex].sectionIndex,
          lessonIndex: flatLessons[resumeIndex].lessonIndex,
          lessonId: flatLessons[resumeIndex].lessonId,
          title:
            sections[flatLessons[resumeIndex].sectionIndex].lessons[
              flatLessons[resumeIndex].lessonIndex
            ].title,
          type:
            sections[flatLessons[resumeIndex].sectionIndex].lessons[
              flatLessons[resumeIndex].lessonIndex
            ].type,
        }
      : null;

  return {
    status: "ready",
    courseId: numericId,
    course,
    id: course.id,
    title: course.title,
    image: course.image,
    instructorName: course.instructors?.[0]?.name || "Instructor",
    hours: course.hours ?? 0,
    category: course.category ?? null,
    enrollmentStatus: enrollment.enrollmentStatus,
    completedLessons: completedCount,
    totalLessons,
    progress,
    derivedStatus,
    courseCompleted,
    lastAccessed: enrollment.lastAccessed,
    dueDate: enrollment.dueDate ?? null,
    sections,
    resumeTarget,
    resumeSectionIndex: resumeTarget ? resumeTarget.sectionIndex : -1,
  };
}

export function materializeModel(courseId, getCourseById, getCourseModel, buildFlatLessons, buildSeedModel) {
  const numericId = Number(courseId);
  const course = getCourseById(numericId);
  if (!course) return null;
  const sectionsWithLessons = (course.curriculum ?? []).map((s) => ({
    ...s,
    lessons: (s.lessons || []).map((l) => ({ ...l })),
  }));
  const flat = buildFlatLessons(numericId, sectionsWithLessons);
  const stored = getCourseModel(numericId);
  return { model: stored || buildSeedModel(flat, 0), flat, courseId: numericId };
}