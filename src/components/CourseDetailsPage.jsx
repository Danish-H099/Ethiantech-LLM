import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import courses from "../data/courses";
import {
  Star,
  Clock,
  BookOpen,
  Monitor,
  Award,
  PlayCircle,
  Users,
  Globe,
  Zap,
  Download,
  FileText,
} from "lucide-react";
import { LoginPopup, SignupPopup } from "./AuthPopups";
import StarRating from "./StarRating";
import CourseStructure from "./CourseStructure";
import curriculumData from "../data/curriculumData.json";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [popupState, setPopupState] = useState("none");

  const course = courses.find((c) => c.id === Number(id));

  if (!course) {
    return (
      <div className="relative min-h-screen bg-surface text-gray-900">
        <Header
          onLoginClick={() => setPopupState("login")}
          onSignupClick={() => setPopupState("signup")}
        />
        <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center">
          <BookOpen size={64} className="text-gray-300" />
          <h2 className="mt-6 text-2xl font-bold text-gray-700">
            Course Not Found
          </h2>
          <p className="mt-2 text-gray-500">
            The course you're looking for doesn't exist.
          </p>
          <Link
            to="/courses"
            className="mt-6 btn-brand rounded-xl px-6 py-3 text-sm"
          >
            Browse Courses
          </Link>
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

  const priceNum = parseFloat(course.price.replace("$", ""));
  const originalPrice = (priceNum * 3).toFixed(2);
  const discountPercent = Math.round((1 - priceNum / (priceNum * 3)) * 100);

  const totalLectures = curriculumData.reduce((s, sec) => s + sec.lectures, 0);
  const totalDuration = "27h 25m";

  return (
    <div className="relative min-h-screen bg-surface text-gray-900">
      <Header
        onLoginClick={() => setPopupState("login")}
        onSignupClick={() => setPopupState("signup")}
      />

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 text-left">
        <p className="text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          {" / "}
          <Link to="/courses" className="hover:text-gray-700">Courses</Link>
          {" / "}
          <span className="font-medium text-gray-900">{course.title}</span>
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-left">
        <div className="lg:flex lg:gap-10">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[40px]">
              {course.title}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              Dive deep into {course.title.toLowerCase()} and master the skills
              you need to succeed. This comprehensive course covers everything
              from foundational concepts to advanced techniques with hands-on
              projects and real-world applications.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <StarRating rating={course.rating} size={18} />
                <span className="text-sm font-semibold text-gray-800">
                  {course.rating}
                </span>
              </div>
              <Link
                to="#reviews"
                className="text-sm font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800"
              >
                ({course.reviews.toLocaleString()} ratings)
              </Link>
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Users size={16} />
                {course.students.toLocaleString()} students
              </span>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Course by{" "}
              <Link
                to="#"
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                {course.author}
              </Link>
            </p>

            <CourseStructure sections={curriculumData} totalDuration={totalDuration} />

            <hr className="my-10 border-gray-200" />

            <h2 className="text-xl font-bold text-gray-900 text-left">
              Course Description
            </h2>

            <div className="mt-4 max-w-3xl space-y-4 text-sm leading-7 text-gray-600 text-left">
              <p>
                This course is designed to take you from a complete beginner to a
                confident practitioner in <strong>{course.category.toLowerCase()}</strong>.
                Throughout the program, you'll engage with carefully structured
                content that builds upon each concept, ensuring a solid
                understanding at every stage. Each module includes hands-on
                exercises, real-world examples, and practical assignments to
                reinforce your learning.
              </p>
              <p>
                Our instructor <strong>{course.author}</strong> brings years of
                industry experience and a passion for teaching to every lesson.
                With real-world case studies, downloadable resources, and
                ongoing community support, you'll gain the skills and confidence
                needed to excel in your career. By the end of this course,
                you'll have a portfolio-ready project and the expertise to
                tackle complex challenges.
              </p>
            </div>
          </div>

          <aside className="mt-8 w-full shrink-0 lg:mt-0 lg:w-[380px]">
            <div className="sticky top-24 space-y-5">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="relative h-48 w-full overflow-hidden sm:h-52">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-red-600">
                    <Zap size={14} />
                    <span>5 days left at this price!</span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {course.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ${originalPrice}
                    </span>
                    <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-700">
                      {discountPercent}% off
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-4 border-y border-gray-100 py-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star size={14} className="fill-orange-500 text-orange-500" />
                      {course.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {totalDuration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} />
                      {totalLectures} lessons
                    </span>
                  </div>

                  <button className="mt-4 btn-brand w-full rounded-lg px-6 py-3.5 text-sm">
                    Enroll Now
                  </button>

                  <div className="mt-6">
                    <h4 className="mb-3 text-sm font-semibold text-gray-900 text-left" >
                      What's in the course?
                    </h4>
                    <ul className="space-y-2.5">
                      {[
                        { icon: Globe, text: "Lifetime access with free updates" },
                        { icon: PlayCircle, text: "Step-by-step project guidance" },
                        { icon: Download, text: "Downloadable resources and source code" },
                        { icon: FileText, text: "Quizzes to test your knowledge" },
                        { icon: Award, text: "Certificate of completion" },
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-sm text-gray-600"
                        >
                          <item.icon
                            size={16}
                            className="shrink-0 text-gray-400"
                          />
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </aside>
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
