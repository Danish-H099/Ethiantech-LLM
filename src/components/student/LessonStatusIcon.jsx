import { CheckCircle2, PlayCircle, Circle, Lock } from "lucide-react";
import { LESSON_STATUS_META } from "src/lib/lessonStatus";
export default function LessonStatusIcon({ status, size = 18, className = "" }) {
  const meta = LESSON_STATUS_META[status] ?? LESSON_STATUS_META["not-started"];
  const { Icon, className: statusClass } = meta;
  return (
    <Icon
      size={size}
      className={`shrink-0 ${statusClass} ${className}`}
      aria-hidden="true"
    />
  );
}
