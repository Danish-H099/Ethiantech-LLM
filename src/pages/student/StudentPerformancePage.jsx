import { useMemo } from "react";
import { m as Motion, useReducedMotion } from "motion/react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, TrendingUp, Award, BookOpen, Clock } from "lucide-react";
import {
  performanceByCategory,
  scoreTrend,
  courseScores,
} from "src/data/studentData";
import { CHART_PINK, CHART_BLUE, CHART_GREEN, CHART_AMBER } from "src/data/chartColors";
import { fadeIn, fadeUp, viewportOnce, createStaggerItem } from "src/lib/animationVariants";

const perfStats = [
  { label: "Avg Score", value: "82%", icon: BarChart3, accent: CHART_PINK },
  { label: "Courses Done", value: "2 / 6", icon: BookOpen, accent: CHART_GREEN },
  { label: "Total Hours", value: "47.5", icon: Clock, accent: CHART_BLUE },
  { label: "Rank", value: "Top 15%", icon: Award, accent: CHART_AMBER },
];

function GradeBadge({ grade }) {
  const styles = {
    A: "bg-green-100 text-green-600",
    "A-": "bg-green-100 text-green-600",
    "B+": "bg-amber-100 text-amber-600",
    B: "bg-amber-100 text-amber-600",
    "-": "bg-gray-100 text-ink-muted",
  };
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${styles[grade] || styles["-"]}`}
    >
      {grade}
    </span>
  );
}

function StatusDot({ status }) {
  const colors = {
    Completed: CHART_GREEN,
    "In Progress": CHART_PINK,
    "Not Started": "#9CA3AF",
  };
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: colors[status] }}
      />
      <span className="text-sm text-ink">{status}</span>
    </div>
  );
}

export default function StudentPerformancePage() {
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">
          Performance
        </h1>
        <p className="mt-1 text-md text-ink-muted">
          Your overall learning performance and course scores
        </p>
      </div>

      {/* Stat Cards */}
      <Motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
      >
        {perfStats.map((card, i) => {
          const Icon = card.icon;
          return (
            <Motion.div key={card.label} variants={staggerItem} custom={i}>
              <div className="card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${card.accent}15` }}
                  >
                    <Icon size={22} style={{ color: card.accent }} />
                  </div>
                </div>
                <p className="text-sm text-ink-muted">{card.label}</p>
                <p className="mt-1 page-title">
                  {card.value}
                </p>
              </div>
            </Motion.div>
          );
        })}
      </Motion.div>

      {/* Charts Row */}
      <Motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mb-8 grid gap-6 xl:grid-cols-2"
      >
        {/* Radar Chart */}
        <Motion.div variants={fadeUp}>
          <div className="card p-6">
            <div className="mb-6 flex items-center gap-2">
              <BarChart3 size={18} className="text-brand" />
              <h2 className="text-lg font-semibold text-ink">
                Score by Category
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={performanceByCategory}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fontSize: 12, fill: "#494949" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#494949" }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke={CHART_PINK}
                  fill={CHART_PINK}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  animationDuration={600}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: 14,
                  }}
                  formatter={(value) => [`${value}%`, "Score"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Motion.div>

        {/* Score Trend */}
        <Motion.div variants={fadeUp}>
          <div className="card p-6">
            <div className="mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-brand" />
              <h2 className="text-lg font-semibold text-ink">
                Score Trend
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={scoreTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 13, fill: "#494949" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 13, fill: "#494949" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[50, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: 14,
                  }}
                  formatter={(value) => [`${value}%`, "Score"]}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={CHART_PINK}
                  strokeWidth={2.5}
                  dot={{ fill: CHART_PINK, strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: CHART_PINK }}
                  animationDuration={600}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Motion.div>
      </Motion.div>

      {/* Course Scores Table */}
      <Motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="card p-6">
          <h2 className="mb-6 text-lg font-semibold text-ink">
            Course-wise Scores
          </h2>
          <div className="overflow-x-auto scrollbar-brand">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="table-header">
                  <th className="px-5 py-3 font-medium">Course</th>
                  <th className="px-5 py-3 font-medium">Score</th>
                  <th className="px-5 py-3 font-medium">Grade</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {courseScores.map((item, index) => (
                  <tr
                    key={item.course}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#F7F9FD" : "#ffffff",
                    }}
                    className="table-row"
                  >
                    <td className="px-5 py-3.5 font-medium text-ink">
                      {item.course}
                    </td>
                    <td className="px-5 py-3.5">
                      {item.score > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${item.score}%`,
                                backgroundColor: item.score >= 80 ? CHART_GREEN : item.score >= 60 ? CHART_AMBER : "#CBD6E4",
                              }}
                            />
                          </div>
                          <span className="text-ink">{item.score}%</span>
                        </div>
                      ) : (
                        <span className="text-ink-muted/50">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <GradeBadge grade={item.grade} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusDot status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Motion.div>
    </div>
  );
}
