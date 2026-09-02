import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { m as Motion, useReducedMotion } from "motion/react";
import { CheckCircle2, Heart, ShoppingCart } from "lucide-react";

import {
  getWishlistedCourses,
  enrollFromWishlist,
  getEnrolledCourses,
} from "src/services/studentRepository";
import {
  fadeIn,
  viewportOnce,
  createStaggerItem,
  createCardHover,
} from "src/lib/animationVariants";
import StudentEmptyState from "src/components/student/StudentEmptyState";
import WishlistHeartButton from "src/components/student/WishlistHeartButton";
import Stars from "src/components/ui/Stars";
import { hideOnError } from "src/lib/assets";

// ---------------------------------------------------------------- sections

function EnrollFeedbackBanner({ feedback }) {
  return (
    <div
      role="status"
      className="mb-6 flex items-center gap-3 rounded-lg border border-success/30 bg-success-soft px-4 py-3 text-sm-fluid font-medium text-success"
    >
      <CheckCircle2 size={18} className="shrink-0" />
      <span>
        Enrolled successfully in{" "}
        <span className="font-semibold">{feedback.title}</span> — start learning
        from My Courses.
      </span>
      <Link
        to={`/student/course/${feedback.courseId}`}
        className="ml-auto shrink-0 font-semibold underline underline-offset-2"
      >
        Start Course →
      </Link>
    </div>
  );
}

function PageHeading() {
  return (
    <div className="mb-8">
      <h1 className="page-title">Wishlist</h1>
      <p className="mt-1 text-sm-fluid text-ink-muted">Courses saved for later</p>
    </div>
  );
}

function EmptyWishlistPanel() {
  return (
    <div className="card px-4 py-16">
      <StudentEmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Browse the catalog and save courses you're interested in — they'll show up here."
        action={{ label: "Browse Catalog", to: "/courses" }}
      />
    </div>
  );
}

function WishlistGrid({
  courses,
  enrolledIds,
  staggerItem,
  cardHover,
  onEnroll,
  onWishlistChange,
}) {
  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
    >
      {courses.map((course, i) => (
        <WishlistCard
          key={course.id}
          course={course}
          index={i}
          alreadyEnrolled={enrolledIds.has(course.id)}
          staggerItem={staggerItem}
          cardHover={cardHover}
          onEnroll={onEnroll}
          onWishlistChange={onWishlistChange}
        />
      ))}
    </Motion.div>
  );
}

// ------------------------------------------------------------ course card

function CardMedia({ course, onWishlistChange }) {
  return (
    <div className="relative h-[160px] overflow-hidden bg-surface">
      <img
        src={course.image}
        alt={course.title}
        loading="lazy"
        className="h-full w-full object-cover"
        onError={hideOnError}
      />
      <div className="absolute right-3 top-3">
        <WishlistHeartButton
          courseId={course.id}
          title={course.title}
          onToggle={onWishlistChange}
          size={18}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand shadow transition hover:bg-white"
        />
      </div>
    </div>
  );
}

function CardBody({ course, alreadyEnrolled, onEnroll }) {
  return (
    <div className="p-5">
      <h3 className="mb-1 line-clamp-2 text-sm-fluid font-semibold text-ink">
        {course.title}
      </h3>
      <p className="mb-3 text-sm-fluid text-ink-muted">{course.instructor}</p>

      <div className="mb-4 flex items-center gap-3">
        <span className="flex items-center gap-2 text-sm-fluid">
          <span className="font-medium text-ink">{course.rating}</span>
          <Stars rating={course.rating} />
        </span>
        <span className="text-body-lg font-bold text-brand">{course.price}</span>
      </div>

      {alreadyEnrolled ? (
        <Link
          to={`/student/course/${course.id}`}
          className="btn-outline flex w-full items-center justify-center px-5 py-2.5 text-sm-fluid"
        >
          Already Enrolled →
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => onEnroll(course)}
          className="btn-brand flex w-full items-center justify-center gap-2 px-5 py-2.5 text-sm-fluid"
        >
          <ShoppingCart size={16} />
          Enroll Now
        </button>
      )}
    </div>
  );
}

function WishlistCard({
  course,
  index,
  alreadyEnrolled,
  staggerItem,
  cardHover,
  onEnroll,
  onWishlistChange,
}) {
  return (
    <Motion.div variants={staggerItem} custom={index}>
      <Motion.div
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        className="h-full"
      >
        <div className="card h-full overflow-hidden">
          <CardMedia course={course} onWishlistChange={onWishlistChange} />
          <CardBody
            course={course}
            alreadyEnrolled={alreadyEnrolled}
            onEnroll={onEnroll}
          />
        </div>
      </Motion.div>
    </Motion.div>
  );
}

// ------------------------------------------------------------------- page

export default function StudentWishlistPage() {
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((v) => v + 1);
  const [enrollFeedback, setEnrollFeedback] = useState(null); // { title, courseId }

  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );
  const cardHover = useMemo(
    () => createCardHover(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  const courses = useMemo(() => {
    // `revision` forces a fresh read from the repository after each mutation.
    void revision;
    return getWishlistedCourses();
  }, [revision]);
  const enrolledIds = useMemo(() => {
    void revision;
    return new Set(getEnrolledCourses().map((c) => c.id));
  }, [revision]);

  useEffect(() => {
    if (!enrollFeedback) return undefined;
    const t = setTimeout(() => setEnrollFeedback(null), 5000);
    return () => clearTimeout(t);
  }, [enrollFeedback]);

  function handleEnroll(course) {
    const result = enrollFromWishlist(course.id);
    if (result.success) {
      setEnrollFeedback({ title: course.title, courseId: course.id });
      refresh();
    } else if (result.reason === "already-enrolled") {
      refresh();
    }
  }

  return (
    <div>
      {enrollFeedback && <EnrollFeedbackBanner feedback={enrollFeedback} />}

      <PageHeading />

      {courses.length === 0 ? (
        <EmptyWishlistPanel />
      ) : (
        <WishlistGrid
          courses={courses}
          enrolledIds={enrolledIds}
          staggerItem={staggerItem}
          cardHover={cardHover}
          onEnroll={handleEnroll}
          onWishlistChange={refresh}
        />
      )}
    </div>
  );
}
