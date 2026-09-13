import { useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, m as Motion, useReducedMotion } from "motion/react";
import { BookOpen, Filter } from "lucide-react";

import Header from "src/components/Header";
import Footer from "src/components/Footer";
import Breadcrumbs from "src/components/ui/Breadcrumbs";
import CourseCard from "src/components/CourseCard";
import {
  RATING_OPTIONS,
  makeEmptyFilters,
  applyCourseFilters,
  filterSignature,
  durationIdFor,
  CourseFilterPanels,
} from "src/components/CourseFilters";
import SearchBar from "src/components/ui/SearchBar";
import SortSelect, { sortCourses } from "src/components/ui/SortSelect";
import SubcategoryBar from "src/components/SubcategoryBar";
import { AuthPopupGate } from "src/components/AuthPopups";

import courses from "src/services/courses";

import {
  createStaggerItem,
  easeDepart,
  fadeUp,
  durations,
} from "src/lib/animationVariants";

const INITIAL_VISIBLE = 6;
const LOAD_MORE_COUNT = 6;

const getFacets = () => {
  const byTopic = {};
  const bySubcategory = {};
  const byCourseType = {};
  const byLevel = {};
  const byDuration = {};
  let free = 0;
  let paid = 0;

  courses.forEach((course) => {
    course.topics.forEach((topic) => {
      byTopic[topic] = (byTopic[topic] || 0) + 1;
    });
    course.subcategories.forEach((sub) => {
      bySubcategory[sub] = (bySubcategory[sub] || 0) + 1;
    });
    byCourseType[course.courseType] =
      (byCourseType[course.courseType] || 0) + 1;
    byLevel[course.level] = (byLevel[course.level] || 0) + 1;
    const durationId = durationIdFor(course);
    if (durationId) {
      byDuration[durationId] = (byDuration[durationId] || 0) + 1;
    }
    if (course.isFree) free += 1;
    else paid += 1;
  });

  const byRating = {};
  RATING_OPTIONS.forEach((option) => {
    byRating[option.value] = courses.filter(
      (course) => course.rating >= option.value
    ).length;
  });

  return {
    topics: [...new Set(courses.flatMap((course) => course.topics))],
    subcategories: [
      ...new Set(courses.flatMap((course) => course.subcategories)),
    ],
    levels: [...new Set(courses.map((course) => course.level))],
    counts: {
      byTopic,
      bySubcategory,
      byCourseType,
      byLevel,
      byDuration,
      byRating,
      byPrice: { free, paid },
    },
  };
};

function CoursesHero() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <h1 className="page-title mb-2">Courses</h1>
          <p className="text-subtitle text-ink-muted">
            Browse expert-led courses, pick a course and start learning today.
          </p>
        </Motion.div>
      </div>
    </section>
  );
}

function ResultsToolbar({
  search,
  onSearch,
  sortBy,
  onSortByChange,
  filtersOpen,
  onToggleFilters,
  filtersToggleRef,
  activeFilterCount,
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <SearchBar
          search={search}
          onSearch={onSearch}
          className="order-1 w-full sm:order-2 sm:min-w-0 sm:max-w-md sm:flex-1"
        />
        <div className="order-2 flex flex-wrap items-center gap-4 sm:order-1 sm:shrink-0">
          <button
            ref={filtersToggleRef}
            type="button"
            onClick={onToggleFilters}
            aria-expanded={filtersOpen}
            aria-controls="filter-panel"
            aria-label={
              activeFilterCount > 0
                ? `Toggle filters, ${activeFilterCount} active`
                : "Toggle filters"
            }
            className="btn-outline px-4 py-2 text-sm-fluid"
          >
            <Filter size={16} aria-hidden="true" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-sm-fluid font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-by"
              className="hidden text-sm-fluid text-ink-muted sm:inline"
            >
              Sort by:
            </label>
            <SortSelect id="sort-by" value={sortBy} onChange={onSortByChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseResults({ courses, staggerItem, hasMore, onLoadMore }) {
  return (
    <Motion.div
      key="course-results"
      exit={{ opacity: 0, transition: { duration: durations.slow } }}
    >
      <Motion.div
        layout
        className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-6"
      >
        <AnimatePresence mode="popLayout">
          {courses.map((course, i) => (
            <Motion.div
              key={course.id}
              layout
              variants={staggerItem}
              initial="hidden"
              animate="visible"
              exit={{
                opacity: 0,
                scale: 0.96,
                transition: { duration: durations.slow, ease: easeDepart },
              }}
              custom={i}
              className="h-full"
            >
              <CourseCard course={course} />
            </Motion.div>
          ))}
        </AnimatePresence>
      </Motion.div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="btn-outline px-8 py-3 text-sm-fluid"
          >
            Load More
          </button>
        </div>
      )}
    </Motion.div>
  );
}

function EmptyResults({ onClearAll }) {
  return (
    <Motion.div
      key="no-courses"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: durations.slow }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <BookOpen size={48} className="text-ink-muted/40" aria-hidden="true" />
      <p className="mt-4 text-body-lg font-medium text-ink-muted">
        No courses found
      </p>
      <p className="mt-1 text-sm-fluid text-ink-muted">
        Try adjusting your search or filter criteria.
      </p>
      <button
        type="button"
        onClick={onClearAll}
        className="mt-4 rounded-lg border border-border bg-white px-4 py-2 text-sm-fluid text-ink-muted transition hover:bg-surface-soft"
      >
        Clear all filters
      </button>
    </Motion.div>
  );
}

export default function CourseListPage() {
  const [popupState, setPopupState] = useState("none");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";

  const [appliedFilters, setAppliedFilters] = useState(makeEmptyFilters);
  const [draftFilters, setDraftFilters] = useState(makeEmptyFilters);
  const [sortBy, setSortBy] = useState("popular");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );
  const resultsRef = useRef(null);
  const filtersToggleRef = useRef(null);

  const facets = useMemo(() => getFacets(), []);

  const appliedCourses = useMemo(
    () =>
      sortCourses(applyCourseFilters(courses, appliedFilters, search), sortBy),
    [appliedFilters, search, sortBy]
  );
  const visibleCourses = useMemo(
    () => appliedCourses.slice(0, visibleCount),
    [appliedCourses, visibleCount]
  );

  const appliedSignature = filterSignature(appliedFilters, search);
  const [lastAppliedSignature, setLastAppliedSignature] = useState(
    appliedSignature
  );

  if (appliedSignature !== lastAppliedSignature) {
    setLastAppliedSignature(appliedSignature);
    setVisibleCount(INITIAL_VISIBLE);
  }

  const isDraftDirty =
    filterSignature(draftFilters, "") !== filterSignature(appliedFilters, "");

  const activeFilterCount = useMemo(() => {
    let count = search ? 1 : 0;
    count += appliedFilters.topics.length;
    count += appliedFilters.subcategories.length;
    if (appliedFilters.courseType) count += 1;
    if (appliedFilters.level) count += 1;
    if (appliedFilters.rating) count += 1;
    count += appliedFilters.durations.length;
    count += appliedFilters.prices.length;
    return count;
  }, [appliedFilters, search]);

  const hasActiveFilters = activeFilterCount > 0;
  const hasMore = visibleCount < appliedCourses.length;

  const handleDraftChange = (patch) => {
    setDraftFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleApply = () => setAppliedFilters(draftFilters);

  const handleSearch = (query) => {
    navigate(query ? { search: `?q=${encodeURIComponent(query)}` } : {}, {
      replace: true,
    });
  };

  const handleQuickTopic = (next) => {
    setAppliedFilters((prev) => ({ ...prev, topics: next }));
    setDraftFilters((prev) => ({ ...prev, topics: next }));
  };

  const resetAll = () => {
    navigate({}, { replace: true });
    setAppliedFilters(makeEmptyFilters());
    setDraftFilters(makeEmptyFilters());
    setSortBy("popular");
  };

  const toggleFilters = () => setFiltersOpen((open) => !open);

  const closeFilters = () => {
    setFiltersOpen(false);
    filtersToggleRef.current?.focus();
  };

  const loadMore = () => setVisibleCount((count) => count + LOAD_MORE_COUNT);

  return (
    <div className="relative min-h-screen bg-surface text-ink">
      <Header
        onLoginClick={() => setPopupState("login")}
        onSignupClick={() => setPopupState("signup")}
      />

      <main id="main" className="flex-1">
        <CoursesHero />

        <SubcategoryBar
          topics={facets.topics}
          selectedTopics={appliedFilters.topics}
          onSelect={handleQuickTopic}
          counts={facets.counts.byTopic}
          total={courses.length}
          resultsRef={resultsRef}
        />

        <section
          ref={resultsRef}
          className="mx-auto max-w-7xl scroll-mt-28 px-4 py-8 sm:px-6 lg:px-8"
        >
          <ResultsToolbar
            search={search}
            onSearch={handleSearch}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            filtersOpen={filtersOpen}
            onToggleFilters={toggleFilters}
            filtersToggleRef={filtersToggleRef}
            activeFilterCount={activeFilterCount}
          />

          <CourseFilterPanels
            open={filtersOpen}
            facets={facets}
            draft={draftFilters}
            onChange={handleDraftChange}
            onApply={handleApply}
            applyLabel="Apply Filters"
            onClose={closeFilters}
            onClearAll={resetAll}
            hasActiveFilters={hasActiveFilters}
            isDraftDirty={isDraftDirty}
          >
            <p
              className="mb-4 text-sm-fluid text-ink-muted"
              aria-live="polite"
            >
              {appliedCourses.length}{" "}
              {appliedCourses.length === 1 ? "course" : "courses"} found
            </p>

            <h2 className="sr-only">All courses</h2>

            <AnimatePresence mode="wait">
              {visibleCourses.length > 0 ? (
                <CourseResults
                  courses={visibleCourses}
                  staggerItem={staggerItem}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                />
              ) : (
                <EmptyResults onClearAll={resetAll} />
              )}
            </AnimatePresence>
          </CourseFilterPanels>
        </section>
      </main>

      <Footer />

      <AuthPopupGate state={popupState} onStateChange={setPopupState} />
    </div>
  );
}
