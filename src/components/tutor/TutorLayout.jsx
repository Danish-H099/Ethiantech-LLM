import { Suspense, useEffect, useRef, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusSquare,
  BookOpen,
  Users,
  User,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { clearMockAuth } from "src/utils/authMock";
import TutorNavbar from "src/components/tutor/TutorNavbar";
import Footer from "src/components/Footer";
import RouteLoader from "src/components/RouteLoader";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/tutor/dashboard" },
  { label: "Add Course", icon: PlusSquare, path: "/tutor/add-course" },
  { label: "My Courses", icon: BookOpen, path: "/tutor/courses" },
  { label: "Student Enrolled", icon: Users, path: "/tutor/students" },
];

export default function TutorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navigate = useNavigate();

  function handleLogout() {
    clearMockAuth();
    navigate("/", { replace: true });
  }

  // Close the drawer and return focus to the hamburger so keyboard/AT users
  // land back where they opened it from.
  function closeDrawer() {
    setSidebarOpen(false);
    hamburgerRef.current?.focus();
  }

  // Mobile drawer focus management: land on the first NavLink when opening,
  // trap Tab within the drawer, close on Escape, and return focus to the
  // hamburger when the drawer closes via keyboard.
  useEffect(() => {
    if (!sidebarOpen) return;
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const focusables = sidebar.querySelectorAll(
      'a[href], button:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        setSidebarOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <div data-role="tutor" className="flex min-h-screen flex-col bg-surface font-outfit">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm-fluid focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      {/* Mobile drawer backdrop — sits below the drawer (z-40) and below the
          navbar's X. Clicking it closes the drawer. */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={-1}
          className="fixed inset-0 z-40 cursor-default bg-black/30 lg:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* Full-width header — lifted out of the sidebar+main row so it spans the
          whole viewport on desktop, leaving the row below to match sidebar/main. */}
      <TutorNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        hamburgerRef={hamburgerRef}
      />

      {/* Middle block: workspace row (flex-1) between the sticky navbar above
          and the footer below. The whole window scrolls as a single scroll
          context — neither the sidebar nor main gets its own scrollbar.

          Desktop: the <aside> is a normal flex column (`lg:static`) whose white
          background stretches to the full row height; the inner <nav> is the
          sticky part (`sticky top-[74px]`), locking 74px below the viewport so
          the menu stays visible while main scrolls. `lg:z-0` keeps the sidebar
          beneath the `z-30` navbar so it can never overlap it.

          Mobile: the aside stays `fixed inset-y-0 z-50` and slides in as a
          drawer over the viewport. */}
      <div className="flex flex-1">
        <aside
          ref={sidebarRef}
          className={`fixed inset-y-0 left-0 z-50 flex w-[251px] flex-col border-r border-gray-300 bg-white transition-[width,transform] duration-200 lg:relative lg:z-0 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${collapsed ? "lg:w-[76px]" : "lg:w-[251px]"}`}
        >
          {/* Mobile drawer header: a close (X) button that lives *inside* the
              drawer (z-50) so it sits above the backdrop (z-40) and stays
              clickable. Hidden on desktop where the navbar owns toggling. */}
          <div className="flex items-center justify-between border-b border-gray-300 px-3 py-3 lg:hidden">
            <span className="text-sm-fluid font-semibold text-ink">Menu</span>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close menu"
              className="rounded p-1 text-gray-700 transition hover:bg-gray-50"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="relative lg:sticky lg:top-[74px] mt-2 flex flex-col gap-1 px-3 py-5 lg:mt-2">
            {/* Desktop-only collapse control — anchored to the sticky nav (the
                visible content) so it stays centered and on-screen, and straddles
                the sidebar/main border via -right-3 (nav's px-3 padding). */}
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              className="absolute top-1/2 -right-0 z-20 hidden h-8 w-8 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-ink shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-tutor focus-visible:ring-offset-1 lg:flex motion-reduce:transition-none"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/tutor/dashboard"}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded px-3 py-2.5 text-sm-fluid transition-colors ${
                      isActive
                        ? "border-l-[3px] border-accent-tutor bg-tint-tutor pl-[9px] font-medium text-accent-tutor"
                        : "border-l-[3px] border-transparent text-ink hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-all duration-200 ${
                      collapsed
                        ? "lg:w-0 lg:overflow-hidden lg:opacity-0"
                        : "lg:w-auto lg:opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile-only action panel — mirrors the desktop navbar's profile
              dropdown menu (My Profile + Logout) so the drawer matches the
              header's dropdown instead of a one-off block. */}
          <div className="mt-auto border-t border-gray-300 px-3 py-4 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm-fluid text-ink transition hover:bg-gray-50"
            >
              <User size={16} />
              My Profile
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm-fluid text-ink transition hover:bg-gray-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        <main
          id="main"
          className="flex-1 bg-surface p-6 lg:p-8"
        >
          <Suspense fallback={<RouteLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Full-width footer at the page bottom — placed outside the viewport-locked
          row so it can never pin over `main` and never steals its height. */}
      <Footer />
    </div>
  );
}
