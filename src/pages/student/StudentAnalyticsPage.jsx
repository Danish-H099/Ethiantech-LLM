import { useMemo, useState } from "react";
import { m as Motion, useReducedMotion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  Activity,
  BarChart3,
  Flame,
  Clock,
  Target,
  TrendingUp,
  Zap,
  CalendarClock,
} from "lucide-react";

import {
  getLearningActivity,
  getStreak,
  getLearningPace,
  getQuizMastery,
  getSkillMastery,
  getStudyActivity,
  getEnrolledCourses,
  getScoreTrend,
} from "src/services/studentRepository";
import {
  CHART_PINK,
  CHART_BLUE,
  CHART_AMBER,
  CHART_GREEN,
  GRID_STROKE,
  TICK_FILL,
  TICK_SIZE,
  AXIS_DEFAULTS,
  TOOLTIP_STYLE,
  GRID_DEFAULTS,
} from "src/lib/chartConfig";
import {
  fadeIn,
  fadeUp,
  viewportOnce,
  createStaggerItem,
} from "src/lib/animationVariants";
import StudyActivityCalendar from "src/components/student/StudyActivityCalendar";
import PaceStatusBadge from "src/components/student/PaceStatusBadge";
import StudentEmptyState from "src/components/student/StudentEmptyState";

function formatCompletionDate(date) {
  if (!date) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
        const Icon = card.icon;
        return (
          <Motion.div key={card.label} variants={staggerItem} custom={i} className="h-full">
            <div className="card flex h-full flex-col gap-3 p-5">
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
              {card.sub && <p className="text-sm-fluid text-ink-muted">{card.sub}</p>}
            </div>
          </Motion.div>
        );
      })}
    </Motion.div>
  );
}

function StudyTimeChart({ data }) {
  const hasData = data.some((d) => d.hours > 0);
  return (
    <Motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
      {hasData ? (
        <div className="card p-6">
          <div className="mb-6 flex items-center gap-2">
            <Clock size={18} className="text-brand" aria-hidden="true" />
            <h2 className="text-body-lg font-semibold text-ink">Weekly Study Time</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray={GRID_DEFAULTS.strokeDasharray} stroke={GRID_STROKE} vertical={false} />
              <XAxis dataKey="week" {...AXIS_DEFAULTS} tick={{ fontSize: TICK_SIZE, fill: TICK_FILL }} />
              <YAxis
                {...AXIS_DEFAULTS}
                tick={{ fontSize: TICK_SIZE, fill: TICK_FILL }}
                tickFormatter={(v) => `${v}h`}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                formatter={(value) => [`${value} hrs`, "Study time"]}
              />
              <Bar dataKey="hours" fill={CHART_BLUE} radius={[6, 6, 0, 0]} maxBarSize={36} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="card px-4 py-14">
          <StudentEmptyState
            icon={Clock}
            title="No study time yet"
            description="Complete a lesson to see your weekly study breakdown."
          />
        </div>
      )}
    </Motion.div>
  );
}

function PaceSection({ pace, avgWeeklyHours }) {
  if (pace.length === 0) {
    return (
      <Motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
        <div className="card px-4 py-14">
          <StudentEmptyState
            icon={Target}
            title="No active courses"
            description="Start a course to see your estimated completion date and pace."
            action={{ label: "Browse Courses", to: "/courses" }}
          />
        </div>
      </Motion.div>
    );
  }

  return (
    <Motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
      <div className="card p-6">
        <div className="mb-6 flex items-center gap-2">
          <TrendingUp size={18} className="text-brand" aria-hidden="true" />
          <h2 className="text-body-lg font-semibold text-ink">Course Pace &amp; Velocity</h2>
          <span className="ml-auto text-sm-fluid text-ink-muted">
            Avg {avgWeeklyHours}h / week
          </span>
        </div>
        <ul className="divide-y divide-border">
          {pace.map((p) => (
            <li key={p.courseId} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm-fluid font-medium text-ink">{p.courseTitle}</p>
                <p className="mt-0.5 text-sm-fluid text-ink-muted">
                  {p.remainingHours}h remaining · est. finish {formatCompletionDate(p.estCompletion)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative h-2 w-28 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${p.progress}%`, backgroundColor: CHART_AMBER }}
                  />
                </div>
                <span className="w-10 text-right text-sm-fluid font-semibold text-ink">
                  {p.progress}%
                </span>
                <PaceStatusBadge status={p.paceStatus} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Motion.div>
  );
}

function QuizAccuracyCard({ mastery }) {
  if (mastery.attempted === 0) {
    return (
      <div className="card px-4 py-14">
        <StudentEmptyState
          icon={Zap}
          title="No quiz data yet"
          description="Complete a quiz to see your first-try accuracy breakdown."
        />
      </div>
    );
  }

  return (
    <div className="card flex flex-col gap-4 p-6">
      <div className="flex items-center gap-2">
        <Zap size={18} className="text-brand" aria-hidden="true" />
        <h2 className="text-body-lg font-semibold text-ink">Quiz Mastery</h2>
      </div>
      <div className="flex items-end gap-3">
        <p className="text-metric font-semibold text-ink">{mastery.firstTryAccuracy}%</p>
        <p className="mb-1 text-sm-fluid text-ink-muted">first-try accuracy</p>
      </div>
      <p className="text-sm-fluid text-ink-muted">
        {mastery.passedFirstTry} of {mastery.attempted} quizzes passed on the first attempt.
      </p>
      {mastery.quizzes.length > 0 && (
        <ul className="mt-1 space-y-2">
          {mastery.quizzes.slice(0, 4).map((q, i) => (
            <li key={i} className="flex items-center justify-between gap-3 text-sm-fluid">
              <span className="min-w-0 truncate text-ink">{q.title}</span>
              <span
                className={`badge ${
                  q.passedFirstTry ? "bg-success-soft text-success" : "bg-red-100 text-red-700"
                }`}
              >
                {q.firstTryScore}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SkillRadar({ skills }) {
  const data = skills.slice(0, 6).map((s) => ({ skill: s.skill, percent: s.percent }));
  const hasSkills = data.length > 0 && data.some((s) => s.percent > 0);

  if (!hasSkills) {
    return (
      <div className="card px-4 py-14">
        <StudentEmptyState
          icon={Activity}
          title="No skill data yet"
          description="Complete lessons to build your skill mastery profile."
        />
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="mb-6 flex items-center gap-2">
        <Activity size={18} className="text-brand" aria-hidden="true" />
        <h2 className="text-body-lg font-semibold text-ink">Skill Mastery</h2>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke={GRID_STROKE} />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: TICK_FILL }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: TICK_FILL }} />
          <Radar
            name="Mastery"
            dataKey="percent"
            stroke={CHART_PINK}
            fill={CHART_PINK}
            fillOpacity={0.25}
            strokeWidth={2}
            animationDuration={600}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`${value}%`, "Mastery"]} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function StudentAnalyticsPage() {
  const [nowMs] = useState(() => Date.now());

  const enrolledCourses = useMemo(() => getEnrolledCourses(), []);
  const isZeroState = enrolledCourses.length === 0;

  const activity = useMemo(() => getLearningActivity(), []);
  const streak = useMemo(() => getStreak(nowMs), [nowMs]);
  const { avgWeeklyHours, pace } = useMemo(() => getLearningPace(nowMs), [nowMs]);
  const mastery = useMemo(() => getQuizMastery(), []);
  const skills = useMemo(() => getSkillMastery(), []);
  const activityCalendar = useMemo(() => getStudyActivity(nowMs), [nowMs]);
  const scoreTrend = useMemo(() => getScoreTrend(nowMs), [nowMs]);

  const totalHours = activity.reduce((sum, a) => sum + a.hours, 0);

  const hasScoreTrend = scoreTrend.length > 0;
  const latestScore = hasScoreTrend ? scoreTrend[scoreTrend.length - 1].avgScore : 0;
  const prevScore = scoreTrend.length > 1 ? scoreTrend[scoreTrend.length - 2].avgScore : null;
  const scoreDelta = prevScore != null ? latestScore - prevScore : null;

  let scoreSub = "Take a quiz to start tracking";
  if (hasScoreTrend && prevScore == null) {
    scoreSub = "Trend begins with your first quiz";
  } else if (scoreDelta != null) {
    if (scoreDelta > 0) scoreSub = `+${scoreDelta} from last week`;
    else if (scoreDelta < 0) scoreSub = `${scoreDelta} from last week`;
    else scoreSub = "No change from last week";
  }

  const statCards = [
    {
      label: "Study Streak",
      value: streak ? `${streak.current} ${streak.current === 1 ? "day" : "days"}` : "0 days",
      sub: streak ? `Longest ${streak.longest} ${streak.longest === 1 ? "day" : "days"}` : "Complete a lesson today to start",
      icon: Flame,
      accent: CHART_PINK,
    },
    {
      label: "Total Hours",
      value: `${Math.round(totalHours * 10) / 10}h`,
      sub: totalHours > 0 ? "Across all activity" : "Your study time will appear here",
      icon: Clock,
      accent: CHART_BLUE,
    },
    {
      label: "Weekly Average",
      value: `${avgWeeklyHours}h`,
      sub: avgWeeklyHours > 0 ? "Study time per week" : "Tracks your weekly commitment",
      icon: CalendarClock,
      accent: CHART_AMBER,
    },
    {
      label: "Score Trend",
      value: hasScoreTrend ? `${latestScore}%` : "—",
      sub: scoreSub,
      icon: TrendingUp,
      accent: CHART_GREEN,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Learning Analytics</h1>
        <p className="mt-1 text-sm-fluid text-ink-muted">
          {isZeroState
            ? "Track your progress once you start learning."
            : "How you learn — study habits, pace, and the skills you've mastered."}
        </p>
      </div>

      {isZeroState ? (
        <Motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <div className="card px-4 py-16">
            <StudentEmptyState
              icon={BarChart3}
              title="Your learning journey starts here"
              description="Enroll in a course to unlock your personal analytics dashboard — study streak, skill mastery, pace tracking, and more."
              action={{ label: "Browse Courses", to: "/courses" }}
            />
          </div>
        </Motion.div>
      ) : (
        <>
          <StatCardsGrid cards={statCards} />

          <Motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-8">
            <StudyActivityCalendar
              data={activityCalendar.data}
              currentStreak={streak?.current ?? 0}
              longestStreak={streak?.longest ?? 0}
            />
          </Motion.div>

          <div className="mb-8 grid gap-6 xl:grid-cols-2">
            <StudyTimeChart data={activity} />
            <PaceSection pace={pace} avgWeeklyHours={avgWeeklyHours} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <QuizAccuracyCard mastery={mastery} />
            <SkillRadar skills={skills} />
          </div>
        </>
      )}
    </div>
  );
}
