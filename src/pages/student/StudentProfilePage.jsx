import { User } from "lucide-react";
import StudentEmptyState from "src/components/student/StudentEmptyState";

export default function StudentProfilePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Profile</h1>
      </div>
      <div className="card px-4 py-16">
        <StudentEmptyState
          icon={User}
          title="Profile coming soon"
          description="Update your name, photo, and preferences here once this feature becomes available."
          action={{ label: "Back to Dashboard", to: "/student/dashboard" }}
        />
      </div>
    </div>
  );
}
