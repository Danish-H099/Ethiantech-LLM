import { Bell } from "lucide-react";
import StudentEmptyState from "src/components/student/StudentEmptyState";

export default function StudentNotificationsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Notifications</h1>
      </div>
      <div className="card px-4 py-16">
        <StudentEmptyState
          icon={Bell}
          title="No notifications yet"
          description="You'll see updates from your instructors here — new due dates, course updates, and important announcements."
          action={{ label: "Back to Dashboard", to: "/student/dashboard" }}
        />
      </div>
    </div>
  );
}
