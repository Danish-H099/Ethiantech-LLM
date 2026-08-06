import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, PlayCircle } from "lucide-react";

export default function CourseStructure({
  sections,
  title = "Course Structure",
  totalDuration,
  defaultExpandedIndex = 0,
  onLessonClick,
  renderLessonContent,
  renderLessonMeta,
}) {
  const [expandedIndex, setExpandedIndex] = useState(defaultExpandedIndex);
  const totalSections = sections.length;
  const totalLectures = sections.reduce((s, sec) => s + sec.lectures, 0);

  return (
    <>
      <hr className="divider my-8" />
      <h2 className="page-title">{title}</h2>
      <p className="mt-2 mb-4 text-sm text-ink-muted">
        {totalSections} sections • {totalLectures} lectures
        {totalDuration && <> • {totalDuration}</>}
      </p>
      <div className="card overflow-hidden">
        <div className="divide-y divide-border">
          {sections.map((section, i) => (
            <div key={i} className="border-b border-border last:border-b-0">
              <button
                onClick={() =>
                  setExpandedIndex(expandedIndex === i ? -1 : i)
                }
                className="flex w-full items-center justify-between bg-surface-soft px-5 py-3 text-left text-sm font-semibold text-ink transition hover:bg-gray-100"
              >
                <span>{section.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-normal text-ink-muted">
                    {section.lectures} lectures • {section.duration}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-ink-muted transition ${expandedIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>
              {expandedIndex === i && (
                <div className="divide-y divide-border bg-white">
                  {section.lessons.map((lesson, j) => {
                    const meta = renderLessonMeta ? (
                      renderLessonMeta(lesson)
                    ) : (
                      <span className="shrink-0 text-xs text-ink-muted/70">
                        {lesson.duration}
                      </span>
                    );

                    if (onLessonClick) {
                      return (
                        <button
                          key={lesson.id || j}
                          type="button"
                          onClick={() => onLessonClick(lesson)}
                          className="flex w-full cursor-pointer items-center justify-between px-5 py-2.5 text-left text-sm text-ink-muted transition hover:bg-surface-soft hover:text-ink"
                        >
                          <div className="flex items-center gap-3">
                            {renderLessonContent ? (
                              renderLessonContent(lesson)
                            ) : (
                              <span>{lesson.title}</span>
                            )}
                          </div>
                          {meta}
                        </button>
                      );
                    }

                    return (
                      <div
                        key={lesson.id || j}
                        className="flex items-center justify-between px-5 py-2.5 text-sm text-ink-muted"
                      >
                        <div className="flex items-center gap-3">
                          {renderLessonContent ? (
                            renderLessonContent(lesson)
                          ) : (
                            <>
                              <PlayCircle size={16} className="shrink-0 text-ink-muted/70" />
                              <Link
                                to="/courses/video"
                                className="text-inherit no-underline"
                              >
                                {lesson.title}
                              </Link>
                            </>
                          )}
                        </div>
                        {meta}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
