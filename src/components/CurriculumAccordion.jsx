import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Shared accordion engine for course curricula. Renders the section headers,
 * expand/collapse logic, and per-lesson rows, delegating the actual lesson
 * presentation to `renderLesson` so callers can specialize behaviour
 * (e.g. student links vs. public preview/locked states).
 *
 * @param {Object} props
 * @param {Array} props.sections Curriculum sections.
 * @param {string} [props.title] Heading text.
 * @param {string} [props.totalDuration] Optional total duration label.
 * @param {number} [props.defaultExpandedIndex] Index expanded on mount.
 * @param {(lesson: Object, meta: { lessonIndex: number, sectionIndex: number }) => React.ReactNode} props.renderLesson
 */
export function CurriculumAccordion({
  sections,
  title = "Course Structure",
  totalDuration,
  defaultExpandedIndex = 0,
  renderLesson,
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

  return (
    <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="detail-section-title">{title}</h2>
          <p className="mt-2 text-sm-fluid text-ink-muted">
            {sections.length} sections • {totalLectures} lectures
            {totalDuration && <> • {totalDuration}</>}
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
                  className="flex w-full items-center justify-between bg-surface-soft px-5 py-3 text-left text-sm-fluid font-semibold text-ink transition hover:bg-gray-100"
                >
                  <span>{section.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm-fluid font-normal text-ink-muted">
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
                      className="flex items-center justify-between px-5 py-2.5 text-sm-fluid text-ink-muted"
                    >
                      <div className="flex items-center gap-3">
                        {renderLesson(lesson, {
                          lessonIndex: j,
                          sectionIndex: i,
                        })}
                      </div>
                      <span className="shrink-0 text-sm-fluid text-ink-muted/70">
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
