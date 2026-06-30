import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import courses from "./CourseData";
import {
  Search,
  Filter,
  Star,
  BookOpen,
  ChevronDown,
  X,
} from "lucide-react";
import { LoginPopup, SignupPopup } from "./AuthPopups";

const INITIAL_VISIBLE = 6;
const LOAD_MORE_COUNT = 6;

function CourseCard({ course }) {
  return (
    <Link
      to={`/course/${course.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative h-44 w-full overflow-hidden sm:h-48">
        <img
          src={course.image}
          alt={course.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold tracking-wide text-gray-700 shadow">
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
          <div className="flex items-center gap-0.5 text-orange-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.round(course.rating) ? "fill-current" : ""}
              />
            ))}
          </div>
          <span className="text-gray-400">({course.reviews})</span>
        </div>
        <p className="text-lg font-bold text-gray-900">{course.price}</p>
      </div>
    </Link>
  );
}

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
    <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-gray-200 bg-white pl-4 py-1 pr-1 shadow-sm">
      <Search className="shrink-0 text-gray-400" size={18} />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search courses..."
        className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
      {inputValue && (
        <button onClick={handleClear} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      )}
      <button
        onClick={handleSearch}
        className="rounded-lg bg-[#D62A91] px-8 text-sm font-medium text-white transition hover:opacity-90"
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
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <BookOpen size={16} />
          Category
        </h4>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ""}
              onChange={() => onCategoryChange("")}
              className="accent-[#D62A91]"
            />
            All Categories
          </label>
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => onCategoryChange(cat)}
                className="accent-[#D62A91]"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <ChevronDown size={16} />
          Level
        </h4>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <input
              type="radio"
              name="level"
              checked={selectedLevel === ""}
              onChange={() => onLevelChange("")}
              className="accent-[#D62A91]"
            />
            All Levels
          </label>
          {levels.map((lvl) => (
            <label
              key={lvl}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <input
                type="radio"
                name="level"
                checked={selectedLevel === lvl}
                onChange={() => onLevelChange(lvl)}
                className="accent-[#D62A91]"
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
      <label className="hidden text-sm text-gray-500 sm:inline">Sort by:</label>
      <select
        value={sortBy}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400"
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
    <div className="relative min-h-screen bg-[#f8f8fb] text-gray-900">
      <Header
        onLoginClick={() => setPopupState("login")}
        onSignupClick={() => setPopupState("signup")}
      />

      <section className="bg-gradient-to-br from-[#FFF1F5] to-[#E7F0FF]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 sm:flex-row sm:items-center sm:py-16 lg:px-8 lg:py-16">
          <div className="text-left">
            <h1 className="mb-1 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Course List
            </h1>
            <p className="text-sm text-gray-500">
              <Link to="/" className="hover:text-gray-700">Home</Link> / <span className="text-gray-900 font-medium">Courses</span>
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
            <div className="sticky top-20 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
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
              <p className="mb-2 text-sm text-gray-500 lg:hidden">
                {filteredCourses.length}{" "}
                {filteredCourses.length === 1 ? "course" : "courses"} found
              </p>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 lg:hidden"
                  >
                    <Filter size={16} />
                    Filters
                  </button>
                  <p className="hidden text-sm text-gray-500 lg:block">
                    {filteredCourses.length}{" "}
                    {filteredCourses.length === 1 ? "course" : "courses"} found
                  </p>
                </div>
                <SortDropdown sortBy={sortBy} onChange={setSortBy} />
              </div>
            </div>

            {showFilters && (
              <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:hidden">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600"
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
                      className="rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen size={48} className="text-gray-300" />
                <p className="mt-4 text-lg font-medium text-gray-500">
                  No courses found
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setLevel("");
                    setSortBy("popular");
                  }}
                  className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

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
