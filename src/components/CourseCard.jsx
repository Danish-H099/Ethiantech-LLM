import { Link } from "react-router-dom";
import StarRating from "./StarRating";

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/course/${course.id}`}
      className="group block card overflow-hidden transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative h-44 w-full overflow-hidden sm:h-48">
        <img
          src={course.image}
          alt={course.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-10 font-semibold tracking-wide text-gray-700 shadow">
          {course.tag}
        </span>
      </div>

      <div className="space-y-2 p-4 text-left">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500">{course.author}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-800">{course.rating}</span>
          <StarRating rating={course.rating} />
          <span className="text-gray-400">({course.reviews})</span>
        </div>
        <p className="text-lg font-bold text-gray-900">{course.price}</p>
      </div>
    </Link>
  );
}
