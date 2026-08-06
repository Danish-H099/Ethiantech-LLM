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
      <hr className="my-8 border-gray-200" />
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 mb-4 text-sm text-gray-500">
        {totalSections} sections • {totalLectures} lectures
        {totalDuration && <> • {totalDuration}</>}
      </p>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="divide-y divide-gray-200">
          {sections.map((section, i) => (
            <div key={i} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() =>
                  setExpandedIndex(expandedIndex === i ? -1 : i)
                }
                className="flex w-full items-center justify-between bg-surface-soft px-5 py-3 text-left text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
              >
                <span>{section.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-normal text-gray-500">
                    {section.lectures} lectures • {section.duration}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition ${expandedIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>
              {expandedIndex === i && (
                <div className="divide-y divide-gray-100 bg-white">
                  {section.lessons.map((lesson, j) => (
                    <div
                      key={lesson.id || j}
                      onClick={() => onLessonClick?.(lesson)}
                      className={`flex cursor-pointer items-center justify-between px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900`}
                    >
                      <div className="flex items-center gap-3">
                        {renderLessonContent ? (
                          renderLessonContent(lesson)
                        ) : (
                          <>
                            <PlayCircle size={16} className="shrink-0 text-gray-400" />
                            <Link
                              to="/courses/video"
                              className="text-inherit no-underline"
                            >
                              {lesson.title}
                            </Link>
                          </>
                        )}
                      </div>
                      {renderLessonMeta ? (
                        renderLessonMeta(lesson)
                      ) : (
                        <span className="shrink-0 text-xs text-gray-400">
                          {lesson.duration}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
