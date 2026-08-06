import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import courses from "../data/courses";
import {
  Search,
  Filter,
  BookOpen,
  ChevronDown,
  X,
} from "lucide-react";
import { LoginPopup, SignupPopup } from "./AuthPopups";
import CourseCard from "./CourseCard";

const INITIAL_VISIBLE = 6;
const LOAD_MORE_COUNT = 6;

function SearchSection({ search, setSearch }) {
  const [inputValue, setInputValue] = useState(search);

  const handleSearch = () => {
    setSearch(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    setSearch("");
  };

  return (
    <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-border bg-white pl-4 py-1 pr-1 shadow-sm">
      <Search className="shrink-0 text-ink-muted/70" size={18} />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search courses..."
        className="w-full bg-transparent text-sm outline-none placeholder:text-ink-muted/70"
      />
      {inputValue && (
        <button onClick={handleClear} className="text-ink-muted/70 transition hover:text-ink-muted">
          <X size={16} />
        </button>
      )}
      <button
        onClick={handleSearch}
        className="btn-brand rounded-lg px-8 text-sm"
      >
        Search
      </button>
    </div>
  );
}

function FilterPanel({
  categories,
  levels,
  selectedCategory,
  selectedLevel,
  onCategoryChange,
  onLevelChange,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
          <BookOpen size={16} />
          Category
        </h4>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-muted hover:text-ink">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ""}
              onChange={() => onCategoryChange("")}
              className="accent-brand"
            />
            All Categories
          </label>
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex cursor-pointer items-center gap-2 text-sm text-ink-muted hover:text-ink"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => onCategoryChange(cat)}
                className="accent-brand"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
          <ChevronDown size={16} />
          Level
        </h4>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-muted hover:text-ink">
            <input
              type="radio"
              name="level"
              checked={selectedLevel === ""}
              onChange={() => onLevelChange("")}
              className="accent-brand"
            />
            All Levels
          </label>
          {levels.map((lvl) => (
            <label
              key={lvl}
              className="flex cursor-pointer items-center gap-2 text-sm text-ink-muted hover:text-ink"
            >
              <input
                type="radio"
                name="level"
                checked={selectedLevel === lvl}
                onChange={() => onLevelChange(lvl)}
                className="accent-brand"
              />
              {lvl}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function SortDropdown({ sortBy, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-by" className="hidden text-sm text-ink-muted sm:inline">Sort by:</label>
      <select
        id="sort-by"
        value={sortBy}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink/20"
      >
        <option value="popular">Most Popular</option>
        <option value="newest">Newest</option>
        <option value="rating">Highest Rated</option>
        <option value="price-asc">Price Low → High</option>
        <option value="price-desc">Price High → Low</option>
      </select>
    </div>
  );
}

export default function CourseListPage() {
  const [popupState, setPopupState] = useState("none");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(
    () => [...new Set(courses.map((c) => c.category))],
    []
  );
  const levels = useMemo(
    () => [...new Set(courses.map((c) => c.level))],
    []
  );

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.author.toLowerCase().includes(q)
      );
    }

    if (category) {
      result = result.filter((c) => c.category === category);
    }

    if (level) {
      result = result.filter((c) => c.level === level);
    }

    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price-asc":
        result.sort(
          (a, b) =>
            parseFloat(a.price.replace("$", "")) -
            parseFloat(b.price.replace("$", ""))
        );
        break;
      case "price-desc":
        result.sort(
          (a, b) =>
            parseFloat(b.price.replace("$", "")) -
            parseFloat(a.price.replace("$", ""))
        );
        break;
    }

    return result;
  }, [search, category, level, sortBy]);

  React.useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [search, category, level, sortBy]);

  const visibleCourses = filteredCourses.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCourses.length;

  return (
    <div className="relative min-h-screen bg-surface text-ink">
      <Header
        onLoginClick={() => setPopupState("login")}
        onSignupClick={() => setPopupState("signup")}
      />

      <main id="main" className="flex-1">
      <section className="bg-(image:--gradient-hero)">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 sm:flex-row sm:items-center sm:py-16 lg:px-8 lg:py-16">
          <div className="text-left">
            <h1 className="page-title mb-1 font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Course List
            </h1>
            <p className="text-sm text-ink-muted">
              <Link to="/" className="hover:text-ink">Home</Link> / <span className="text-ink font-medium">Courses</span>
            </p>
          </div>
          <div className="w-full shrink-0 sm:w-auto sm:min-w-[320px]">
            <SearchSection search={search} setSearch={setSearch} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:flex lg:gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="card sticky top-20 p-5">
              <FilterPanel
                categories={categories}
                levels={levels}
                selectedCategory={category}
                selectedLevel={level}
                onCategoryChange={setCategory}
                onLevelChange={setLevel}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-4 lg:mb-6">
              <p className="mb-2 text-sm text-ink-muted lg:hidden">
                {filteredCourses.length}{" "}
                {filteredCourses.length === 1 ? "course" : "courses"} found
              </p>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface-soft lg:hidden"
                  >
                    <Filter size={16} />
                    Filters
                  </button>
                  <p className="hidden text-sm text-ink-muted lg:block">
                    {filteredCourses.length}{" "}
                    {filteredCourses.length === 1 ? "course" : "courses"} found
                  </p>
                </div>
                <SortDropdown sortBy={sortBy} onChange={setSortBy} />
              </div>
            </div>

            {showFilters && (
              <div className="card mb-6 p-5 lg:hidden">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-ink">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-ink-muted/70 transition hover:text-ink-muted"
                  >
                    <X size={16} />
                  </button>
                </div>
                <FilterPanel
                  categories={categories}
                  levels={levels}
                  selectedCategory={category}
                  selectedLevel={level}
                  onCategoryChange={setCategory}
                  onLevelChange={setLevel}
                />
              </div>
            )}

            {visibleCourses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-10 flex justify-center">
                    <button
                      onClick={() =>
                        setVisibleCount((c) => c + LOAD_MORE_COUNT)
                      }
                      className="rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-ink transition hover:bg-surface-soft"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen size={48} className="text-gray-300" />
                <p className="mt-4 text-lg font-medium text-ink-muted">
                  No courses found
                </p>
                <p className="mt-1 text-sm text-ink-muted/70">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setLevel("");
                    setSortBy("popular");
                  }}
                  className="mt-4 rounded-lg border border-border bg-white px-4 py-2 text-sm text-ink-muted transition hover:bg-surface-soft"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      </main>

      <Footer />

      {popupState === "login" && (
        <LoginPopup
          onClose={() => setPopupState("none")}
          onSwitchToSignup={() => setPopupState("signup")}
        />
      )}

      {popupState === "signup" && (
        <SignupPopup
          onClose={() => setPopupState("none")}
          onSwitchToLogin={() => setPopupState("login")}
        />
      )}
    </div>
  );
}
