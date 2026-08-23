import { Star } from "lucide-react";

export default function Stars({ rating, size = 14, className = "" }) {
  return (
    <div
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className={`flex items-center gap-0.5 text-orange-500 ${className}`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(Math.max(rating - i, 0), 1);
        return (
          <span
            key={i}
            aria-hidden="true"
            className="relative inline-block shrink-0"
            style={{ width: size, height: size }}
          >
            <Star size={size} className="absolute inset-0" />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star size={size} className="fill-current" />
            </span>
          </span>
        );
      })}
    </div>
  );
}
