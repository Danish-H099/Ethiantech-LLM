import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { m as Motion, useReducedMotion } from "motion/react";
import Header from "src/components/Header";
import Footer from "src/components/Footer";
import Breadcrumbs from "src/components/ui/Breadcrumbs";
import CourseCard from "src/components/CourseCard";
import EnrollCard from "src/components/EnrollCard";
import CourseSectionNav from "src/components/CourseSectionNav";
import { getCourseById, getRelatedCourses as exportGetRelatedCourses } from "src/services/courses";
import {
  BookOpen,
  Users,
  FolderKanban,
  ChevronDown,
  CheckCircle2,
  X,
  Building2,
} from "lucide-react";
import { AuthPopupGate } from "src/components/AuthPopups";
import PublicCourseStructure from "src/components/PublicCourseStructure";
import WishlistHeartButton from "src/components/student/WishlistHeartButton";
import Stars from "src/components/ui/Stars";
import { AVATAR_PLACEHOLDER, avatarFallback } from "src/lib/assets";
import { getCourseReviews } from "src/services/courses";
import { getLessonMedia } from "src/data/lessonMedia";
import { formatTotalDuration, parsePrice } from "src/lib/format";
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
  createStaggerItem,
  buttonPress,
} from "src/lib/animationVariants";
import { toast } from "sonner";

function SectionReveal({ className, id, children }) {
  return (
    <Motion.div
      id={id}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={className}
    >
      {children}
    </Motion.div>
  );
}

function CheckListSection({ title, items, icon, id, containerClassName }) {
  const Icon = icon;
  return (
    <section id={id} className={id ? "scroll-mt-28" : undefined}>
      <h2 className="detail-section-title">{title}</h2>
      <div
        className={`mt-4 rounded-xl bg-surface-soft p-5 sm:p-6${
          containerClassName ? ` ${containerClassName}` : ""
        }`}
      >
        <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-body text-ink-muted"
            >
              <Icon
                size={18}
                className="mt-0.5 shrink-0 text-brand"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CourseSkills({ skills = [], tools = [] }) {
  return (
    <section>
      <h2 className="detail-section-title">Skills you'll gain</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Link
            key={skill}
            to={`/courses?q=${encodeURIComponent(skill)}`}
            className="badge border border-border bg-white text-ink-muted transition hover:border-brand hover:text-brand"
          >
            {skill}
          </Link>
        ))}
      </div>

      {tools.length > 0 && (
        <>
          <h3 className="mt-6 detail-section-title font-semibold text-ink">
            Tools you'll use
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {tools.map((tool) => (
              <Link
                key={tool}
                to={`/courses?q=${encodeURIComponent(tool)}`}
                className="badge bg-tint-tutor text-brand-secondary-strong transition hover:brightness-95"
              >
                {tool}
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function InstructorSection({ instructors }) {
  return (
    <section id="instructor" className="scroll-mt-28">
      <h2 className="detail-section-title">
        {instructors.length > 1 ? "Your Instructors" : "Your Instructor"}
      </h2>
      <div className="card mt-4 divide-y divide-border p-5">
        {instructors.map((instructor) => (
          <div
            key={instructor.id}
            className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row"
          >
            <img
              src={instructor.photo}
              alt={instructor.name}
              loading="lazy"
              onError={avatarFallback}
              className="h-20 w-20 shrink-0 rounded-xl bg-surface object-cover"
            />
            <div>
              <h3 className="text-body-lg font-semibold text-ink">{instructor.name}</h3>
              <p className="text-sm-fluid font-medium text-brand-strong">
                {instructor.title}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm-fluid text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <Stars rating={instructor.rating} />
                  {instructor.rating} instructor rating
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} aria-hidden="true" />
                  {instructor.students.toLocaleString()} students
                </span>
              </div>
              <p className="mt-2 text-body text-ink-muted">
                {instructor.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewsSection({ course, reviews }) {
  return (
    <section id="reviews" className="scroll-mt-28">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="detail-section-title">Reviews</h2>
        <div className="flex items-center gap-3">
          <Stars rating={course.rating} size={20} />
          <span className="text-body-lg font-bold text-ink">{course.rating}</span>
          <span className="text-sm-fluid text-ink-muted">
            · {course.reviews.toLocaleString()} ratings
          </span>
        </div>
      </div>
      <div className="card mt-4 divide-y divide-border p-5">
        {reviews.map((review) => (
          <article key={review.id} className="py-5 first:pt-0 last:pb-0">
            <div className="flex items-start gap-3">
              <img
                src={review.avatar || AVATAR_PLACEHOLDER}
                alt=""
                loading="lazy"
                decoding="async"
                onError={avatarFallback}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 className="text-body font-semibold text-ink">
                    {review.author}
                  </h3>
                  <span className="text-sm-fluid text-ink-muted">{review.date}</span>
                </div>
                <p className="text-sm-fluid text-ink-muted">{review.role}</p>
                <div className="mt-1.5">
                  <Stars rating={review.rating} size={14} />
                </div>
                <p className="mt-2 text-body text-ink-muted">
                  {review.text}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CourseFaq({ faq }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="scroll-mt-28">
      <h2 className="detail-section-title">Frequently Asked Questions</h2>
      <div className="card mt-4 divide-y divide-border overflow-hidden">
        {faq.map((item, i) => {
          const open = openIndex === i;
          const triggerId = `faq-trigger-${i}`;
          const panelId = `faq-panel-${i}`;
          return (
            <div key={item.question}>
              <button
                type="button"
                id={triggerId}
                onClick={() => setOpenIndex(open ? -1 : i)}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-body font-semibold text-ink transition hover:bg-surface-soft"
              >
                <span>{item.question}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-ink-muted transition ${
                    open ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                hidden={!open}
                className="px-5 pb-5 text-body text-ink-muted"
              >
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RelatedCourses({ courses, staggerItem }) {
  return (
    <section>
      <h2 className="detail-section-title">Students also enrolled in</h2>
      <Motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-6"
      >
        {courses.map((course, i) => (
          <Motion.div key={course.id} variants={staggerItem} custom={i}>
            <CourseCard course={course} />
          </Motion.div>
        ))}
      </Motion.div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-body text-ink-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function CourseHero({ course, staggerItem, mobileCardRef, enrollProps, onLoginClick }) {
  const navigate = useNavigate();
  return (
    <Motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <Motion.div variants={staggerItem} custom={0}>
        {course.institution && (
          <div className="mb-3 flex items-center gap-2">
            {course.institution.logo ? (
              <img
                src={course.institution.logo}
                alt={course.institution.name}
                className="h-5 w-5 object-contain"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-tint-tutor text-sm-fluid font-bold text-brand-secondary-strong"
              >
                {course.institution.name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <span className="text-sm-fluid font-medium text-ink-muted">
              {course.institution.name}
            </span>
          </div>
        )}
      </Motion.div>

      <Motion.h1
        variants={staggerItem}
        custom={1}
        className="text-heading font-bold text-ink tracking-tight"
      >
        {course.title}
      </Motion.h1>

      <Motion.p
        variants={staggerItem}
        custom={2}
        className="mt-4 max-w-2xl text-subtitle text-ink-muted"
      >
        {course.promise}
      </Motion.p>

      <Motion.div
        variants={staggerItem}
        custom={3}
        className="mt-5 flex flex-wrap items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <Stars rating={course.rating} size={18} />
          <span className="text-sm-fluid font-semibold text-ink">
            {course.rating}
          </span>
        </div>
        <Link
          to="#reviews"
          className="link text-sm-fluid underline underline-offset-2"
        >
          ({course.reviews.toLocaleString()} ratings)
        </Link>
        <span className="flex items-center gap-1.5 text-sm-fluid text-ink-muted">
          <Users size={16} />
          {course.students.toLocaleString()} students
        </span>
        <WishlistHeartButton
          courseId={course.id}
          title={course.title}
          withLabel
          onLoginClick={onLoginClick}
          onSave={() => {
            requestAnimationFrame(() => {
              toast.success("Course saved to wishlist", {
                id: "wishlist",
                duration: 8000,
                action: {
                  label: "View Wishlist",
                  onClick: () => navigate("/student/wishlist"),
                },
              });
            });
          }}
          className="btn-outline px-3 py-1.5 text-sm-fluid"
        />
      </Motion.div>

      <Motion.div
        variants={staggerItem}
        custom={4}
        className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm-fluid text-ink-muted"
      >
        <span>{course.level}</span>
        <span>{course.language}</span>
        <span>Last updated {course.lastUpdated}</span>
      </Motion.div>

      {course.instructors.length > 0 && (
        <Motion.p
          variants={staggerItem}
          custom={5}
          className="mt-4 flex items-center gap-3 text-sm-fluid text-ink-muted"
        >
          <img
            src={course.instructors[0].photo}
            aria-hidden="true"
            alt=""
            onError={avatarFallback}
            className="h-9 w-9 rounded-full bg-surface object-cover"
          />
          Course by{" "}
          <Link to="#instructor" className="link">
            {course.instructors[0].name}
          </Link>
          {course.instructors.length > 1 && (
            <span>+{course.instructors.length - 1} more</span>
          )}
        </Motion.p>
      )}

      <Motion.div
        ref={mobileCardRef}
        variants={staggerItem}
        custom={6}
        className="card mt-10 overflow-hidden lg:hidden"
      >
        <EnrollCard {...enrollProps} />
      </Motion.div>
    </Motion.div>
  );
}

function CourseContent({ course, reviews, relatedCourses, staggerItem, totalDuration, onPreviewClick }) {
  return (
    <>
      <div className="mt-10 space-y-10">
        <SectionReveal>
          <CheckListSection
            id="outcomes"
            title="What you'll learn"
            items={course.learningOutcomes}
            icon={CheckCircle2}
          />
        </SectionReveal>

        <SectionReveal>
          <CourseSkills skills={course.skills} tools={course.tools} />
        </SectionReveal>
      </div>

        <SectionReveal id="curriculum" className="mt-16 scroll-mt-28">
          <PublicCourseStructure
            sections={course.curriculum}
            totalDuration={totalDuration}
            title="Course content"
            courseId={course.id}
            onPreviewClick={onPreviewClick}
          />
        </SectionReveal>

      <hr className="divider my-10" />

      <SectionReveal>
        <h2 className="detail-section-title">Course Description</h2>
        <div className="mt-4 max-w-3xl space-y-4 text-body text-ink-muted">
          {course.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </SectionReveal>

      <div className="mt-10 space-y-10">
        {course.projects.length > 0 && (
          <SectionReveal>
            <CheckListSection
              title="Projects you'll build"
              items={course.projects}
              icon={FolderKanban}
              containerClassName="max-w-3xl"
            />
          </SectionReveal>
        )}

        {course.requirements.length > 0 && (
          <SectionReveal>
            <section>
              <h2 className="detail-section-title">Requirements</h2>
              <BulletList items={course.requirements} />
            </section>
          </SectionReveal>
        )}

        {course.targetAudience.length > 0 && (
          <SectionReveal>
            <section>
              <h2 className="detail-section-title">Who this course is for</h2>
              <BulletList items={course.targetAudience} />
            </section>
          </SectionReveal>
        )}

        <SectionReveal>
          <InstructorSection instructors={course.instructors} />
        </SectionReveal>

        <SectionReveal>
          <ReviewsSection course={course} reviews={reviews} />
        </SectionReveal>

        <SectionReveal>
          <CourseFaq faq={course.faq} />
        </SectionReveal>
      </div>

      {relatedCourses.length > 0 && (
        <SectionReveal className="mt-10">
          <RelatedCourses courses={relatedCourses} staggerItem={staggerItem} />
        </SectionReveal>
      )}
    </>
  );
}

function CourseSidebar({ enrollProps }) {
  return (
    <aside className="hidden w-full shrink-0 lg:block lg:w-[380px]">
      <div className="sticky top-28 space-y-5">
        <SectionReveal className="card scrollbar-brand max-h-[calc(100vh-7rem)] overflow-y-auto">
          <EnrollCard {...enrollProps} />
        </SectionReveal>
      </div>
    </aside>
  );
}

function MobilePurchaseBar({ course }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="min-w-0">
          {course.isFree ? (
            <p className="text-body-lg font-bold text-brand">Free</p>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-body-lg font-bold text-ink">{course.price}</span>
              <span className="text-sm-fluid text-ink-muted line-through">
                {course.originalPrice}
              </span>
            </div>
          )}
          <span className="flex min-w-0 items-center gap-1.5 text-sm-fluid text-ink-muted">
            <Stars rating={course.rating} size={12} />
            <span className="truncate">
              {course.rating} · {course.students.toLocaleString()} students
            </span>
          </span>
        </div>
        <Motion.button
          type="button"
          variants={buttonPress}
          whileHover="hover"
          whileTap="tap"
          className="btn-brand shrink-0 rounded-lg px-6 py-3 text-sm-fluid"
        >
          Enroll Now
        </Motion.button>
      </div>
    </div>
  );
}

function VideoPreviewModal({ preview, onClose }) {
  const { lesson, meta } = preview || {};
  const { courseId, sectionIndex, lessonIndex } = meta || {};
  const media =
    lesson && courseId != null
      ? getLessonMedia(`${courseId}-s${sectionIndex}-l${lessonIndex}`)
      : null;

  return (
    <Dialog.Root
      open={!!preview}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(94vw,960px,calc((100dvh-4rem)*16/9))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-2xl">
          <Dialog.Title className="sr-only">
            {lesson?.title ?? "Lesson preview"}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Free preview lesson video.
          </Dialog.Description>

          <div className="relative bg-black">
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-1.5 text-white/90 transition hover:bg-black/80"
                aria-label="Close preview"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
            {media ? (
              // Captions are provided when the media descriptor includes them.
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                controls
                autoPlay
                className="aspect-video w-full bg-black"
                src={media.videoSrc}
              >
                {media.captionSrc && (
                  <track
                    kind="captions"
                    src={media.captionSrc}
                    srcLang="en"
                    label="English captions"
                  />
                )}
                Your browser does not support video.
              </video>
            ) : (
              <div className="flex aspect-video items-center justify-center bg-black text-sm-fluid text-white/70">
                Preview video unavailable.
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [popupState, setPopupState] = useState("none");
  const [preview, setPreview] = useState(null);
  const mobileCardRef = useRef(null);
  const [showPurchaseBar, setShowPurchaseBar] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  const course = getCourseById(id);

  const relatedCourses = course ? exportGetRelatedCourses(course) : [];

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    if (mq.matches) return undefined;
    const el = mobileCardRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        setShowPurchaseBar(!entries[0].isIntersecting);
      },
      { rootMargin: "0px 0px -72px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const authPopups = (
    <AuthPopupGate state={popupState} onStateChange={setPopupState} />
  );

  if (!course) {
    return (
      <div className="relative flex min-h-screen flex-col bg-surface text-ink">
        <Header
          onLoginClick={() => setPopupState("login")}
          onSignupClick={() => setPopupState("signup")}
        />
        <main id="main" className="flex-1">
          <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center">
            <BookOpen size={64} className="text-ink-muted/40" />
            <h2 className="mt-6 page-title">Course Not Found</h2>
            <p className="mt-2 text-ink-muted">
              The course you're looking for doesn't exist.
            </p>
            <Link
              to="/courses"
              className="mt-6 btn-brand rounded-xl px-6 py-3 text-sm-fluid"
            >
              Browse Courses
            </Link>
          </section>
        </main>
        <Footer />
        {authPopups}
      </div>
    );
  }

  const totalLectures = course.curriculum
    ?.reduce((s, sec) => s + sec.lectures, 0) || 0;
  const totalDuration = formatTotalDuration(course.hours);
  const reviews = getCourseReviews(course.id);
  const priceNum = course.isFree ? 0 : parsePrice(course.price);
  const originalNum = course.isFree ? 0 : parsePrice(course.originalPrice);
  const discountPercent =
    !course.isFree && originalNum > priceNum
      ? Math.round((1 - priceNum / originalNum) * 100)
      : null;

  const enrollProps = { course, totalDuration, totalLectures, discountPercent };

  return (
    <div className="relative flex min-h-screen flex-col bg-surface text-ink">
      <Header
        onLoginClick={() => setPopupState("login")}
        onSignupClick={() => setPopupState("signup")}
      />

      <main id="main" className="flex-1">
        <Breadcrumbs 
          items={[
            { label: "Courses", link: "/courses" },
            { label: course.title }
          ]} 
        />

        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <CourseSectionNav />
          <div className="lg:flex lg:gap-10">
            <div className="min-w-0 flex-1">
              <CourseHero
                course={course}
                staggerItem={staggerItem}
                mobileCardRef={mobileCardRef}
                enrollProps={enrollProps}
                onLoginClick={() => setPopupState("login")}
              />
              <CourseContent
                course={course}
                reviews={reviews}
                relatedCourses={relatedCourses}
                staggerItem={staggerItem}
                totalDuration={totalDuration}
                onPreviewClick={(lesson, meta) => setPreview({ lesson, meta })}
              />
            </div>
            <CourseSidebar
              enrollProps={enrollProps}
            />
          </div>
        </section>
      </main>

      {showPurchaseBar && popupState === "none" && (
        <MobilePurchaseBar course={course} />
      )}

      <Footer />
      {authPopups}
      <VideoPreviewModal
        preview={preview}
        onClose={() => setPreview(null)}
      />
    </div>
  );
}
