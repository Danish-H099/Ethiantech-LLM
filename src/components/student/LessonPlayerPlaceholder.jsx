import { Clock, CheckCircle2 } from "lucide-react";
import { LESSON_TYPE_ICONS, DEFAULT_LESSON_ICON, LESSON_TYPE_LABELS } from "src/lib/lessonTypes";
import LessonCompleteButton from "src/components/student/LessonCompleteButton";
export default function LessonPlayerPlaceholder({
  lesson,
  title,
  description,
  isCompleted,
  onComplete,
}) {
  const TypeIcon = LESSON_TYPE_ICONS[lesson.type] ?? DEFAULT_LESSON_ICON;
  const typeLabel = LESSON_TYPE_LABELS[lesson.type] ?? "Lesson";

  const phaseCopy = {
    resource: {
      heading: "Resource preview",
      copy: "This downloadable resource is listed in the syllabus but isn't included in the prototype yet.",
    },
  }[lesson.type] ?? {
    heading: "Activity coming soon",
    copy: "This activity will be available in a later phase.",
  };

  const heading = title ?? phaseCopy.heading;
  const body = description ?? phaseCopy.copy;

  return (
    <div className="card px-6 py-16">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tint-student">
          <TypeIcon size={28} className="text-brand" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-body-lg font-semibold text-ink">{heading}</h2>
        <p className="mx-auto mt-1 max-w-md text-sm-fluid text-ink-muted">{body}</p>
        {isCompleted && (
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-sm-fluid font-medium text-success">
            <CheckCircle2 size={14} aria-hidden="true" />
            Completed
          </span>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="badge bg-surface-soft text-ink-muted">
            <Clock size={13} className="mr-1" aria-hidden="true" />
            {lesson.duration || `${typeLabel} lesson`}
          </span>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-md items-center justify-center">
        <LessonCompleteButton
          isCompleted={isCompleted}
          onComplete={onComplete}
          lessonTitle={lesson.title}
        />
      </div>
    </div>
  );
}
