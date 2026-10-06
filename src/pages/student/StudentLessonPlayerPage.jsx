import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { m as Motion, useReducedMotion } from "motion/react";
import * as Tabs from "@radix-ui/react-tabs";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileQuestion,
  ListTree,
  Lock,
  X,
  Clock,
  PlayCircle,
  FileText,
  BookOpen,
  MessageSquare,
  StickyNote,
  Send,
  Trash2,
  Plus,
  User,
} from "lucide-react";

import Breadcrumbs from "src/components/ui/Breadcrumbs";
import ProgressRing from "src/components/ui/ProgressRing";
import CourseSyllabus from "src/components/student/CourseSyllabus";
import LessonStatusIcon from "src/components/student/LessonStatusIcon";
import LessonPlayerPlaceholder from "src/components/student/LessonPlayerPlaceholder";
import LessonProgressBar from "src/components/student/LessonProgressBar";
import LessonCompleteButton from "src/components/student/LessonCompleteButton";
import LessonPlayerQuiz from "src/components/student/LessonPlayerQuiz";
import LessonPlayerExercise from "src/components/student/LessonPlayerExercise";
import {
  UnderlineTabList,
  UnderlineTab,
} from "src/components/student/UnderlineTabList";
import { durations, easeArrive } from "src/lib/animationVariants";
import { formatRelativeTime } from "src/lib/format";
import {
  LESSON_TYPE_ICONS,
  DEFAULT_LESSON_ICON,
  LESSON_TYPE_LABELS,
} from "src/lib/lesson";
import { LESSON_STATUS_META } from "src/lib/lesson";
import { LESSON_STATUS } from "src/lib/statuses";
import {
  getCourseById,
} from "src/services/courses";
import {
  getEnrolledCourseData,
  getLessonMediaFor,
  getLessonProgress,
  resolveLesson,
  completeLesson,
  updateLessonProgress,
  recordLessonAccess,
  getQuizData,
  getCommentsForLesson,
  addComment,
  getNotesForLesson,
  addLessonNote,
  deleteNote,
} from "src/services/studentRepository";
import { DEFAULT_STUDENT_ID } from "src/data/students";

const COURSE_BREADCRUMBS = { label: "My Courses", link: "/student/my-courses" };

// ------------------------------------------------------------------ helpers

function findPrecedingLesson(sections, sectionIndex, lessonIndex) {
  for (let s = sectionIndex; s >= 0; s -= 1) {
    const lessons = sections[s]?.lessons ?? [];
    const start = s === sectionIndex ? lessonIndex - 1 : lessons.length - 1;
    for (let l = start; l >= 0; l -= 1) {
      return lessons[l];
    }
  }
  return null;
}

// --------------------------------------------------------- empty states

function LessonPageEmptyState({ items, icon, title, description, action }) {
  const Icon = icon;
  return (
    <div>
      <Breadcrumbs items={items} />
      <div className="mt-6 card px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <Icon size={32} className="text-ink-muted" aria-hidden="true" />
          <h1 className="mt-4 text-body-lg font-semibold text-ink">{title}</h1>
          <p className="mt-1 max-w-md text-sm-fluid text-ink-muted">{description}</p>
          <Link
            to={action.to}
            className="btn-brand mt-6 px-5 py-2.5 text-sm-fluid"
          >
            {action.label}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------- lesson meta

function LessonPlayerMeta({ resolved, status }) {
  const headingRef = useRef(null);
  const TypeIcon = LESSON_TYPE_ICONS[resolved.type] ?? DEFAULT_LESSON_ICON;
  const typeLabel = LESSON_TYPE_LABELS[resolved.type] ?? "Lesson";
  const statusMeta = LESSON_STATUS_META[status] ?? LESSON_STATUS_META[LESSON_STATUS.NOT_STARTED];

  useEffect(() => {
    headingRef.current?.focus();
  }, [resolved.lessonId]);

  return (
    <section className="card p-5 sm:p-6" aria-labelledby="player-lesson-title">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <LessonStatusIcon status={status} size={20} />
        <span className="text-sm-fluid font-medium text-ink-muted">{statusMeta.label}</span>
        {resolved.isPreview && (
          <span className="badge bg-tint-tutor text-sm font-medium text-brand-secondary-strong">
            Preview
          </span>
        )}
      </div>

      <h1
        id="player-lesson-title"
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 text-heading font-semibold text-ink focus-visible:outline-none"
      >
        {resolved.title}
      </h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm-fluid text-ink-muted">
        <span className="flex items-center gap-1.5">
          <TypeIcon size={15} aria-hidden="true" />
          {typeLabel}
        </span>
        {resolved.duration && (
          <span className="flex items-center gap-1.5">
            <Clock size={15} aria-hidden="true" />
            {resolved.duration}
          </span>
        )}
        <span>{resolved.sectionTitle}</span>
      </div>
    </section>
  );
}

// --------------------------------------------------------- lesson tabs

function TabPanel({ children }) {
  const reduce = useReducedMotion();
  return (
    <Motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : durations.slow, ease: easeArrive }}
      className="pt-6"
    >
      {children}
    </Motion.div>
  );
}

function DescriptionPanel({ description, sectionTitle }) {
  if (description) {
    return (
      <p className="text-body leading-relaxed text-ink-muted">{description}</p>
    );
  }
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-soft px-6 py-12 text-center">
      <BookOpen size={28} className="mx-auto text-ink-muted/50" aria-hidden="true" />
      <p className="mt-3 text-sm-fluid font-medium text-ink">No description yet</p>
      <p className="mx-auto mt-1 max-w-md text-sm-fluid text-ink-muted">
        A written description hasn&rsquo;t been added for this lesson
        {sectionTitle ? ` in “${sectionTitle}”` : ""}.
      </p>
    </div>
  );
}

function CommentsPanel({ courseId, lessonId }) {
  const [comments, setComments] = useState(() => getCommentsForLesson(courseId, lessonId));
  const [text, setText] = useState("");

  function refresh() {
    setComments(getCommentsForLesson(courseId, lessonId));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    addComment(courseId, lessonId, "You", value);
    setText("");
    refresh();
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment…"
          aria-label="Add a comment"
          className="input flex-1"
        />
        <button
          type="submit"
          className="btn-brand btn-brand-flat px-6 py-2.5 text-sm-fluid"
        >
          <Send size={15} aria-hidden="true" />
          Comment
        </button>
      </form>

      {comments.length === 0 ? (
        <div className="card px-4 py-14 text-center">
          <MessageSquare size={28} className="mx-auto text-ink-muted/50" aria-hidden="true" />
          <p className="mt-3 text-sm-fluid font-medium text-ink">No comments yet</p>
          <p className="mt-1 text-sm-fluid text-ink-muted">
            Be the first to start the discussion.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tint-student text-brand-strong">
                  <User size={16} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm-fluid font-semibold text-ink">{c.author}</p>
                  <p className="text-sm-fluid text-ink-muted/70">{formatRelativeTime(c.date)}</p>
                </div>
              </div>
              <p className="mt-3 text-sm-fluid leading-7 text-ink-muted">{c.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LessonTabs({
  courseId,
  lessonId,
  lessonTitle,
  courseName,
  sectionTitle,
  description,
}) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <section className="card p-5 sm:p-6" aria-label="Lesson details">
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <UnderlineTabList ariaLabel="Lesson details">
          {[
            { value: "description", label: "Description", Icon: BookOpen },
            { value: "comments", label: "Comments", Icon: MessageSquare },
            { value: "notes", label: "Notes", Icon: StickyNote },
          ].map((t) => (
            <UnderlineTab key={t.value} value={t.value} icon={t.Icon}>
              {t.label}
            </UnderlineTab>
          ))}
        </UnderlineTabList>

        <Tabs.Content value="description">
          <TabPanel>
            <DescriptionPanel description={description} sectionTitle={sectionTitle} />
          </TabPanel>
        </Tabs.Content>

        <Tabs.Content value="comments">
          <TabPanel>
            <CommentsPanel courseId={courseId} lessonId={lessonId} />
          </TabPanel>
        </Tabs.Content>

        <Tabs.Content value="notes">
          <TabPanel>
            <NotesPanel courseId={courseId} lessonId={lessonId} courseName={courseName} lessonTitle={lessonTitle} />
          </TabPanel>
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
}

function NotesPanel({ courseId, lessonId, courseName, lessonTitle }) {
  const [notes, setNotes] = useState(() => getNotesForLesson(courseId, lessonId));
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);

  function refresh() {
    setNotes(getNotesForLesson(courseId, lessonId));
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    addLessonNote(courseId, courseName, lessonId, lessonTitle, title.trim(), content.trim());
    setTitle("");
    setContent("");
    setShowForm(false);
    refresh();
  }

  function handleDelete(id) {
    deleteNote(id);
    refresh();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="min-w-0 break-words text-sm-fluid text-ink-muted">
          {lessonTitle ? `Notes for “${lessonTitle}”` : "Notes for this lesson"}
        </p>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex shrink-0 items-center gap-1.5 text-sm-fluid font-medium text-brand-strong hover:underline"
          >
            <Plus size={15} aria-hidden="true" />
            Add note
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card mb-5 p-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            aria-label="Note title"
            className="input mb-3"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note…"
            aria-label="Note content"
            rows={4}
            className="input mb-3 resize-none py-3 leading-[1.7]"
          />
          <div className="flex gap-3">
            <button type="submit" className="btn-brand px-5 py-2 text-sm-fluid">
              Save note
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-outline px-5 py-2 text-sm-fluid"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {notes.length === 0 && !showForm ? (
        <div className="card px-4 py-14 text-center">
          <StickyNote size={28} className="mx-auto text-ink-muted/50" aria-hidden="true" />
          <p className="mt-3 text-sm-fluid font-medium text-ink">No notes for this lesson yet</p>
          <p className="mt-1 text-sm-fluid text-ink-muted">
            Capture what matters while you learn.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {notes.map((n) => (
            <li key={n.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <h4 className="min-w-0 break-words font-semibold text-ink">{n.title}</h4>
                <button
                  type="button"
                  onClick={() => handleDelete(n.id)}
                  aria-label={`Delete note ${n.title}`}
                  className="shrink-0 rounded p-1 text-ink-muted/50 transition hover:text-red-500"
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm-fluid leading-7 text-ink-muted">
                {n.content}
              </p>
              <p className="mt-3 text-sm-fluid text-ink-muted/40">{n.date}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 border-t border-border pt-4 text-center">
        <Link to="/student/notes" className="text-sm-fluid font-medium text-brand-strong hover:underline">
          Open all notebooks →
        </Link>
      </div>
    </div>
  );
}

// ------------------------------------------------------- lesson nav

function LessonNavPrevNext({
  courseId,
  sections,
  currentSectionIndex,
  currentLessonIndex,
}) {
  const flat = [];
  sections.forEach((section, sectionIndex) => {
    (section.lessons ?? []).forEach((lesson, lessonIndex) => {
      flat.push({ ...lesson, sectionIndex, lessonIndex });
    });
  });

  const currentPos = flat.findIndex(
    (lesson) =>
      lesson.sectionIndex === currentSectionIndex && lesson.lessonIndex === currentLessonIndex
  );

  let previous = null;
  for (let i = currentPos - 1; i >= 0; i -= 1) {
    if (flat[i].status !== LESSON_STATUS.LOCKED) {
      previous = flat[i];
      break
    }
  }

  let next = null;
  for (let i = currentPos + 1; i < flat.length; i += 1) {
    if (flat[i].status !== LESSON_STATUS.LOCKED) {
      next = flat[i];
      break
    }
  }

  const toLesson = (lesson) => `/student/course/${courseId}/play?lessonId=${lesson.lessonId}`;

  const linkClass =
    "flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-brand px-4 py-3 text-sm-fluid font-medium text-brand-strong transition hover:bg-brand hover:text-white";
  const disabledClass =
    "flex min-w-0 flex-1 cursor-not-allowed select-none items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm-fluid text-ink-muted/60";

  return (
    <nav aria-label="Lesson navigation" className="flex flex-col gap-3 sm:flex-row">
      {previous ? (
        <Link
          to={toLesson(previous)}
          className={linkClass}
          aria-label={`Previous lesson: ${previous.title}`}
        >
          <ChevronLeft size={18} className="shrink-0" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-sm-fluid uppercase tracking-wide opacity-70">Previous</span>
            <span className="block truncate">{previous.title}</span>
          </span>
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          <ChevronLeft size={18} className="shrink-0" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-sm-fluid uppercase tracking-wide">Previous</span>
            <span className="block truncate">Start of course</span>
          </span>
        </span>
      )}

      {next ? (
        <Link
          to={toLesson(next)}
          className={`${linkClass} sm:justify-end`}
          aria-label={`Next lesson: ${next.title}`}
        >
          <span className="min-w-0 text-right">
            <span className="block text-sm-fluid uppercase tracking-wide opacity-70">Next</span>
            <span className="block truncate">{next.title}</span>
          </span>
          <ChevronRight size={18} className="shrink-0" aria-hidden="true" />
        </Link>
      ) : (
        <span className={`${disabledClass} sm:justify-end`} aria-disabled="true">
          <span className="min-w-0 text-right">
            <span className="block text-sm-fluid uppercase tracking-wide">Next</span>
            <span className="block truncate">End of course</span>
          </span>
          <ChevronRight size={18} className="shrink-0" aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}

// ------------------------------------------------------- complete toast

function LessonCompleteToast({ open, nextTo, nextLabel = "Next lesson" }) {
  if (!open) return null;
  return (
    <div
      role="status"
      aria-live="assertive"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-success bg-success-soft px-4 py-3 text-success shadow-lg">
        <CheckCircle2 size={20} aria-hidden="true" />
        <span className="font-semibold text-ink">Lesson completed!</span>
        {nextTo && (
          <Link
            to={nextTo}
            className="ml-1 rounded-lg bg-success px-3 py-1.5 text-sm-fluid font-semibold text-white transition hover:opacity-90"
          >
            {nextLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------- video player

function LessonPlayerVideo({
  lesson,
  media,
  poster,
  isCompleted,
  onComplete,
  onProgress,
  videoProgress,
}) {
  const videoRef = useRef(null);
  const [displayPct, setDisplayPct] = useState(videoProgress?.percentage || 0);
  const [announcePct, setAnnouncePct] = useState(videoProgress?.percentage || 0);
  const [mediaError, setMediaError] = useState(false);
  const lastWriteRef = useRef({ time: 0, pct: 0 });

  function renderUnavailable() {
    return (
      <div>
        <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-ink">
          {poster && (
            <img
              src={poster}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          )}
          <div className="relative flex flex-col items-center gap-3 px-6 text-center text-white">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur">
              <PlayCircle size={32} aria-hidden="true" />
            </span>
            <p className="text-sm-fluid font-semibold">Video unavailable</p>
            <p className="max-w-sm text-sm-fluid text-white/70">
              This lesson's video can't be played right now. Completion unlocks once the
              video is attached.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm-fluid text-ink-muted">
            Progress tracking starts once a video is attached.
          </p>
          <LessonCompleteButton
            isCompleted={isCompleted}
            disabled
            onComplete={onComplete}
            lessonTitle={lesson.title}
          />
        </div>
      </div>
    );
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !media?.videoSrc) return undefined;
    const onMeta = () => {
      if (!isCompleted && videoProgress?.currentTime) {
        try {
          v.currentTime = videoProgress.currentTime;
        } catch {
          /* ignore seek failures on unsupported sources */
        }
      }
    };
    v.addEventListener("loadedmetadata", onMeta);
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, [media?.videoSrc, isCompleted, videoProgress?.currentTime]);

  function handleTimeUpdate(e) {
    const v = e.currentTarget;
    if (!v.duration) return;
    const pct = (v.currentTime / v.duration) * 100;
    setDisplayPct(pct);

    const now = Date.now();
    const last = lastWriteRef.current;
    if (now - last.time >= 5000 || Math.abs(pct - last.pct) >= 10) {
      lastWriteRef.current = { time: now, pct };
      setAnnouncePct(Math.round(pct));
      onProgress?.({ currentTime: v.currentTime, percentage: Math.round(pct) });
    }

    if (pct >= 90 && !isCompleted) onComplete?.();
  }

  function handleEnded() {
    if (!isCompleted) onComplete?.();
  }

  if (!media?.videoSrc || mediaError) {
    return renderUnavailable();
  }

  return (
    <div>
      <div className="overflow-hidden rounded-xl bg-ink shadow-sm">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption -- captions render only
            when a real caption source exists; a <track> is never faked when absent. */}
        <video
          ref={videoRef}
          controls
          preload="metadata"
          playsInline
          controlsList="nodownload"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={() => setMediaError(true)}
          className="aspect-video w-full bg-ink"
          poster={poster}
          aria-label={`Video lesson: ${lesson.title}`}
        >
          <source src={media.videoSrc} type="video/mp4" />
          {media.captionSrc && (
            <track kind="captions" src={media.captionSrc} srcLang="en" label="English" />
          )}
          Your browser does not support embedded video.
        </video>
      </div>

      <div className="mt-4 space-y-3">
        <LessonProgressBar
          percentage={isCompleted ? 100 : Math.round(displayPct)}
          label={`Video progress: ${isCompleted ? 100 : Math.round(displayPct)}%`}
        />
        <span className="sr-only" aria-live="polite">
          {`Video progress: ${announcePct}%`}
        </span>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm-fluid text-ink-muted">
            {isCompleted
              ? "You've watched this lesson."
              : "Your position is saved as you watch."}
          </span>
          <LessonCompleteButton
            isCompleted={isCompleted}
            onComplete={onComplete}
            lessonTitle={lesson.title}
          />
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------- article view

function LessonPlayerArticle({ lesson, content, isCompleted, onComplete }) {
  const paragraphs = Array.isArray(content)
    ? content
    : content
      ? [content]
      : [];

  return (
    <article className="card overflow-hidden">
      <div className="px-5 py-8 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2 text-sm-fluid font-medium uppercase tracking-wide text-ink-muted">
            <FileText size={14} aria-hidden="true" />
            Written lesson
          </div>
          <h2 className="mt-3 text-heading font-semibold text-ink">{lesson.title}</h2>

          {isCompleted && (
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-sm-fluid font-medium text-success">
              <CheckCircle2 size={14} aria-hidden="true" />
              Completed
            </span>
          )}

          {paragraphs.length > 0 ? (
            <div className="mt-8 space-y-5 border-t border-border pt-8 text-body leading-relaxed text-ink">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-border bg-surface-soft px-6 py-12 text-center">
              <FileText size={28} className="mx-auto text-ink-muted/50" aria-hidden="true" />
              <p className="mt-3 text-sm-fluid font-medium text-ink">Content not published yet</p>
              <p className="mx-auto mt-1 max-w-sm text-sm-fluid text-ink-muted">
                This lesson's written content isn't included in the prototype yet. Check back
                once the course is updated.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-surface-soft px-5 py-4 sm:px-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <p className="text-sm-fluid text-ink-muted">
            {isCompleted
              ? "You've finished this lesson."
              : "Mark this lesson complete when you're done reading."}
          </p>
          <LessonCompleteButton
            isCompleted={isCompleted}
            onComplete={onComplete}
            lessonTitle={lesson.title}
          />
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------- body switch

function LessonPlayerBody({
  resolved,
  media,
  poster,
  isCompleted,
  onComplete,
  onRevision,
  onProgress,
  videoProgress,
  courseId,
}) {
  switch (resolved.type) {
    case "video":
      return (
        <LessonPlayerVideo
          lesson={resolved}
          media={media}
          poster={poster}
          isCompleted={isCompleted}
          onComplete={onComplete}
          onProgress={onProgress}
          videoProgress={videoProgress}
        />
      );
    case "article":
      return (
        <LessonPlayerArticle lesson={resolved} isCompleted={isCompleted} onComplete={onComplete} />
      );
    case "quiz":
      return getQuizData(resolved.lessonId) ? (
        <LessonPlayerQuiz
          resolved={resolved}
          courseId={courseId}
          isCompleted={isCompleted}
          onRevision={onRevision}
          onComplete={onComplete}
        />
      ) : (
        <LessonPlayerPlaceholder
          lesson={resolved}
          isCompleted={isCompleted}
          onComplete={onComplete}
        />
      );
    case "exercise":
    case "project":
      return (
        <LessonPlayerExercise
          resolved={resolved}
          courseId={courseId}
          isCompleted={isCompleted}
          onRevision={onRevision}
          onComplete={onComplete}
        />
      );
    case "resource":
      return (
        <LessonPlayerPlaceholder
          lesson={resolved}
          isCompleted={isCompleted}
          onComplete={onComplete}
        />
      );
    default:
      console.warn(`Unknown lesson type "${resolved.type}" — falling back to placeholder.`);
      return (
        <LessonPlayerPlaceholder
          lesson={resolved}
          title="Lesson type not recognized"
          description="This lesson uses a type this prototype doesn't handle yet."
          isCompleted={isCompleted}
          onComplete={onComplete}
        />
      );
  }
}

// --------------------------------------------------------------- page

export default function StudentLessonPlayerPage() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const lessonId = searchParams.get("lessonId");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerToggleRef = useRef(null);
  const drawerRef = useRef(null);
  const [, setRevision] = useState(0);
  const [completion, setCompletion] = useState(null);

  const course = getCourseById(courseId);
  const data = getEnrolledCourseData(DEFAULT_STUDENT_ID, courseId);

  const resolved = lessonId ? resolveLesson(course?.id, lessonId) : null;

  const [prevLocationKey, setPrevLocationKey] = useState(location.key);
  if (prevLocationKey !== location.key) {
    setPrevLocationKey(location.key);
    setDrawerOpen(false);
  }

  useEffect(() => {
    if (!drawerOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        drawerToggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const first = drawerRef.current?.querySelector("a[href], button");
    first?.focus();
  }, [drawerOpen]);

  const rLessonId = resolved?.lessonId;
  const rSectionIndex = resolved?.sectionIndex;
  const rLessonIndex = resolved?.lessonIndex;
  useEffect(() => {
    if (!rLessonId || rSectionIndex == null || rLessonIndex == null) return;
    const view = getEnrolledCourseData(DEFAULT_STUDENT_ID, courseId);
    if (view.status !== "ready") return;
    const status =
      view.sections[rSectionIndex]?.lessons?.[rLessonIndex]?.status;
    if (status && status !== LESSON_STATUS.LOCKED) {
      recordLessonAccess(DEFAULT_STUDENT_ID, courseId, rLessonId);
    }
  }, [courseId, rLessonId, rSectionIndex, rLessonIndex]);

  useEffect(() => {
    if (!completion) return undefined;
    const t = setTimeout(() => setCompletion(null), 3000);
    return () => clearTimeout(t);
  }, [completion]);

  if (!course) {
    return (
      <LessonPageEmptyState
        items={[COURSE_BREADCRUMBS, { label: "Lesson" }]}
        icon={FileQuestion}
        title="Course not found"
        description="This lesson's course is no longer available in the catalog."
        action={{ label: "Back to My Courses", to: "/student/my-courses" }}
      />
    );
  }

  if (data.status === "not-enrolled") {
    return (
      <LessonPageEmptyState
        items={[COURSE_BREADCRUMBS, { label: course.title, link: `/student/course/${course.id}` }, { label: "Lesson" }]}
        icon={Lock}
        title="You're not enrolled"
        description="You need to enroll in this course before you can watch its lessons."
        action={{ label: "Browse Catalog", to: "/courses" }}
      />
    );
  }

  const { sections } = data;

  if (!lessonId) {
    if (sections.length === 0) {
      return (
        <LessonPageEmptyState
          items={[COURSE_BREADCRUMBS, { label: course.title, link: `/student/course/${course.id}` }, { label: "Lesson" }]}
          icon={FileQuestion}
          title="No curriculum has been published for this course yet"
          description="This course doesn't have any lessons available to play."
          action={{ label: "Back to course overview", to: `/student/course/${course.id}` }}
        />
      );
    }
    if (data.resumeTarget) {
      return (
        <Navigate
          to={`/student/course/${course.id}/play?lessonId=${data.resumeTarget.lessonId}`}
          replace
        />
      );
    }
    return (
      <LessonPageEmptyState
        items={[COURSE_BREADCRUMBS, { label: course.title, link: `/student/course/${course.id}` }, { label: "Lesson" }]}
        icon={CheckCircle2}
        title="You've completed every lesson"
        description="There's no next lesson to resume in this course. Review the syllabus anytime."
        action={{ label: "Back to course overview", to: `/student/course/${course.id}` }}
      />
    );
  }

  if (!resolved) {
    return (
      <LessonPageEmptyState
        items={[COURSE_BREADCRUMBS, { label: course.title, link: `/student/course/${course.id}` }, { label: "Lesson" }]}
        icon={FileQuestion}
        title="Lesson not found in this course"
        description="We couldn't find that lesson. It may have been moved or removed from the syllabus."
        action={{ label: "Back to course overview", to: `/student/course/${course.id}` }}
      />
    );
  }

  const currentStatus =
    sections[resolved.sectionIndex]?.lessons?.[resolved.lessonIndex]?.status ?? LESSON_STATUS.LOCKED;
  const media = getLessonMediaFor(resolved.lessonId);
  const preceding = findPrecedingLesson(sections, resolved.sectionIndex, resolved.lessonIndex);
  const drawerId = "player-syllabus-drawer";

  const lessonState = getLessonProgress(DEFAULT_STUDENT_ID, course.id, resolved.lessonId);
  const isCompleted = lessonState?.status === LESSON_STATUS.COMPLETED;
  const videoProgress = lessonState?.videoProgress;

  const handleRevision = () => setRevision((r) => r + 1);

  const handleComplete = () => {
    const result = completeLesson(DEFAULT_STUDENT_ID, course.id, resolved.lessonId);
    setRevision((r) => r + 1);
    setCompletion(result);
  };

  const handleProgress = (patch) => {
    updateLessonProgress(DEFAULT_STUDENT_ID, course.id, resolved.lessonId, { videoProgress: patch });
  };

  const flatForNav = [];
  sections.forEach((s, si) => (s.lessons || []).forEach((l, li) => flatForNav.push({ ...l, si, li })));
  const currentPos = flatForNav.findIndex(
    (l) => l.lessonId === resolved.lessonId
  );
  let nextLesson = null;
  for (let i = currentPos + 1; i < flatForNav.length; i += 1) {
    if (flatForNav[i].status !== LESSON_STATUS.LOCKED) {
      nextLesson = flatForNav[i];
      break;
    }
  }

  const breadcrumbs = [
    COURSE_BREADCRUMBS,
    { label: course.title, link: `/student/course/${course.id}` },
    { label: resolved.title },
  ];

  const header = (
    <section className="card mt-6 flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
      <Link
        to={`/student/course/${course.id}`}
        className="flex items-center gap-2 text-sm-fluid font-medium text-brand-strong transition hover:underline"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Course overview
      </Link>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0">
            <ProgressRing progress={data.progress} size={48} stroke={5} />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-ink">
              {data.progress}%
            </span>
          </div>
          <div className="hidden text-sm-fluid text-ink-muted sm:block">
            <p className="font-semibold text-ink">
              {data.completedLessons}/{data.totalLessons} lessons
            </p>
            <p>completed</p>
          </div>
        </div>
        <button
          ref={drawerToggleRef}
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-expanded={drawerOpen}
          aria-controls={drawerId}
          className="btn-outline px-4 py-2 text-sm-fluid lg:hidden"
        >
          <ListTree size={16} aria-hidden="true" />
          Contents
        </button>
      </div>
    </section>
  );

  const syllabus = (
    <CourseSyllabus
      key={resolved.lessonId}
      sections={sections}
      courseId={course.id}
      defaultOpenSection={resolved.sectionIndex}
      currentLessonId={resolved.lessonId}
    />
  );

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumbs items={breadcrumbs} />

      {header}

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 space-y-6 lg:flex-1">
          {currentStatus === LESSON_STATUS.LOCKED ? (
            <section className="card px-4 py-16" aria-describedby="player-locked-hint">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Lock size={28} className="text-ink-muted" aria-hidden="true" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <LessonStatusIcon status={LESSON_STATUS.LOCKED} size={20} />
                  <span
                    className="badge bg-gray-100 text-sm font-medium text-ink-muted"
                    aria-label={`Locked — Complete ${preceding ? `"${preceding.title}"` : "the earlier lessons"} to unlock`}
                  >
                    Locked
                  </span>
                </div>
                <h2 className="mt-3 text-body-lg font-semibold text-ink">{resolved.title}</h2>
                <p id="player-locked-hint" className="mt-2 text-sm-fluid text-ink-muted" aria-live="polite">
                  Complete {preceding ? `"${preceding.title}"` : "the earlier lessons"} to unlock this
                  lesson.
                </p>
                <Link
                  to={`/student/course/${course.id}`}
                  className="btn-brand mt-6 px-5 py-2.5 text-sm-fluid"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Back to course overview
                </Link>
              </div>
            </section>
          ) : (
            <>
              <LessonPlayerMeta resolved={resolved} status={currentStatus} />
              <div role="region" aria-labelledby="player-lesson-title">
                <LessonPlayerBody
                  key={resolved.lessonId}
                  resolved={resolved}
                  media={media}
                  poster={course.image}
                  isCompleted={isCompleted}
                  onComplete={handleComplete}
                  onProgress={handleProgress}
                  onRevision={handleRevision}
                  courseId={course.id}
                  videoProgress={videoProgress}
                />
              </div>

              {isCompleted && nextLesson && (
                <section className="card flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success-soft text-success">
                      <CheckCircle2 size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">Lesson completed</p>
                      <p className="text-sm-fluid text-ink-muted">
                        Great work — you can continue to the next lesson.
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/student/course/${course.id}/play?lessonId=${nextLesson.lessonId}`}
                    className="btn-brand w-full px-5 py-2.5 text-sm-fluid sm:w-auto"
                  >
                    Next lesson
                    <ChevronRight size={16} aria-hidden="true" />
                  </Link>
                </section>
              )}

              <LessonTabs
                key={resolved.lessonId}
                courseId={course.id}
                lessonId={resolved.lessonId}
                lessonTitle={resolved.title}
                courseName={course.title}
                sectionTitle={resolved.sectionTitle}
                description={null}
              />
              <LessonNavPrevNext
                courseId={course.id}
                sections={sections}
                currentSectionIndex={resolved.sectionIndex}
                currentLessonIndex={resolved.lessonIndex}
              />
            </>
          )}
        </div>

        <aside className="hidden w-full shrink-0 lg:block lg:w-80 lg:flex-shrink-0 xl:w-[400px]">
          <div className="lg:sticky lg:top-[90px]">{syllabus}</div>
        </aside>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
          <button
            type="button"
            aria-label="Close course syllabus"
            tabIndex={-1}
            className="absolute inset-0"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            ref={drawerRef}
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-label={`${course.title} — course content`}
            className="scrollbar-brand absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-surface p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="section-title">Course content</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close course syllabus"
                className="btn-outline shrink-0 px-3 py-2"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            {syllabus}
          </div>
        </div>
      )}

      <LessonCompleteToast
        open={Boolean(completion)}
        nextTo={
          completion?.nextLessonId
            ? `/student/course/${course.id}/play?lessonId=${completion.nextLessonId}`
            : null
        }
      />
    </div>
  );
}
