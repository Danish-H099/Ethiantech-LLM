import {
  PlayCircle,
  FileText,
  ListChecks,
  Wrench,
  FolderKanban,
  Download,
} from "lucide-react";
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
