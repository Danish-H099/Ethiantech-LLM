import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { m as Motion, useReducedMotion } from "motion/react";
import { BookOpen, GraduationCap, Play } from "lucide-react";

import { getEnrolledCourses } from "src/data/studentRepository";
import StudentEmptyState from "src/components/student/StudentEmptyState";
import StatusBadge from "src/components/StatusBadge";
import LessonProgressBar from "src/components/student/LessonProgressBar";
import {
  UnderlineTabList,
  UnderlineTab,
} from "src/components/student/UnderlineTabList";
import { fadeIn, createStaggerItem } from "src/lib/animationVariants";
import { hideOnError } from "src/lib/assets";

const STATUS_FILTERS = ["All", "In Progress", "Completed", "Not Started"];

const CTA_BY_STATUS = {
  Completed: { label: "Revisit Course", buttonClass: "btn-brand" },
  "In Progress": { label: "Continue Learning", buttonClass: "btn-brand" },
  "Not Started": { label: "Start Course", buttonClass: "btn-outline" },
};

function progressColorFor(status) {
  if (status === "Completed") return "var(--color-success)";
  if (status === "Not Started") return "var(--color-toggle)";
  return "var(--color-accent-student)";
}

function emptyStateFor(filter, onClearFilter) {
  if (filter !== "All") {
    return {
      icon: BookOpen,
      title: `No ${filter} courses`,
      description: "Clear the filter to see all your enrolled courses.",
      action: { label: "Clear Filter", onClick: onClearFilter },
    };
  }
  return {
    icon: GraduationCap,
    title: "No courses yet",
    description:
      "Explore the catalog and enroll in a course — it will show up here once you do.",
    action: { label: "Browse Catalog", to: "/courses" },
  };
}

// ---------------------------------------------------------------- sections

function PageHeading() {
  return (
    <div className="mb-8">
      <h1 className="page-title">My Courses</h1>
      <p className="mt-1 text-sm-fluid text-ink-muted">
        Pick up where you left off
      </p>
    </div>
  );
}

function FilterTabBar({ countFor }) {
  return (
    <UnderlineTabList ariaLabel="Filter courses by status">
      {STATUS_FILTERS.map((f) => (
        <UnderlineTab key={f} value={f} badge={countFor(f)}>
          {f}
        </UnderlineTab>
      ))}
    </UnderlineTabList>
  );
}

function EmptyCoursesPanel({ emptyCopy }) {
  return (
    <div className="card mt-6 px-4 py-14">
      <StudentEmptyState
        icon={emptyCopy.icon}
        title={emptyCopy.title}
        description={emptyCopy.description}
        action={emptyCopy.action}
      />
    </div>
  );
}

function CourseGrid({ courses, staggerItem }) {
  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
    >
      {courses.map((course, i) => (
        <EnrolledCourseCard
          key={course.id}
          course={course}
          index={i}
          staggerItem={staggerItem}
        />
      ))}
    </Motion.div>
  );
}

function CourseTabContent({ value, courses, staggerItem, emptyCopy }) {
  return (
    <Tabs.Content value={value}>
      {courses.length > 0 ? (
        <CourseGrid courses={courses} staggerItem={staggerItem} />
      ) : (
        <EmptyCoursesPanel emptyCopy={emptyCopy} />
      )}
    </Tabs.Content>
  );
}

// ------------------------------------------------------------ course card

function CardMedia({ course }) {
  return (
    <div className="relative h-[160px] overflow-hidden bg-surface">
      <img
        src={course.image}
        alt={course.title}
        loading="lazy"
        className="h-full w-full object-cover"
        onError={hideOnError}
      />
      <div className="absolute left-3 top-3">
        <StatusBadge status={course.status} />
      </div>
    </div>
  );
}

function CardBody({ course }) {
  const cta = CTA_BY_STATUS[course.status];

  return (
    <div className="flex flex-1 flex-col p-5">
      <Link
        to={`/student/course/${course.id}`}
        className="mb-1 line-clamp-2 text-sm-fluid font-semibold text-ink transition hover:text-accent-student"
      >
        {course.title}
      </Link>
      <p className="mb-4 text-sm-fluid text-ink-muted">{course.instructorName}</p>

      <div className="mt-auto">
        <div className="mb-1.5 flex items-center justify-between text-sm-fluid">
          <span className="text-ink-muted">
            {course.completedLessons}/{course.totalLessons} lessons
          </span>
          <span className="font-semibold text-ink">{course.progress}%</span>
        </div>
        <LessonProgressBar
          percentage={course.progress}
          label={`Course progress: ${course.progress}%`}
          color={progressColorFor(course.status)}
          animated
        />
        <Link
          to={`/student/course/${course.id}`}
          className={`${cta.buttonClass} mt-3 w-full py-2.5 text-sm-fluid`}
        >
          <Play size={16} />
          {cta.label}
        </Link>
      </div>
    </div>
  );
}

// Enrolled-course card: the card shell is NOT a link (avoids nested
// interactive elements). The title link and the status CTA are separate,
// sibling interactive children.
function EnrolledCourseCard({ course, index, staggerItem }) {
  return (
    <Motion.div variants={staggerItem} custom={index}>
      <div className="card card-hover flex h-full flex-col overflow-hidden">
        <CardMedia course={course} />
        <CardBody course={course} />
      </div>
    </Motion.div>
  );
}

// ------------------------------------------------------------------ page

export default function StudentMyCoursesPage() {
  const [filter, setFilter] = useState("All");
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  // Syllabus-derived views (single source of truth) — replaces the raw
  // enrollment record that duplicated catalog fields.
  const enrolledCourses = getEnrolledCourses();

  const countFor = (f) =>
    f === "All"
      ? enrolledCourses.length
      : enrolledCourses.filter((c) => c.status === f).length;

  const coursesFor = (f) =>
    f === "All" ? enrolledCourses : enrolledCourses.filter((c) => c.status === f);

  const emptyCopy = emptyStateFor(filter, () => setFilter("All"));

  return (
    <div>
      <PageHeading />

      <Tabs.Root value={filter} onValueChange={setFilter}>
        <FilterTabBar countFor={countFor} />
        {STATUS_FILTERS.map((f) => (
          <CourseTabContent
            key={f}
            value={f}
            courses={coursesFor(f)}
            staggerItem={staggerItem}
            emptyCopy={emptyCopy}
          />
        ))}
      </Tabs.Root>
    </div>
  );
}
