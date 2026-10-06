export const CHART_ACCENTS = ["#D62A91", "#5F6FFF", "#10B981", "#F59E0B"];

export const CHART_PINK = "#D62A91";
export const CHART_BLUE = "#5F6FFF";
export const CHART_GREEN = "#10B981";
export const CHART_AMBER = "#F59E0B";

// Notebook palette (StudentNotesPage)
export const NOTEBOOK_COLORS = ["#C47A9B", "#8B9DC3", "#7BA3BF", "#8DBBA1", "#D4B896", "#B5A3C9"];

// Shared Recharts configuration — import from here, never write raw hex in chart props.
// These values match the CSS tokens in src/index.css.

export const GRID_STROKE = "#E5E7EB"; // var(--color-border) — chart grid uses lighter border
export const TICK_FILL = "#494949"; // var(--color-ink-muted)
export const TICK_SIZE = 13;

export const AXIS_DEFAULTS = {
  tick: { fontSize: TICK_SIZE, fill: TICK_FILL },
  axisLine: { stroke: GRID_STROKE },
  tickLine: false,
};

export const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: `1px solid ${GRID_STROKE}`,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  fontSize: 14,
};

export const GRID_DEFAULTS = {
  strokeDasharray: "3 3",
  stroke: GRID_STROKE,
};
