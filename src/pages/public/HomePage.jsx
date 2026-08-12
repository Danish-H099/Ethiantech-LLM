import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, m as Motion, useReducedMotion } from "motion/react";
import Header from "src/components/Header";
import courses from "src/data/courses";
import testimonialsData from "src/data/testimonialsData.json";
import Footer from "src/components/Footer";
import { Building2, Presentation } from "lucide-react";
import { LoginPopup, SignupPopup } from "src/components/AuthPopups";
import CourseCard from "src/components/CourseCard";
import TestimonialCard from "src/components/TestimonialCard";
import {
  buttonPress,
  fadeUp,
  staggerContainer,
  viewportOnce,
  createStaggerItem,
} from "src/lib/animationVariants";

const { companies, testimonials } = testimonialsData;

function HeroSection({ onGetStarted, staggerItem }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pt-14 md:pt-16 lg:px-8 lg:pt-20">
      <Motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl text-center"
      >
        <Motion.h1
          variants={staggerItem}
          custom={0}
          className="mx-auto max-w-4xl text-hero font-extrabold text-ink"
        >
          Master in-demand skills with expert-led courses
        </Motion.h1>

        <Motion.p
          variants={staggerItem}
          custom={1}
          className="mx-auto mt-6 max-w-2xl text-body-fluid leading-7 text-ink-muted"
        >
          Join thousands of learners building real skills in coding, AI, design, and
          business — start free and learn at your own pace.
        </Motion.p>

        <Motion.div
          variants={staggerItem}
          custom={2}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Motion.button
            type="button"
            variants={buttonPress}
            whileHover="hover"
            whileTap="tap"
            onClick={onGetStarted}
            className="btn-brand px-8 py-3 text-sm-fluid"
          >
            Create free account
          </Motion.button>
        </Motion.div>
      </Motion.div>
    </section>
  );
}

function StatsBar({ stats, staggerItem }) {
  return (
    <section className="border-y border-border bg-white">
      <Motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8"
      >
        {stats.map((stat, i) => (
          <Motion.div key={stat.label} variants={staggerItem} custom={i} className="text-center">
            <p className="text-stat font-bold tabular-nums text-brand">{stat.value}</p>
            <p className="mt-1 text-sm-fluid text-ink-muted">{stat.label}</p>
          </Motion.div>
        ))}
      </Motion.div>
    </section>
  );
}

function FeaturedCoursesSection({ staggerItem }) {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="page-title">Explore Our Top Courses</h2>
          <p className="mt-3 text-body-fluid leading-7 text-ink-muted">
            Top-rated courses across programming, AI, design, and business — crafted to
            deliver real skills, not just theory.
          </p>
        </Motion.div>

        <Motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {courses.slice(0, 4).map((course, i) => (
            <Motion.div key={course.id} variants={staggerItem} custom={i}>
              <CourseCard course={course} />
            </Motion.div>
          ))}
        </Motion.div>

        <Motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 flex justify-center"
        >
          <Link
            to="/courses"
            className="btn-outline px-6 py-3 text-sm-fluid"
          >
            Browse courses
          </Link>
        </Motion.div>
      </section>
    </div>
  );
}

function TestimonialsSection({ staggerItem }) {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="text-center"
      >
        <p className="text-body-fluid font-medium tracking-wide text-ink-muted">Trusted by learners from</p>
      </Motion.div>

      <Motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-8 flex flex-wrap justify-center gap-14"
      >
        {companies.map((company, i) => (
          <Motion.img
            key={company.name}
            src={company.logo}
            alt={company.name}
            loading="lazy"
            custom={i}
            variants={staggerItem}
            className="h-[clamp(1.75rem,1.568rem+0.777vw,2.5rem)] object-contain"
          />
        ))}
      </Motion.div>

      <Motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-24 text-center"
      >
        <h2 className="page-title">Hear From Our Learners</h2>

        <p className="mx-auto mt-4 max-w-3xl text-body-fluid text-ink-muted">
          Real stories from learners who built new skills and transformed their careers.
        </p>
      </Motion.div>

      <Motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-16 grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {testimonials.map((item, i) => {
          const isExpanded = expandedId === item.id;
          const quoteId = `testimonial-quote-${item.id}`;
          return (
            <Motion.div key={item.id} variants={staggerItem} custom={i}>
              <TestimonialCard
                item={item}
                isExpanded={isExpanded}
                onToggle={() => setExpandedId(isExpanded ? null : item.id)}
                quoteId={quoteId}
              />
            </Motion.div>
          );
        })}
      </Motion.div>
    </section>
  );
}

function CTASection({ onGetStarted }) {
  return (
    <section className="bg-tint-pink py-28 text-center">
      <Motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
      >
        <h2 className="page-title">Start Building Real Skills Today</h2>

        <p className="mx-auto mt-6 max-w-2xl text-body-fluid leading-7 text-ink-muted">
          Join thousands of learners mastering in-demand skills with expert-led courses —
          start free today.
        </p>

        <div className="mt-10 flex justify-center gap-5">
          <Motion.button
            variants={buttonPress}
            whileHover="hover"
            whileTap="tap"
            onClick={onGetStarted}
            className="btn-brand px-8 py-3 text-sm-fluid shadow"
          >
            Get started
          </Motion.button>
        </div>
      </Motion.div>
    </section>
  );
}

function EducatorsSection({ staggerItem }) {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <h2 className="page-title">For Educators &amp; Organizations</h2>

          <p className="mx-auto mt-4 max-w-2xl text-body-fluid leading-7 text-ink-muted">
            Share your expertise with thousands of learners, or build curated learning paths
            for your team.
          </p>
        </Motion.div>

        <Motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Motion.div variants={staggerItem} custom={0}>
            <Motion.div variants={buttonPress} whileHover="hover" whileTap="tap">
              <Link to="/tutor/dashboard" className="btn-outline px-6 py-3 text-sm-fluid hover:bg-brand hover:text-white">
                <Presentation size={18} aria-hidden="true" />
                Teach on EthianTech
              </Link>
            </Motion.div>
          </Motion.div>

          <Motion.div variants={staggerItem} custom={1}>
            <Motion.div variants={buttonPress} whileHover="hover" whileTap="tap">
              <a
                href="mailto:info@ethiantech.com?subject=Team%20training%20inquiry"
                className="btn-outline px-6 py-3 text-sm-fluid hover:bg-brand hover:text-white"
              >
                <Building2 size={18} aria-hidden="true" />
                Train your team
              </a>
            </Motion.div>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [popupState, setPopupState] = useState("none");
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(() => createStaggerItem(!!shouldReduceMotion), [shouldReduceMotion]);

  const stats = useMemo(() => {
    const learners = courses.reduce((sum, course) => sum + course.students, 0);
    const instructors = new Set(courses.map((course) => course.author)).size;
    const avgRating =
      courses.reduce((sum, course) => sum + course.rating, 0) / courses.length;
    return [
      { value: `${learners.toLocaleString()}+`, label: "Learners enrolled" },
      { value: `${courses.length}`, label: "Expert-led courses" },
      { value: `${instructors}`, label: "Expert instructors" },
      { value: `${avgRating.toFixed(1)}/5`, label: "Average rating" },
    ];
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-surface text-ink">
      <Header
        onLoginClick={() => setPopupState("login")}
        onSignupClick={() => setPopupState("signup")}
      />
      <main id="main" className="flex-1">
        <HeroSection onGetStarted={() => setPopupState("signup")} staggerItem={staggerItem} />
        <StatsBar stats={stats} staggerItem={staggerItem} />
        <FeaturedCoursesSection staggerItem={staggerItem} />
        <TestimonialsSection staggerItem={staggerItem} />
        <CTASection onGetStarted={() => setPopupState("signup")} />
        <EducatorsSection staggerItem={staggerItem} />
      </main>
      <Footer />

      <AnimatePresence mode="wait">
        {popupState === "login" && (
          <LoginPopup
            key="login"
            onClose={() => setPopupState("none")}
            onSwitchToSignup={() => setPopupState("signup")}
          />
        )}
        {popupState === "signup" && (
          <SignupPopup
            key="signup"
            onClose={() => setPopupState("none")}
            onSwitchToLogin={() => setPopupState("login")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
