const LEVEL_COLORS = {
  0: "bg-gray-100",
  1: "bg-tint-student",
  2: "bg-pink-200",
  3: "bg-pink-400",
  4: "bg-brand",
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

export default function StudyHeatmap({ data, className = "" }) {
  if (!data || data.length === 0) {
    return (
      <div className={`card p-6 ${className}`}>
        <p className="text-center text-sm-fluid text-ink-muted">No activity data available</p>
      </div>
    );
  }

  const year = new Date(data[0].date).getFullYear();
  const firstDate = new Date(data[0].date);
  const firstDayOfWeek = firstDate.getDay();
  const offsetDays = firstDayOfWeek === 0 ? 0 : firstDayOfWeek;

  const weeks = [];
  let currentWeek = new Array(7).fill(null);
  for (let i = 0; i < offsetDays; i++) {
    currentWeek[i] = null;
  }

  data.forEach((day, index) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    currentWeek[dayOfWeek] = day;

    if (dayOfWeek === 6 || index === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = new Array(7).fill(null);
    }
  });

  const monthPositions = [];
  let currentMonth = -1;
  weeks.forEach((week, weekIndex) => {
    const firstDay = week.find((d) => d !== null);
    if (firstDay) {
      const month = new Date(firstDay.date).getMonth();
      if (month !== currentMonth) {
        monthPositions.push({ month, weekIndex });
        currentMonth = month;
      }
    }
  });

  return (
    <div className={`card p-6 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-body-lg font-semibold text-ink">Study Activity {year}</h2>
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-3 w-3 rounded-sm ${LEVEL_COLORS[level]}`}
                title={`Level ${level}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-brand">
        <div className="inline-block min-w-full">
          <div className="relative" style={{ paddingLeft: "24px", paddingTop: "20px" }}>
            <div className="absolute left-0 top-5 flex flex-col gap-[3px]" style={{ width: "20px" }}>
              {WEEKDAY_LABELS.map((label, i) => (
                <div key={i} className="flex h-3 items-center justify-end pr-1 text-xs text-ink-muted">
                  {label}
                </div>
              ))}
            </div>

            <div className="absolute left-6 top-0 flex" style={{ height: "16px" }}>
              {monthPositions.map(({ month, weekIndex }) => (
                <div
                  key={month}
                  className="text-xs text-ink-muted"
                  style={{ marginLeft: `${weekIndex * 16}px` }}
                >
                  {MONTH_LABELS[month]}
                </div>
              ))}
            </div>

            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <div key={dayIndex} className="h-3 w-3" />;
                    }
                    const date = new Date(day.date);
                    const formattedDate = date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    const eventText = day.count === 1 ? "event" : "events";
                    return (
                      <div
                        key={dayIndex}
                        className={`h-3 w-3 rounded-sm ${LEVEL_COLORS[day.level]} transition-transform hover:scale-125`}
                        title={`${formattedDate}: ${day.count} ${eventText}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
