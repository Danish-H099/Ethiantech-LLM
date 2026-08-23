/**
 * Lesson media — the only genuinely available media assets in this prototype.
 *
 * The curriculum data (src/data/curriculumData.json) carries no media URLs, so
 * the vast majority of video lessons intentionally fall back to the player's
 * poster placeholder. The one real asset is the demo video + caption file,
 * previewed from the public course details page (src/pages/public/CourseDetailsPage.jsx),
 * which plays course 1's first lesson. That single mapping is recorded here so
 * the player renders a native <video> for it and never guesses or invents a
 * hosting convention for any other lesson.
 */
import captionsUrl from "src/assets/demo-captions.vtt?url";

const lessonMedia = {
  "1-s0-l0": {
    videoSrc: "/videos/demo.mp4",
    captionSrc: captionsUrl,
  },
};

/** Media descriptor ({ videoSrc, captionSrc }) for a lesson, or null. */
export function getLessonMedia(lessonId) {
  return lessonMedia[lessonId] ?? null;
}
