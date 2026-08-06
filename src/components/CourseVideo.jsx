import { useState } from "react";
import { User, BookOpen } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import CourseStructure from "./CourseStructure";
import { LoginPopup, SignupPopup } from "./AuthPopups";
import curriculumData from "../data/curriculumData.json";
import captions from "../assets/demo-captions.vtt?url";

const comments = [
  {
    id: 1,
    name: "John Doe",
    image: "https://i.pravatar.cc/50?img=12",
    time: "2 min ago",
    text: "This lecture was really informative. I understood everything clearly.",
  },
  {
    id: 2,
    name: "Emily",
    image: "https://i.pravatar.cc/50?img=32",
    time: "5 min ago",
    text: "Amazing explanation. Looking forward to the next lecture.",
  },
  {
    id: 3,
    name: "Amily",
    image: "https://i.pravatar.cc/50?img=45",
    time: "5 min ago",
    text: "Really appreciate the insights and perspective shared in this article. It's definitely given me something to think about and has helped me see things from a different angle. Thank you for writing and sharing.",
  },
];

export default function CourseVideo() {
  const [popupState, setPopupState] = useState("none");
  const [activeTab, setActiveTab] = useState("description");
  const [commentText, setCommentText] = useState("");
  const [noteText, setNoteText] = useState("");

  function handleCommentSubmit(e) {
    e.preventDefault();
    if (commentText.trim()) {
      setCommentText("");
    }
  }

  return (
    <div className="relative min-h-screen bg-surface text-ink">
      <Header
        onLoginClick={() => setPopupState("login")}
        onSignupClick={() => setPopupState("signup")}
      />

      <main id="main" className="flex-1">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="lg:flex lg:gap-10">
          {/* Left Column – Course Structure Sidebar */}
          <aside className="w-full shrink-0 lg:w-[471px]">
            <CourseStructure sections={curriculumData} />
          </aside>

          {/* Right Column – Video + Tabs */}
          <div className="min-w-0 flex-1">
            {/* Video Player */}
            <div className="overflow-hidden rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
              <video controls preload="none" className="w-full aspect-video bg-black">
                <source src="/videos/demo.mp4" type="video/mp4" />
                <track kind="captions" src={captions} srcLang="en" label="English captions" />
                Your browser does not support video.
              </video>
            </div>

            {/* Tab Bar */}
            <div className="mt-6 flex border-b border-border">
              <button
                onClick={() => setActiveTab("description")}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "description"
                    ? "text-ink"
                    : "text-ink-muted/70 hover:text-ink-muted"
                }`}
              >
                <span
                  className={
                    activeTab === "description"
                      ? "text-brand"
                      : "text-ink-muted/70"
                  }
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="rotate-180"
                  >
                    <path
                      d="M2 4h12M2 8h8M2 12h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Description
                {activeTab === "description" && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("comments")}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "comments"
                    ? "text-ink"
                    : "text-ink-muted/70 hover:text-ink-muted"
                }`}
              >
                <span
                  className={
                    activeTab === "comments"
                      ? "text-brand"
                      : "text-ink-muted/70"
                  }
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M2 2h12a1 1 0 011 1v8a1 1 0 01-1 1H5l-3 3V3a1 1 0 011-1z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Comments
                {activeTab === "comments" && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("notes")}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "notes"
                    ? "text-ink"
                    : "text-ink-muted/70 hover:text-ink-muted"
                }`}
              >
                <span
                  className={
                    activeTab === "notes" ? "text-brand" : "text-ink-muted/70"
                  }
                >
                  <BookOpen size={16} />
                </span>
                Notes
                {activeTab === "notes" && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "description" && (
              <div className="card mt-6 p-6">
                <h3 className="section-title">
                  Lecture Description
                </h3>
                <p className="mt-4 text-sm leading-7 text-ink-muted">
                  In this lecture we build the complete Text to Image SaaS
                  application from scratch using React, Node.js, MongoDB,
                  Express and TailwindCSS.
                </p>
              </div>
            )}

            {activeTab === "comments" && (
              <div className="mt-6">
                <h3 className="section-title mb-5">
                  Comments
                </h3>

                <form
                  onSubmit={handleCommentSubmit}
                  className="mb-8 flex gap-3"
                >
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="input flex-1"
                  />
                  <button
                    type="submit"
                    className="btn-brand px-6 py-2.5 text-sm"
                  >
                    Comment
                  </button>
                </form>

                <div className="space-y-5">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="card p-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="avatar bg-gray-200">
                          <img
                            src={comment.image}
                            alt={comment.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div className="hidden h-full w-full items-center justify-center">
                            <User size={18} className="text-ink-muted" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-ink">
                            {comment.name}
                          </h4>
                          <p className="text-xs text-ink-muted/70">
                            {comment.time}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-ink-muted">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <button className="rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-ink transition hover:bg-surface-soft">
                    Load more
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="mt-6">
                <h3 className="section-title mb-5">
                  My Notes
                </h3>
                <div className="card p-6">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Start writing your notes for this lecture..."
                    rows={10}
                    className="input resize-y py-3 leading-7 bg-surface-soft"
                  />
                  <div className="mt-4 flex justify-end">
                    <button className="btn-brand px-6 py-2.5 text-sm">
                      Save Notes
                    </button>
                  </div>
                </div>
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
