import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { LESSON_TYPE_ICONS, DEFAULT_LESSON_ICON } from "src/lib/lessonTypes";
import LessonStatusIcon from "src/components/student/LessonStatusIcon";
import { LESSON_STATUS_META } from "src/lib/lessonStatus";
export default function CourseSyllabus({
  sections,
  courseId,
  defaultOpenSection = 0,
  currentLessonId = null,
}) {
  const [open, setOpen] = useState(() => {
    const set = new Set([defaultOpenSection]);
    return set;
  });

  const allExpanded = sections.length > 0 && sections.every((_, i) => open.has(i));
  const toggleSection = (i) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  const toggleAll = () =>
    setOpen(allExpanded ? new Set() : new Set(sections.map((_, i) => i)));

  if (sections.length === 0) {
    return (
      <div className="card px-4 py-14 text-center">
        <p className="text-sm-fluid text-ink-muted">
          No curriculum has been published for this course yet.
        </p>
      </div>
    );
  }

  const totalLessons = sections.reduce((n, s) => n + s.lessons.length, 0);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="page-title">Syllabus</h2>
          <p className="mt-1 text-sm-fluid text-ink-muted">
            {sections.length} sections • {totalLessons} lessons
          </p>
        </div>
        {sections.length > 1 && (
          <button
            type="button"
            onClick={toggleAll}
            className="text-sm-fluid font-medium text-brand-strong underline underline-offset-2 transition hover:text-ink"
          >
            {allExpanded ? "Collapse all" : "Expand all"}
          </button>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="divide-y divide-border">
          {sections.map((section, i) => {
            const isOpen = open.has(i);
            const triggerId = `syllabus-trigger-${i}`;
            const panelId = `syllabus-panel-${i}`;
            const sectionDone = section.completedCount === section.lessons.length;

            return (
              <div key={section.sectionIndex ?? i}>
                <button
                  id={triggerId}
                  type="button"
                  onClick={() => toggleSection(i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-3 bg-surface-soft px-5 py-3 text-left text-sm-fluid font-semibold text-ink transition hover:bg-gray-100"
                >
                  <span className="min-w-0 truncate" title={section.title}>{section.title}</span>
                  <span className="flex shrink-0 items-center gap-2 text-sm-fluid font-normal text-ink-muted">
                    <span>
                      {section.completedCount}/{section.lessons.length} done
                      {!sectionDone && ` · ${section.duration ?? ""}`}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  hidden={!isOpen}
                  className="bg-white"
                >
                  <ul className="divide-y divide-border">
                    {section.lessons.map((lesson) => {
                      const TypeIcon = LESSON_TYPE_ICONS[lesson.type] ?? DEFAULT_LESSON_ICON;
                      const meta = LESSON_STATUS_META[lesson.status] ?? LESSON_STATUS_META["not-started"];
                      const locked = lesson.status === "locked";
                      const isCurrent = Boolean(currentLessonId) && lesson.lessonId === currentLessonId;
                      const playTo = `/student/course/${courseId}/play?lessonId=${lesson.lessonId}`;
                      const rowClass = locked
                        ? "flex w-full items-center gap-3 px-5 py-2.5 text-sm-fluid text-ink-muted/60"
                        : `flex w-full items-center gap-3 px-5 py-2.5 text-sm-fluid transition hover:bg-surface-soft ${
                            isCurrent
                              ? "bg-tint-student font-semibold text-ink"
                              : lesson.status === "in-progress"
                                ? "font-semibold text-ink"
                                : lesson.status === "completed"
                                  ? "text-ink"
                                  : "text-ink-muted"
                          }`;

                      const row = (
                        <>
                          <LessonStatusIcon status={lesson.status} className="shrink-0" />
                          <TypeIcon size={16} className="shrink-0 text-ink-muted/70" aria-hidden="true" />
                          <span className="min-w-0 truncate" title={lesson.title}>{lesson.title}</span>
                          {lesson.preview && (
                            <span className="badge shrink-0 bg-tint-tutor text-sm-fluid font-semibold text-brand-secondary-strong">
                              Preview
                            </span>
                          )}
                          {locked && (
                            <span className="badge shrink-0 bg-gray-100 text-sm font-medium text-ink-muted">
                              Locked
                            </span>
                          )}
                          <span className="ml-auto hidden shrink-0 pl-3 text-sm-fluid text-ink-muted/70 sm:block">
                            {lesson.duration}
                          </span>
                        </>
                      );

                      return (
                        <li key={lesson.lessonId}>
                          {locked ? (
                            <div
                              tabIndex={0}
                              role="button"
                              aria-disabled="true"
                              aria-label={`${meta.label}: ${lesson.title}. Locked — finish earlier lessons to unlock.`}
                              title="Locked — finish earlier lessons to unlock."
                              className={rowClass}
                            >
                              {row}
                            </div>
                          ) : (
                            <Link
                              to={playTo}
                              aria-label={`${meta.label}: ${lesson.title}`}
                              aria-current={isCurrent ? "page" : undefined}
                              className={rowClass}
                            >
                              {row}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
