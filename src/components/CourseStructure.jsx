import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  PlayCircle,
  FileText,
  ListChecks,
  Wrench,
  FolderKanban,
  Download,
} from "lucide-react";

const LESSON_TYPE_ICONS = {
  video: PlayCircle,
  article: FileText,
  quiz: ListChecks,
  exercise: Wrench,
  project: FolderKanban,
  resource: Download,
};

export default function CourseStructure({
  sections,
  title = "Course Structure",
  totalDuration,
  defaultExpandedIndex = 0,
  courseId,
}) {
  const [openSections, setOpenSections] = useState(
    () => new Set([defaultExpandedIndex])
  );
  const totalLectures = sections.reduce((s, sec) => s + sec.lectures, 0);
  const allExpanded = sections.every((_, i) => openSections.has(i));

  function toggleSection(i) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function toggleAll() {
    setOpenSections(
      allExpanded ? new Set() : new Set(sections.map((_, i) => i))
    );
  }

  const renderLesson = (lesson) => {
    const Icon = LESSON_TYPE_ICONS[lesson.type] ?? PlayCircle;
    return (
      <>
        <Icon size={16} className="shrink-0 text-ink-muted/70" aria-hidden="true" />
        <Link
          to={courseId ? `/courses/video?course=${courseId}` : "/courses/video"}
          className="text-inherit no-underline"
        >
          {lesson.title}
        </Link>
        {lesson.preview && (
          <span className="badge bg-tint-tutor text-10 font-semibold text-brand-secondary-strong">
            Preview
          </span>
        )}
      </>
    );
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="page-title">{title}</h2>
          <p className="mt-2 text-sm text-ink-muted">
            {sections.length} sections • {totalLectures} lectures
            {totalDuration && <> • {totalDuration}</>}
          </p>
        </div>
        {sections.length > 1 && (
          <button
            type="button"
            onClick={toggleAll}
            className="text-sm font-medium text-brand-strong underline underline-offset-2 transition hover:text-ink"
          >
            {allExpanded ? "Collapse all" : "Expand all"}
          </button>
        )}
      </div>
      <div className="card overflow-hidden">
        <div className="divide-y divide-border">
          {sections.map((section, i) => {
            const open = openSections.has(i);
            const triggerId = `curriculum-trigger-${i}`;
            const panelId = `curriculum-panel-${i}`;
            return (
              <div key={i} className="border-b border-border last:border-b-0">
                <button
                  id={triggerId}
                  onClick={() => toggleSection(i)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between bg-surface-soft px-5 py-3 text-left text-sm font-semibold text-ink transition hover:bg-gray-100"
                >
                  <span>{section.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-normal text-ink-muted">
                      {section.lectures} lectures • {section.duration}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-ink-muted transition ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  hidden={!open}
                  className="divide-y divide-border bg-white"
                >
                  {section.lessons.map((lesson, j) => (
                    <div
                      key={lesson.id || j}
                      className="flex items-center justify-between px-5 py-2.5 text-sm text-ink-muted"
                    >
                      <div className="flex items-center gap-3">
                        {renderLesson(lesson)}
                      </div>
                      <span className="shrink-0 text-xs text-ink-muted/70">
                        {lesson.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
