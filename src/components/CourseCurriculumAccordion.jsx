import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CourseCurriculumAccordion({
  sections,
  defaultExpandedIndex = -1,
  renderHeaderMeta,
  renderLessonContent,
  renderLessonMeta,
  activeLessonId,
  onLessonClick,
}) {
  const [expandedIndex, setExpandedIndex] = useState(defaultExpandedIndex);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="divide-y divide-gray-200">
        {sections.map((section, i) => (
          <div key={i} className="border-b border-gray-200 last:border-b-0">
            <button
              onClick={() =>
                setExpandedIndex(expandedIndex === i ? -1 : i)
              }
              className="flex w-full items-center justify-between bg-[#F7F9FD] px-5 py-3 text-left text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
            >
              <span>{section.title}</span>
              <div className="flex items-center gap-2">
                {renderHeaderMeta && (
                  <span className="text-xs font-normal text-gray-500">
                    {renderHeaderMeta(section)}
                  </span>
                )}
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition ${
                    expandedIndex === i ? "rotate-180" : ""
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
                    className={`flex cursor-pointer items-center justify-between px-5 py-2.5 text-sm transition ${
                      activeLessonId === lesson.id
                        ? "bg-[#D62A91]/5 text-[#D62A91]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {renderLessonContent ? (
                        renderLessonContent(lesson, j)
                      ) : (
                        <span>{lesson.title}</span>
                      )}
                    </div>
                    {renderLessonMeta && (
                      <span className="shrink-0 text-xs text-gray-400">
                        {renderLessonMeta(lesson)}
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
  );
}
