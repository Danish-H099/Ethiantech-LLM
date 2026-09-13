import * as Dialog from "@radix-ui/react-dialog";
import {
  CheckCircle2,
  ClipboardList,
  Download,
  ListChecks,
  X,
  XCircle,
} from "lucide-react";

import { getGradeDetail } from "src/services/studentRepository";
import { formatRelativeTime } from "src/lib/format";

const GRADE_POINTS = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  D: 1.0,
  F: 0.0,
};

const gradePoints = (grade) => (grade in GRADE_POINTS ? GRADE_POINTS[grade] : null);

const SUBMISSION_STATUS_META = {
  completed: { label: "Completed", className: "bg-success-soft text-success" },
  submitted: { label: "Submitted", className: "bg-amber-100 text-amber-700" },
  "not-submitted": { label: "Not submitted", className: "bg-gray-100 text-ink-muted" },
};

function OverallScoreBlock({ detail }) {
  const points = gradePoints(detail.grade);
  return (
    <div className="rounded-xl bg-tint-student p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm-fluid text-brand-strong">
            {detail.type === "university" ? "Overall Grade" : "Completion"}
          </p>
          <p className="text-metric font-semibold text-ink">
            {detail.type === "university" ? (detail.grade ?? "—") : `${detail.progress ?? 0}%`}
          </p>
          {detail.type === "university" && points != null && (
            <p className="text-sm-fluid text-ink-muted">{points.toFixed(1)} GPA points</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm-fluid text-brand-strong">Score</p>
          <p className="text-metric font-semibold text-ink">
            {detail.score ?? "—"}
            {detail.score != null && <span className="text-sm-fluid text-ink-muted"> / 100</span>}
          </p>
        </div>
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

export default function GradeDetailDrawer({ open, onOpenChange, courseId }) {
  const detail = open && courseId != null ? getGradeDetail(courseId) : null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />

        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:translate-x-full data-[state=open]:translate-x-0">
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
            <div className="min-w-0">
              <Dialog.Title className="truncate text-body-lg font-semibold text-ink">
                {detail ? `${detail.courseTitle}` : "Grade Details"}
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-sm-fluid text-ink-muted">
                {detail
                  ? `${detail.type === "university" ? "University credential" : "Standalone course"} · overall result and breakdown`
                  : "Overall result and per-assessment breakdown"}
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
            <div className="flex-1 overflow-y-auto scrollbar-brand p-6">
              <OverallScoreBlock detail={detail} />

              {detail.type === "standalone" && detail.status === "Completed" && (
                <button
                  type="button"
                  className="btn-brand mt-4 w-full px-5 py-2.5 text-sm-fluid"
                >
                  <Download size={16} aria-hidden="true" />
                  Download Certificate
                </button>
              )}

              {detail.skills?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {detail.skills.map((skill) => (
                    <span key={skill} className="badge bg-surface-soft text-ink-muted">
                      {skill}
                    </span>
                  ))}
                </div>
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

              <p className="mt-6 text-sm-fluid text-ink-muted">
                Instructor feedback is available inside each lesson once work is reviewed.
              </p>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
