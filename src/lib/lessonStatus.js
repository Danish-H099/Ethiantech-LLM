import { CheckCircle2, PlayCircle, Circle, Lock } from "lucide-react";
export const LESSON_STATUS_META = {
  completed: { Icon: CheckCircle2, label: "Completed", className: "text-success" },
  "in-progress": { Icon: PlayCircle, label: "In progress", className: "text-brand" },
  "not-started": { Icon: Circle, label: "Not started", className: "text-ink-muted" },
  locked: { Icon: Lock, label: "Locked", className: "text-ink-muted/60" },
};
