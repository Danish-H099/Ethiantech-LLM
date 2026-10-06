export const DAY_MS = 24 * 60 * 60 * 1000;

export function getISOWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

export function dayKey(ms) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function formatDayKey(ms) {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDayKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m, d).getTime();
}

export function getStreak(events, nowMs = Date.now()) {
  const activityDays = new Set();
  events.forEach((event) => {
    if (!event.timestamp) return;
    const ms = new Date(event.timestamp).getTime();
    if (!Number.isFinite(ms)) return;
    activityDays.add(dayKey(ms));
  });

  if (activityDays.size === 0) return null;

  const days = [...activityDays].map(parseDayKey).sort((a, b) => a - b);

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i += 1) {
    run = days[i] - days[i - 1] === DAY_MS ? run + 1 : 1;
    if (run > longest) longest = run;
  }

  const today = parseDayKey(dayKey(nowMs));
  const last = days[days.length - 1];
  let current = 0;
  if (last === today || last === today - DAY_MS) {
    current = 1;
    for (let i = days.length - 1; i > 0; i -= 1) {
      if (days[i] - days[i - 1] !== DAY_MS) break;
      current += 1;
    }
  }

  return { current, longest };
}

export function getStudyActivity(events, nowMs = Date.now()) {
  const now = new Date(nowMs);
  const year = now.getFullYear();
  const jan1 = new Date(year, 0, 1);
  const dec31 = new Date(year, 11, 31);

  const counts = new Map();

  events.forEach((event) => {
    if (!event.timestamp) return;
    const ms = new Date(event.timestamp).getTime();
    if (!Number.isFinite(ms)) return;
    if (ms < jan1.getTime() || ms > dec31.getTime() + DAY_MS - 1) return;
    const key = formatDayKey(ms);
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  const data = [];
  const cursor = new Date(jan1);
  while (cursor <= dec31) {
    const key = formatDayKey(cursor.getTime());
    data.push({ date: key, active: (counts.get(key) || 0) > 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  const totalDays = data.length;
  const activeDays = data.filter((d) => d.active).length;
  return { data, totalDays, activeDays };
}

export function getLearningActivity(events) {
  const filtered = events.filter(
    (e) =>
      e.eventType === "completion" ||
      e.eventType === "submission" ||
      e.eventType === "quiz"
  );
  if (filtered.length === 0) {
    return [];
  }
  const weekMap = new Map();
  const now = new Date();
  const currentWeek = getISOWeekNumber(now);
  const currentYear = now.getFullYear();
  filtered.forEach((event) => {
    const d = new Date(event.timestamp);
    const year = d.getFullYear();
    const weekNum = getISOWeekNumber(d);
    const weekOffset = (currentYear - year) * 52 + (currentWeek - weekNum);
    if (weekOffset < 0 || weekOffset >= 12) return;
    const weekIndex = 12 - weekOffset;
    const key = `W${weekIndex}`;
    const existing = weekMap.get(key) || 0;
    weekMap.set(key, existing + event.estimatedHours);
  });
  const activity = [];
  for (let i = 1; i <= 12; i++) {
    const key = `W${i}`;
    activity.push({
      week: key,
      hours: Math.round((weekMap.get(key) || 0) * 10) / 10,
    });
  }
  return activity;
}

export function getQuizMastery(studentId, allEnrollments, getCourseById, getQuizAttempts, getQuizData, buildLessonId) {
  const quizzes = [];

  allEnrollments(studentId).forEach((enrollment) => {
    const course = getCourseById(enrollment.courseId);
    if (!course) return;

    (course.curriculum ?? []).forEach((section, sectionIndex) => {
      section.lessons.forEach((lesson, lessonIndex) => {
        if (lesson.type !== "quiz") return;
        const lessonId = lesson.id || buildLessonId(course.id, sectionIndex, lessonIndex);
        const attempts = getQuizAttempts(studentId, enrollment.courseId, lessonId);
        if (attempts.length === 0) return;
        const spec = getQuizData(lessonId);
        const passing = spec ? spec.passingScore : 0;
        const first = attempts[0];
        quizzes.push({
          courseTitle: course.title,
          title: lesson.title,
          firstTryScore: first.score,
          passedFirstTry: first.score >= passing,
        });
      });
    });
  });

  const attempted = quizzes.length;
  const passedFirstTry = quizzes.filter((q) => q.passedFirstTry).length;
  const firstTryAccuracy = attempted
    ? Math.round(quizzes.reduce((sum, q) => sum + q.firstTryScore, 0) / attempted)
    : 0;

  return { attempted, passedFirstTry, firstTryAccuracy, quizzes };
}

export function getScoreTrend(studentId, allEnrollments, getCourseById, getQuizAttempts, getQuizData, buildLessonId, nowMs = Date.now()) {
  const now = new Date(nowMs);
  const currentWeek = getISOWeekNumber(now);
  const currentYear = now.getFullYear();

  const weekMap = new Map();

  allEnrollments(studentId).forEach((enrollment) => {
    const course = getCourseById(enrollment.courseId);
    if (!course) return;

    (course.curriculum ?? []).forEach((section, sectionIndex) => {
      section.lessons.forEach((lesson, lessonIndex) => {
        if (lesson.type !== "quiz") return;
        const lessonId = lesson.id || buildLessonId(course.id, sectionIndex, lessonIndex);
        const attempts = getQuizAttempts(studentId, enrollment.courseId, lessonId);
        if (attempts.length === 0) return;

        attempts.forEach((attempt) => {
          const submittedAt = attempt.submittedAt;
          if (!submittedAt) return;
          const d = new Date(submittedAt);
          if (!Number.isFinite(d.getTime())) return;

          const year = d.getFullYear();
          const weekNum = getISOWeekNumber(d);
          const weekOffset = (currentYear - year) * 52 + (currentWeek - weekNum);
          if (weekOffset < 0 || weekOffset >= 12) return;
          const weekIndex = 12 - weekOffset;
          const key = `W${weekIndex}`;

          const entry = weekMap.get(key) || { total: 0, count: 0 };
          entry.total += attempt.score;
          entry.count += 1;
          weekMap.set(key, entry);
        });
      });
    });
  });

  return [...weekMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([week, { total, count }]) => ({
      week,
      avgScore: count > 0 ? Math.round(total / count) : 0,
    }));
}

export function getSkillMastery(studentId, allEnrollments, getCourseById, getCourseProgress) {
  const skillMap = new Map();

  allEnrollments(studentId).forEach((enrollment) => {
    const course = getCourseById(enrollment.courseId);
    if (!course) return;
    const progress = getCourseProgress(studentId, enrollment.courseId);
    const progressRatio = progress.progress / 100;
    (course.skills ?? []).forEach((skill) => {
      const entry = skillMap.get(skill) || { mastered: 0, total: 0 };
      entry.total += 1;
      entry.mastered += progressRatio;
      skillMap.set(skill, entry);
    });
  });

  return [...skillMap.entries()]
    .map(([skill, { mastered, total }]) => ({
      skill,
      mastered: Math.round(mastered),
      total,
      percent: total ? Math.round((mastered / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total || a.percent - b.percent)
    .slice(0, 8);
}

export function getLearningPace(studentId, allEnrollments, getCourseById, getCourseProgress, getLearningActivity, nowMs = Date.now()) {
  const activity = getLearningActivity(studentId);
  const avgWeeklyHours = activity.length
    ? Math.round((activity.reduce((sum, a) => sum + a.hours, 0) / activity.length) * 10) / 10
    : 0;

  const pace = [];

  allEnrollments(studentId).forEach((enrollment) => {
    const course = getCourseById(enrollment.courseId);
    if (!course) return;
    const progress = getCourseProgress(studentId, enrollment.courseId);
    if (progress.derivedStatus !== "In Progress") return;
    const remainingHours = (course.hours || 0) * (1 - progress.progress / 100);
    const estWeeks = avgWeeklyHours > 0 ? remainingHours / avgWeeklyHours : null;
    const estCompletion = estWeeks != null ? new Date(nowMs + estWeeks * 7 * DAY_MS) : null;

    let paceStatus = "on-track";
    if (enrollment.dueDate) {
      const startMs = enrollment.lastAccessed ? new Date(enrollment.lastAccessed).getTime() : nowMs;
      const totalPlannedMs = new Date(enrollment.dueDate).getTime() - startMs;
      const elapsedMs = nowMs - startMs;
      const expectedProgress =
        totalPlannedMs > 0 ? Math.min(100, (elapsedMs / totalPlannedMs) * 100) : 0;
      if (progress.progress >= expectedProgress + 5) paceStatus = "ahead";
      else if (progress.progress <= expectedProgress - 5) paceStatus = "behind";
    }

    pace.push({
      courseId: course.id,
      courseTitle: course.title,
      progress: progress.progress,
      remainingHours: Math.round(remainingHours * 10) / 10,
      estWeeks: estWeeks != null ? Math.round(estWeeks * 10) / 10 : null,
      estCompletion,
      paceStatus,
      dueDate: enrollment.dueDate,
    });
  });

  return { avgWeeklyHours, pace };
}