import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { m as Motion, useReducedMotion } from "motion/react";
import * as Tabs from "@radix-ui/react-tabs";
import {
  Award,
  CalendarClock,
  Clock,
  Download,
  FileQuestion,
  FileText,
  GraduationCap,
  Lock,
  Megaphone,
  Pin,
  Play,
  User,
} from "lucide-react";

import Breadcrumbs from "src/components/ui/Breadcrumbs";
import ProgressRing from "src/components/ui/ProgressRing";
import StatusBadge from "src/components/ui/StatusBadge";
import Stars from "src/components/ui/Stars";
import StudentEmptyState from "src/components/student/StudentEmptyState";
import CourseSyllabus from "src/components/student/CourseSyllabus";
import {
  UnderlineTabList,
  UnderlineTab,
} from "src/components/student/UnderlineTabList";
import { durations, easeArrive } from "src/lib/animationVariants";
import { avatarFallback, hideOnError } from "src/lib/assets";
import {
  formatCompactNumber,
  formatDueLabel,
  formatRelativeTime,
  formatTotalDuration,
} from "src/lib/format";
import {
  getEnrolledCourseData,
  getCourseAnnouncementsFor,
  getCourseResourcesFor,
} from "src/services/studentRepository";
import { DEFAULT_STUDENT_ID } from "src/data/students";

const COURSE_TABS = [
  { value: "syllabus", label: "Syllabus" },
  { value: "announcements", label: "Announcements" },
  { value: "instructor", label: "Instructor" },
  { value: "resources", label: "Resources" },
];

// ---------------------------------------------------------------- states

function NotFoundState() {
  return (
    <div>
      <Breadcrumbs
        items={[{ label: "My Courses", link: "/student/my-courses" }, { label: "Course" }]}
      />
      <div className="mt-6 card px-4 py-16">
        <StudentEmptyState
          icon={FileQuestion}
          title="Course not found"
          description="We couldn't find that course. It may have been removed from the catalog."
          action={{ label: "Back to My Courses", to: "/student/my-courses" }}
        />
      </div>
    </div>
  );
}

function NotEnrolledState() {
  return (
    <div>
      <Breadcrumbs
        items={[{ label: "My Courses", link: "/student/my-courses" }, { label: "Course" }]}
      />
      <div className="mt-6 card px-4 py-16">
        <StudentEmptyState
          icon={Lock}
          title="You're not enrolled"
          description="You need to enroll in this course before you can view its syllabus and lessons."
          action={{ label: "Browse Catalog", to: "/courses" }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- header

function CourseHeader({ course, enrollment, resumeAction }) {
  const instructorNames = course.instructors?.map((i) => i.name).join(", ");
  const playTo = resumeAction
    ? `/student/course/${course.id}/play?lessonId=${resumeAction.lessonId}`
    : `/student/course/${course.id}/play`;
  const totalHours = course.hours ? formatTotalDuration(course.hours) : null;

  return (
    <section className="card">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <img
          src={course.image}
          alt=""
          loading="lazy"
          onError={hideOnError}
          className="h-36 w-full shrink-0 rounded-lg bg-surface object-cover sm:h-28 sm:w-44"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={enrollment.status} />
            {course.level && (
              <span className="badge bg-surface-soft text-ink-muted">{course.level}</span>
            )}
          </div>
          <h1
            title={course.title}
            className="mt-2 truncate text-heading font-semibold text-ink"
          >
            {course.title}
          </h1>
          {instructorNames && (
            <p className="mt-1 text-sm-fluid text-ink-muted">
              with {instructorNames}
            </p>
          )}
          {course.promise && (
            <p className="mt-2 line-clamp-2 text-sm-fluid leading-6 text-ink-muted">
              {course.promise}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-b-xl border-t border-border bg-surface-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0">
            <ProgressRing progress={enrollment.progress} size={56} stroke={6} />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-ink">
              {enrollment.progress}%
            </span>
          </div>
          <div>
            <p className="text-body-lg font-semibold leading-tight text-ink">
              {enrollment.completedLessons}/{enrollment.totalLessons} lessons
            </p>
            <p className="flex items-center gap-1 text-sm-fluid text-ink-muted">
              <Clock size={13} aria-hidden="true" />
              {enrollment.status === "Completed"
                ? "Course completed"
                : enrollment.status === "Not Started"
                  ? "Not started yet"
                  : "In progress"}
              {totalHours && ` · ${totalHours} total`}
            </p>
          </div>
        </div>

        <Link
          to={playTo}
          className="btn-brand w-full px-5 py-2.5 text-sm-fluid sm:w-auto"
          aria-label={
            resumeAction
              ? `${resumeAction.label} in ${course.title}`
              : `Open ${course.title}`
          }
        >
          <Play size={16} aria-hidden="true" />
          {resumeAction ? resumeAction.label : "Open Course"}
        </Link>
      </div>
    </section>
  );
}

// --------------------------------------------------------------- sidebar

function CertificateCard({ enrollment }) {
  const completed = enrollment.status === "Completed";

  return (
    <section className="card min-w-[280px] flex-1 p-6 lg:w-full lg:flex-none">
      <h2 className="section-title">Certificate</h2>
      {completed ? (
        <>
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-tint-student p-4">
            <Award size={28} className="shrink-0 text-accent-student" aria-hidden="true" />
            <div>
              <p className="font-semibold text-ink">Course completed</p>
              <p className="text-sm-fluid text-ink-muted">
                You've finished every lesson.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button type="button" className="btn-brand w-full px-5 py-2.5 text-sm-fluid">
              Download Certificate
            </button>
            <button type="button" className="btn-outline w-full px-5 py-2.5 text-sm-fluid">
              Claim Badge
            </button>
          </div>
        </>
      ) : (
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-gray-50 p-4">
          <Award size={28} className="shrink-0 text-ink-muted/60" aria-hidden="true" />
          <div>
            <p className="font-semibold text-ink">Earn your certificate</p>
            <p className="text-sm-fluid text-ink-muted">
              Finish all lessons to unlock it. {enrollment.progress}% complete
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function CourseDetailsCard({ enrollment, now }) {
  const due = enrollment.dueDate ? formatDueLabel(enrollment.dueDate, now) : null;

  return (
    <section className="card min-w-[280px] flex-1 p-6 lg:w-full lg:flex-none">
      <h2 className="section-title">Course Details</h2>
      <dl className="mt-4 space-y-3 text-sm-fluid">
        <div className="flex items-center justify-between gap-3">
          <dt className="shrink-0 text-ink-muted">Last accessed</dt>
          <dd className="text-right font-medium text-ink">
            {enrollment.lastAccessed
              ? formatRelativeTime(enrollment.lastAccessed, now)
              : "—"}
          </dd>
        </div>
        {due && (
          <div className="flex items-center justify-between gap-3">
            <dt className="flex shrink-0 items-center gap-1.5 text-ink-muted">
              <CalendarClock size={15} aria-hidden="true" />
              Deadline
            </dt>
            <dd
              className={`text-right font-medium ${due.overdue ? "text-red-600" : "text-ink"}`}
            >
              {due.text}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}

function ProgressSidebar({ enrollment, now }) {
  return (
    <div className="flex flex-wrap gap-6 lg:flex-col">
      <CertificateCard enrollment={enrollment} />
      <CourseDetailsCard enrollment={enrollment} now={now} />
    </div>
  );
}

// ------------------------------------------------------------------ tabs

function TabPanel({ children }) {
  const reduce = useReducedMotion();
  return (
    <Motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : durations.slow, ease: easeArrive }}
      className="pt-6"
    >
      {children}
    </Motion.div>
  );
}

function AnnouncementsTab({ announcements }) {
  if (!announcements || announcements.length === 0) {
    return (
      <div className="card px-4 py-14 text-center">
        <Megaphone size={28} className="mx-auto text-ink-muted/50" aria-hidden="true" />
        <p className="mt-3 text-sm-fluid font-medium text-ink">No announcements yet</p>
        <p className="mt-1 text-sm-fluid text-ink-muted">
          Your instructor will post updates here as the course progresses.
        </p>
      </div>
    );
  }
  return (
    <ul className="space-y-4">
      {announcements.map((a) => (
        <li key={a.id} className="card p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="flex min-w-0 items-center gap-2 text-sm-fluid font-semibold text-ink">
              {a.pinned && (
                <Pin size={15} className="shrink-0 text-brand" aria-hidden="true" />
              )}
              <span className="min-w-0 break-words">{a.title}</span>
            </h3>
            <time className="shrink-0 text-sm-fluid text-ink-muted" dateTime={a.date}>
              {formatRelativeTime(a.date)}
            </time>
          </div>
          <p className="mt-2 text-sm-fluid leading-6 text-ink-muted">{a.body}</p>
          <p className="mt-3 text-sm-fluid text-ink-muted">— {a.author}</p>
        </li>
      ))}
    </ul>
  );
}

function InstructorTab({ instructors }) {
  if (!instructors || instructors.length === 0) {
    return (
      <div className="card px-4 py-14 text-center">
        <GraduationCap size={28} className="mx-auto text-ink-muted/50" aria-hidden="true" />
        <p className="mt-3 text-sm-fluid font-medium text-ink">No instructor information</p>
        <p className="mt-1 text-sm-fluid text-ink-muted">
          Instructor details aren't available for this course.
        </p>
      </div>
    );
  }
  return (
    <div className="card divide-y divide-border p-5 sm:p-6">
      {instructors.map((instructor) => (
        <div
          key={instructor.id}
          className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row"
        >
          <img
            src={instructor.photo}
            alt={instructor.name}
            loading="lazy"
            onError={avatarFallback}
            className="h-20 w-20 shrink-0 rounded-xl bg-surface object-cover"
          />
          <div className="min-w-0">
            <h3 className="font-semibold text-ink">{instructor.name}</h3>
            <p className="text-sm-fluid font-medium text-brand-strong">{instructor.title}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm-fluid text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Stars rating={instructor.rating} size={14} />
                {instructor.rating} instructor rating
              </span>
              <span className="flex items-center gap-1.5">
                <User size={14} aria-hidden="true" />
                {formatCompactNumber(instructor.students)} students
              </span>
            </div>
            <p className="mt-2 text-sm-fluid leading-6 text-ink-muted">{instructor.bio}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResourcesTab({ resources }) {
  return (
    <div className="space-y-4">
      <div className="card flex items-start gap-3 border border-amber-200 bg-amber-50 p-4">
        <FileText size={18} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-sm-fluid text-ink">{resources?.message}</p>
      </div>
      <ul className="card divide-y divide-border p-0">
        {(resources?.items ?? []).map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 px-5 py-3 text-sm-fluid text-ink-muted"
          >
            <Download size={16} className="shrink-0 text-ink-muted/70" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate font-medium text-ink">
              {item.title}
            </span>
            <span className="hidden text-sm-fluid text-ink-muted sm:block">{item.type}</span>
            <span className="hidden text-sm-fluid text-ink-muted sm:block">{item.size}</span>
            <span className="badge shrink-0 bg-gray-100 text-sm font-medium text-ink-muted">
              Unavailable
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CourseTabs({ sections, course, resumeSectionIndex, announcements, resources }) {
  return (
    <Tabs.Root defaultValue="syllabus">
      <UnderlineTabList ariaLabel="Course sections">
        {COURSE_TABS.map((t) => (
          <UnderlineTab key={t.value} value={t.value}>
            {t.label}
          </UnderlineTab>
        ))}
      </UnderlineTabList>

      <Tabs.Content value="syllabus">
        <TabPanel>
          <CourseSyllabus
            sections={sections}
            courseId={course.id}
            defaultOpenSection={resumeSectionIndex}
          />
        </TabPanel>
      </Tabs.Content>

      <Tabs.Content value="announcements">
        <TabPanel>
          <AnnouncementsTab announcements={announcements} />
        </TabPanel>
      </Tabs.Content>

      <Tabs.Content value="instructor">
        <TabPanel>
          <InstructorTab instructors={course.instructors} />
        </TabPanel>
      </Tabs.Content>

      <Tabs.Content value="resources">
        <TabPanel>
          <ResourcesTab resources={resources} />
        </TabPanel>
      </Tabs.Content>
    </Tabs.Root>
  );
}

// ------------------------------------------------------------------ page

export default function StudentCourseOverviewPage() {
  const { courseId } = useParams();
  // Snapshot "now" once so relative labels stay stable across re-renders.
  const [now] = useState(() => Date.now());

  const data = useMemo(() => getEnrolledCourseData(DEFAULT_STUDENT_ID, courseId), [courseId]);

  // Resolve resume CTA label from the syllabus-derived status + target lesson so
  // the CTA matches what the syllabus actually shows. Labels are terse commands
  // ("Start/Resume/Revisit Course") and never embed the full course title.
  const resumeAction = useMemo(() => {
    if (data.status !== "ready" || !data.resumeTarget) return null;
    const { title, lessonId } = data.resumeTarget;
    if (data.derivedStatus === "Completed") {
      return { label: "Revisit Course", title, lessonId };
    }
    if (data.derivedStatus === "Not Started") {
      return { label: "Start Course", title, lessonId };
    }
    return { label: "Resume Course", title, lessonId };
  }, [data]);

  if (data.status === "not-found") {
    return <NotFoundState />;
  }

  if (data.status === "not-enrolled") {
    return <NotEnrolledState />;
  }

  const { course, sections, resumeSectionIndex } = data;
  const announcements = getCourseAnnouncementsFor(courseId);
  const resources = getCourseResourcesFor(courseId);

  // Display enrollment = syllabus-derived progress/counts/status overlaid on the
  // raw student state. `lastAccessed` / `dueDate` remain the source-of-truth
  // student state; everything derivable from the syllabus is computed once here
  // so the header, sidebar, and syllabus stay internally consistent.
  //
  // An unstarted course has no meaningful "last accessed" time, so we blank it
  // out to avoid showing a stale relative timestamp on a course that was never
  // opened.
  const displayEnrollment = {
    progress: data.progress,
    completedLessons: data.completedLessons,
    totalLessons: data.totalLessons,
    status: data.derivedStatus,
    lastAccessed: data.derivedStatus === "Not Started" ? null : data.lastAccessed,
    dueDate: data.dueDate,
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "My Courses", link: "/student/my-courses" },
          { label: course.title },
        ]}
      />

      <div className="mt-6 space-y-6">
        <CourseHeader
          course={course}
          enrollment={displayEnrollment}
          resumeAction={resumeAction}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            <CourseTabs
              sections={sections}
              course={course}
              resumeSectionIndex={resumeSectionIndex}
              announcements={announcements}
              resources={resources}
            />
          </div>
          <aside className="self-start md:sticky md:top-[90px]">
            <ProgressSidebar enrollment={displayEnrollment} now={now} />
          </aside>
        </div>
      </div>
    </div>
  );
}
