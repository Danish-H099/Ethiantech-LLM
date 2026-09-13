import { User, MoreVertical } from "lucide-react";
import { m as Motion } from "motion/react";
import { getAllUsers } from "src/services/adminData";
import { fadeIn, viewportOnce } from "src/lib/animationVariants";

function RoleBadge({ role }) {
  const isInstructor = role === "Instructor";
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm-fluid font-medium ${
        isInstructor
          ? "bg-violet-100 text-violet-600"
          : "bg-sky-100 text-sky-600"
      }`}
    >
      {role}
    </span>
  );
}

function StatusDot({ status }) {
  const isActive = status === "Active";
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          isActive ? "bg-green-600" : "bg-gray-400"
        }`}
      />
      <span
        className={`text-sm-fluid ${
          isActive ? "text-ink" : "text-ink-muted"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

export default function AdminUsersPage() {
  const allUsers = getAllUsers();
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="page-title">
            User Management
          </h1>
          <p className="mt-1 text-sm-fluid text-ink-muted">
            {allUsers.length} users on the platform
          </p>
        </div>
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
              <th className="w-[50px] px-5 py-4 font-medium">#</th>
              <th className="px-5 py-4 font-medium">Name</th>
              <th className="px-5 py-4 font-medium">Email</th>
              <th className="px-5 py-4 font-medium">Role</th>
              <th className="px-5 py-4 font-medium">Joined</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="w-[50px]" />
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.id} className="table-row odd:bg-surface-soft">
                <td className="px-5 py-4">{user.id}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full bg-gray-200">
                      <User size={16} className="text-ink-muted" />
                    </div>
                    <span className="whitespace-nowrap font-medium text-ink">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-5 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="whitespace-nowrap px-5 py-4">{user.joined}</td>
                <td className="px-5 py-4">
                  <StatusDot status={user.status} />
                </td>
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
