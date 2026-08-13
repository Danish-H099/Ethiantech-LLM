import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock, Users } from "lucide-react";
import { m as Motion, useReducedMotion } from "motion/react";
import { createCardHover } from "src/lib/animationVariants";
import { formatCompactNumber } from "src/lib/format";
import Stars from "src/components/Stars";

const MotionLink = Motion.create(Link);

export default function CourseCard({ course }) {
  const shouldReduceMotion = useReducedMotion();
  const variants = useMemo(
    () => createCardHover(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  const REVIEWS_THRESHOLD_BESTSELLER = 200;
  const NEW_COURSE_ID_CUTOFF = 10;

  const isBestseller = course.reviews > REVIEWS_THRESHOLD_BESTSELLER;
  const isNew = course.id > NEW_COURSE_ID_CUTOFF;

  return (
    <MotionLink
      to={`/course/${course.id}`}
      variants={variants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className="group block card card-hover h-full overflow-hidden"
    >
        <div className="relative h-44 w-full overflow-hidden sm:h-48">
          <img
            src={course.image}
            alt={course.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <span className="badge absolute start-3 top-3 bg-white/90 text-10 font-semibold tracking-wide text-ink-muted shadow">
            {course.tag}
          </span>
          {isBestseller && (
            <span className="badge absolute end-3 top-3 bg-brand text-white text-10 font-semibold tracking-wide shadow">
              Bestseller
            </span>
          )}
          {isNew && !isBestseller && (
            <span className="badge absolute end-3 top-3 bg-brand-secondary text-white text-10 font-semibold tracking-wide shadow">
              New
            </span>
          )}
        </div>

        <div className="min-w-0 space-y-2 p-4 text-left">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-ink">
            {course.title}
          </h3>
          <p className="text-sm-fluid text-ink-muted">{course.author}</p>
          {course.institution && (
            <p className="text-xs font-medium text-brand-secondary-strong">
              {course.institution.name}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm-fluid">
            <span className="font-medium text-ink">{course.rating}</span>
            <Stars rating={course.rating} />
            <span className="text-ink-muted">({course.reviews})</span>
          </div>
          <div className="card-meta-row flex items-center gap-3 text-sm-fluid text-ink-muted">
            <Clock size={14} className="card-meta-icon" aria-hidden="true" />
            <span>{course.duration}</span>
            <span className="hidden sm:inline">•</span>
            <Users size={14} className="card-meta-icon" aria-hidden="true" />
            <span>{formatCompactNumber(course.students)} students</span>
          </div>
          <p className="text-lg font-bold text-ink">
            {course.isFree ? "Free" : course.price}
          </p>
        </div>
      </MotionLink>
  );
}