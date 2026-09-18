import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { m as Motion, useReducedMotion } from "motion/react";
import {
  BarChart3,
  CalendarClock,
  Flame,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Target,
} from "lucide-react";


import ProgressRing from "src/components/ui/ProgressRing";
import { getIcon } from "src/components/ui/IconMap";
import CourseCard from "src/components/CourseCard";
import StudentEmptyState from "src/components/student/StudentEmptyState";
import { hideOnError } from "src/lib/assets";

import { CHART_ACCENTS } from "src/lib/chartConfig";
import { DEFAULT_STUDENT_ID } from "src/data/students";
import {
  getEnrolledCourses,
  getLearningActivity,
  getLearningPace,
  getRecommendedCourses,
  getStreak,
  getStudentProfile,
  getUpcomingDeadlines,
} from "src/services/studentRepository";
import { TASK_ACTION_LABEL, TASK_STATUS, TASK_STATUS_LABEL } from "src/lib/statuses";

import {
  createStaggerItem,
  easeArrive,
  fadeIn,
  fadeUp,
  viewportOnce,
} from "src/lib/animationVariants";
import { courseImageUrl, formatDueLabel } from "src/lib/format";
import {
  DEFAULT_LESSON_ICON,
  DEFAULT_LESSON_TYPE_LABEL,
  LESSON_TYPE_ICONS,
  LESSON_TYPE_LABELS,
} from "src/lib/lesson";

const RECOMMENDATION_COUNT = 4;
const DEADLINE_POOL_SIZE = 10;
const CATEGORY_LIMIT = 5;


function lessonWeightedProgress(courses) {
  const totalLessons = courses.reduce((sum, c) => sum + (c.totalLessons || 0), 0);
  if (totalLessons === 0) return 0;
  const weighted = courses.reduce(
    (sum, c) => sum + (c.progress || 0) * (c.totalLessons || 0),
    0
  );
  return Math.round(weighted / totalLessons);
}


function buildCategoryBreakdown(courses) {
  const byCategory = new Map();
  courses.forEach((c) => {
    const name = c.category || "General";
    const agg = byCategory.get(name) || { lessons: 0, weighted: 0 };
    agg.lessons += c.totalLessons || 0;
    agg.weighted += (c.progress || 0) * (c.totalLessons || 0);
    byCategory.set(name, agg);
  });
  return [...byCategory.entries()]
    .map(([name, agg]) => ({
      name,
      progress: agg.lessons === 0 ? 0 : Math.round(agg.weighted / agg.lessons),
    }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, CATEGORY_LIMIT)
    .map((entry, i) => ({
      ...entry,
      color: CHART_ACCENTS[i % CHART_ACCENTS.length],
    }));
}


function CourseImage({ image, sizes, widths = [400, 800, 1200], eager = false }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const srcSet = widths.map((w) => `${courseImageUrl(image, w)} ${w}w`).join(", ");

  // Cached images may already be complete when the node attaches, in which
  // case onLoad never fires â€” settle the status during commit instead.
  const attachImg = (node) => {
    if (!node?.complete) return;
    if (node.naturalWidth > 0) setLoaded(true);
    else setFailed(true);
  };

  return (
    <>
      {!loaded && !failed && <div className="absolute inset-0 animate-pulse bg-surface" aria-hidden="true" />}
      {failed && <div className="absolute inset-0 bg-surface" aria-hidden="true" />}
      <img
        ref={attachImg}
        src={courseImageUrl(image, widths.at(-1))}
        srcSet={srcSet}
        sizes={sizes}
        alt=""
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : undefined}
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}


function StatPills({ stats }) {
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-8 flex flex-wrap gap-4"
    >
      {stats.map((stat, i) => {
        const Icon = getIcon(stat.iconName);
        return (
          <Motion.div key={stat.label} variants={staggerItem} custom={i} className="min-w-[150px] flex-1">
            <div className="flex h-full items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${stat.accent}15` }}
              >
                <Icon size={16} style={{ color: stat.accent }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm-fluid font-medium text-ink-muted">{stat.label}</p>
                <p className="text-metric font-semibold leading-tight text-ink">{stat.value}</p>
                {stat.sub &&
                  (stat.subBadge ? (
                    <span className="mt-0.5 inline-flex w-fit items-center rounded-full bg-success-soft px-2 py-0.5 text-sm-fluid font-medium text-success">
                      {stat.sub}
                    </span>
                  ) : (
                    <p className="truncate text-sm-fluid text-ink-muted">{stat.sub}</p>
                  ))}
              </div>
            </div>
          </Motion.div>
        );
      })}
    </Motion.div>
  );
}


function StreakBadge({ streak }) {
  const shouldReduceMotion = useReducedMotion();
  if (!streak || streak.current <= 0) return null;

  return (
    <Motion.span
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: easeArrive }}
      className="inline-flex items-center gap-1.5 rounded-full bg-tint-student px-3 py-1 text-sm-fluid font-medium text-brand-strong"
      title={`Longest streak: ${streak.longest} ${streak.longest === 1 ? "day" : "days"}`}
    >
      <Flame size={14} className="text-brand" aria-hidden="true" />
      {streak.current} {streak.current === 1 ? "day" : "days"} streak
    </Motion.span>
  );
}


function OverallProgressRing({ progress, label = "Overall Progress", sub }) {
  const clamped = Math.min(Math.max(progress ?? 0, 0), 100);
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-2" role="img" aria-label={`${label}: ${clamped}%`}>
      <div className="relative">
        <ProgressRing progress={clamped} size={160} stroke={12} />
        <span className="absolute inset-0 flex items-center justify-center text-metric font-semibold leading-none text-ink">
          {clamped}%
        </span>
      </div>
      <div className="text-center">
        <p className="text-sm-fluid font-medium text-ink">{label}</p>
        {sub && <p className="mt-0.5 text-sm-fluid text-ink-muted">{sub}</p>}
      </div>
    </div>
  );
}


function CategoryProgressBars({ categories, max = CATEGORY_LIMIT }) {
  if (!categories?.length) return null;

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col gap-4">
        {categories.slice(0, max).map((category) => (
          <li key={category.name}>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="truncate text-sm-fluid text-ink">{category.name}</span>
              <span className="shrink-0 text-sm-fluid font-medium text-ink-muted">{category.progress}%</span>
            </div>
            <div
              role="progressbar"
              aria-label={`${category.name}: ${category.progress}% complete`}
              aria-valuenow={category.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 overflow-hidden rounded-full bg-surface"
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${category.progress}%`, backgroundColor: category.color }}
              />
            </div>
          </li>
        ))}
      </ul>
      {categories.length > max && (
        <Link to="/student/analytics" className="link mt-4 self-end text-sm-fluid">
          View All
        </Link>
      )}
    </div>
  );
}


function UpcomingSchedule({ deadlines, maxGroups = 3 }) {
  const byCourse = new Map();
  (deadlines || []).forEach((task) => {
    if (!byCourse.has(task.courseId)) {
      byCourse.set(task.courseId, {
        courseId: task.courseId,
        courseTitle: task.courseTitle,
        courseImage: task.courseImage,
        tasks: [],
      });
    }
    byCourse.get(task.courseId).tasks.push(task);
  });
  const visibleGroups = [...byCourse.values()].slice(0, maxGroups);

  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  return (
    <Motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-8" aria-label="Upcoming schedule">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CalendarClock size={18} className="text-brand" />
          <h2 className="text-body-lg font-semibold text-ink">Upcoming Schedule</h2>
        </div>
        {visibleGroups.length > 0 && (
          <Link to="/student/tasks" className="link shrink-0 text-sm-fluid">
            View All Deadlines
          </Link>
        )}
      </div>

      {visibleGroups.length === 0 ? (
        <div className="card p-6 text-sm-fluid text-ink-muted">
          All caught up â€” no upcoming deadlines right now.
        </div>
      ) : (
        <Motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-4"
        >
          {visibleGroups.map((group, i) => {
            const next = group.tasks[0];
            const due = formatDueLabel(next.dueDate);
            const statusLabel = TASK_STATUS_LABEL[next.status] ?? TASK_STATUS_LABEL[TASK_STATUS.NOT_STARTED];
            const actionLabel = TASK_ACTION_LABEL[next.status] ?? TASK_ACTION_LABEL[TASK_STATUS.NOT_STARTED];
            return (
              <Motion.div key={group.courseId} variants={staggerItem} custom={i}>
                <div className="card card-hover flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:px-5">
                  <img
                    src={courseImageUrl(group.courseImage, 160)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={hideOnError}
                    className="hidden h-20 w-28 shrink-0 rounded-lg bg-surface object-cover sm:block"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm-fluid font-semibold text-ink">{group.courseTitle}</p>
                    <p className="mt-0.5 truncate text-sm-fluid text-ink-muted">{next.title}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {!due.overdue && (
                        <span className={`badge badge-status-${next.status}`}>
                          {statusLabel}
                        </span>
                      )}
                      <span
                        className={`badge ${due.overdue ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                        aria-label={`Due: ${due.text}`}
                      >
                        {due.text}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={next.resumeUrl}
                    aria-label={`${actionLabel} ${next.title}`}
                    className="btn-brand w-full shrink-0 px-4 py-2 text-sm-fluid sm:w-auto"
                  >
                    {actionLabel}
                  </Link>
                </div>
              </Motion.div>
            );
          })}
        </Motion.div>
      )}
    </Motion.section>
  );
}


function ContinueLearningSection({ course, paceEntry }) {
  if (!course) {
    return (
      <section className="card mb-8 px-4 py-12">
        <StudentEmptyState
          icon={PlayCircle}
          title="No courses in progress"
          description="Pick a course back up from My Courses, or find something new in the catalog."
          action={{ label: "Browse Catalog", to: "/courses" }}
        />
      </section>
    );
  }

  const ResumeIcon = LESSON_TYPE_ICONS[course.resumeType] ?? DEFAULT_LESSON_ICON;
  const resumeTypeLabel = LESSON_TYPE_LABELS[course.resumeType] ?? DEFAULT_LESSON_TYPE_LABEL;
  const resumeUrl = course.resumeLessonId
    ? `/student/course/${course.id}/play?lessonId=${course.resumeLessonId}`
    : `/student/course/${course.id}`;
  const completedLessons =
    course.totalLessons > 0
      ? Math.round((course.progress / 100) * course.totalLessons)
      : null;

  return (
    <Motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-8" aria-label="Continue learning">
      <div className="mb-4 flex items-center gap-2">
        <PlayCircle size={18} className="text-brand" />
        <h2 className="text-body-lg font-semibold text-ink">Continue Learning</h2>
      </div>

      <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:shadow-card-hover md:flex-row">
        <div className="relative aspect-video max-h-60 shrink-0 md:max-h-none md:aspect-auto md:w-[42%] md:max-w-lg">
          <CourseImage image={course.image} sizes="(min-width:768px) min(42vw, 32rem), 100vw" widths={[480, 800, 1200, 1600]} eager />
          <div className="absolute bottom-3 right-3 rounded-full bg-white/90 p-1 shadow-sm backdrop-blur-sm">
            <div className="relative">
              <ProgressRing progress={course.progress} size={52} stroke={5} />
              <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-ink">
                {course.progress}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
          <div>
            <h3 className="line-clamp-2 text-body-lg font-semibold leading-snug text-ink">{course.title}</h3>
            <p className="mt-1 truncate text-sm-fluid text-ink-muted">
              {course.instructorName}
            </p>
            {completedLessons !== null && (
              <p className="mt-0.5 text-sm-fluid text-ink-muted">
                {completedLessons} of {course.totalLessons} lessons completed
              </p>
            )}
          </div>

          <div className="mt-auto border-t border-border pt-3">
            <p className="text-sm-fluid font-medium text-ink-muted">Pick up where you left off</p>
            <p className="mt-1 flex items-center gap-2 text-sm-fluid text-ink">
              <ResumeIcon size={16} className="shrink-0 text-brand" aria-hidden="true" />
              <span className="line-clamp-1">{course.resumeTitle}</span>
            </p>
            {paceEntry?.estCompletion && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm-fluid text-ink-muted">
                <CalendarClock size={13} aria-hidden="true" />
                Est. finish{" "}
                {paceEntry.estCompletion.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          <Link
            to={resumeUrl}
            aria-label={`Continue ${course.title} â€” ${resumeTypeLabel}: ${course.resumeTitle}`}
            className="btn-brand w-fit px-5 py-2.5 text-sm-fluid"
          >
            Continue Learning
          </Link>
        </div>
      </article>
    </Motion.section>
  );
}


function WeeklyGoalCard({ thisWeekHours, goalHours }) {
  const pct = goalHours > 0 ? Math.min(100, Math.round((thisWeekHours / goalHours) * 100)) : 0;
  const reached = thisWeekHours >= goalHours;
  return (
    <div className="card flex flex-col gap-4 p-6">
      <div className="flex items-center gap-2">
        <Target size={18} className="text-brand" aria-hidden="true" />
        <h2 className="text-body-lg font-semibold text-ink">Weekly Study Goal</h2>
      </div>
      <div className="flex items-center gap-5">
        <div className="relative h-20 w-20 shrink-0">
          <ProgressRing progress={pct} size={80} stroke={9} />
          <span className="absolute inset-0 flex items-center justify-center text-sm-fluid font-semibold text-ink">
            {pct}%
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-metric font-semibold text-ink">
            {thisWeekHours}
            <span className="text-sm-fluid font-normal text-ink-muted"> / {goalHours} hrs</span>
          </p>
          <p className={`mt-0.5 text-sm-fluid ${reached ? "text-success" : "text-ink-muted"}`}>
            {reached ? "Goal reached â€” great work!" : "Keep going to hit your goal"}
          </p>
        </div>
      </div>
    </div>
  );
}


function ProgressOverviewSection({ stats, overallProgress, completedCount, totalEnrolled, categoryBreakdown, streak, weeklyGoal }) {
  return (
    <>
      <StatPills stats={stats} />

      <Motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-8 grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        <div className="card flex flex-col items-center justify-center gap-4 p-6">
          <StreakBadge streak={streak} />
          <OverallProgressRing progress={overallProgress} sub={`${completedCount} of ${totalEnrolled} courses completed`} />
        </div>
        <div className="card p-6">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-brand" />
            <h2 className="text-body-lg font-semibold text-ink">Progress by Category</h2>
          </div>
          <CategoryProgressBars categories={categoryBreakdown} />
        </div>
        <WeeklyGoalCard thisWeekHours={weeklyGoal.thisWeekHours} goalHours={weeklyGoal.goalHours} />
      </Motion.div>
    </>
  );
}


function RecommendationsSection({ courses }) {
  if (courses.length === 0) return null;

  return (
    <Motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} aria-label="Recommended for you">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-brand" />
          <h2 className="text-body-lg font-semibold text-ink">Recommended For You</h2>
        </div>
        <Link to="/courses" className="link shrink-0 text-sm-fluid">
          Browse Catalog
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </Motion.section>
  );
}

export default function StudentDashboardPage() {
  // Snapshot the clock once at mount so relative "last accessed" / due-date
  // labels are stable across re-renders and rendering stays pure.
  const [nowMs] = useState(() => Date.now());

  // --- Data (single source of truth: studentRepository) ---
  const student = getStudentProfile();
  const enrolledCourses = getEnrolledCourses();
const urgentDeadlines = getUpcomingDeadlines(DEFAULT_STUDENT_ID, DEADLINE_POOL_SIZE);
  const recommendedCourses = getRecommendedCourses(DEFAULT_STUDENT_ID, RECOMMENDATION_COUNT);
  const streak = getStreak(nowMs);
  const thisWeekHours = getLearningActivity().at(-1)?.hours ?? 0;
  const WEEKLY_GOAL_HOURS = 5;
  const { pace } = getLearningPace(nowMs);
  const paceByCourse = useMemo(
    () => Object.fromEntries(pace.map((p) => [p.courseId, p])),
    [pace]
  );

  // --- Derived metrics ---
  const continueCourse = enrolledCourses
    .filter((c) => c.status === "In Progress")
    .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))[0];

  const totalEnrolled = enrolledCourses.length;
  const completedCount = enrolledCourses.filter((c) => c.status === "Completed").length;
  const inProgressCount = enrolledCourses.filter((c) => c.status === "In Progress").length;
  const notStartedCount = enrolledCourses.filter((c) => c.status === "Not Started").length;

  // Hours learned = Î£(course hours Ã— progress), NOT total course hours.
  const hoursLearned = enrolledCourses
    .reduce((sum, c) => sum + ((c.hours || 0) * (c.progress || 0)) / 100, 0)
    .toFixed(1);

  const overallProgress = lessonWeightedProgress(enrolledCourses);
  const categoryBreakdown = buildCategoryBreakdown(enrolledCourses);

  const statPillsData = [
    {
      label: "Enrolled",
      value: totalEnrolled,
      sub: notStartedCount > 0 ? `${notStartedCount} Not Started` : "All started",
      iconName: "BookOpen",
      accent: CHART_ACCENTS[0],
    },
    {
      label: "Completed",
      value: completedCount,
      sub: `${completedCount} of ${totalEnrolled} courses`,
      iconName: "CheckCircle",
      accent: CHART_ACCENTS[1],
    },
    {
      label: "In Progress",
      value: inProgressCount,
      sub: continueCourse ? `Next: ${continueCourse.resumeTitle}` : `${inProgressCount} active`,
      iconName: "Clock",
      accent: CHART_ACCENTS[2],
    },
    {
      label: "Study Time",
      value: hoursLearned,
      sub: `+${thisWeekHours} hrs this week`,
      subBadge: true,
      iconName: "TrendingUp",
      accent: CHART_ACCENTS[3],
    },
  ];

  const pageHeader = (
    <header className="mb-8">
      <h1 className="page-title">Welcome back, {student.firstName}!</h1>
      <p className="mt-1 text-sm-fluid text-ink-muted">Your courses, progress, and deadlines at a glance</p>
    </header>
  );

  // First-time onboarding â€” no enrollment widgets, just direction to the catalog.
  if (enrolledCourses.length === 0) {
    return (
      <>
        {pageHeader}
        <div className="card px-4 py-16">
          <StudentEmptyState
            icon={GraduationCap}
            title={`${student.firstName}, you haven't enrolled in any courses yet`}
            description="Browse the catalog, pick a course, and it will show up here so you can track your progress."
            action={{ label: "Browse Catalog", to: "/courses" }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {pageHeader}

      <ContinueLearningSection
        course={continueCourse}
        paceEntry={continueCourse ? paceByCourse[continueCourse.id] : null}
      />

      <ProgressOverviewSection
        stats={statPillsData}
        overallProgress={overallProgress}
        completedCount={completedCount}
        totalEnrolled={totalEnrolled}
        categoryBreakdown={categoryBreakdown}
        streak={streak}
        weeklyGoal={{ thisWeekHours, goalHours: WEEKLY_GOAL_HOURS }}
      />

      <UpcomingSchedule deadlines={urgentDeadlines} />

      <RecommendationsSection courses={recommendedCourses} />
    </>
  );
}

