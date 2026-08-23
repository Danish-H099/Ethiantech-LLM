import { CheckCircle, Clock, Play } from "lucide-react";

const STYLES = {
  Completed: "bg-success-soft text-success",
  "In Progress": "bg-tint-student text-brand-strong",
  "Not Started": "bg-gray-100 text-ink-muted",
};

const ICONS = {
  Completed: CheckCircle,
  "In Progress": Clock,
  "Not Started": Play,
};
export default function StatusBadge({ status, className = "" }) {
  const Icon = ICONS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm-fluid font-medium ${
        STYLES[status] ?? "bg-gray-100 text-ink-muted"
      } ${className}`}
    >
      {Icon && <Icon size={13} aria-hidden="true" />}
      {status}
    </span>
  );
}
