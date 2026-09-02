import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { m as Motion } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Award,
  CheckCircle2,
  ClipboardList,
  Eye,
  GraduationCap,
  ListChecks,
  X,
  XCircle,
} from "lucide-react";

import { getGrades, getGradeDetail } from "src/services/studentRepository";
import { CHART_PINK, CHART_GREEN, CHART_BLUE } from "src/data/chart";
import { formatRelativeTime } from "src/lib/format";
import { fadeIn } from "src/lib/animationVariants";
import { hideOnError } from "src/lib/assets";
import StudentEmptyState from "src/components/student/StudentEmptyState";
import StatusBadge from "src/components/ui/StatusBadge";
import ProgressRing from "src/components/ui/ProgressRing";

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

function DesktopGradeTable({ grades, onView }) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-border scrollbar-brand sm:block">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="table-header">
            <th className="px-5 py-3 font-medium">Course</th>
            <th className="px-5 py-3 font-medium">Institution</th>
            <th className="px-5 py-3 font-medium">Score</th>
            <th className="px-5 py-3 font-medium">Grade</th>
            <th className="px-5 py-3 font-medium">GPA</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 text-right font-medium">Details</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g) => {
            const gpaPoints = g.grade && g.grade !== "-" ? GPA_SCALE[g.grade] : null;
            return (
              <tr key={g.courseId} className="table-row odd:bg-surface-soft">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {g.courseImage && (
                      <img
                        src={g.courseImage}
                        alt=""
                        onError={hideOnError}
                        className="hidden h-10 w-14 shrink-0 rounded bg-surface object-cover lg:block"
                      />
                    )}
                    <div className="min-w-0">
                      <Link
                        to={`/student/course/${g.courseId}`}
                        className="block truncate font-medium text-ink transition hover:text-accent-student"
                      >
                        {g.courseTitle}
                      </Link>
                      <p className="truncate text-sm-fluid text-ink-muted">
                        {g.instructorName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-sm-fluid text-ink-muted">
                  {g.institutionName || "—"}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 font-medium text-ink">
                  {g.score != null ? `${g.score}%` : "—"}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5">
                  {g.grade && g.grade !== "-" ? (
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-sm-fluid font-semibold ${
                        g.grade.startsWith("A")
                          ? "bg-green-100 text-green-700"
                          : g.grade.startsWith("B")
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-ink-muted"
                      }`}
                    >
                      {g.grade}
                    </span>
                  ) : (
                    <span className="text-ink-muted">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-sm-fluid font-medium text-ink">
                  {gpaPoints != null ? gpaPoints.toFixed(1) : "—"}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={g.status} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => onView(g.courseId)}
                    aria-label={`View grade details for ${g.courseTitle}`}
                    className="btn-outline px-3 py-1.5 text-sm-fluid"
                  >
                    <Eye size={14} aria-hidden="true" />
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MobileGradeCards({ grades, onView }) {
  return (
    <div className="space-y-4 sm:hidden">
      {grades.map((g) => {
        const gpaPoints = g.grade && g.grade !== "-" ? GPA_SCALE[g.grade] : null;
        return (
          <div key={g.courseId} className="card p-4">
            <div className="flex items-start gap-3">
              {g.courseImage && (
                <img
                  src={g.courseImage}
                  alt=""
                  onError={hideOnError}
                  className="h-12 w-16 shrink-0 rounded bg-surface object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <Link
                  to={`/student/course/${g.courseId}`}
                  className="block truncate text-sm-fluid font-semibold text-ink"
                >
                  {g.courseTitle}
                </Link>
                <p className="truncate text-sm-fluid text-ink-muted">{g.institutionName || "Independent"}</p>
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm-fluid">
              <dt className="text-ink-muted">Score</dt>
              <dd className="text-right font-medium text-ink">{g.score != null ? `${g.score}%` : "—"}</dd>
              <dt className="text-ink-muted">Grade</dt>
              <dd className="text-right font-medium text-ink">{g.grade || "—"}</dd>
              <dt className="text-ink-muted">GPA</dt>
              <dd className="text-right font-medium text-ink">{gpaPoints != null ? gpaPoints.toFixed(1) : "—"}</dd>
              <dt className="text-ink-muted">Status</dt>
              <dd className="flex justify-end">
                <StatusBadge status={g.status} />
              </dd>
            </dl>

            <button
              type="button"
              onClick={() => onView(g.courseId)}
              aria-label={`View grade details for ${g.courseTitle}`}
              className="btn-outline mt-4 w-full py-2 text-sm-fluid"
            >
              <Eye size={14} aria-hidden="true" />
              View Details
            </button>
          </div>
        );
      })}
    </div>
  );
}

function GradeTable({ grades, onView }) {
  return (
    <>
      <DesktopGradeTable grades={grades} onView={onView} />
      <MobileGradeCards grades={grades} onView={onView} />
    </>
  );
}

function GradeDetailDialog({ open, onOpenChange, courseId }) {
  const detail = open && courseId != null ? getGradeDetail(courseId) : null;
  const gpaPoints = detail?.grade && detail.grade !== "-" ? GPA_SCALE[detail.grade] : null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex items-stretch justify-center p-0 sm:items-center sm:p-4"
        >
          <div className="flex max-h-full w-full flex-col overflow-hidden rounded-none bg-white shadow-xl sm:max-h-[85vh] sm:max-w-lg sm:rounded-xl">
            <div className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div className="min-w-0">
                <Dialog.Title className="truncate text-body-lg font-semibold text-ink">
                  {detail ? `${detail.courseTitle} — Grade Details` : "Grade Details"}
                </Dialog.Title>
                <Dialog.Description className="mt-0.5 text-sm-fluid text-ink-muted">
                  {detail?.institutionName || "University Course"}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close grade details"
                  className="shrink-0 rounded-lg p-1.5 text-ink-muted transition hover:bg-surface hover:text-ink"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            {detail && (
              <div className="flex-1 overflow-y-auto scrollbar-brand p-5">
                <div className="flex items-center justify-between rounded-xl bg-tint-student p-4">
                  <div className="text-center">
                    <p className="text-sm-fluid text-brand-strong">Score</p>
                    <p className="text-metric font-semibold text-ink">
                      {detail.score ?? "—"}
                      {detail.score != null && <span className="text-sm-fluid text-ink-muted">%</span>}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm-fluid text-brand-strong">Grade</p>
                    <p className="text-metric font-semibold text-ink">{detail.grade ?? "—"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm-fluid text-brand-strong">GPA</p>
                    <p className="text-metric font-semibold text-ink">
                      {gpaPoints != null ? gpaPoints.toFixed(1) : "—"}
                    </p>
                  </div>
                </div>

                {detail.performanceCategory && (
                  <p className="mt-3 text-sm-fluid text-ink-muted">
                    Category: <span className="font-medium text-ink">{detail.performanceCategory}</span>
                    {detail.categoryScore != null && (
                      <span className="ml-2 font-medium text-ink">· {detail.categoryScore}%</span>
                    )}
                  </p>
                )}

                <section className="mt-6">
                  <h3 className="mb-3 flex items-center gap-2 text-sm-fluid font-semibold text-ink">
                    <ListChecks size={16} className="text-brand" aria-hidden="true" />
                    Quiz Scores
                    <span className="text-sm-fluid font-normal text-ink-muted">
                      ({detail.quizzes.length})
                    </span>
                  </h3>
                  {detail.quizzes.length === 0 ? (
                    <p className="text-sm-fluid text-ink-muted">No quizzes in this course.</p>
                  ) : (
                    <ul className="space-y-2">
                      {detail.quizzes.map((q) => (
                        <li
                          key={q.lessonId}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5"
                        >
                          <span className="min-w-0 truncate text-sm-fluid text-ink">{q.title}</span>
                          <span className="flex shrink-0 items-center gap-2 text-sm-fluid">
                            {q.bestScore == null ? (
                              <span className="text-ink-muted">Not attempted</span>
                            ) : (
                              <>
                                <span className="font-medium text-ink">{q.bestScore}%</span>
                                {q.passed ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-sm font-medium text-success">
                                    <CheckCircle2 size={12} aria-hidden="true" />
                                    Passed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-sm font-medium text-red-700">
                                    <XCircle size={12} aria-hidden="true" />
                                    Not passed
                                  </span>
                                )}
                              </>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className="mt-6">
                  <h3 className="mb-3 flex items-center gap-2 text-sm-fluid font-semibold text-ink">
                    <ClipboardList size={16} className="text-brand" aria-hidden="true" />
                    Submissions
                    <span className="text-sm-fluid font-normal text-ink-muted">
                      ({detail.submissions.length})
                    </span>
                  </h3>
                  {detail.submissions.length === 0 ? (
                    <p className="text-sm-fluid text-ink-muted">No tasks in this course.</p>
                  ) : (
                    <ul className="space-y-2">
                      {detail.submissions.map((s) => {
                        const statusLabel = s.status === "completed" ? "Completed" : s.status === "submitted" ? "Submitted" : "Not submitted";
                        const statusClass = s.status === "completed" ? "bg-success-soft text-success" : s.status === "submitted" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-ink-muted";
                        return (
                          <li
                            key={s.lessonId}
                            className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5"
                          >
                            <span className="min-w-0 truncate text-sm-fluid text-ink">{s.title}</span>
                            <span className="flex shrink-0 flex-col items-end gap-0.5 text-right">
                              <span className={`badge ${statusClass}`}>{statusLabel}</span>
                              {s.submittedAt && (
                                <span className="text-sm-fluid text-ink-muted">
                                  {formatRelativeTime(s.submittedAt)}
                                </span>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
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
  const [detailCourseId, setDetailCourseId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const allGrades = useMemo(() => getGrades("all"), []);
  const universityGrades = useMemo(
    () => allGrades.filter((g) => g.type === "university"),
    [allGrades]
  );

  const handleView = (courseId) => {
    setDetailCourseId(courseId);
    setDialogOpen(true);
  };

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
      <Motion.div variants={fadeIn} initial="hidden" animate="visible" className="mt-6">
        <GradeTable grades={universityGrades} onView={handleView} />
      </Motion.div>
      <GradeDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        courseId={detailCourseId}
      />
    </div>
  );
}
