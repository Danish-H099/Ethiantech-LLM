import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
export default function StudentEmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}) {
  const Icon = icon || GraduationCap;
  return (
    <div className={`flex flex-col items-center justify-center px-6 text-center ${className}`}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tint-student">
        <Icon size={28} className="text-accent-student" aria-hidden="true" />
      </div>
      <div role="status">
        <h2 className="mt-4 text-body-lg font-semibold text-ink">{title}</h2>
        {description && (
          <p className="mx-auto mt-1 max-w-sm text-sm-fluid text-ink-muted">{description}</p>
        )}
      </div>
      {action && action.to ? (
        <Link to={action.to} className="btn-brand mt-6 px-5 py-2.5 text-sm-fluid">
          {action.label}
        </Link>
      ) : action?.onClick ? (
        <button type="button" onClick={action.onClick} className="btn-brand mt-6 px-5 py-2.5 text-sm-fluid">
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
