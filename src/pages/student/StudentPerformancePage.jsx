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
  getPerformanceByCategory,
  getScoreTrend,
  getCourseScores,
} from "src/data/studentRepository";
import { CHART_PINK, CHART_BLUE, CHART_GREEN, CHART_AMBER } from "src/data/chartColors";
import {
  GRID_STROKE,
  TICK_FILL,
  TOOLTIP_STYLE,
  GRID_DEFAULTS,
} from "src/data/ChartDefaults";
import { getIcon } from "src/components/IconMap";
import { fadeIn, fadeUp, viewportOnce, createStaggerItem } from "src/lib/animationVariants";
import LessonProgressBar from "src/components/student/LessonProgressBar";

const SCORE_COLOR_MID = "#CBD6E4";
const STATUS_DOT_NEUTRAL = "#9CA3AF";

const GRADE_BADGE_STYLES = {
  A: "bg-green-100 text-green-600",
  "A-": "bg-green-100 text-green-600",
  "B+": "bg-amber-100 text-amber-600",
  B: "bg-amber-100 text-amber-600",
  "-": "bg-gray-100 text-ink-muted",
};

const STATUS_DOT_COLORS = {
  Completed: CHART_GREEN,
  "In Progress": CHART_PINK,
  "Not Started": STATUS_DOT_NEUTRAL,
};

function buildPerfStats(scores) {
  return [
    {
      label: "Avg Score",
      value: `${Math.round(scores.reduce((sum, c) => sum + (c.score || 0), 0) / scores.length)}%`,
      icon: BarChart3,
      accent: CHART_PINK,
    },
    {
      label: "Courses Done",
      value: `${scores.filter((c) => c.status === "Completed").length} / ${scores.length}`,
      icon: BookOpen,
      accent: CHART_GREEN,
    },
    {
      label: "Total Hours",
      value: "47.5",
      icon: Clock,
      accent: CHART_BLUE,
    },
    {
      label: "Rank",
      value: "Top 15%",
      icon: Award,
      accent: CHART_AMBER,
    },
  ];
}

// ---------------------------------------------------------------- sections

function PageHeading() {
  return (
    <div className="mb-8">
      <h1 className="page-title">Performance</h1>
      <p className="mt-1 text-sm-fluid text-ink-muted">Your overall learning performance and course scores</p>
    </div>
  );
}

function StatCardsGrid({ cards }) {
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card, i) => {
        const Icon = card.icon || getIcon(card.iconName);
        return (
          <Motion.div key={card.label} variants={staggerItem} custom={i}>
            <div className="card flex flex-col gap-3 p-5">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${card.accent}15` }}
                >
                  <Icon size={18} style={{ color: card.accent }} />
                </div>
                <p className="text-sm-fluid font-medium text-ink-muted">{card.label}</p>
              </div>
              <p className="text-metric font-semibold leading-tight text-ink">{card.value}</p>
              {card.sub &&
                (card.subBadge ? (
                  <span className="inline-flex w-fit items-center rounded-full bg-success-soft px-2 py-0.5 text-sm-fluid font-medium text-success">
                    {card.sub}
                  </span>
                ) : (
                  <p className="text-sm-fluid text-ink-muted">{card.sub}</p>
                ))}
            </div>
          </Motion.div>
        );
      })}
    </Motion.div>
  );
}

function ChartsRow({ byCategory, trend }) {
  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-8 grid gap-6 xl:grid-cols-2"
    >
      <ChartCard title="Score by Category" icon={BarChart3}>
        <ScoreByCategoryChart data={byCategory} />
      </ChartCard>

      <ChartCard title="Score Trend" icon={TrendingUp}>
        <ScoreTrendChart data={trend} />
      </ChartCard>
    </Motion.div>
  );
}

function CourseScoresTable({ scores }) {
  return (
    <Motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
      <div className="card p-6">
        <h2 className="mb-6 text-body-lg font-semibold text-ink">Course-wise Scores</h2>
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
              {scores.map((item) => (
                <tr key={item.course} className="table-row odd:bg-surface-soft">
                  <td className="px-5 py-3.5 font-medium text-ink">{item.course}</td>
                  <td className="px-5 py-3.5">
                    <ScoreCell score={item.score} />
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
  );
}

// ------------------------------------------------------------------ charts

function ScoreByCategoryChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data}>
        <PolarGrid stroke={GRID_STROKE} />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: TICK_FILL }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 11, fill: TICK_FILL }} />
        <Radar
          name="Score"
          dataKey="score"
          stroke={CHART_PINK}
          fill={CHART_PINK}
          fillOpacity={0.2}
          strokeWidth={2}
          animationDuration={600}
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`${value}%`, "Score"]} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function ScoreTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
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
          domain={[50, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`${value}%`, "Score"]} />
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
  );
}

function ChartCard({ title, icon: Icon, children }) {
  return (
    <Motion.div variants={fadeUp}>
      <div className="card p-6">
        <div className="mb-6 flex items-center gap-2">
          {Icon && <Icon size={18} className="text-brand" aria-hidden="true" />}
          <h2 className="text-body-lg font-semibold text-ink">{title}</h2>
        </div>
        {children}
      </div>
    </Motion.div>
  );
}

// ------------------------------------------------------------------ cells

function ScoreCell({ score }) {
  if (!score || score <= 0) return <span className="text-ink-muted/50">-</span>;

  return (
    <div className="flex items-center gap-2">
      <div className="w-16">
        <LessonProgressBar
          percentage={score}
          label={`Score: ${score}%`}
          color={score >= 80 ? CHART_GREEN : score >= 60 ? CHART_AMBER : SCORE_COLOR_MID}
        />
      </div>
      <span className="text-ink">{score}%</span>
    </div>
  );
}

function GradeBadge({ grade }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm-fluid font-medium ${
        GRADE_BADGE_STYLES[grade] || GRADE_BADGE_STYLES["-"]
      }`}
    >
      {grade}
    </span>
  );
}

function StatusDot({ status }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: STATUS_DOT_COLORS[status] }}
      />
      <span className="text-sm-fluid text-ink">{status}</span>
    </div>
  );
}

// ------------------------------------------------------------------- page

export default function StudentPerformancePage() {
  const byCategory = getPerformanceByCategory();
  const trend = getScoreTrend();
  const scores = getCourseScores();

  return (
    <div>
      <PageHeading />

      <StatCardsGrid cards={buildPerfStats(scores)} />

      <ChartsRow byCategory={byCategory} trend={trend} />

      <CourseScoresTable scores={scores} />
    </div>
  );
}
