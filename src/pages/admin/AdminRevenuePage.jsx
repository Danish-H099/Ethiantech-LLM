import { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { m as Motion, useReducedMotion } from "motion/react";
import { getMonthlyRevenue, getRevenueByCategory } from "src/services/adminData";
import { CHART_PINK } from "src/lib/chartConfig";
import { GRID_STROKE, TICK_FILL, TOOLTIP_STYLE, GRID_DEFAULTS } from "src/lib/chartConfig";
import { fadeIn, viewportOnce, createStaggerItem } from "src/lib/animationVariants";

const summaryCards = [
  { label: "Total Revenue", value: "$128,430", sub: "All time", up: true, change: "+12.5%" },
  { label: "This Month", value: "$16,330", sub: "December 2024", up: true, change: "+4.5%" },
  { label: "Last Month", value: "$15,600", sub: "November 2024", up: true, change: "+11.5%" },
  { label: "Avg. Monthly", value: "$10,702", sub: "12-month average", up: true, change: "+8.3%" },
];

export default function AdminRevenuePage() {
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );
  const monthlyRevenue = getMonthlyRevenue();
  const revenueByCategory = getRevenueByCategory();

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Revenue</h1>
        <p className="mt-1 text-sm-fluid text-ink-muted">Track your platform revenue and financial performance</p>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card, i) => (
          <Motion.div
            key={card.label}
            custom={i}
            variants={staggerItem}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="card p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm-fluid text-ink-muted">{card.label}</p>
              <span
                className="flex items-center gap-0.5 text-sm-fluid font-medium"
                style={{ color: card.up ? "var(--color-success)" : "var(--color-error)" }}
              >
                {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {card.change}
              </span>
            </div>
            <p className="mt-2 text-metric font-semibold text-ink">{card.value}</p>
            <p className="mt-0.5 text-sm-fluid text-ink-muted/70">{card.sub}</p>
          </Motion.div>
        ))}
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-3">
        <Motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="card p-6 xl:col-span-2"
        >
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-brand" />
            <h2 className="text-body-lg font-semibold text-ink">Monthly Revenue</h2>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_PINK} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_PINK} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray={GRID_DEFAULTS.strokeDasharray} stroke={GRID_STROKE} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 13, fill: TICK_FILL }}
                axisLine={{ stroke: GRID_STROKE }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 13, fill: TICK_FILL }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={CHART_PINK}
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Motion.div>

        <Motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="card p-6"
        >
          <h2 className="mb-6 text-body-lg font-semibold text-ink">Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={revenueByCategory} layout="vertical">
              <CartesianGrid strokeDasharray={GRID_DEFAULTS.strokeDasharray} stroke={GRID_STROKE} horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: TICK_FILL }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fontSize: 13, fill: TICK_FILL }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill={CHART_PINK} radius={[0, 6, 6, 0]} barSize={24} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </Motion.div>
      </div>
    </div>
  );
}
