import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { m as Motion } from "motion/react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Award,
  CheckCircle2,
  ClipboardList,
  Eye,
  ListChecks,
  X,
  XCircle,
} from "lucide-react";

import { getGrades, getGradeDetail } from "src/data/studentRepository";
import { formatRelativeTime } from "src/lib/format";
import { fadeIn } from "src/lib/animationVariants";
import { hideOnError } from "src/lib/assets";
import StudentEmptyState from "src/components/student/StudentEmptyState";
import StatusBadge from "src/components/StatusBadge";
import {
  UnderlineTabList,
  UnderlineTab,
} from "src/components/student/UnderlineTabList";

const GRADE_FILTERS = [
  { label: "All Courses", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "In Progress", value: "in-progress" },
];

// Submission status presentation inside the detail dialog.
const SUBMISSION_STATUS_META = {
  completed: { label: "Completed", className: "bg-success-soft text-success" },
  submitted: { label: "Submitted", className: "bg-amber-100 text-amber-700" },
  "not-submitted": { label: "Not submitted", className: "bg-gray-100 text-ink-muted" },
};

// ---------------------------------------------------------------- sections

function PageHeading() {
  return (
    <div className="mb-8">
      <h1 className="page-title">Grades &amp; Feedback</h1>
      <p className="mt-1 text-sm-fluid text-ink-muted">
        Review your scores and instructor feedback across enrolled courses.
      </p>
    </div>
  );
}

function FilterTabBar() {
  return (
    <UnderlineTabList ariaLabel="Filter courses by status">
      {GRADE_FILTERS.map((f) => {
        const count =
          f.value === "all"
            ? getGrades("all").length
            : getGrades(f.value).length;
        return (
          <UnderlineTab key={f.value} value={f.value} badge={count}>
            {f.label}
          </UnderlineTab>
        );
      })}
    </UnderlineTabList>
  );
}

function EmptyGradesPanel() {
  return (
    <div className="card mt-6 px-4 py-14">
      <StudentEmptyState
        icon={Award}
        title="No grades yet"
        description="Complete tasks and quizzes to see your scores and feedback here."
        action={{ label: "Back to Dashboard", to: "/student/dashboard" }}
      />
    </div>
  );
}

function GradesTabContent({ value, grades, onView }) {
  return (
    <Tabs.Content value={value}>
      {grades.length > 0 ? (
        <Motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mt-6"
        >
          <GradeTable grades={grades} onView={onView} />
        </Motion.div>
      ) : (
        <EmptyGradesPanel />
      )}
    </Tabs.Content>
  );
}

// ------------------------------------------------------------- grade table

function DesktopGradeTable({ grades, onView }) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-border scrollbar-brand sm:block">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="table-header">
            <th className="px-5 py-3 font-medium">Course</th>
            <th className="px-5 py-3 font-medium">Score</th>
            <th className="px-5 py-3 font-medium">Grade</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 text-right font-medium">Details</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g) => (
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
              <td className="whitespace-nowrap px-5 py-3.5 font-medium text-ink">
                {g.score ?? "—"}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 font-medium text-ink">
                {g.grade ?? "—"}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileGradeCards({ grades, onView }) {
  return (
    <div className="space-y-4 sm:hidden">
      {grades.map((g) => (
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
              <p className="truncate text-sm-fluid text-ink-muted">{g.instructorName}</p>
            </div>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm-fluid">
            <dt className="text-ink-muted">Score</dt>
            <dd className="text-right font-medium text-ink">{g.score ?? "—"}</dd>
            <dt className="text-ink-muted">Grade</dt>
            <dd className="text-right font-medium text-ink">{g.grade ?? "—"}</dd>
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
      ))}
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

// ----------------------------------------------------------- detail dialog

function OverallScoreBlock({ detail }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-tint-student p-4">
      <div>
        <p className="text-sm-fluid text-brand-strong">Overall Score</p>
        <p className="text-metric font-semibold text-ink">
          {detail.score ?? "—"}
          {detail.score != null && <span className="text-sm-fluid text-ink-muted"> / 100</span>}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm-fluid text-brand-strong">Grade</p>
        <p className="text-metric font-semibold text-ink">{detail.grade ?? "—"}</p>
      </div>
    </div>
  );
}

function QuizScoresList({ quizzes }) {
  if (quizzes.length === 0) {
    return <p className="text-sm-fluid text-ink-muted">No quizzes in this course.</p>;
  }

  return (
    <ul className="space-y-2">
      {quizzes.map((q) => (
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
                <span className="text-ink-muted">
                  {q.attemptCount} attempt{q.attemptCount === 1 ? "" : "s"}
                </span>
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SubmissionsList({ submissions }) {
  if (submissions.length === 0) {
    return <p className="text-sm-fluid text-ink-muted">No tasks in this course.</p>;
  }

  return (
    <ul className="space-y-2">
      {submissions.map((s) => {
        const meta = SUBMISSION_STATUS_META[s.status] ?? SUBMISSION_STATUS_META["not-submitted"];
        return (
          <li
            key={s.lessonId}
            className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5"
          >
            <span className="min-w-0 truncate text-sm-fluid text-ink">{s.title}</span>
            <span className="flex shrink-0 flex-col items-end gap-0.5 text-right">
              <span className={`badge ${meta.className}`}>{meta.label}</span>
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
  );
}

function GradeDetailDialog({ open, onOpenChange, courseId }) {
  const detail = open && courseId != null ? getGradeDetail(courseId) : null;

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
                  Overall score and per-assessment breakdown
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
                <OverallScoreBlock detail={detail} />

                {detail.performanceCategory && (
                  <p className="mt-3 text-sm-fluid text-ink-muted">
                    {detail.performanceCategory}
                    {detail.categoryScore != null && (
                      <span className="font-medium text-ink"> · {detail.categoryScore}</span>
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
                  <QuizScoresList quizzes={detail.quizzes} />
                </section>

                <section className="mt-6">
                  <h3 className="mb-3 flex items-center gap-2 text-sm-fluid font-semibold text-ink">
                    <ClipboardList size={16} className="text-brand" aria-hidden="true" />
                    Submissions
                    <span className="text-sm-fluid font-normal text-ink-muted">
                      ({detail.submissions.length})
                    </span>
                  </h3>
                  <SubmissionsList submissions={detail.submissions} />
                </section>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ------------------------------------------------------------------- page

export default function StudentGradesPage() {
  const [filter, setFilter] = useState("all");
  const [detailCourseId, setDetailCourseId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const grades = useMemo(() => getGrades(filter), [filter]);

  const handleView = (courseId) => {
    setDetailCourseId(courseId);
    setDialogOpen(true);
  };

  return (
    <div>
      <PageHeading />

      <Tabs.Root value={filter} onValueChange={setFilter}>
        <FilterTabBar />

        {GRADE_FILTERS.map((f) => (
          <GradesTabContent
            key={f.value}
            value={f.value}
            grades={grades}
            onView={handleView}
          />
        ))}
      </Tabs.Root>

      <GradeDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        courseId={detailCourseId}
      />
    </div>
  );
}
