import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import courses from "../data/courses";
import Testimonials from "./Testimonials";
import CTASection from "./CTAsection";
import Footer from "./Footer";
import { Search } from "lucide-react";
import { LoginPopup, SignupPopup } from "./AuthPopups";
import CourseCard from "./CourseCard";

export default function HomePage() {
  // Centralized state to manage the popups
  const [popupState, setPopupState] = useState('none');

  return (
    <div className="relative min-h-screen bg-surface text-ink">

      {/* Pass the state updaters to the Header */}
      <Header
        onLoginClick={() => setPopupState('login')}
        onSignupClick={() => setPopupState('signup')}
      />

      <main id="main" className="flex-1">

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-5xl text-center">
          <h3 className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-2xl md:text-2xl lg:text-5xl">
            Innovate Transform Accelerate
            <br />
            EthianTech LMS Platform
            <br />
            <span className="relative inline-block text-brand-secondary text-4xl font-outfit">
              Tailored for your Growth.
            </span>
          </h3>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-ink-muted sm:text-base">
            We bring together world-class instructors, interactive content, and a
            supportive community to help you achieve your personal and
            professional goals.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-border bg-white p-2 shadow-sm sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-xl px-2 py-1">
              <Search className="text-ink-muted/70" size={18} />
              <input
                type="text"
                placeholder="Search for courses"
                className="w-full bg-transparent text-sm outline-none placeholder:text-ink-muted/70"
              />
            </div>
            <button className="btn-brand rounded-xl px-6 py-3 text-sm sm:px-8">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="text-2xl font-bold text-ink sm:text-3xl">
            Learn from the best
          </h3>
          <p className="mt-3 text-sm leading-7 text-ink-muted sm:text-base">
            Discover our top-rated courses across various categories. From coding
            and design to business and wellness, our courses are crafted to
            deliver results.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {courses.slice(0, 4).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/courses"
            className="btn-outline rounded-xl px-6 py-3 text-sm"
          >
            Show all courses
          </Link>
        </div>
      </section>

      <Testimonials />
      <CTASection />
      </main>
      <Footer />

      {/* Auth Popups */}
      {popupState === 'login' && (
        <LoginPopup
          onClose={() => setPopupState('none')}
          onSwitchToSignup={() => setPopupState('signup')}
        />
      )}

      {popupState === 'signup' && (
        <SignupPopup
          onClose={() => setPopupState('none')}
          onSwitchToLogin={() => setPopupState('login')}
        />
      )}
    </div>
  );
}