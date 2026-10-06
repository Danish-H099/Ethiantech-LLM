import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { m as Motion } from "motion/react";
import {
  ArrowLeft,
  Award,
  Building2,
  CheckCircle2,
  ClipboardList,
  Download,
  ListChecks,
  XCircle,
} from "lucide-react";

import { getGradeDetail } from "src/services/studentRepository";
import { DEFAULT_STUDENT_ID } from "src/data/students";
import { fadeIn, viewportOnce } from "src/lib/animationVariants";
import { LESSON_STATUS } from "src/lib/statuses";
import LessonProgressBar from "src/components/student/LessonProgressBar";
import StatusBadge from "src/components/ui/StatusBadge";

const QUIZ_STATUS_META = {
  passed: { label: "Passed", icon: CheckCircle2, className: "bg-success-soft text-success" },
  "not-passed": { label: "Not passed", icon: XCircle, className: "bg-red-100 text-red-700" },
  "not-attempted": { label: "Not attempted", icon: null, className: "bg-gray-100 text-ink-muted" },
};

const SUBMISSION_STATUS_META = {
  completed: { label: "Completed", className: "bg-success-soft text-success" },
  submitted: { label: "Submitted", className: "bg-amber-100 text-amber-700" },
  "not-submitted": { label: "Not submitted", className: "bg-gray-100 text-ink-muted" },
};

function MetricCard({ label, value, sub }) {
  return (
    <div className="rounded-xl bg-surface-soft px-4 py-3 text-center">
      <p className="text-metric font-semibold leading-tight text-ink">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-ink-muted">{label}</p>
      {sub && <p className="text-xs text-ink-muted">{sub}</p>}
    </div>
  );
}

function ProgressHeroCard({ detail }) {
  const attempted = detail.quizzes.filter((q) => q.bestScore != null).length;
  const totalQuizzes = detail.quizzes.length;
  const submitted = detail.submissions.filter((s) => s.status === LESSON_STATUS.COMPLETED || s.status === "submitted").length;
  const totalSubmissions = detail.submissions.length;

  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="card p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-body-lg font-semibold text-ink">
            {detail.courseTitle}
          </h2>
          {detail.institutionName && (
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-muted">
              <Building2 size={14} aria-hidden="true" />
              {detail.institutionName}
            </p>
          )}
        </div>
        <StatusBadge status={detail.status} />
        {detail.grade && (
          <span className="badge bg-surface-soft text-ink-muted">
            Grade {detail.grade}
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          label="Score"
          value={detail.score != null ? `${detail.score}` : "—"}
        />
        <MetricCard
          label="Progress"
          value={`${detail.progress ?? 0}%`}
        />
        <MetricCard
          label="Quizzes"
          value={`${attempted}/${totalQuizzes}`}
          sub="attempted"
        />
        <MetricCard
          label="Tasks"
          value={`${submitted}/${totalSubmissions}`}
          sub="submitted"
        />
      </div>

      <div className="mt-4">
        <LessonProgressBar
          percentage={detail.progress ?? 0}
          label={`Course progress: ${detail.progress ?? 0}%`}
          color="var(--color-accent-student)"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          to={`/student/course/${detail.courseId}`}
          className="text-sm font-medium text-brand transition hover:text-brand-strong"
        >
          Go to Course
        </Link>
      </div>
    </Motion.div>
  );
}

function QuizScoresSection({ quizzes }) {
  if (quizzes.length === 0) return null;

  const attempted = quizzes.filter((q) => q.bestScore != null).length;

  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="card p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
        <ListChecks size={16} className="text-brand" aria-hidden="true" />
        Quiz Scores
        <span className="text-sm font-normal text-ink-muted">
          ({attempted}/{quizzes.length} attempted)
        </span>
      </h3>

      <div className="space-y-3">
        {quizzes.map((quiz) => {
          let statusKey = "not-attempted";
          if (quiz.bestScore != null) {
            statusKey = quiz.passed ? "passed" : "not-passed";
          }
          const meta = QUIZ_STATUS_META[statusKey];
          const StatusIcon = meta.icon;
          const attemptsRemaining =
            quiz.maxAttempts != null ? quiz.maxAttempts - quiz.attemptCount : null;

          return (
            <div
              key={quiz.lessonId}
              className="rounded-lg border border-border px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{quiz.title}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    Passing score: {quiz.passingScore}%
                    {attemptsRemaining != null && (
                      <> · {attemptsRemaining} attempt{attemptsRemaining === 1 ? "" : "s"} remaining</>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {quiz.bestScore != null ? (
                    <span className="text-sm font-semibold text-ink">{quiz.bestScore}%</span>
                  ) : (
                    <span className="text-sm text-ink-muted">—</span>
                  )}
                  <span className={`badge inline-flex items-center gap-1 text-xs ${meta.className}`}>
                    {StatusIcon && <StatusIcon size={12} aria-hidden="true" />}
                    {meta.label}
                  </span>
                </div>
              </div>
              {quiz.lastAttemptedAt && (
                <p className="mt-1 text-xs text-ink-muted">
                  Last attempted {new Date(quiz.lastAttemptedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Motion.div>
  );
}

function SubmissionsSection({ submissions }) {
  if (submissions.length === 0) return null;

  const submitted = submissions.filter(
    (s) => s.status === LESSON_STATUS.COMPLETED || s.status === "submitted"
  ).length;

  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="card p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
        <ClipboardList size={16} className="text-brand" aria-hidden="true" />
        Projects &amp; Submissions
        <span className="text-sm font-normal text-ink-muted">
          ({submitted}/{submissions.length} submitted)
        </span>
      </h3>

      <div className="space-y-3">
        {submissions.map((sub) => {
          const meta =
            SUBMISSION_STATUS_META[sub.status] ?? SUBMISSION_STATUS_META["not-submitted"];

          return (
            <div
              key={sub.lessonId}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{sub.title}</p>
                {sub.submittedAt && (
                  <p className="mt-0.5 text-xs text-ink-muted">
                    Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span className={`badge text-xs ${meta.className}`}>{meta.label}</span>
            </div>
          );
        })}
      </div>
    </Motion.div>
  );
}

function SkillsCard({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="card p-6"
    >
      <h3 className="mb-3 text-sm font-semibold text-ink">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="badge bg-surface-soft text-ink-muted">
            {skill}
          </span>
        ))}
      </div>
    </Motion.div>
  );
}

function CertificateCard({ detail }) {
  if (!detail.certificate) return null;

  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="card p-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tint-student">
          <Award size={24} className="text-brand" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-ink">{detail.certificate}</h3>
          <p className="mt-1 text-sm text-ink-muted">
            {detail.institutionName
              ? `Earn a verifiable credential from ${detail.institutionName}.`
              : "Complete the course to earn your certificate."}
          </p>
          {detail.status === "Completed" ? (
            <button
              type="button"
              className="btn-brand mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm"
            >
              <Download size={16} aria-hidden="true" />
              Download Certificate
            </button>
          ) : (
            <p className="mt-3 text-sm text-ink-muted">
              Complete the course to download your certificate.
            </p>
          )}
        </div>
      </div>
    </Motion.div>
  );
}

export default function StudentCourseGradesPage() {
  const { courseId } = useParams();
  const detail = useMemo(() => getGradeDetail(DEFAULT_STUDENT_ID, courseId), [courseId]);

  if (!detail) {
    return (
      <div>
        <Link
          to="/student/grades"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand transition hover:text-brand-strong"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to My Grades
        </Link>
        <div className="card px-4 py-14 text-center">
          <p className="text-ink-muted">Course not found or no grade data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/student/grades"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand transition hover:text-brand-strong"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to My Grades
      </Link>

      <div className="space-y-6">
        <ProgressHeroCard detail={detail} />
        <QuizScoresSection quizzes={detail.quizzes} />
        <SubmissionsSection submissions={detail.submissions} />
        <SkillsCard skills={detail.skills} />
        <CertificateCard detail={detail} />
      </div>
    </div>
  );
}
