/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { AnimatePresence, m as Motion, useReducedMotion } from "motion/react";
import {
  BookOpen,
  Star,
  Clock,
  Layers,
  School,
  GraduationCap,
  Tag,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { easeArrive, easeDepart, durations, slideUp } from "src/lib/animationVariants";

const WEEKS_PER_UNIT = {
  hour: 1 / 40,
  week: 1,
  month: 4.33,
  year: 52,
};

/** Normalize a course's `duration` ("8 weeks", "6 months", "3 years") into weeks. */
export const durationToWeeks = (duration) => {
  const match = /(\d+(?:\.\d+)?)\s*(hours?|weeks?|months?|years?)/i.exec(
    String(duration)
  );
  if (!match) return 0;
  const value = Number.parseFloat(match[1]);
  const unit = match[2].toLowerCase().replace(/s$/, "");
  return value * (WEEKS_PER_UNIT[unit] ?? 1);
};

/** Duration buckets as ascending week-ceilings; the first match wins. */
const WEEK_BOUNDS = [
  { id: "1-4-weeks", label: "1\u20134 Weeks", max: 4 },
  { id: "1-3-months", label: "1\u20133 Months", max: 13 },
  { id: "3-6-months", label: "3\u20136 Months", max: 26 },
  { id: "6-12-months", label: "6\u201312 Months", max: 52 },
  { id: "1-2-years", label: "1\u20132 Years", max: 104 },
  { id: "2-4-years", label: "2\u20134 Years", max: 208 },
  { id: "4-plus-years", label: "4+ Years", max: Infinity },
];

export const DURATION_BUCKETS = [
  { id: "lt-2-hours", label: "Less Than 2 Hours" },
  ...WEEK_BOUNDS,
];

export const RATING_OPTIONS = [
  { value: 4.5, label: "4.5 & up" },
  { value: 4, label: "4.0 & up" },
  { value: 3.5, label: "3.5 & up" },
];

export const PRICE_OPTIONS = [
  { id: "free", label: "Free" },
  { id: "paid", label: "Paid" },
];

/** Canonical course types, in display order (subset present in the catalog). */
export const COURSE_TYPES = [
  "Professional Course",
  "Bootcamp",
  "University Course",
];

export const makeEmptyFilters = () => ({
  topics: [],
  subcategories: [],
  courseType: "",
  level: "",
  rating: 0,
  durations: [],
  prices: [],
});

export const durationIdFor = (course) => {
  if ((course.hours ?? 0) < 2) return "lt-2-hours";
  const weeks = durationToWeeks(course.duration);
  if (weeks <= 0) return null;
  return WEEK_BOUNDS.find((bucket) => weeks <= bucket.max)?.id ?? null;
};

export const filterSignature = (filters, search) =>
  [
    search,
    filters.topics.join(","),
    filters.subcategories.join(","),
    filters.courseType,
    filters.level,
    filters.rating,
    filters.durations.join(","),
    filters.prices.join(","),
  ].join("|");

export const applyCourseFilters = (courseList, filters, search) => {
  let result = [...courseList];
  const query = search.trim().toLowerCase();

  if (query) {
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.author.toLowerCase().includes(query)
    );
  }
  if (filters.topics.length) {
    result = result.filter((c) =>
      c.topics.some((topic) => filters.topics.includes(topic))
    );
  }
  if (filters.subcategories.length) {
    result = result.filter((c) =>
      c.subcategories.some((sub) => filters.subcategories.includes(sub))
    );
  }
  if (filters.courseType) {
    result = result.filter((c) => c.courseType === filters.courseType);
  }
  if (filters.level) {
    result = result.filter((c) => c.level === filters.level);
  }
  if (filters.rating) {
    result = result.filter((c) => c.rating >= filters.rating);
  }
  if (filters.durations.length) {
    result = result.filter((c) =>
      filters.durations.includes(durationIdFor(c))
    );
  }
  if (filters.prices.length) {
    result = result.filter((c) =>
      filters.prices.includes(c.isFree ? "free" : "paid")
    );
  }
  return result;
};

function FilterGroup({ id, title, icon, children }) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const fullId = `filters-${id}`;

  return (
    <div className="border-b border-border py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${fullId}-options`}
        className="-mx-2 flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1 text-left transition hover:bg-surface-soft focus-visible:bg-surface-soft"
      >
        <span className="flex items-center gap-2 text-sm-fluid font-semibold text-ink">
          {icon}
          {title}
        </span>
        <Motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : durations.modal,
            ease: easeArrive,
          }}
          className="shrink-0 text-ink-muted"
        >
          <ChevronDown size={16} aria-hidden="true" />
        </Motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <Motion.div
            key={`${fullId}-options`}
            id={`${fullId}-options`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -6,
              transition: {
                duration: shouldReduceMotion ? 0 : durations.slow,
                ease: easeDepart,
              },
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : durations.modal,
              ease: easeArrive,
            }}
            className="mt-2 space-y-1"
          >
            {children}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterOptionRow({ type, name, checked, onChange, label, count }) {
  const isRadio = type === "radio";
  const controlClass = isRadio
    ? "peer absolute inset-0 cursor-pointer appearance-none rounded-full border border-toggle bg-white transition duration-hover hover:border-brand focus-visible:border-brand checked:border-brand"
    : "peer absolute inset-0 cursor-pointer appearance-none rounded border border-toggle bg-white transition duration-hover hover:border-brand focus-visible:border-brand checked:border-brand checked:bg-brand";
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1 text-sm-fluid text-ink-muted transition hover:text-ink focus-within:text-ink">
      <span className="flex min-w-0 items-center gap-2">
        <span className="relative flex h-4.5 w-4.5 shrink-0 items-center justify-center">
          <input type={type} name={`filters-${name}`} checked={checked} onChange={onChange} className={controlClass} />
          {isRadio ? (
            <span className="pointer-events-none relative z-10 h-2 w-2 rounded-full bg-brand opacity-0 transition-opacity duration-hover peer-checked:opacity-100" />
          ) : (
            <Check size={12} strokeWidth={3} className="pointer-events-none relative z-10 text-white opacity-0 transition-opacity duration-hover peer-checked:opacity-100" />
          )}
        </span>
        <span className="min-w-0">{label}</span>
      </span>
      {typeof count === "number" && (
        <span className={checked ? "shrink-0 font-semibold text-brand" : "shrink-0 text-ink-muted"}>{count}</span>
      )}
    </label>
  );
}

export default function FilterPanel({
  draft,
  onChange,
  topics,
  subcategories,
  levels,
  counts,
  onApply,
  onClearAll,
  hasActiveFilters,
  isDraftDirty,
  applyLabel,
  onClose,
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between py-1">
        <h2 className="text-sm-fluid font-semibold text-ink">Filters</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="rounded p-1 text-ink-muted/70 transition hover:text-ink-muted"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <FilterGroup
        id="topic"
        title="Topic"
        icon={<BookOpen size={16} aria-hidden="true" />}
      >
        <FilterOptionRow
          type="checkbox"
          name="topic"
          checked={draft.topics.length === 0}
          onChange={() => onChange({ topics: [] })}
          label="All Topics"
        />
        {topics.map((topic) => (
          <FilterOptionRow
            key={topic}
            type="checkbox"
            name="topic"
            checked={draft.topics.includes(topic)}
            onChange={() =>
              onChange({
                topics: draft.topics.includes(topic)
                  ? draft.topics.filter((t) => t !== topic)
                  : [...draft.topics, topic],
              })
            }
            label={topic}
            count={counts.byTopic[topic]}
          />
        ))}
      </FilterGroup>

      <FilterGroup
        id="subcategory"
        title="Sub-category"
        icon={<Layers size={16} aria-hidden="true" />}
      >
        <FilterOptionRow
          type="checkbox"
          name="subcategory"
          checked={draft.subcategories.length === 0}
          onChange={() => onChange({ subcategories: [] })}
          label="All Sub-categories"
        />
        {subcategories.map((sub) => (
          <FilterOptionRow
            key={sub}
            type="checkbox"
            name="subcategory"
            checked={draft.subcategories.includes(sub)}
            onChange={() =>
              onChange({
                subcategories: draft.subcategories.includes(sub)
                  ? draft.subcategories.filter((s) => s !== sub)
                  : [...draft.subcategories, sub],
              })
            }
            label={sub}
            count={counts.bySubcategory[sub]}
          />
        ))}
      </FilterGroup>

      <FilterGroup
        id="course-type"
        title="Course Type"
        icon={<School size={16} aria-hidden="true" />}
      >
        <FilterOptionRow
          type="radio"
          name="courseType"
          checked={draft.courseType === ""}
          onChange={() => onChange({ courseType: "" })}
          label="All Types"
        />
        {COURSE_TYPES.map((type) => (
          <FilterOptionRow
            key={type}
            type="radio"
            name="courseType"
            checked={draft.courseType === type}
            onChange={() => onChange({ courseType: type })}
            label={type}
            count={counts.byCourseType[type]}
          />
        ))}
      </FilterGroup>

      <FilterGroup
        id="duration"
        title="Duration"
        icon={<Clock size={16} aria-hidden="true" />}
      >
        {DURATION_BUCKETS.map((bucket) => (
          <FilterOptionRow
            key={bucket.id}
            type="checkbox"
            name="duration"
            checked={draft.durations.includes(bucket.id)}
            onChange={() =>
              onChange({
                durations: draft.durations.includes(bucket.id)
                  ? draft.durations.filter((d) => d !== bucket.id)
                  : [...draft.durations, bucket.id],
              })
            }
            label={bucket.label}
            count={counts.byDuration[bucket.id]}
          />
        ))}
      </FilterGroup>

      <FilterGroup
        id="rating"
        title="Rating"
        icon={<Star size={16} aria-hidden="true" />}
      >
        <FilterOptionRow
          type="radio"
          name="rating"
          checked={draft.rating === 0}
          onChange={() => onChange({ rating: 0 })}
          label="Any rating"
        />
        {RATING_OPTIONS.map((option) => (
          <FilterOptionRow
            key={option.value}
            type="radio"
            name="rating"
            checked={draft.rating === option.value}
            onChange={() => onChange({ rating: option.value })}
            label={
              <span className="flex items-center gap-1">
                <Star size={14} className="shrink-0 fill-orange-500 text-orange-500" aria-hidden="true" />
                {option.label}
              </span>
            }
            count={counts.byRating[option.value]}
          />
        ))}
      </FilterGroup>

      <FilterGroup
        id="level"
        title="Level"
        icon={<GraduationCap size={16} aria-hidden="true" />}
      >
        <FilterOptionRow
          type="radio"
          name="level"
          checked={draft.level === ""}
          onChange={() => onChange({ level: "" })}
          label="All Levels"
        />
        {levels.map((lvl) => (
          <FilterOptionRow
            key={lvl}
            type="radio"
            name="level"
            checked={draft.level === lvl}
            onChange={() => onChange({ level: lvl })}
            label={lvl}
            count={counts.byLevel[lvl]}
          />
        ))}
      </FilterGroup>

      <FilterGroup
        id="price"
        title="Price"
        icon={<Tag size={16} aria-hidden="true" />}
      >
        {PRICE_OPTIONS.map((option) => (
          <FilterOptionRow
            key={option.id}
            type="checkbox"
            name="price"
            checked={draft.prices.includes(option.id)}
            onChange={() =>
              onChange({
                prices: draft.prices.includes(option.id)
                  ? draft.prices.filter((p) => p !== option.id)
                  : [...draft.prices, option.id],
              })
            }
            label={option.label}
            count={counts.byPrice[option.id]}
          />
        ))}
      </FilterGroup>

      <button
        type="button"
        onClick={onApply}
        disabled={!isDraftDirty}
        className="btn-brand mt-4 w-full rounded-lg px-4 py-2.5 text-sm-fluid disabled:cursor-not-allowed disabled:opacity-50"
      >
        {applyLabel}
      </button>
      <button
        type="button"
        onClick={onClearAll}
        disabled={!isDraftDirty && !hasActiveFilters}
        className="mt-3 block w-full text-center text-13 font-medium text-brand-strong transition hover:underline disabled:cursor-not-allowed disabled:opacity-40"
      >
        Clear all
      </button>
    </div>
  );
}

/** Single filter panel: stacked card on mobile, sticky sidebar on desktop. */
export function CourseFilterPanels({
  open,
  facets,
  draft,
  onChange,
  onApply,
  applyLabel,
  onClose,
  onClearAll,
  hasActiveFilters,
  isDraftDirty,
  children,
}) {
  const panelProps = {
    draft,
    onChange,
    topics: facets.topics,
    subcategories: facets.subcategories,
    levels: facets.levels,
    counts: facets.counts,
    onClearAll,
    hasActiveFilters,
    isDraftDirty,
  };

  return (
    <div className="lg:flex lg:items-start lg:gap-8">
      <AnimatePresence initial={false}>
        {open && (
          <Motion.div
            key="filter-panel"
            id="filter-panel"
            variants={slideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="card scrollbar-brand mb-6 p-5 lg:mb-0 lg:w-68 lg:shrink-0 lg:sticky lg:top-28 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
          >
            <FilterPanel
              {...panelProps}
              onApply={onApply}
              applyLabel={applyLabel}
              onClose={onClose}
            />
          </Motion.div>
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
