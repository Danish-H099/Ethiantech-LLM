/* eslint-disable react-hooks/static-components -- Icon resolved from IconMap per render via getIcon() is the project convention */
import { getIcon } from "src/components/ui/IconMap";


export default function DashboardStatCard({ label, value, change, up, accent, iconName, icon: IconProp }) {
  const Icon = IconProp || getIcon(iconName);
  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}15` }}
        >
          <Icon size={22} style={{ color: accent }} />
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-sm-fluid font-medium"
          style={{
            backgroundColor: up ? "var(--color-success-soft)" : "var(--color-error-soft)",
            color: up ? "var(--color-success)" : "var(--color-error)",
          }}
        >
          {change}
        </span>
      </div>
      <p className="text-sm-fluid text-ink-muted">{label}</p>
      <p className="mt-1 page-title">{value}</p>
    </div>
  );
}

