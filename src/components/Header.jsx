import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, m as Motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { mobileMenu } from "src/lib/animationVariants";

export default function Header({ onLoginClick, onSignupClick }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const closeMenu = () => setMobileMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-sm">
            <a href="#main" className="skip-link">Skip to main content</a>

            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-dark text-white shadow-sm">
                        <span className="text-xs font-bold">ET</span>
                    </div>
                    <span className="font-outfit text-xl font-bold text-ink sm:text-2xl">EthianTech LMS</span>
                </Link>

                <nav aria-label="Primary" className="hidden items-center gap-2 md:flex">
                    <Link to="/" className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-left text-sm-fluid font-medium text-ink-muted transition hover:bg-surface-soft hover:text-ink">Home</Link>
                    <Link to="/courses" className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-left text-sm-fluid font-medium text-ink-muted transition hover:bg-surface-soft hover:text-ink">Courses</Link>
                    <button type="button" onClick={onLoginClick} className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-left text-sm-fluid font-medium text-ink-muted transition hover:bg-surface-soft hover:text-ink">Login</button>
                    <button type="button" onClick={onSignupClick} className="btn-brand min-h-11 rounded-full px-4 py-2 text-sm-fluid">Create Account</button>
                </nav>

                <button
                    type="button"
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    className="rounded p-2.5 text-ink-muted transition hover:text-ink md:hidden"
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-nav-panel"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <Motion.nav
                        id="mobile-nav-panel"
                        key="mobile-nav"
                        aria-label="Mobile"
                        variants={mobileMenu}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="border-t border-border bg-white md:hidden"
                    >
                        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
                            <Link to="/" onClick={closeMenu} className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-left text-sm-fluid font-medium text-ink-muted transition hover:bg-surface-soft hover:text-ink">Home</Link>
                            <Link to="/courses" onClick={closeMenu} className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-left text-sm-fluid font-medium text-ink-muted transition hover:bg-surface-soft hover:text-ink">Courses</Link>
                            <button type="button" onClick={() => { onLoginClick(); closeMenu(); }} className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-left text-sm-fluid font-medium text-ink-muted transition hover:bg-surface-soft hover:text-ink">Login</button>
                            <button type="button" onClick={() => { onSignupClick(); closeMenu(); }} className="btn-brand min-h-11 w-full rounded-full px-4 py-2 text-sm-fluid">Create Account</button>
                        </div>
                    </Motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}
