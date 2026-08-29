import {
  CheckCircle2,
  PlayCircle,
  Circle,
  Lock,
  FileText,
  ListChecks,
  Wrench,
  FolderKanban,
  Download,
} from "lucide-react";
import { LESSON_STATUS } from "src/lib/statuses";

export const LESSON_STATUS_META = {
  [LESSON_STATUS.COMPLETED]: { Icon: CheckCircle2, label: "Completed", className: "text-success" },
  [LESSON_STATUS.IN_PROGRESS]: { Icon: PlayCircle, label: "In progress", className: "text-brand" },
  [LESSON_STATUS.NOT_STARTED]: { Icon: Circle, label: "Not started", className: "text-ink-muted" },
  [LESSON_STATUS.LOCKED]: { Icon: Lock, label: "Locked", className: "text-ink-muted/60" },
};

export const LESSON_TYPE_ICONS = {
  video: PlayCircle,
  article: FileText,
  quiz: ListChecks,
  exercise: Wrench,
  project: FolderKanban,
  resource: Download,
};
export const DEFAULT_LESSON_ICON = PlayCircle;
export const LESSON_TYPE_LABELS = {
  video: "Video",
  article: "Article",
  quiz: "Quiz",
  exercise: "Exercise",
  project: "Project",
  resource: "Resource",
};
export const DEFAULT_LESSON_TYPE_LABEL = "Lesson";

export function buildLessonId(courseId, sectionIndex, lessonIndex) {
  return `${courseId}-s${sectionIndex}-l${lessonIndex}`;
}