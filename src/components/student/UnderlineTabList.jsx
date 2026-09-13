import * as Tabs from "@radix-ui/react-tabs";
export function UnderlineTabList({ ariaLabel, className = "", children }) {
  return (
    <Tabs.List
      aria-label={ariaLabel}
      className={`flex gap-1 overflow-x-auto border-b border-border scrollbar-brand ${className}`}
    >
      {children}
    </Tabs.List>
  );
}
export function UnderlineTab({
  value,
  icon: Icon,
  badge,
  badgeClassName = "",
  children,
  className = "",
}) {
  return (
    <Tabs.Trigger
      value={value}
      className={`group flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm-fluid font-medium transition-colors data-[state=active]:border-accent-student data-[state=active]:text-brand-strong data-[state=inactive]:border-transparent data-[state=inactive]:text-ink-muted hover:text-ink ${className}`}
    >
      {Icon ? <Icon size={16} aria-hidden="true" /> : null}
      {children}
      {badge != null && (
        <span
          className={`badge bg-surface-soft text-ink-muted group-data-[state=active]:bg-tint-student group-data-[state=active]:text-brand-strong ${badgeClassName}`}
        >
          {badge}
        </span>
      )}
    </Tabs.Trigger>
  );
}
