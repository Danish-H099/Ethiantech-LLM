import { Link } from "react-router-dom";
import { m as Motion } from "motion/react";
import { Clock, BookOpen, Check, PlayCircle } from "lucide-react";
import { buttonPress } from "src/lib/animationVariants";

const MotionLink = Motion.create(Link);

export default function EnrollCard({ course, totalDuration, totalLectures, discountPercent }) {
  return (
    <>
      <div className="relative h-48 w-full overflow-hidden sm:h-52">
        <img
          src={course.image}
          alt={course.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-5">
        <div className="absolute top-3 left-3 flex items-center gap-1">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${course.level === "Beginner" ? "bg-primary-soft text-primary" : course.level === "Intermediate" ? "bg-secondary-soft text-secondary" : "bg-success-soft text-success"}`}
          >
            {course.level}
          </span>
        </div>
        {course.isFree ? (
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-brand">Free</span>
            <span className="text-sm-fluid text-ink-muted/70">
              Enroll now — no payment required
            </span>
          </div>
        ) : (
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-ink">
              {course.price}
            </span>
            <span className="text-sm-fluid text-ink-muted/70 line-through">
              {course.originalPrice}
            </span>
            {discountPercent && (
              <span className="rounded bg-success-soft px-1.5 py-0.5 text-xs font-semibold text-success">
                {discountPercent}% off
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center gap-3 text-xs text-ink-muted">
          <span className="flex items-center gap-1">
            <Clock size={14} /> {totalDuration}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={14} /> {totalLectures} lessons
          </span>
          <span className="flex items-center gap-1">
            <PlayCircle size={14} /> {course.students.toLocaleString()} students
          </span>
        </div>

        <Motion.button
          type="button"
          variants={buttonPress}
          whileHover="hover"
          whileTap="tap"
          className="mt-4 btn-brand w-full rounded-lg px-6 py-3.5 text-sm-fluid"
        >
          Enroll Now
        </Motion.button>
        <div className="mt-3 space-y-2 text-sm-fluid text-ink-muted">
          <p className="flex items-center gap-2.5">
            <Check size={16} className="shrink-0 text-brand" aria-hidden="true" />
            <span>{course.certificate.description}</span>
          </p>
        </div>

        <div className="mt-6">
          <h4 className="mb-3 text-sm-fluid font-semibold text-ink text-left">
            What's in the course?
          </h4>
          <ul className="space-y-2.5">
            {course.highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm-fluid text-ink-muted"
              >
                <Check
                  size={16}
                  className="shrink-0 text-brand"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
