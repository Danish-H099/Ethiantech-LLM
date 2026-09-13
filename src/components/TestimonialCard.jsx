import { useMemo } from "react";
import { m as Motion, useReducedMotion } from "motion/react";
import { createCardHover } from "src/lib/animationVariants";
import { avatarFallback } from "src/lib/assets";
import Stars from "src/components/ui/Stars";

export default function TestimonialCard({ item, isExpanded, onToggle, quoteId }) {
  const shouldReduceMotion = useReducedMotion();
  const cardHover = useMemo(() => createCardHover(!!shouldReduceMotion), [shouldReduceMotion]);

  return (
    <Motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className="card"
    >
      <div className="flex items-center gap-4 p-5">
        <img
          src={item.image}
          loading="lazy"
          className="h-14 w-14 rounded-full object-cover"
          alt={item.name}
          onError={avatarFallback}
        />
        <div>
          <h3 className="text-body font-semibold text-ink">{item.name}</h3>
          <p className="text-sm-fluid text-ink-muted">{item.role}</p>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="mb-3 flex items-center gap-1">
          <Stars rating={item.rating} size={16} />
        </div>

        <p
          id={quoteId}
          className={`text-sm-fluid text-ink-muted ${
            isExpanded ? "" : "line-clamp-4"
          }`}
        >
          {item.quote}
        </p>

        <button
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls={quoteId}
          className="mt-6 text-sm-fluid font-medium text-brand-strong hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      </div>
    </Motion.div>
  );
}
