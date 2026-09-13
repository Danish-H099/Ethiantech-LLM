import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { m as Motion, useReducedMotion } from "motion/react";
import Header from "src/components/Header";
import courses from "src/services/courses";
import Footer from "src/components/Footer";
import { Building2, GraduationCap, Users, BookOpen } from "lucide-react";
import { AuthPopupGate } from "src/components/AuthPopups";
import CourseCard from "src/components/CourseCard";
import TestimonialCard from "src/components/TestimonialCard";
import {
  buttonPress,
  fadeUp,
  staggerContainer,
  viewportOnce,
  createStaggerItem,
} from "src/lib/animationVariants";

const companies = [
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1280px-Microsoft_logo_%282012%29.svg.png" },
  { name: "Walmart", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Walmart_logo_%282008%29.svg" },
  { name: "Accenture", logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Accenture_logo.svg?width=512" },
  { name: "Adobe", logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Adobe_Corporate_logo.svg?width=512" },
  { name: "Paypal", logo: "https://cdn.simpleicons.org/paypal" }
];

const testimonials = [
  {
    id: 1,
    name: "Donald Jackman",
    role: "SWE 1 @ Amazon",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    rating: 5,
    quote: "The structured curriculum and hands-on projects were exactly what I needed to land my first SWE role. Mentors gave focused feedback on my interview prep, and every module left me with a portfolio piece I was proud of. Within four months of starting I had an offer from Amazon, and I still reference the system-design notes during my day-to-day work. I recommend EthianTech to every junior engineer I mentor."
  },
  {
    id: 2,
    name: "Richard Nelson",
    role: "SWE 2 @ Summa",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4,
    quote: "Flexible pacing let me level up without leaving my job. I studied in the evenings and applied each lesson the next morning, and the capstone became the centerpiece of my portfolio. That project is what finally got me promoted to SWE 2. I also loved the community review threads — feedback from engineers outside my company pushed me to write cleaner, more idiomatic code."
  },
  {
    id: 3,
    name: "James Washington",
    role: "SWE 2 @ Google",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    quote: "The interview-prep track alone is worth the price. I'd failed Google twice before; the rubric-aligned mocks and the system-design templates gave me a repeatable framework. Third attempt was the charm. Now I'm the one giving referrals to teammates from the program."
  },
  {
    id: 4,
    name: "Nancy Sanders",
    role: "Full-Stack Dev @ Shopify",
    image: "https://randomuser.me/api/portraits/women/19.jpg",
    rating: 5,
    quote: "Coming from a non-CS background, the curriculum didn't assume I knew compiler theory — it met me where I was. The Discord study-groups kept me accountable, and the career-services resume review caught three real gaps my CV had. I got an offer six weeks after graduating."
  }
];

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
          className="mx-auto max-w-4xl text-hero font-extrabold text-ink tracking-tight"
        >
          Master in-demand skills with expert-led courses
        </Motion.h1>

        <Motion.p
          variants={staggerItem}
          custom={1}
          className="mx-auto mt-6 max-w-3xl text-subhero font-medium text-ink-muted"
        >
          Join thousands of learners building real skills. Start for free and learn at your own pace.
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
            <p className="text-metric font-bold tabular-nums text-brand">{stat.value}</p>
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
          <p className="mt-3 text-subtitle text-ink-muted">
            Top-rated courses across programming, AI, design, and business crafted to
            deliver real skills.
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
        <p className="text-eyebrow font-medium text-ink-muted">Trusted by learners from</p>
      </Motion.div>

      <Motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-8 flex flex-wrap justify-center gap-10 items-center"
      >
        {companies.map((company, i) => (
          <Motion.div
            key={company.name}
            custom={i}
            variants={staggerItem}
            className="flex h-[clamp(2.5rem,2rem+1vw,3rem)] max-w-[160px] items-center"
          >
            <img
              src={company.logo}
              alt={company.name}
              loading="lazy"
              className="h-full w-auto max-w-full object-contain transition duration-300"
            />
          </Motion.div>
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

        <p className="mx-auto mt-4 max-w-3xl text-subtitle text-ink-muted">
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

function CTASection({ onGetStarted, staggerItem }) {
  return (
    <section className="bg-tint-pink py-28 text-center">
      <Motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
      >
        <Motion.h2 variants={staggerItem} custom={0} className="page-title">
          Start Building Real Skills Today
        </Motion.h2>

        <Motion.p
          variants={staggerItem}
          custom={1}
          className="mx-auto mt-6 max-w-2xl text-subtitle text-ink-muted"
        >
          Join thousands of learners mastering in-demand skills with expert-led courses —
          start free today.
        </Motion.p>

        <Motion.div variants={staggerItem} custom={2} className="mt-10 flex justify-center gap-5">
          <Motion.button
            variants={buttonPress}
            whileHover="hover"
            whileTap="tap"
            onClick={onGetStarted}
            className="btn-brand px-8 py-3 text-sm-fluid shadow"
          >
            Get started
          </Motion.button>
        </Motion.div>
      </Motion.div>
    </section>
  );
}

function PartnerSection({ staggerItem }) {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <h2 className="page-title">Teach & Train with EthianTech</h2>

          <p className="mx-auto mt-4 max-w-2xl text-subtitle text-ink-muted">
            Whether you're an expert sharing knowledge or an organization upskilling your team,
            our platform gives you the tools to create, deliver, and track learning at scale.
          </p>
        </Motion.div>

        <Motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid gap-8 sm:grid-cols-2"
        >
          <Motion.div variants={staggerItem} custom={0}>
            <div className="card p-8 text-center hover:shadow-card-hover transition-shadow">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-tint-pink">
                <GraduationCap size={28} className="text-brand" aria-hidden="true" />
              </div>
              <h3 className="text-body-lg font-semibold text-ink">Teach on EthianTech</h3>
              <p className="mt-2 text-sm-fluid text-ink-muted">
                Share your expertise with thousands of learners. Create courses, build your
                brand, and earn revenue doing what you love.
              </p>
              <Link
                to="/tutor/dashboard"
                className="mt-6 inline-flex items-center gap-2 text-sm-fluid font-medium text-brand-strong hover:underline"
              >
                Become an instructor
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Motion.div>

          <Motion.div variants={staggerItem} custom={1}>
            <div className="card p-8 text-center hover:shadow-card-hover transition-shadow">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-tint-pink">
                <Users size={28} className="text-brand" aria-hidden="true" />
              </div>
              <h3 className="text-body-lg font-semibold text-ink">Train Your Team</h3>
              <p className="mt-2 text-sm-fluid text-ink-muted">
                Upskill your workforce with expert-led courses. Track progress, measure
                outcomes, and build a culture of continuous learning.
              </p>
              <a
                href="mailto:info@ethiantech.com?subject=Team%20training%20inquiry"
                className="mt-6 inline-flex items-center gap-2 text-sm-fluid font-medium text-brand-strong hover:underline"
              >
                Contact sales
                <span aria-hidden="true">→</span>
              </a>
            </div>
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
        <CTASection onGetStarted={() => setPopupState("signup")} staggerItem={staggerItem} />
        <PartnerSection staggerItem={staggerItem} />
      </main>
      <Footer />

      <AuthPopupGate state={popupState} onStateChange={setPopupState} />
    </div>
  );
}
