import { useMemo } from "react";
import { m as Motion, useReducedMotion } from "motion/react";
import { BookOpen, CheckCircle, Clock, Play } from "lucide-react";
import { enrolledCourses } from "../../data/studentData";
import { fadeIn, viewportOnce, createStaggerItem, createCardHover } from "../../lib/animationVariants";

function ProgressBar({ progress }) {
  let color = "#D62A91";
  if (progress === 100) color = "#10B981";
  else if (progress === 0) color = "#CBD6E4";

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <Motion.div
        className="h-full rounded-full"
        style={{ width: `${progress}%`, backgroundColor: color, transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Completed: "bg-green-100 text-green-600",
    "In Progress": "bg-tint-pink text-brand",
    "Not Started": "bg-gray-100 text-ink-muted",
  };
  const icons = {
    Completed: CheckCircle,
    "In Progress": Clock,
    "Not Started": Play,
  };
  const Icon = icons[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

export default function StudentMyCoursesPage() {
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );
  const cardHover = useMemo(
    () => createCardHover(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">
          My Courses
        </h1>
        <p className="mt-1 text-md text-ink-muted">
          Continue learning from where you left off
        </p>
      </div>

      <Motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      >
        {enrolledCourses.map((course, i) => (
          <Motion.div key={course.id} variants={staggerItem} custom={i}>
            <Motion.div
              variants={cardHover}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="h-full"
            >
              <div className="card h-full overflow-hidden">
                <div className="relative h-[160px] overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-3 top-3">
                    <StatusBadge status={course.status} />
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="mb-1 line-clamp-2 text-base font-semibold text-ink">
                    {course.title}
                  </h3>
                  <p className="mb-4 text-13 text-ink-muted">
                    {course.instructor}
                  </p>

                  <div className="mb-3">
                    <div className="mb-1.5 flex items-center justify-between text-13">
                      <span className="text-ink-muted">
                        {course.completedLessons}/{course.totalLessons} lessons
                      </span>
                      <span className="font-semibold text-ink">
                        {course.progress}%
                      </span>
                    </div>
                    <ProgressBar progress={course.progress} />
                  </div>

                  {course.status !== "Not Started" && (
                    <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-medium text-white transition hover:bg-brand/90">
                      <Play size={16} />
                      {course.status === "Completed" ? "Review Course" : "Continue Learning"}
                    </button>
                  )}
                  {course.status === "Not Started" && (
                    <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-brand bg-white py-2.5 text-sm font-medium text-brand transition hover:bg-brand/5">
                      <Play size={16} />
                      Start Course
                    </button>
                  )}
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        ))}
      </Motion.div>
    </div>
  );
}
