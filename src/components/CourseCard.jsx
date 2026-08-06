import { useMemo } from "react";
import { Link } from "react-router-dom";
import { m as Motion, useReducedMotion } from "motion/react";
import StarRating from "./StarRating";
import { createCardHover } from "../lib/animationVariants";

export default function CourseCard({ course }) {
  const shouldReduceMotion = useReducedMotion();
  const variants = useMemo(
    () => createCardHover(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  return (
    <Motion.div
      variants={variants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className="h-full"
    >
      <Link
        to={`/course/${course.id}`}
        className="group block card card-hover h-full overflow-hidden"
      >
      <div className="relative h-44 w-full overflow-hidden sm:h-48">
        <img
          src={course.image}
          alt={course.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="badge absolute left-3 top-3 bg-white/90 text-10 font-semibold tracking-wide text-ink-muted shadow">
          {course.tag}
        </span>
      </div>

      <div className="space-y-2 p-4 text-left">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-ink">
          {course.title}
        </h3>
        <p className="text-sm text-ink-muted">{course.author}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-ink">{course.rating}</span>
          <StarRating rating={course.rating} />
          <span className="text-ink-muted/70">({course.reviews})</span>
        </div>
        <p className="text-lg font-bold text-ink">{course.price}</p>
      </div>
      </Link>
    </Motion.div>
  );
}
