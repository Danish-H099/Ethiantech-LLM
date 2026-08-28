import { useReducedMotion } from "motion/react";

export default function SubcategoryBar({
  topics,
  selectedTopics,
  onSelect,
  counts,
  total,
  resultsRef,
}) {
  const shouldReduceMotion = useReducedMotion();

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const handleSelect = (next) => {
    onSelect(next);
    scrollToResults();
  };

  return (
    <nav
      aria-label="Course topics"
      className="border-b border-border bg-white"
    >
      <div className="scrollbar-brand mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => handleSelect([])}
          aria-pressed={selectedTopics.length === 0}
          className={
            selectedTopics.length === 0
              ? "category-quick-chip category-quick-chip-active"
              : "category-quick-chip"
          }
        >
          All Courses <span className="opacity-80">({total})</span>
        </button>
        {topics.map((topic) => {
          const isActive = selectedTopics.includes(topic);
          return (
            <button
              key={topic}
              type="button"
              onClick={() =>
                handleSelect(
                  isActive
                    ? selectedTopics.filter((t) => t !== topic)
                    : [...selectedTopics, topic]
                )
              }
              aria-pressed={isActive}
              className={
                isActive
                  ? "category-quick-chip category-quick-chip-active"
                  : "category-quick-chip"
              }
            >
              {topic} <span className="opacity-80">({counts[topic]})</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
