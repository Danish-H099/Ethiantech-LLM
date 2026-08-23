import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock, Star, Users } from "lucide-react";
import { m as Motion, useReducedMotion } from "motion/react";
import { createCardHover } from "src/lib/animationVariants";
import { hideOnError } from "src/lib/assets";
import { formatCompactNumber } from "src/lib/format";

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
        <div className="relative h-44 w-full overflow-hidden bg-surface sm:h-48">
          <img
            src={course.image}
            alt={course.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={hideOnError}
          />
          {isBestseller && (
            <span className="badge absolute end-3 top-3 bg-brand text-white text-sm-fluid font-semibold tracking-wide shadow">
              Bestseller
            </span>
          )}
          {isNew && !isBestseller && (
            <span className="badge absolute end-3 top-3 bg-brand-secondary text-white text-sm-fluid font-semibold tracking-wide shadow">
              New
            </span>
          )}
        </div>

        <div className="min-w-0 space-y-2 p-4 text-left">
          <h3 className="line-clamp-2 text-sm-fluid font-semibold leading-snug text-ink">
            {course.title}
          </h3>
          <p className="text-sm-fluid text-ink-muted">{course.author}</p>
          {course.institution && (
            <p className="text-sm-fluid font-medium text-brand-secondary-strong">
              {course.institution.name}
            </p>
          )}
          <div className="flex items-center gap-1.5 text-sm-fluid">
            <span className="font-medium text-ink">{course.rating}</span>
            <Star size={14} className="fill-current text-orange-500" aria-hidden="true" />
            <span className="text-ink-muted">({course.reviews})</span>
          </div>
          <div className="card-meta-row">
            <Clock size={14} className="card-meta-icon" aria-hidden="true" />
            <span>{course.duration}</span>
            <Users size={14} className="card-meta-icon" aria-hidden="true" />
            <span>{formatCompactNumber(course.students)} enrolled</span>
          </div>
          <p
            className={`text-body-lg font-bold ${
              course.isFree ? "text-brand" : "text-ink"
            }`}
          >
            {course.isFree ? "Free" : course.price}
          </p>
        </div>
      </MotionLink>
  );
}
