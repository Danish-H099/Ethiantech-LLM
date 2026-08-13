import { useMemo } from "react";
import { m as Motion, useReducedMotion } from "motion/react";
import { createCardHover } from "src/lib/animationVariants";
import Stars from "src/components/Stars";

export default function TestimonialCard({ item, isExpanded, onToggle, quoteId }) {
  const shouldReduceMotion = useReducedMotion();
  const cardHover = useMemo(() => createCardHover(!!shouldReduceMotion), [shouldReduceMotion]);

  return (
    <Motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className="card card-hover"
    >
      <div className="flex items-center gap-4 border-b border-border p-5">
        <img
          src={item.image}
          loading="lazy"
          className="h-12 w-12 rounded-full object-cover"
          alt={item.name}
        />
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-ink-muted">{item.role}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3">
          <Stars rating={item.rating} />
        </div>

        <p
          id={quoteId}
          className={`text-base leading-7 text-ink-muted ${
            isExpanded ? "" : "line-clamp-4"
          }`}
        >
          {item.quote}
        </p>

        <button
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls={quoteId}
          className="mt-6 text-sm font-medium text-brand-strong hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      </div>
    </Motion.div>
  );
}
