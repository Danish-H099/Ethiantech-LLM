import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ChevronDown,
  LogOut,
  User,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { clearMockAuth } from "src/utils/authMock";
import { getStudentProfile, getUnreadCount } from "src/services/studentRepository";
import { avatarFallback } from "src/lib/assets";
import logo from "src/assets/logo.webp";

export default function StudentNavbar({ sidebarOpen, setSidebarOpen, hamburgerRef, onVisibilityChange }) {
  const navigate = useNavigate();
  const student = getStudentProfile();
  const unreadCount = getUnreadCount();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const lastToggleTime = useRef(0);
  const visibleRef = useRef(true);

  function handleLogout() {
    clearMockAuth();
    navigate("/", { replace: true });
  }

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY.current;
      lastScrollY.current = scrollY;
      // Lockout timer + larger threshold prevent rapid toggles that interrupt CSS transitions
      if (Math.abs(delta) < 10) return;
      const now = Date.now();
      if (now - lastToggleTime.current < 300) return;
      let next = visibleRef.current;
      if (scrollY <= 0) {
        next = true;
      } else if (delta > 10) {
        next = false;
      } else if (delta < -10) {
        next = true;
      }
      if (next !== visibleRef.current) {
        visibleRef.current = next;
        lastToggleTime.current = now;
        setVisible(next);
        onVisibilityChange?.(next);
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onVisibilityChange]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 flex h-[74px] items-center justify-between border-b border-gray-300 bg-white px-4 transition-transform duration-300 sm:px-6 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <Link to="/" className="flex items-center gap-2" aria-label="Ethian Tech Home">
        <img
          src={logo}
          loading="lazy"
          className="h-8 w-auto"
          alt="Ethian Tech"
        />
        <span className="font-outfit text-header-brand font-bold text-ink">
          Ethian Tech
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <NavLink
          to="/student/notifications"
          aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
          className="relative rounded p-3 text-gray-700 transition hover:bg-gray-50 hover:text-ink"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 rounded-full bg-accent-student px-1.5 text-sm-fluid font-bold text-white"
            >
              {unreadCount}
            </span>
          )}
        </NavLink>

        {/* Profile dropdown — desktop only; on mobile the profile actions
            live inside the sidebar drawer. */}
        <div className="hidden lg:block">
          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger asChild>
              <button
                aria-label="Open profile menu"
                className="flex select-none items-center gap-2 rounded transition hover:bg-gray-50 focus-visible:outline-none"
              >
                <div className="relative flex h-[45px] w-[45px] items-center justify-center overflow-hidden rounded-full bg-brand/10 shadow-avatar">
                  <img
                    src={student.avatar}
                    alt={`${student.fullName} avatar`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={avatarFallback}
                  />
                </div>
                <ChevronDown size={16} className="text-ink-muted" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-50 w-[194px] rounded border border-gray-200 bg-surface-soft shadow-dropdown"
              >
                <DropdownMenu.Item asChild className="outline-none">
                  <NavLink
                    to="/student/profile"
                    className="flex items-center gap-3 px-5 py-3 text-sm-fluid text-gray-800 transition data-[highlighted]:bg-gray-100 hover:bg-gray-100"
                  >
                    <User size={16} />
                    My Profile
                  </NavLink>
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="border-t border-gray-200" />

                <DropdownMenu.Item
                  onSelect={handleLogout}
                  className="flex items-center gap-3 px-5 py-3 text-sm-fluid text-gray-800 outline-none transition data-[highlighted]:bg-gray-100 hover:bg-gray-100"
                >
                  <LogOut size={16} />
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        {/* Mobile hamburger — rightmost on small screens */}
        <button
          ref={hamburgerRef}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={sidebarOpen}
          className="rounded p-1 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
