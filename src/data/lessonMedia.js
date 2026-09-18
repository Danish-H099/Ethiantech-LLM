import captionsUrl from "src/assets/demo-captions.vtt?url";
import demoVideoUrl from "src/assets/demo.mp4?url";

const lessonMedia = {
  "1-s0-l0": {
    videoSrc: demoVideoUrl,
    captionSrc: captionsUrl,
  },
};

const demoMedia = {
  videoSrc: demoVideoUrl,
  captionSrc: captionsUrl,
};

export function getLessonMedia(lessonId) {
  return lessonMedia[lessonId] ?? demoMedia;
}
