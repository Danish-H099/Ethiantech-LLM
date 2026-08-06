import { useState } from "react";
import { m as Motion } from "motion/react";
import { allCourses } from "../../data/adminData";
import { fadeIn, viewportOnce } from "../../lib/animationVariants";

function StatusBadge({ status }) {
  const isLive = status === "Live";
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
        isLive
          ? "bg-green-100 text-green-600"
          : "bg-amber-100 text-amber-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminCoursesPage() {
  const [courses] = useState(allCourses);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="page-title">
            Course Management
          </h1>
          <p className="mt-1 text-md text-ink-muted">
            {courses.length} courses on the platform
          </p>
        </div>
      </div>

      <Motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="card overflow-x-auto"
      >
        <table className="w-full min-w-[850px] border-collapse">
          <thead>
            <tr className="table-header">
              <th className="px-5 py-4 font-medium">Course</th>
              <th className="px-5 py-4 font-medium">Instructor</th>
              <th className="px-5 py-4 font-medium">Students</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 text-right font-medium">Earnings</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr
                key={course.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#F7F9FD" : "#ffffff",
                }}
                className="table-row"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={course.image}
                      alt={course.title}
                      loading="lazy"
                      className="h-9 w-16 rounded object-cover shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                    />
                    <span className="max-w-[280px] leading-snug text-ink">
                      {course.title}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  {course.instructor}
                </td>
                <td className="px-5 py-4">{course.students.toLocaleString()}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={course.status} />
                </td>
                <td className="px-5 py-4 text-right font-medium text-ink">
                  ${course.earnings.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="rounded border border-ink/20 px-3 py-1.5 text-13 text-ink/70 transition hover:border-brand hover:text-brand">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Motion.div>
    </div>
  );
}
