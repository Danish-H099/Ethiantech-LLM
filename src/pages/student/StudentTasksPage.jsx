import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { m as Motion, useReducedMotion } from "motion/react";
import * as Tabs from "@radix-ui/react-tabs";
import { ArrowRight, ClipboardList, Clock } from "lucide-react";

import { getTasks } from "src/services/studentRepository";
import { TASK_STATUS, TASK_STATUS_LABEL, TASK_ACTION_LABEL } from "src/lib/statuses";
import { formatDueLabel } from "src/lib/format";
import { LESSON_TYPE_LABELS, LESSON_TYPE_ICONS } from "src/lib/lesson";
import { hideOnError } from "src/lib/assets";
import { fadeIn, createStaggerItem } from "src/lib/animationVariants";
import { DEFAULT_STUDENT_ID } from "src/data/students";
import StudentEmptyState from "src/components/student/StudentEmptyState";
import {
  UnderlineTabList,
  UnderlineTab,
} from "src/components/student/UnderlineTabList";

const TASK_FILTERS = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Overdue", value: "overdue" },
  { label: "Completed", value: TASK_STATUS.COMPLETED },
];

const EMPTY_COPY = {
  all: {
    icon: ClipboardList,
    title: "No tasks yet",
    description: "Your instructor hasn't posted any tasks. Check back later — new work will appear here.",
  },
  upcoming: {
    icon: ClipboardList,
    title: "Nothing due soon",
    description: "All caught up — you have no upcoming tasks right now.",
  },
  overdue: {
    icon: ClipboardList,
    title: "No overdue tasks",
    description: "Nice work — everything that's due has been submitted or completed.",
  },
  [TASK_STATUS.COMPLETED]: {
    icon: ClipboardList,
    title: "No completed tasks yet",
    description: "Start a task to see it here once you submit or complete it.",
  },
};

function badgeClassFor(value, count) {
  if (value === "overdue" && count > 0) {
    return "group-data-[state=active]:bg-red-100 group-data-[state=active]:text-red-700";
  }
  if (value === TASK_STATUS.COMPLETED) {
    return "group-data-[state=active]:bg-success-soft group-data-[state=active]:text-success";
  }
  return "";
}

// ---------------------------------------------------------------- sections

function PageHeading() {
  return (
    <div className="mb-8">
      <h1 className="page-title">Tasks</h1>
      <p className="mt-1 text-sm-fluid text-ink-muted">
        Track your exercises, projects, and deadlines across all enrolled courses.
      </p>
    </div>
  );
}

function FilterTabBar({ tasks }) {
  const dueState = (t) => (t.dueDate ? formatDueLabel(t.dueDate) : null);

  const countFor = (value) => {
    if (value === "all") return tasks.length;
    if (value === "upcoming")
      return tasks.filter((t) => {
        const d = dueState(t);
        return t.status !== TASK_STATUS.COMPLETED && d && !d.overdue;
      }).length;
    if (value === "overdue")
      return tasks.filter((t) => {
        const d = dueState(t);
        return t.status !== TASK_STATUS.COMPLETED && d && d.overdue;
      }).length;
    if (value === TASK_STATUS.COMPLETED)
      return tasks.filter((t) => t.status === TASK_STATUS.COMPLETED || t.status === TASK_STATUS.SUBMITTED)
        .length;
    return 0;
  };

  return (
    <UnderlineTabList ariaLabel="Filter tasks by status">
      {TASK_FILTERS.map((f) => {
        const count = countFor(f.value);
        return (
          <UnderlineTab
            key={f.value}
            value={f.value}
            badge={count}
            badgeClassName={badgeClassFor(f.value, count)}
          >
            {f.label}
          </UnderlineTab>
        );
      })}
    </UnderlineTabList>
  );
}

function EmptyTasksPanel({ copy }) {
  return (
    <div className="card mt-6 px-4 py-14">
      <StudentEmptyState
        icon={copy.icon}
        title={copy.title}
        description={copy.description}
      />
    </div>
  );
}

function TaskList({ tasks, now, staggerItem }) {
  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="mt-6 space-y-4"
    >
      {tasks.map((task, i) => (
        <Motion.div key={task.taskId} variants={staggerItem} custom={i}>
          <TaskCard task={task} now={now} />
        </Motion.div>
      ))}
    </Motion.div>
  );
}

function TaskTabContent({ value, tasks, now, staggerItem }) {
  return (
    <Tabs.Content value={value}>
      {tasks.length > 0 ? (
        <TaskList tasks={tasks} now={now} staggerItem={staggerItem} />
      ) : (
        <EmptyTasksPanel copy={EMPTY_COPY[value]} />
      )}
    </Tabs.Content>
  );
}

// -------------------------------------------------------------- task card

function CardBadges({ task }) {
  const TypeIcon = LESSON_TYPE_ICONS[task.type] ?? LESSON_TYPE_ICONS.exercise;
  const statusLabel =
    TASK_STATUS_LABEL[task.status] ?? TASK_STATUS_LABEL[TASK_STATUS.NOT_STARTED];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="badge bg-tint-student text-brand-strong">
        <TypeIcon size={13} aria-hidden="true" />
        {LESSON_TYPE_LABELS[task.type] ?? "Task"}
      </span>
      <span
        className={`badge badge-status-${task.status}`}
        aria-label={`Status: ${statusLabel}`}
      >
        {statusLabel}
      </span>
    </div>
  );
}

function CardMeta({ task, now }) {
  const due = task.dueDate ? formatDueLabel(task.dueDate, now) : null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm-fluid text-ink-muted">
      {due ? (
        <span
          className={`inline-flex items-center gap-1 font-medium ${
            due.overdue ? "text-red-600" : "text-amber-700"
          }`}
          aria-label={`Due: ${due.text}`}
        >
          <Clock size={13} aria-hidden="true" />
          {due.text}
        </span>
      ) : (
        <span>No due date</span>
      )}
      {task.estimatedEffort && (
        <span className="text-ink-muted/80">· {task.estimatedEffort}</span>
      )}
    </div>
  );
}

function TaskCard({ task, now }) {
  const actionLabel = TASK_ACTION_LABEL[task.status] ?? "Start";

  return (
    <div className="card card-hover flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:px-5">
      {task.courseImage && (
        <img
          src={task.courseImage}
          alt=""
          loading="lazy"
          onError={hideOnError}
          className="hidden h-20 w-28 shrink-0 rounded-lg bg-surface object-cover sm:block"
        />
      )}

      <div className="min-w-0 flex-1">
        <CardBadges task={task} />
        <Link
          to={task.resumeUrl}
          className="mt-2 block truncate text-sm-fluid font-semibold text-ink transition hover:text-accent-student"
          aria-label={`Open ${task.title} in ${task.courseTitle}`}
        >
          {task.title}
        </Link>
        <p className="mt-0.5 truncate text-sm-fluid text-ink-muted">
          {task.courseTitle}
        </p>
        <CardMeta task={task} now={now} />
      </div>

      <Link
        to={task.resumeUrl}
        aria-label={`${actionLabel} ${task.title}`}
        className="btn-brand w-full shrink-0 px-4 py-2 text-sm-fluid sm:w-auto"
      >
        {actionLabel}
        <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </div>
  );
}

// ------------------------------------------------------------------- page

export default function StudentTasksPage() {
  const [filter, setFilter] = useState("all");
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  // Snapshot the clock once at mount so due-date labels stay stable across renders.
  const [now] = useState(() => Date.now());

  // Full list powers the tab count badges; the filtered list powers the list.
  const allTasks = useMemo(() => getTasks(DEFAULT_STUDENT_ID, "all"), []);
  const tasks = useMemo(() => getTasks(DEFAULT_STUDENT_ID, filter), [filter]);

  return (
    <div>
      <PageHeading />

      <Tabs.Root value={filter} onValueChange={setFilter}>
        <FilterTabBar tasks={allTasks} />

        {TASK_FILTERS.map((f) => {
          const items = f.value === filter ? tasks : [];
          return (
            <TaskTabContent
              key={f.value}
              value={f.value}
              tasks={items}
              now={now}
              staggerItem={staggerItem}
            />
          );
        })}
      </Tabs.Root>
    </div>
  );
}
