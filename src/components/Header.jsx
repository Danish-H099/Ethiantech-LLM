import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header({ onLoginClick, onSignupClick }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMenu = () => setMobileMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-white/90">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
            >
                Skip to main content
            </a>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-dark text-white shadow-sm">
                        <span className="text-xs font-bold">ET</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-ink sm:text-2xl">EthianTech LMS</h2>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-8 md:flex">
                    <Link
                        to="/courses"
                        className="text-sm font-medium text-ink-muted transition hover:text-ink"
                    >
                        Courses
                    </Link>

                    <button
                        onClick={onLoginClick}
                        className="text-sm font-medium text-ink-muted transition hover:text-ink"
                    >
                        Login
                    </button>

                    <button
                        onClick={onSignupClick}
                        className="btn-brand rounded-full px-5 py-2.5 text-sm"
                    >
                        Create Account
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    className="rounded p-2 text-ink-muted transition hover:text-ink md:hidden"
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {mobileMenuOpen && (
                <div className="border-t border-border bg-white md:hidden">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6">
                        <Link
                            to="/courses"
                            onClick={closeMenu}
                            className="text-sm font-medium text-ink-muted transition hover:text-ink"
                        >
                            Courses
                        </Link>
                        <button
                            onClick={() => { onLoginClick(); closeMenu(); }}
                            className="text-left text-sm font-medium text-ink-muted transition hover:text-ink"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => { onSignupClick(); closeMenu(); }}
                            className="btn-brand w-full rounded-full px-5 py-2.5 text-sm"
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
