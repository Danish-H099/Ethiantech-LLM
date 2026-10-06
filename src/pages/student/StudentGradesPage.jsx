import { useMemo } from "react";
import { Link } from "react-router-dom";
import { m as Motion, useReducedMotion } from "motion/react";
import {
  Award,
  ClipboardList,
  Eye,
  GraduationCap,
} from "lucide-react";

import { getGrades } from "src/services/studentRepository";
import { CHART_PINK, CHART_GREEN, CHART_BLUE } from "src/lib/chartConfig";
import { fadeIn, createStaggerItem } from "src/lib/animationVariants";
import { hideOnError } from "src/lib/assets";
import StudentEmptyState from "src/components/student/StudentEmptyState";
import StatusBadge from "src/components/ui/StatusBadge";

const GPA_SCALE = { A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0 };

function calculateGPA(grades) {
  const withGrade = grades.filter((g) => g.grade && g.grade !== "-" && GPA_SCALE[g.grade] != null);
  if (withGrade.length === 0) return null;
  const total = withGrade.reduce((sum, g) => sum + GPA_SCALE[g.grade], 0);
  return (total / withGrade.length).toFixed(2);
}

function PageHeading() {
  return (
    <div className="mb-8">
      <h1 className="page-title">Grades & Transcripts</h1>
      <p className="mt-1 text-sm-fluid text-ink-muted">
        Your academic record — scores, GPA, and performance across university courses.
      </p>
    </div>
  );
}

function SummaryCards({ grades }) {
  const universityGrades = grades.filter((g) => g.type === "university");
  const gpa = calculateGPA(universityGrades);
  const completed = universityGrades.filter((g) => g.status === "Completed").length;
  const avgScore = universityGrades.length > 0
    ? Math.round(
        universityGrades.reduce((sum, g) => sum + (g.score || 0), 0) / universityGrades.length
      )
    : 0;

  const cards = [
    {
      label: "Cumulative GPA",
      value: gpa ?? "—",
      sub: gpa ? "On a 4.0 scale" : "No graded courses yet",
      icon: GraduationCap,
      accent: CHART_PINK,
    },
    {
      label: "Courses Completed",
      value: completed,
      sub: `of ${universityGrades.length} enrolled`,
      icon: Award,
      accent: CHART_GREEN,
    },
    {
      label: "Average Score",
      value: `${avgScore}%`,
      sub: "Across university courses",
      icon: ClipboardList,
      accent: CHART_BLUE,
    },
  ];

  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="mb-8 grid gap-6 sm:grid-cols-3"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="card flex flex-col gap-3 p-5">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${card.accent}15` }}
              >
                <Icon size={18} style={{ color: card.accent }} />
              </div>
              <p className="text-sm-fluid font-medium text-ink-muted">{card.label}</p>
            </div>
            <p className="text-metric font-semibold leading-tight text-ink">{card.value}</p>
            <p className="text-sm-fluid text-ink-muted">{card.sub}</p>
          </div>
        );
      })}
    </Motion.div>
  );
}

function gradeBadgeClass(grade) {
  if (grade.startsWith("A")) return "bg-green-100 text-green-700";
  if (grade.startsWith("B")) return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-ink-muted";
}

function GradeCardMeta({ grade, gpaPoints }) {
  const meta = [
    grade.institutionName || "Independent",
    `Score ${grade.score != null ? `${grade.score}%` : "—"}`,
    `GPA ${gpaPoints != null ? gpaPoints.toFixed(1) : "—"}`,
  ];

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm-fluid text-ink-muted">
      {meta.map((item, i) => (
        <span key={item} className="inline-flex items-center gap-1">
          {i > 0 && <span className="text-ink-muted/60"> · </span>}
          {item}
        </span>
      ))}
    </div>
  );
}

function GradeCard({ grade }) {
  const gpaPoints = grade.grade && grade.grade !== "-" ? GPA_SCALE[grade.grade] : null;

  return (
    <div className="card card-hover flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:px-5">
      {grade.courseImage && (
        <img
          src={grade.courseImage}
          alt=""
          loading="lazy"
          onError={hideOnError}
          className="hidden h-20 w-28 shrink-0 rounded-lg bg-surface object-cover sm:block"
        />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {grade.grade && grade.grade !== "-" && (
            <span className={`badge ${gradeBadgeClass(grade.grade)}`}>{grade.grade}</span>
          )}
          <StatusBadge status={grade.status} />
        </div>
        <Link
          to={`/student/course/${grade.courseId}`}
          className="mt-2 block truncate text-sm-fluid font-semibold text-ink transition hover:text-accent-student"
        >
          {grade.courseTitle}
        </Link>
        <p className="mt-0.5 truncate text-sm-fluid text-ink-muted">
          {grade.instructorName || "Instructor"}
        </p>
        <GradeCardMeta grade={grade} gpaPoints={gpaPoints} />
      </div>

      <Link
        to={`/student/grades/${grade.courseId}`}
        aria-label={`View grade details for ${grade.courseTitle}`}
        className="btn-outline w-full shrink-0 px-4 py-2 text-sm-fluid sm:w-auto"
      >
        <Eye size={14} aria-hidden="true" />
        View Details
      </Link>
    </div>
  );
}

function GradeList({ grades, staggerItem }) {
  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="mt-6 space-y-4"
    >
      {grades.map((g, i) => (
        <Motion.div key={g.courseId} variants={staggerItem} custom={i}>
          <GradeCard grade={g} />
        </Motion.div>
      ))}
    </Motion.div>
  );
}

function NoUniversityCoursesState() {
  return (
    <div className="card mt-6 px-4 py-14">
      <StudentEmptyState
        icon={GraduationCap}
        title="No university courses enrolled"
        description="Grades and transcripts are only available for university courses. Enroll in a university course to see your academic record here."
        action={{ label: "Browse Catalog", to: "/courses" }}
      />
    </div>
  );
}

export default function StudentGradesPage() {
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );
  const allGrades = useMemo(() => getGrades(), []);
  const universityGrades = useMemo(
    () => allGrades.filter((g) => g.type === "university"),
    [allGrades]
  );

  if (universityGrades.length === 0) {
    return (
      <div>
        <PageHeading />
        <NoUniversityCoursesState />
      </div>
    );
  }

  return (
    <div>
      <PageHeading />
      <SummaryCards grades={allGrades} />
      <GradeList grades={universityGrades} staggerItem={staggerItem} />
    </div>
  );
}
