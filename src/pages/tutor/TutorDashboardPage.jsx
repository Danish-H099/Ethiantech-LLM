import { useMemo } from "react";
import { User } from "lucide-react";
import { m as Motion, useReducedMotion } from "motion/react";
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
import {
  DollarSign,
  Users,
} from "lucide-react";
import { getIcon } from "src/components/IconMap";
import { tutorStats, earningsOverTime, studentsOverTime } from "src/data/tutorDashboard";
import { studentRoster } from "src/data/studentData";
import { CHART_ACCENTS, CHART_PINK } from "src/data/chartColors";
import { fadeIn, fadeUp, viewportOnce, createStaggerItem } from "src/lib/animationVariants";

export default function TutorDashboardPage() {
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );
  const recentStudents = studentRoster.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">
          Dashboard
        </h1>
        <p className="mt-1 text-md text-ink-muted">
          Overview of your courses, earnings, and student enrollments
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
        {tutorStats.map((card, i) => {
          const Icon = getIcon(card.iconName);
          const accent = CHART_ACCENTS[i];
          return (
            <Motion.div key={card.label} variants={staggerItem} custom={i}>
              <div className="card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${accent}15` }}
                  >
                    <Icon size={22} style={{ color: accent }} />
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-13 font-medium"
                    style={{
                      backgroundColor: card.up ? "#DCFCE7" : "#FEE2E2",
                      color: card.up ? "#16A34A" : "#DC2626",
                    }}
                  >
                    {card.change}
                  </span>
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
        {/* Earnings Over Time */}
        <Motion.div variants={fadeUp}>
          <div className="card p-6">
            <div className="mb-6 flex items-center gap-2">
              <DollarSign size={18} className="text-brand" />
              <h2 className="text-lg font-semibold text-ink">
                Earnings Over Time
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={earningsOverTime}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_PINK} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={CHART_PINK} stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: 14,
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, "Earnings"]}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke={CHART_PINK}
                  strokeWidth={2.5}
                  fill="url(#earningsGrad)"
                  animationDuration={600}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Motion.div>

        {/* Student Enrollment Trend */}
        <Motion.div variants={fadeUp}>
          <div className="card p-6">
            <div className="mb-6 flex items-center gap-2">
              <Users size={18} className="text-brand" />
              <h2 className="text-lg font-semibold text-ink">
                Student Enrollment Trend
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={studentsOverTime}>
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
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: 14,
                  }}
                  formatter={(value) => [value.toLocaleString(), "Students"]}
                />
                <Bar
                  dataKey="students"
                  fill={CHART_PINK}
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                  animationDuration={600}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Motion.div>
      </Motion.div>

      {/* Recent Enrollments */}
      <Motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="card p-6">
        <h2 className="mb-6 text-lg font-semibold text-ink">
          Recent Enrollments
        </h2>
        <div className="overflow-x-auto scrollbar-brand">
          <table className="w-full min-w-[500px] border-collapse">
            <thead>
              <tr className="table-header">
                <th className="w-[50px] px-5 py-3 font-medium">#</th>
                <th className="px-5 py-3 font-medium">Student Name</th>
                <th className="px-5 py-3 font-medium">Course</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((student, index) => (
                <tr
                  key={student.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#F7F9FD" : "#ffffff",
                  }}
                  className="table-row"
                >
                  <td className="px-5 py-3.5">{student.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-brand/10">
                        <User size={14} className="text-brand" />
                      </div>
                      <span className="whitespace-nowrap font-medium text-ink">
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="line-clamp-1">{student.course}</span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5">{student.date}</td>
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
