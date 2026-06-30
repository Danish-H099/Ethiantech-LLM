import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import courses from "./CourseData";
import Testimonials from "./Testimonials";
import CTASection from "./CTAsection";
import Footer from "./Footer";
import { Search, Star } from "lucide-react";
import { LoginPopup, SignupPopup } from "./AuthPopups";

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
              <Star key={i} size={14} className={i < 4 ? "fill-current" : ""} />
            ))}
          </div>
          <span className="text-gray-400">({course.reviews})</span>
        </div>
        <p className="text-lg font-bold text-gray-900">{course.price}</p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  // Centralized state to manage the popups
  const [popupState, setPopupState] = useState('none');

  return (
    <div className="relative min-h-screen bg-[#f8f8fb] text-gray-900">

      {/* Pass the state updaters to the Header */}
      <Header
        onLoginClick={() => setPopupState('login')}
        onSignupClick={() => setPopupState('signup')}
      />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-5xl text-center">
          <h3 className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-2xl md:text-2xl lg:text-5xl">
            Innovate Transform Accelerate
            <br />
            EthianTech LMS Platform
            <br />
            <span className="relative inline-block text-blue-600 text-4xl font-outfit">
              Tailored for your Growth.
            </span>
          </h3>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            We bring together world-class instructors, interactive content, and a
            supportive community to help you achieve your personal and
            professional goals.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-xl px-2 py-1">
              <Search className="text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search for courses"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>
            <button className="rounded-xl bg-[#D62A91] px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 sm:px-8">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Learn from the best
          </h3>
          <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-base">
            Discover our top-rated courses across various categories. From coding
            and design to business and wellness, our courses are crafted to
            deliver results.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/courses"
            className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Show all courses
          </Link>
        </div>
      </section>

      <Testimonials />
      <CTASection />
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