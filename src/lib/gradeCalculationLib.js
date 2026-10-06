import { getCourseById } from "src/services/courses";
import { buildLessonId } from "src/lib/lesson";
import { LESSON_STATUS, ENROLLMENT_STATUS } from "src/lib/statuses";

const TASK_LESSON_TYPES = ["exercise", "project"];

export function getGrades(studentId, allEnrollments, studentCourseGrades, getCourseProgress) {
  const grades = [];

  allEnrollments(studentId).forEach((enrollment) => {
    const course = getCourseById(enrollment.courseId);
    if (!course) return;
    const progress = getCourseProgress(studentId, enrollment.courseId);
    const scoreEntry = studentCourseGrades.find(
      (s) => s.studentId === studentId && s.courseId === enrollment.courseId
    );

    let quizCount = 0;
    let quizAttempted = 0;
    let submissionCount = 0;
    let submissionSubmitted = 0;

    (course.curriculum ?? []).forEach((section) => {
      (section.lessons || []).forEach((lesson) => {
        if (lesson.type === "quiz") {
          quizCount += 1;
        } else if (TASK_LESSON_TYPES.includes(lesson.type)) {
          submissionCount += 1;
        }
      });
    });

    grades.push({
      courseId: course.id,
      courseTitle: course.title,
      courseImage: course.image,
      instructorName: course.instructors?.[0]?.name || "Instructor",
      type: course.type,
      courseType: course.courseType,
      institutionName: course.institution?.name ?? null,
      certificate: course.certificate?.type ?? null,
      skills: course.skills ?? [],
      score: scoreEntry?.score ?? null,
      grade: scoreEntry?.grade ?? null,
      status: progress.derivedStatus,
      progress: progress.progress,
      quizCount,
      quizAttempted,
      submissionCount,
      submissionSubmitted,
    });
  });

  return grades;
}

export function getGradeDetail(studentId, courseId, allEnrollments, studentCourseGrades, getCourseProgress, getLessonProgress, getQuizAttempts, getQuizData, getSubmissionRecord) {
  const numericId = Number(courseId);
  const course = getCourseById(numericId);
  if (!course) return null;

  const enrollment = allEnrollments(studentId).find((e) => e.courseId === numericId);
  if (!enrollment) return null;

  const progress = getCourseProgress(studentId, numericId);
  const scoreEntry = studentCourseGrades.find(
    (s) => s.studentId === studentId && s.courseId === numericId
  );

  const quizzes = [];
  const submissions = [];

  (course.curriculum ?? []).forEach((section, sectionIndex) => {
    (section.lessons || []).forEach((lesson, lessonIndex) => {
      const lessonId = lesson.id || buildLessonId(numericId, sectionIndex, lessonIndex);
      if (lesson.type === "quiz") {
        const spec = getQuizData(lessonId);
        const attempts = getQuizAttempts(studentId, numericId, lessonId);
        const bestScore = attempts.length
          ? Math.max(...attempts.map((a) => a.score))
          : null;
        const passing = spec ? spec.passingScore : 0;
        quizzes.push({
          lessonId,
          title: lesson.title,
          bestScore,
          passed: bestScore !== null && bestScore >= passing,
          passingScore: passing,
          maxAttempts: spec?.maxAttempts ?? null,
          attemptCount: attempts.length,
          lastAttemptedAt: attempts.length
            ? attempts[attempts.length - 1].submittedAt
            : null,
        });
      } else if (TASK_LESSON_TYPES.includes(lesson.type)) {
        const rec = getLessonProgress(studentId, numericId, lessonId);
        const sub = getSubmissionRecord(studentId, numericId, lessonId);
        let subStatus;
        if (rec?.status === LESSON_STATUS.COMPLETED) subStatus = LESSON_STATUS.COMPLETED;
        else if (sub && sub.attempt && sub.submittedAt) subStatus = "submitted";
        else subStatus = "not-submitted";
        submissions.push({
          lessonId,
          title: lesson.title,
          type: lesson.type,
          status: subStatus,
          submittedAt: sub?.submittedAt ?? null,
        });
      }
    });
  });

  return {
    courseId: course.id,
    courseTitle: course.title,
    courseImage: course.image,
    instructorName: course.instructors?.[0]?.name || "Instructor",
    type: course.type,
    courseType: course.courseType,
    institutionName: course.institution?.name ?? null,
    certificate: course.certificate?.type ?? null,
    skills: course.skills ?? [],
    score: scoreEntry?.score ?? null,
    grade: scoreEntry?.grade ?? null,
    status: progress.derivedStatus,
    progress: progress.progress,
    quizzes,
    submissions,
    performanceCategory: null,
    categoryScore: null,
  };
}

export function getPerformanceByCategory(studentId, studentCourseGrades, getCourseById) {
  const categoryMap = new Map();

  studentCourseGrades
    .filter((g) => g.studentId === studentId)
    .forEach((grade) => {
      const course = getCourseById(grade.courseId);
      if (!course) return;
      const category = course.category ?? "General";
      const existing = categoryMap.get(category) || { total: 0, sum: 0, count: 0 };
      existing.total += 1;
      existing.sum += grade.score ?? 0;
      existing.count += 1;
      categoryMap.set(category, existing);
    });

  return [...categoryMap.entries()].map(([category, { sum, count }]) => ({
    studentId,
    category,
    score: count > 0 ? Math.round(sum / count) : 0,
  }));
}