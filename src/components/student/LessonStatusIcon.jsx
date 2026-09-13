import { CheckCircle2, PlayCircle, Circle, Lock } from "lucide-react";
import { LESSON_STATUS_META } from "src/lib/lesson";
import { LESSON_STATUS } from "src/lib/statuses";

export default function LessonStatusIcon({ status, size = 18, className = "" }) {
  const meta = LESSON_STATUS_META[status] ?? LESSON_STATUS_META[LESSON_STATUS.NOT_STARTED];
  const { Icon, className: statusClass } = meta;
  return (
    <Icon
      size={size}
      className={`shrink-0 ${statusClass} ${className}`}
      aria-hidden="true"
    />
  );
}
