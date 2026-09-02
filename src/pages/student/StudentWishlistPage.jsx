import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, m as Motion, useReducedMotion } from "motion/react";
import { Heart, Trash2 } from "lucide-react";

import {
  getWishlistedCourses,
  getEnrolledCourses,
  toggleWishlist,
  enrollFromWishlist,
} from "src/services/studentRepository";
import { getWishlistRecommendations } from "src/services/courses";
import {
  fadeIn,
  viewportOnce,
  createStaggerItem,
  durations,
  easeDepart,
} from "src/lib/animationVariants";
import StudentEmptyState from "src/components/student/StudentEmptyState";
import CourseCard from "src/components/CourseCard";
import ConfirmDialog from "src/components/ui/ConfirmDialog";
import { toast } from "sonner";

// ---------------------------------------------------------------- sections

function PageHeading({ count }) {
  const copy =
    count === 0
      ? "Courses you save will appear here"
      : `${count} course${count === 1 ? "" : "s"} saved for later`;
  return (
    <div className="mb-8">
      <h1 className="page-title">Wishlist</h1>
      <p className="mt-1 text-sm-fluid text-ink-muted">{copy}</p>
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

function RecommendedCourses({ wishlistedCourses, enrolledIds, staggerItem }) {
  const excludedIds = useMemo(() => {
    const ids = new Set([...enrolledIds].map(Number));
    wishlistedCourses.forEach((course) => ids.add(course.id));
    return [...ids];
  }, [enrolledIds, wishlistedCourses]);

  const recommendations = useMemo(
    () => getWishlistRecommendations(wishlistedCourses, excludedIds, 4),
    [wishlistedCourses, excludedIds]
  );

  const personalized = wishlistedCourses.length > 0;

  return (
    <section className="mt-12" aria-label="Recommended courses">
      <div className="mb-6">
        <h2 className="section-title">
          {personalized ? "More courses like your wishlist" : "Popular courses"}
        </h2>
        <p className="mt-1 text-sm-fluid text-ink-muted">
          {personalized
            ? "Based on the topics and skills in courses you've saved"
            : "Courses students are loving right now"}
        </p>
      </div>
      <Motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      >
        {recommendations.map((course, i) => (
          <Motion.div key={course.id} variants={staggerItem} custom={i} className="h-full">
            <CourseCard course={course} />
          </Motion.div>
        ))}
      </Motion.div>
    </section>
  );
}

function WishlistGrid({ courses, staggerItem, onEnroll, onRemoveRequest }) {
  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {courses.map((course, i) => (
          <Motion.div
            key={course.id}
            layout
            variants={staggerItem}
            initial="hidden"
            animate="visible"
            exit={{
              opacity: 0,
              scale: 0.96,
              transition: { duration: durations.slow, ease: easeDepart },
            }}
            custom={i}
            className="h-full"
          >
            <CourseCard
              course={course}
              onEnroll={(c) => onEnroll(c.id)}
              onRemove={(c) => onRemoveRequest(c.id)}
            />
          </Motion.div>
        ))}
      </AnimatePresence>
    </Motion.div>
  );
}

// ------------------------------------------------------------------- page

export default function StudentWishlistPage() {
  const [, setRevision] = useState(0);
  const refresh = () => setRevision((v) => v + 1);
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();

  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  const courses = getWishlistedCourses();
  const enrolledIds = new Set(getEnrolledCourses().map((c) => c.id));

  function handleConfirmRemove() {
    if (confirmId != null) toggleWishlist(confirmId);
    toast("Removed from wishlist");
    setConfirmId(null);
    refresh();
  }

  function handleEnroll(courseId) {
    const result = enrollFromWishlist(courseId);
    if (result.success) refresh();
    navigate(`/student/course/${courseId}`);
  }

  return (
    <div>
      <PageHeading count={courses.length} />

      {courses.length === 0 ? (
        <EmptyWishlistPanel />
      ) : (
        <WishlistGrid
          courses={courses}
          staggerItem={staggerItem}
          onEnroll={handleEnroll}
          onRemoveRequest={(id) => setConfirmId(id)}
        />
      )}
      <RecommendedCourses
        wishlistedCourses={courses}
        enrolledIds={enrolledIds}
        staggerItem={staggerItem}
      />

      <ConfirmDialog
        open={confirmId !== null}
        onCancel={() => setConfirmId(null)}
        onConfirm={handleConfirmRemove}
        variant="danger"
        icon={Trash2}
        title="Remove from wishlist?"
        description="This course will be removed from your wishlist."
        confirmLabel="Remove"
        cancelLabel="Keep"
      />
    </div>
  );
}