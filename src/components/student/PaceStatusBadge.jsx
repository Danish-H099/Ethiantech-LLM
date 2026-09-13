const PACE_STATUS_META = {
  ahead: { label: "Ahead", className: "bg-success-soft text-success" },
  "on-track": { label: "On track", className: "bg-blue-100 text-blue-700" },
  behind: { label: "Behind", className: "bg-red-100 text-red-700" },
};

export default function PaceStatusBadge({ status, className = "" }) {
  const meta = PACE_STATUS_META[status] ?? PACE_STATUS_META["on-track"];
  return (
    <span className={`badge ${meta.className} ${className}`}>
      {meta.label}
    </span>
  );
}
