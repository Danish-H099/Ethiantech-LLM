import React from "react";
import { Link } from "react-router-dom";

export default function Header({ onLoginClick, onSignupClick }) {
    // Mobile menu state (commented out in your original code, left intact here)
    // const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
                        <span className="text-xs font-bold">ET</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold sm:text-2xl">EthianTech LMS</h2>
                    </div>
                </Link>
                {/* <div className="flex items-center gap-3">
                    <img src={logo} alt="Logo" className="h-18 w-18" />
                </div> */}

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-8 md:flex">
                    <Link
                        to="/courses"
                        className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
                    >
                        Courses
                    </Link>

                    <button
                        onClick={onLoginClick}
                        className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
                    >
                        Login
                    </button>

                    <button
                        onClick={onSignupClick}
                        className="rounded-full bg-[#D62A91] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        Create Account
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                {/* <button
            className="rounded-md p-2 text-gray-700 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div> */}

                {/* Mobile Nav */}
                {/* {mobileMenuOpen && (
            <div className="border-t border-gray-200 bg-white md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6">
              <a href="#" className="text-sm font-medium text-gray-700">
                Add Courses
              </a>
              <a href="#" className="text-sm font-medium text-gray-700">
                Login
              </a>
              <button className="w-full rounded-full bg-[#D62A91] px-5 py-2.5 text-sm font-semibold text-white">
                Create Account
              </button>
            </div>
          </div>
        )} */}
            </div>
        </header>
    );
}