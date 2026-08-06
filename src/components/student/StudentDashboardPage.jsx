import { User } from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  BookOpen,
  CheckCircle,
  Clock,
  StickyNote,
} from "lucide-react";
import {
  studentStats,
  learningActivity,
  completionStatus,
  recentNotes,
} from "../../data/studentData";
import { CHART_ACCENTS, CHART_PINK } from "../../data/chartColors";

const icons = [BookOpen, CheckCircle, Clock, StickyNote];

export default function StudentDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">
          Student Dashboard
        </h1>
        <p className="mt-1 text-md text-ink-muted">
          Track your learning progress and manage your courses
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {studentStats.map((card, i) => {
          const Icon = icons[i];
          const accent = CHART_ACCENTS[i];
          return (
            <div
              key={card.label}
              className="card p-6"
            >
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
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid gap-6 xl:grid-cols-2">
        {/* Learning Activity */}
        <div className="card p-6">
          <div className="mb-6 flex items-center gap-2">
            <Clock size={18} className="text-brand" />
            <h2 className="text-lg font-semibold text-ink">
              Learning Activity
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={learningActivity}>
              <defs>
                <linearGradient id="learningGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_PINK} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_PINK} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 13, fill: "#494949" }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 13, fill: "#494949" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}h`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: 14,
                }}
                formatter={(value) => [`${value}h`, "Hours"]}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke={CHART_PINK}
                strokeWidth={2.5}
                fill="url(#learningGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Course Completion */}
        <div className="card p-6">
          <div className="mb-6 flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-500" />
            <h2 className="text-lg font-semibold text-ink">
              Course Completion
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={completionStatus}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {completionStatus.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: 14,
                }}
                formatter={(value) => [value, "Courses"]}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={10}
                formatter={(value) => (
                  <span className="text-13 text-ink-muted">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Notes */}
      <div className="card p-6">
        <div className="mb-6 flex items-center gap-2">
          <StickyNote size={18} className="text-amber-500" />
          <h2 className="text-lg font-semibold text-ink">
            Recent Notes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse">
            <thead>
              <tr className="table-header">
                <th className="px-5 py-3 font-medium">Course</th>
                <th className="px-5 py-3 font-medium">Note</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentNotes.map((note, index) => (
                <tr
                  key={note.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#F7F9FD" : "#ffffff",
                  }}
                  className="table-row"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-brand/10">
                        <User size={14} className="text-brand" />
                      </div>
                      <span className="whitespace-nowrap font-medium text-ink">
                        {note.courseName}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="line-clamp-1">{note.preview}</span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5">{note.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
