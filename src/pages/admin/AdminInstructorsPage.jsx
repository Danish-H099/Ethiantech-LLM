import { User } from "lucide-react";
import { m as Motion } from "motion/react";
import { getInstructors } from "src/data/adminData";
import { fadeIn, viewportOnce } from "src/lib/animationVariants";
import Stars from "src/components/Stars";

export default function AdminInstructorsPage() {
  const instructors = getInstructors();
  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">
          Instructors
        </h1>
        <p className="mt-1 text-sm-fluid text-ink-muted">
          Manage and view all instructors on the platform
        </p>
      </div>

      <Motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="card scrollbar-brand overflow-x-auto"
      >
        <table className="w-full min-w-[750px] border-collapse">
          <thead>
            <tr className="table-header">
              <th className="px-5 py-4 font-medium">Instructor</th>
              <th className="px-5 py-4 font-medium">Courses</th>
              <th className="px-5 py-4 font-medium">Students</th>
              <th className="px-5 py-4 font-medium">Avg Rating</th>
              <th className="px-5 py-4 text-right font-medium">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((inst) => (
              <tr key={inst.id} className="table-row odd:bg-surface-soft">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-brand/10">
                      <User size={18} className="text-brand" />
                    </div>
                    <span className="whitespace-nowrap font-medium text-ink">
                      {inst.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">{inst.courses}</td>
                <td className="px-5 py-4">{inst.students.toLocaleString()}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-ink">{inst.rating}</span>
                    <Stars rating={inst.rating} />
                  </div>
                </td>
                <td className="px-5 py-4 text-right font-medium text-ink">
                  ${inst.earnings.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Motion.div>
    </div>
  );
}
