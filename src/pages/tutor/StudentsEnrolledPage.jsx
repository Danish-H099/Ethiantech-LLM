import { m as Motion } from "motion/react";
import { User, MoreVertical } from "lucide-react";
import { getStudentRoster } from "src/services/tutorDashboard";
import { fadeIn, viewportOnce } from "src/lib/animationVariants";

export default function StudentsEnrolledPage() {
  const studentRoster = getStudentRoster();
  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">
          Students Enrolled
        </h1>
        <p className="mt-1 text-sm-fluid text-ink-muted">
          View all students enrolled in your courses
        </p>
      </div>

      <Motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="card scrollbar-brand overflow-x-auto"
      >
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="table-header">
              <th className="w-[50px] px-5 py-4 font-medium">#</th>
              <th className="px-5 py-4 font-medium">Student Name</th>
              <th className="px-5 py-4 font-medium">Course Title</th>
              <th className="px-5 py-4 font-medium">Date</th>
              <th className="w-[50px]" />
            </tr>
          </thead>
          <tbody>
            {studentRoster.map((student) => (
              <tr key={student.id} className="table-row odd:bg-surface-soft">
                <td className="px-5 py-4">{student.id}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full bg-brand/10">
                      <User size={16} className="text-brand" />
                    </div>
                    <span className="whitespace-nowrap font-medium text-ink">{student.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="line-clamp-2">{student.course}</span>
                </td>
                <td className="whitespace-nowrap px-5 py-4">{student.date}</td>
                <td className="px-3">
                  <button className="text-ink/50 transition hover:text-ink/80">
                    <MoreVertical size={16} />
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
