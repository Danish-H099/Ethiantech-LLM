import { CheckCircle2, CheckCircle } from "lucide-react";
export default function LessonCompleteButton({ isCompleted, disabled = false, onComplete, lessonTitle }) {
  const title = lessonTitle || "lesson";
  const label = isCompleted ? "Completed" : "Mark as complete";

  if (isCompleted) {
    return (
      <button
        type="button"
        onClick={onComplete}
        disabled
        aria-label={`${title} completed`}
        className="inline-flex cursor-default items-center gap-2 rounded-lg border border-success bg-success-soft px-4 py-2.5 text-sm-fluid font-semibold text-success"
      >
        <CheckCircle2 size={18} aria-hidden="true" />
        {label}
      </button>
    );
  }

  if (disabled) {
    return (
      <button
        type="button"
        onClick={onComplete}
        disabled
        aria-label={`Mark ${title} as complete (unavailable until media is attached)`}
        className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-border bg-gray-100 px-4 py-2.5 text-sm-fluid font-semibold text-ink-muted/60"
      >
        <CheckCircle size={18} aria-hidden="true" />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onComplete}
      aria-label={`Mark ${title} as complete`}
      className="btn-brand px-4 py-2.5 text-sm-fluid"
    >
      <CheckCircle size={18} aria-hidden="true" />
      {label}
    </button>
  );
}
