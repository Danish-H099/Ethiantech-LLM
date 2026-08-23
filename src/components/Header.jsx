import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, m as Motion } from "motion/react";
import {
  BookOpen,
  Building2,
  ChevronDown,
  GraduationCap,
  House,
  Menu,
  X,
} from "lucide-react";
import { mobileMenu } from "src/lib/animationVariants";
import logo from "src/assets/logo.webp";

const navLinkClass = (active, textSize, minH = "min-h-11") =>
  `inline-flex ${minH} items-center gap-3 rounded-lg px-3 py-2 text-left ${textSize} transition-colors ${
    active
      ? "nav-link-active"
      : "font-medium text-ink-muted hover:bg-surface-soft hover:text-brand-strong"
  }`;

export default function Header({ onLoginClick, onSignupClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = () => setMobileMenuOpen(false);
  const { pathname } = useLocation();
  const [lastPathname, setLastPathname] = useState(pathname);
  const isHome = pathname === "/";
  const isCourses = pathname.startsWith("/courses") || pathname.startsWith("/course/");

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMobileMenuOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm transition-all duration-200 ${
        scrolled ? "shadow-sm" : ""
      }`}
      style={{ scrollPaddingTop: "80px" }}
    >
      <a
        href="#main"
        className="skip-link focus:not-sr-only focus:absolute focus:z-[70] focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <div className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2"
          aria-label="Ethian Tech Home"
        >
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

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          <Link
            to="/"
            aria-current={isHome ? "page" : undefined}
            className={navLinkClass(isHome, "text-nav")}
          >
            Home
          </Link>
          <Link
            to="/courses"
            aria-current={isCourses ? "page" : undefined}
            className={navLinkClass(isCourses, "text-nav")}
          >
            Courses
          </Link>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="inline-flex min-h-11 select-none items-center gap-1.5 rounded-lg px-3 py-2 text-left text-nav font-medium text-ink-muted transition-colors hover:bg-surface-soft hover:text-brand-strong data-[state=open]:bg-surface-soft data-[state=open]:text-ink"
              >
                Solutions
                <ChevronDown
                  size={16}
                  className="transition-transform duration-slow data-[state=open]:rotate-180"
                  aria-hidden="true"
                />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="start"
                sideOffset={8}
                className="z-50 w-[264px] rounded-xl border border-border bg-white p-1.5 shadow-dropdown"
              >
                <DropdownMenu.Item asChild className="rounded-lg outline-none data-[highlighted]:bg-surface-soft">
                  <Link to="/tutor/dashboard" className="flex items-start gap-3 px-2.5 py-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tint-pink">
                      <GraduationCap size={18} className="text-brand" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-nav font-semibold text-ink">
                        Teach on EthianTech
                      </span>
                      <span className="block text-sm text-ink-muted">
                        Create courses and earn revenue
                      </span>
                    </span>
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="my-1 border-t border-border" />

                <DropdownMenu.Item asChild className="rounded-lg outline-none data-[highlighted]:bg-surface-soft">
                  <a
                    href="mailto:info@ethiantech.com?subject=Team%20training%20inquiry"
                    className="flex items-start gap-3 px-2.5 py-2.5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tint-pink">
                      <Building2 size={18} className="text-brand" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-nav font-semibold text-ink">
                        EthianTech for Business
                      </span>
                      <span className="block text-sm text-ink-muted">
                        Upskill teams with expert-led training
                      </span>
                    </span>
                  </a>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <button
            type="button"
            onClick={onSignupClick}
            className="btn-brand min-h-11 rounded-full px-4 py-2 text-nav"
          >
            Create Account
          </button>
        </nav>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="inline-flex min-h-11 items-center justify-center rounded-lg p-2 text-ink-muted transition-colors hover:bg-surface-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-panel"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen &&
        createPortal(
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={closeMenu}
            className="fixed inset-0 z-40 cursor-default bg-black/40 md:hidden"
          />,
          document.body
        )}

      <AnimatePresence>
        {mobileMenuOpen && (
          <Motion.nav
            id="mobile-nav-panel"
            key="mobile-nav"
            aria-label="Mobile navigation"
            variants={mobileMenu}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-40 border-t border-border bg-white shadow-dropdown md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col px-4 pb-6 pt-4 sm:px-6">
              <Link
                to="/"
                onClick={closeMenu}
                aria-current={isHome ? "page" : undefined}
                className={navLinkClass(isHome, "text-body", "min-h-12")}
              >
                <House size={20} className="shrink-0" aria-hidden="true" />
                Home
              </Link>
              <Link
                to="/courses"
                onClick={closeMenu}
                aria-current={isCourses ? "page" : undefined}
                className={navLinkClass(isCourses, "text-body", "min-h-12")}
              >
                <BookOpen size={20} className="shrink-0" aria-hidden="true" />
                Courses
              </Link>

              <div className="mt-3 rounded-xl bg-surface-soft p-2">
                <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  For organizations &amp; creators
                </p>
                <Link
                  to="/tutor/dashboard"
                  onClick={closeMenu}
                  className={navLinkClass(false, "text-body", "min-h-12")}
                >
                  <GraduationCap size={20} className="shrink-0" aria-hidden="true" />
                  Teach on EthianTech
                </Link>
                <a
                  href="mailto:info@ethiantech.com?subject=Team%20training%20inquiry"
                  onClick={closeMenu}
                  className={navLinkClass(false, "text-body", "min-h-12")}
                >
                  <Building2 size={20} className="shrink-0" aria-hidden="true" />
                  EthianTech for Business
                </a>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => {
                    onSignupClick();
                    closeMenu();
                  }}
                  className="btn-brand min-h-12 w-full rounded-full px-4 py-2.5 text-body"
                >
                  Create Account
                </button>
                <p className="mt-2 flex min-h-11 items-center justify-center gap-1 text-sm-fluid text-ink-muted">
                  Already have an account?
                  <button
                    type="button"
                    onClick={() => {
                      onLoginClick();
                      closeMenu();
                    }}
                    className="link inline-flex items-center px-1"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>
          </Motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
