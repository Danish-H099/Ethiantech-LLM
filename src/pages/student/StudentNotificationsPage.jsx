import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { m as Motion, useReducedMotion } from "motion/react";
import {
  Bell,
  CheckCircle2,
  Clock,
  Megaphone,
  GraduationCap,
  CheckCheck,
} from "lucide-react";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount,
} from "src/services/studentRepository";
import { formatRelativeTime } from "src/lib/format";
import {
  UnderlineTabList,
  UnderlineTab,
} from "src/components/student/UnderlineTabList";
import StudentEmptyState from "src/components/student/StudentEmptyState";
import {
  staggerContainer,
  createStaggerItem,
} from "src/lib/animationVariants";

const NOTIFICATION_FILTERS = [
  { label: "All", value: "all" },
  { label: "Announcements", value: "announcement" },
  { label: "Deadlines", value: "deadline" },
  { label: "Completions", value: "completion" },
];

const TYPE_ICON = {
  announcement: Megaphone,
  deadline: Clock,
  completion: GraduationCap,
};

const TYPE_STYLE = {
  announcement: "bg-blue-100 text-blue-600",
  deadline: "bg-amber-100 text-amber-700",
  completion: "bg-success-soft text-success",
};

const EMPTY_COPY = {
  all: {
    icon: Bell,
    title: "No notifications yet",
    description: "You'll see updates from your instructors here — new due dates, course updates, and important announcements.",
  },
  announcement: {
    icon: Megaphone,
    title: "No announcements",
    description: "Course announcements from your instructors will appear here.",
  },
  deadline: {
    icon: Clock,
    title: "No upcoming deadlines",
    description: "All caught up — you have no tasks due soon.",
  },
  completion: {
    icon: GraduationCap,
    title: "No completions yet",
    description: "Complete a course to see your achievement here.",
  },
};

// ---------------------------------------------------------------- sections

function NotificationFilters({ counts }) {
  return (
    <UnderlineTabList ariaLabel="Filter notifications">
      {NOTIFICATION_FILTERS.map((f) => (
        <UnderlineTab key={f.value} value={f.value} badge={counts[f.value]}>
          {f.label}
        </UnderlineTab>
      ))}
    </UnderlineTabList>
  );
}

function NotificationItem({ notification, staggerItem }) {
  const navigate = useNavigate();
  const Icon = TYPE_ICON[notification.type] ?? Bell;
  const iconStyle = TYPE_STYLE[notification.type] ?? "bg-gray-100 text-ink-muted";

  function handleClick() {
    markNotificationRead(notification.id);
    if (notification.courseId) {
      navigate(`/student/course/${notification.courseId}`);
    }
  }

  return (
    <Motion.div variants={staggerItem}>
      <button
        type="button"
        onClick={handleClick}
        className={`card flex w-full items-start gap-4 p-4 text-left transition hover:shadow-card-hover sm:p-5 ${
          notification.read ? "" : "border-l-3 border-accent-student"
        }`}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
        >
          <Icon size={18} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p
              className={`text-sm-fluid leading-snug ${
                notification.read
                  ? "font-medium text-ink-muted"
                  : "font-semibold text-ink"
              }`}
            >
              {notification.title}
            </p>
            <span className="shrink-0 text-xs text-ink-muted">
              {formatRelativeTime(notification.date)}
            </span>
          </div>
          <p className="mt-1 text-sm-fluid text-ink-muted line-clamp-2">
            {notification.body}
          </p>
          {notification.courseTitle && (
            <p className="mt-1.5 text-sm-fluid font-medium text-brand-strong">
              {notification.courseTitle}
            </p>
          )}
        </div>
        {!notification.read && (
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent-student" />
        )}
      </button>
    </Motion.div>
  );
}

function NotificationList({ notifications, staggerContainer, staggerItem }) {
  if (notifications.length === 0) {
    return null;
  }
  return (
    <Motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="mt-6 space-y-3"
    >
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} staggerItem={staggerItem} />
      ))}
    </Motion.div>
  );
}

function EmptyPanel({ filter }) {
  const copy = EMPTY_COPY[filter] ?? EMPTY_COPY.all;
  return (
    <div className="mt-6 card px-4 py-14">
      <StudentEmptyState
        icon={copy.icon}
        title={copy.title}
        description={copy.description}
      />
    </div>
  );
}

// ------------------------------------------------------------------- page

export default function StudentNotificationsPage() {
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((v) => v + 1);
  const [filter, setFilter] = useState("all");
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  // Force fresh read on each render after mutation
  const allNotifications = useMemo(() => {
    void revision;
    return getNotifications();
  }, [revision]);
  const filteredNotifications = useMemo(() => {
    void revision;
    return getNotifications(undefined, filter);
  }, [filter, revision]);

  const counts = useMemo(() => {
    const c = { all: allNotifications.length, announcement: 0, deadline: 0, completion: 0 };
    allNotifications.forEach((n) => {
      if (c[n.type] !== undefined) c[n.type] += 1;
    });
    return c;
  }, [allNotifications]);

  const unreadCount = useMemo(() => {
    void revision;
    return getUnreadCount();
  }, [revision]);

  function handleMarkAllRead() {
    markAllNotificationsRead();
    refresh();
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="mt-1 text-sm-fluid text-ink-muted">
            Updates from your courses, deadlines, and achievements.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="btn-outline shrink-0 px-3 py-1.5 text-sm-fluid"
          >
            <CheckCheck size={14} aria-hidden="true" />
            Mark all read
          </button>
        )}
      </div>

      <Tabs.Root value={filter} onValueChange={setFilter}>
        <NotificationFilters counts={counts} />

        {NOTIFICATION_FILTERS.map((f) => (
          <Tabs.Content key={f.value} value={f.value}>
            {filteredNotifications.length > 0 ? (
              <NotificationList
                notifications={filteredNotifications}
                staggerContainer={staggerContainer}
                staggerItem={staggerItem}
              />
            ) : (
              <EmptyPanel filter={f.value} />
            )}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  );
}
