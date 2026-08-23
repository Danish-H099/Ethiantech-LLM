// Shared Recharts configuration — import from here, never write raw hex in chart props.
// These values match the CSS tokens in src/index.css.

export const GRID_STROKE = "#E5E7EB"; // var(--color-border) — chart grid uses lighter border
export const TICK_FILL = "#494949"; // var(--color-ink-muted)
export const TICK_SIZE = 13;
export const TICK_SIZE_SM = 12;
export const TICK_SIZE_XS = 11;

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

// Trend badge colors (green = up, red = down)
export const TREND_UP_BG = "#DCFCE7";
export const TREND_UP_TEXT = "#16A34A";
export const TREND_DOWN_BG = "#FEE2E2";
export const TREND_DOWN_TEXT = "#DC2626";
