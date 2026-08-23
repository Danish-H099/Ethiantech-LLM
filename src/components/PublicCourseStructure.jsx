import { Lock, PlayCircle } from "lucide-react";
import { LESSON_TYPE_ICONS, DEFAULT_LESSON_ICON } from "src/lib/lessonTypes";
import { CurriculumAccordion } from "src/components/CurriculumAccordion";

/**
 * Public (pre-enrollment) curriculum view. Preview lessons open a preview
 * video via `onPreviewClick`; every other lesson is rendered locked and
 * non-interactive so visitors cannot browse gated content. Inherits the
 * accordion engine from `CurriculumAccordion`.
 */
export default function PublicCourseStructure({
  sections,
  title = "Course Structure",
  totalDuration,
  defaultExpandedIndex = 0,
  courseId,
  onPreviewClick,
}) {
  const renderLesson = (lesson, { lessonIndex, sectionIndex }) => {
    const Icon = LESSON_TYPE_ICONS[lesson.type] ?? DEFAULT_LESSON_ICON;

    if (lesson.preview) {
      return (
        <>
          <Icon size={16} className="shrink-0 text-brand" aria-hidden="true" />
          <button
            type="button"
            onClick={() =>
              onPreviewClick?.(lesson, {
                lessonIndex,
                sectionIndex,
                courseId,
              })
            }
            className="text-inherit no-underline font-medium text-ink transition hover:text-brand-strong hover:underline underline-offset-2"
          >
            {lesson.title}
          </button>
          <span className="badge bg-tint-tutor text-sm-fluid font-semibold text-brand-secondary-strong">
            Preview
          </span>
        </>
      );
    }

    return (
      <>
        <Lock size={16} className="shrink-0 text-ink-muted/50" aria-hidden="true" />
        <span className="text-ink-muted/60" aria-hidden="true">
          {lesson.title}
        </span>
      </>
    );
  };

  return (
    <CurriculumAccordion
      sections={sections}
      title={title}
      totalDuration={totalDuration}
      defaultExpandedIndex={defaultExpandedIndex}
      renderLesson={renderLesson}
    />
  );
}
