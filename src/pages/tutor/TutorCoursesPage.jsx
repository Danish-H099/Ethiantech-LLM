import { useState } from "react";
import { m as Motion } from "motion/react";
import courses from "src/services/courses";
import { parsePrice } from "src/lib/format";
import { fadeIn, viewportOnce } from "src/lib/animationVariants";

const CURRENT_TUTOR_ID = "richard-james";

function StatusToggle({ initialStatus }) {
  const [isLive, setIsLive] = useState(initialStatus === "Live");

  return (
    <button
      role="switch"
      aria-checked={isLive}
      onClick={() => setIsLive(!isLive)}
      className={`relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer items-center rounded-full transition-colors ${isLive ? "bg-brand" : "bg-toggle"
        }`}
    >
      <span
        className={`absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform ${isLive ? "translate-x-6" : "translate-x-0"
          }`}
      />
    </button>
  );
}

export default function TutorCoursesPage() {
  const tutorCourses = courses
    .filter((course) => course.tutorIds.includes(CURRENT_TUTOR_ID))
    .map((course) => ({
      ...course,
      status: "Live",
      earnings: Math.round(parsePrice(course.price) * course.students),
    }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">My Courses</h1>
        <p className="mt-1 text-sm-fluid text-ink-muted">
          Manage and view all your published courses
        </p>
      </div>

      <Motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="card scrollbar-brand overflow-x-auto"
      >
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="table-header">
              <th className="px-5 py-4 font-medium">Course</th>
              <th className="px-5 py-3 font-medium">Students</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 text-right font-medium">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {tutorCourses.map((course) => (
              <tr key={course.id} className="table-row odd:bg-surface-soft">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={course.image}
                      alt={course.title}
                      loading="lazy"
                      className="h-9 w-16 rounded object-cover shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                    />
                    <span className="max-w-[320px] leading-snug text-ink">
                      {course.title}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">{course.students}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <StatusToggle initialStatus={course.status} />
                    <span
                      className={`text-sm-fluid ${course.status === "Live"
                          ? "text-brand"
                          : "text-ink/60"
                        }`}
                    >
                      {course.status}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right font-medium text-ink">
                  ${course.earnings.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Motion.div>
    </div>
  );
}
