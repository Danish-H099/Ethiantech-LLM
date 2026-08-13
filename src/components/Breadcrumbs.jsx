import { Link } from "react-router-dom";
import { m as Motion } from "motion/react";
import { fadeUp } from "src/lib/animationVariants";

export default function Breadcrumbs({ items = [], className = "" }) {
  return (
    <section className={`mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 ${className}`}>
      <Motion.nav
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        aria-label="Breadcrumb"
        className="text-sm-fluid text-ink-muted"
      >
        <ol className="flex flex-wrap items-center">
          <li className="flex items-center">
            <Link to="/" className="hover:text-ink transition-colors">
              Home
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <span className="mx-2 text-ink-muted/40" aria-hidden="true">/</span>
              {item.link ? (
                <Link 
                  to={item.link} 
                  className="hover:text-ink transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-ink" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </Motion.nav>
    </section>
  );
}
