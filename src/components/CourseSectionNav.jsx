import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const COURSE_SECTION_NAV = [
  { id: "outcomes", label: "What you'll learn" },
  { id: "curriculum", label: "Course content" },
  { id: "instructor", label: "Instructor" },
  { id: "reviews", label: "Reviews" },
  { id: "faq", label: "FAQ" },
];

export default function CourseSectionNav() {
  const [activeId, setActiveId] = useState(COURSE_SECTION_NAV[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    COURSE_SECTION_NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Course sections"
      className="sticky top-14 z-30 -mx-4 mb-8 border-b border-border bg-surface/95 px-4 py-2 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <ul className="flex items-center gap-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
        {COURSE_SECTION_NAV.map(({ id, label }) => (
          <li key={id}>
            <Link
              to={`#${id}`}
              aria-current={activeId === id ? "true" : undefined}
              className={`inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm-fluid font-medium transition ${
                activeId === id
                  ? "bg-surface-soft text-ink"
                  : "text-ink-muted hover:bg-surface-soft hover:text-ink"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
