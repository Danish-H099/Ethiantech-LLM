import { useMemo, useState } from "react";
import { m as Motion } from "motion/react";
import { CalendarCheck, ChevronLeft, ChevronRight, Flame, PartyPopper, Trophy } from "lucide-react";
import { formatDayKey } from "src/lib/analyticsLib";
import { fadeUp, viewportOnce } from "src/lib/animationVariants";
import StudentEmptyState from "src/components/student/StudentEmptyState";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MILESTONES = [7, 30, 50, 100, 365];
const STREAK_HINT = "Complete at least one lesson each day to build your streak.";

function getLongDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return `${MONTH_LABELS[m - 1]} ${d}, ${y}`;
}

export default function StudyActivityCalendar({
  data,
  currentStreak = 0,
  longestStreak = 0,
  className = "",
}) {
  const hasData = data && data.length > 0;
  const activeDays = hasData ? data.filter((d) => d.active).length : 0;
  const [todayKey] = useState(() => formatDayKey(Date.now()));
  const [view, setView] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const dataYear = hasData ? new Date(data[0].date).getFullYear() : new Date().getFullYear();

  const dataByDate = useMemo(() => {
    const map = new Map();
    if (!hasData) return map;
    let run = 0;
    data.forEach((d) => {
      if (d.active) {
        run += 1;
        map.set(d.date, { active: true, run });
      } else {
        run = 0;
        map.set(d.date, { active: false, run: 0 });
      }
    });
    return map;
  }, [data, hasData]);

  const firstOfMonth = new Date(view.year, view.month, 1);
  const startDay = firstOfMonth.getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const rowCount = Math.ceil((startDay + daysInMonth) / 7);

  const cells = [];
  for (let i = 0; i < rowCount * 7; i += 1) {
    const dayNum = i - startDay + 1;
    if (dayNum < 1 || dayNum > daysInMonth) {
      cells.push(null);
      continue;
    }
    const dateKey = formatDayKey(new Date(view.year, view.month, dayNum).getTime());
    const entry = dataByDate.get(dateKey);
    const isActive = entry?.active ?? false;
    const isToday = dateKey === todayKey;
    const isMilestone = isActive && MILESTONES.includes(entry.run);
    cells.push({ dayNum, dateKey, isActive, isToday, isMilestone });
  }

  const weeks = [];
  for (let r = 0; r < rowCount; r += 1) {
    weeks.push(cells.slice(r * 7, r * 7 + 7));
  }

  const monthActiveDays = cells.filter((c) => c && c.isActive).length;
  const monthPct = daysInMonth > 0 ? Math.round((monthActiveDays / daysInMonth) * 100) : 0;
  const nextMilestone = MILESTONES.find((m) => m > currentStreak);

  const [currentYear, currentMonthIndex] = todayKey.split("-").map(Number);
  const isCurrentMonth = view.year === currentYear && view.month === currentMonthIndex - 1;
  const canGoPrev = view.year > dataYear || (view.year === dataYear && view.month > 0);
  const canGoNext = view.year < dataYear || (view.year === dataYear && view.month < 11);

  const goPrevMonth = () => {
    if (!canGoPrev) return;
    setView((v) => {
      if (v.month === 0) return { year: v.year - 1, month: 11 };
      return { year: v.year, month: v.month - 1 };
    });
  };

  const goNextMonth = () => {
    if (!canGoNext) return;
    setView((v) => {
      if (v.month === 11) return { year: v.year + 1, month: 0 };
      return { year: v.year, month: v.month + 1 };
    });
  };

  const goToday = () => {
    const now = new Date();
    setView({ year: now.getFullYear(), month: now.getMonth() });
  };

  if (!hasData || activeDays === 0) {
    return (
      <div className={`card px-4 py-14 ${className}`}>
        <StudentEmptyState
          icon={CalendarCheck}
          title="No study activity yet"
          description="Complete a lesson to start tracking your study consistency."
        />
      </div>
    );
  }

  return (
    <div className={`card p-6 ${className}`}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-body-lg font-semibold text-ink">
          <Flame size={18} className="text-brand" aria-hidden="true" />
          Study Activity
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToday}
            disabled={isCurrentMonth}
            className="btn-outline px-3 py-1.5 text-sm-fluid"
          >
            Today
          </button>
          <div className="flex items-center gap-0.5 rounded-lg border border-border bg-white p-0.5">
            <button
              type="button"
              onClick={goPrevMonth}
              disabled={!canGoPrev}
              aria-label="Previous month"
              className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition hover:bg-surface hover:text-ink disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink-muted"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <span
              aria-live="polite"
              className="w-36 select-none text-center text-sm-fluid font-semibold text-ink"
            >
              {MONTH_LABELS[view.month]} {view.year}
            </span>
            <button
              type="button"
              onClick={goNextMonth}
              disabled={!canGoNext}
              aria-label="Next month"
              className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition hover:bg-surface hover:text-ink disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink-muted"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div
        role="grid"
        aria-label={`Study activity calendar ${MONTH_LABELS[view.month]} ${view.year}`}
      >
        <div role="row" className="mb-1.5 grid grid-cols-7">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              role="columnheader"
              className="px-1 text-center text-xs font-medium text-ink-muted"
            >
              {day}
            </div>
          ))}
        </div>

        {weeks.map((weekCells, rowIndex) => (
          <div key={rowIndex} role="row" className="grid grid-cols-7">
            {weekCells.map((cell, cellIndex) => {
              if (!cell) {
                return <div key={cellIndex} aria-hidden="true" className="h-9" />;
              }
              const isToday = cell.isToday;
              const isActive = cell.isActive;
              const tooltip =
                isToday && !isActive
                  ? STREAK_HINT
                  : `${getLongDate(cell.dateKey)} — ${isActive ? "Studied" : "No activity"}`;

              let visual;
              if (isToday) {
                visual = isActive
                  ? "inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm-fluid font-bold text-white ring-2 ring-brand ring-offset-2"
                  : "inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-brand bg-white text-sm-fluid font-bold text-brand";
              } else if (isActive) {
                visual =
                  "inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm-fluid font-medium text-white";
              } else {
                visual = "text-sm-fluid font-medium text-ink-muted";
              }

              return (
                <div
                  key={cellIndex}
                  role="gridcell"
                  aria-label={tooltip}
                  aria-current={isToday ? "date" : undefined}
                  title={tooltip}
                  className="relative flex h-9 items-center justify-center"
                >
                  <span className={visual}>{cell.dayNum}</span>
                  {cell.isMilestone && (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-0.5 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-500"
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <Motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-5 border-t border-border pt-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-brand" aria-hidden="true" />
            <div>
              <p className="text-metric font-semibold leading-tight text-brand">{currentStreak}</p>
              <p className="text-xs text-ink-muted">day streak</p>
            </div>
          </div>
          <div className="hidden h-8 w-px bg-border sm:block" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" aria-hidden="true" />
            <div>
              <p className="text-body font-medium leading-tight text-ink">{longestStreak} days</p>
              <p className="text-xs text-ink-muted">best streak</p>
            </div>
          </div>
          <div className="hidden h-8 w-px bg-border sm:block" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <CalendarCheck size={14} className="text-success" aria-hidden="true" />
            <div>
              <p className="text-sm-fluid leading-tight text-ink-muted">
                {monthActiveDays} of {daysInMonth} days ({monthPct}%)
              </p>
              <p className="text-xs text-ink-muted">this month</p>
            </div>
          </div>
        </div>
        {nextMilestone != null && currentStreak > 0 && (
          <p className="mt-4 flex items-center gap-1.5 text-sm-fluid text-ink-muted">
            <PartyPopper size={14} className="text-amber-500" aria-hidden="true" />
            Next milestone: {nextMilestone}-day streak — keep it going!
          </p>
        )}
      </Motion.div>
    </div>
  );
}